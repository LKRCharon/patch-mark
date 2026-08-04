import type { Annotation, AnnotationStore, CreateAnnotationInput, ResolveAnnotationPatch, StoreRequestOptions } from '../types.js';
import {
  annotationLimits,
  parseAnnotationResponse,
  parseAnnotationsResponse,
  parseCreateAnnotation,
  parseResolvePatch,
} from '../schema.js';
import { getAuthToken } from '../auth.js';

export interface FetchStoreOptions {
  endpoint: string;
  headers?: Record<string, string>;
  /** Abort a request that has not completed in this many milliseconds. */
  timeoutMs?: number;
}

/**
 * Thrown when the backend rejects a request with 401. The <patch-mark>
 * component recognizes this error (by name) and shows its unlock UI.
 */
export class PatchMarkAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PatchMarkAuthError';
  }
}

function withAuth(base: Record<string, string>): Record<string, string> {
  const token = getAuthToken();
  if (!token) return base;
  const hasAuth = Object.keys(base).some((key) => key.toLowerCase() === 'authorization');
  return hasAuth ? base : { authorization: `Bearer ${token}`, ...base };
}

function throwIfUnauthorized(response: Response): void {
  if (response.status === 401) {
    throw new PatchMarkAuthError('Access token missing or rejected (401)');
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function browserBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.href;
  return 'http://localhost/';
}

function normalizeEndpoint(endpoint: string): URL {
  try {
    const url = new URL(endpoint, browserBaseUrl());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('endpoint must use http: or https:');
    }
    // Tokens belong in Authorization headers, not a URL that may be copied
    // into a handoff prompt, browser history, telemetry, or server logs.
    if (url.username || url.password) {
      throw new Error('endpoint must not contain credentials');
    }
    return url;
  } catch {
    throw new Error(`Invalid patch-mark endpoint: ${endpoint}`);
  }
}

function withPath(base: URL, suffix: string): URL {
  const url = new URL(base.href);
  url.pathname = `${url.pathname.replace(/\/+$/, '')}${suffix}` || suffix;
  return url;
}

function collectionUrl(base: URL, pagePath: string): URL {
  const url = new URL(base.href);
  url.searchParams.set('page', pagePath);
  return url;
}

function itemUrl(base: URL, id: string): URL {
  return withPath(base, `/${encodeURIComponent(id)}`);
}

function reorderUrl(base: URL): URL {
  return withPath(base, '/reorder');
}

function validatedIds(ids: string[]): string[] {
  if (!Array.isArray(ids) || ids.length > 1000) throw new Error('Invalid annotation reorder request');
  const unique = new Set<string>();
  for (const id of ids) {
    if (typeof id !== 'string' || id.trim().length === 0 || id.length > annotationLimits.id || unique.has(id)) {
      throw new Error('Invalid annotation reorder request');
    }
    unique.add(id);
  }
  return ids;
}

async function request(
  url: URL,
  init: RequestInit,
  options: StoreRequestOptions | undefined,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const forwardAbort = (): void => controller.abort(options?.signal?.reason);
  if (options?.signal?.aborted) forwardAbort();
  else options?.signal?.addEventListener('abort', forwardAbort, { once: true });

  const timer = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    globalThis.clearTimeout(timer);
    options?.signal?.removeEventListener('abort', forwardAbort);
  }
}

