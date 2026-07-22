import type { Annotation, AnnotationStore, CreateAnnotationInput } from '../types.js';

export interface FetchStoreOptions {
  endpoint: string;
  headers?: Record<string, string>;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createFetchStore(options: FetchStoreOptions): AnnotationStore {
  const { endpoint, headers = {} } = options;

  const defaultHeaders: Record<string, string> = {
    'content-type': 'application/json',
    ...headers,
  };

  return {
    async list(pagePath: string): Promise<Annotation[]> {
      const url = `${endpoint}?page=${encodeURIComponent(pagePath)}`;
      const response = await fetch(url, { cache: 'no-store', headers });
      if (!response.ok) throw new Error(`Failed to load annotations (${response.status})`);
      const data = await response.json() as { annotations: Annotation[] };
      return data.annotations ?? [];
    },

    async create(input: CreateAnnotationInput): Promise<Annotation> {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `Failed to create annotation (${response.status})`);
      }
      const data = await response.json() as { annotation: Annotation };
      return data.annotation;
    },

    async update(id: string, patch: Partial<Annotation>): Promise<Annotation> {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        headers: defaultHeaders,
        body: JSON.stringify(patch),
      });
      if (!response.ok) throw new Error(`Failed to update annotation (${response.status})`);
      const data = await response.json() as { annotation: Annotation };
      return data.annotation;
    },

    async delete(id: string): Promise<void> {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
        headers: defaultHeaders,
      });
      if (!response.ok) throw new Error(`Failed to delete annotation (${response.status})`);
    },

    async reorder(ids: string[]): Promise<void> {
      const response = await fetch(`${endpoint}/reorder`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) throw new Error(`Failed to reorder annotations (${response.status})`);
    },
  };
}

// Re-export for convenience when a server-less approach is needed:
// generate the annotation locally and use a custom store to persist.
export function createLocalAnnotation(input: CreateAnnotationInput): Annotation {
  return {
    id: generateId(),
    pagePath: input.pagePath,
    pageTitle: input.pageTitle,
    message: input.message,
    element: input.element,
    createdAt: new Date().toISOString(),
    status: 'open',
    changes: input.changes,
  };
}