export function createFetchStore(options: FetchStoreOptions): AnnotationStore {
  const base = normalizeEndpoint(options.endpoint);
  const timeoutMs = options.timeoutMs ?? 15_000;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error('timeoutMs must be a positive finite number');

  const headers = options.headers ?? {};
  const defaultHeaders: Record<string, string> = {
    'content-type': 'application/json',
    ...headers,
  };

  return {
    // Deliberately absolute: a copied handoff can be executed outside the page
    // that configured a relative endpoint.
    source: { type: 'rest', endpoint: base.href },

    async list(pagePath: string, requestOptions?: StoreRequestOptions): Promise<Annotation[]> {
      const response = await request(
        collectionUrl(base, pagePath),
        { cache: 'no-store', headers: withAuth(headers) },
        requestOptions,
        timeoutMs,
      );
      throwIfUnauthorized(response);
      if (!response.ok) throw new Error(`Failed to load annotations (${response.status})`);
      return parseAnnotationsResponse(await response.json());
    },

    async create(input: CreateAnnotationInput, requestOptions?: StoreRequestOptions): Promise<Annotation> {
      const safeInput = parseCreateAnnotation(input);
      const response = await request(
        base,
        {
          method: 'POST',
          headers: withAuth(defaultHeaders),
          body: JSON.stringify(safeInput),
        },
        requestOptions,
        timeoutMs,
      );
      throwIfUnauthorized(response);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' })) as { error?: unknown };
        throw new Error(typeof error.error === 'string' ? error.error : `Failed to create annotation (${response.status})`);
      }
      return parseAnnotationResponse(await response.json());
    },

    async update(id: string, patch: ResolveAnnotationPatch, requestOptions?: StoreRequestOptions): Promise<Annotation> {
      if (typeof id !== 'string' || id.trim().length === 0 || id.length > annotationLimits.id) {
        throw new Error('Invalid annotation id');
      }
      // The v1 built-in REST adapter intentionally supports only the resolve
      // lifecycle operation. Other edits need a domain-specific custom store.
      const safePatch = parseResolvePatch(patch);
      const response = await request(
        itemUrl(base, id),
        {
          method: 'PATCH',
          headers: withAuth(defaultHeaders),
          body: JSON.stringify(safePatch),
        },
        requestOptions,
        timeoutMs,
      );
      throwIfUnauthorized(response);
      if (!response.ok) throw new Error(`Failed to resolve annotation (${response.status})`);
      return parseAnnotationResponse(await response.json());
    },

    async validateAccess(requestOptions?: StoreRequestOptions): Promise<void> {
      const pagePath = requestOptions?.pagePath;
      if (typeof pagePath !== 'string' || pagePath.trim().length === 0) {
        throw new Error('A pagePath is required to validate annotation access');
      }
      const response = await request(
        collectionUrl(base, pagePath),
        { cache: 'no-store', headers: withAuth(headers) },
        requestOptions,
        timeoutMs,
      );
      throwIfUnauthorized(response);
      if (!response.ok) throw new Error(`Failed to validate annotation access (${response.status})`);
      // Validate the payload too. A successful authorization response must
      // not turn into a poisoned cache for the subsequent list operation.
      await parseAnnotationsResponse(await response.json());
    },

    async delete(id: string, requestOptions?: StoreRequestOptions): Promise<void> {
      if (typeof id !== 'string' || id.trim().length === 0 || id.length > annotationLimits.id) {
        throw new Error('Invalid annotation id');
      }
      const response = await request(
        itemUrl(base, id),
        { method: 'DELETE', headers: withAuth(headers) },
        requestOptions,
        timeoutMs,
      );
      throwIfUnauthorized(response);
      if (!response.ok) throw new Error(`Failed to delete annotation (${response.status})`);
    },

    async reorder(ids: string[], requestOptions?: StoreRequestOptions): Promise<void> {
      const pagePath = requestOptions?.pagePath;
      if (typeof pagePath !== 'string' || pagePath.trim().length === 0) {
        throw new Error('A pagePath is required to reorder annotations');
      }
      const response = await request(
        reorderUrl(base),
        {
          method: 'POST',
          headers: withAuth(defaultHeaders),
          body: JSON.stringify({ ids: validatedIds(ids), page: pagePath }),
        },
        requestOptions,
        timeoutMs,
      );
      throwIfUnauthorized(response);
      if (!response.ok) throw new Error(`Failed to reorder annotations (${response.status})`);
    },
  };
}

// Re-export for convenience when a server-less approach is needed:
// generate the annotation locally and use a custom store to persist.
export function createLocalAnnotation(input: CreateAnnotationInput): Annotation {
  const safeInput = parseCreateAnnotation(input);
  return {
    id: generateId(),
    pagePath: safeInput.pagePath,
    pageTitle: safeInput.pageTitle,
    message: safeInput.message,
    element: safeInput.element,
    createdAt: new Date().toISOString(),
    status: 'open',
    changes: safeInput.changes,
  };
}
