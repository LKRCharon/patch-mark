import type { Annotation, AnnotationStore, CreateAnnotationInput, ResolveAnnotationPatch } from '../types.js';
import { STORAGE_KEY_DEFAULT } from '../identity.js';
import { parseAnnotation, parseAnnotations, parseResolvePatch } from '../schema.js';

const MAX_ANNOTATIONS = 1000;

export class PatchMarkPersistenceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'PatchMarkPersistenceError';
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__patch_mark_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Browser-only store with an explicit durability state. If localStorage is
 * unavailable at startup it intentionally uses memory for the session. If a
 * durable write later fails, the operation throws instead of claiming success.
 */
export function createLocalStorageStore(options?: { key?: string }): AnnotationStore {
  const storageKey = options?.key ?? STORAGE_KEY_DEFAULT;
  let persistence: 'durable' | 'memory' = isLocalStorageAvailable() ? 'durable' : 'memory';
  const memoryFallback: Annotation[] = [];

  function readFromMemory(): Annotation[] {
    return [...memoryFallback];
  }

  function readFromStorage(): Annotation[] {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      // Invalid records must never reach a renderer. Preserve valid legacy
      // records rather than making one malformed entry hide every annotation.
      if (!Array.isArray(parsed)) {
        throw new PatchMarkPersistenceError('Saved patch-mark annotations are malformed.');
      }
      const safe: Annotation[] = [];
      for (const value of parsed) {
        try {
          safe.push(parseAnnotation(value));
        } catch {
          // An old or manually-edited record is ignored, rather than trusted.
        }
      }
      return safe;
    } catch (error) {
      if (error instanceof PatchMarkPersistenceError) throw error;
      throw new PatchMarkPersistenceError('Could not read saved patch-mark annotations.', { cause: error });
    }
  }

  function writeToMemory(annotations: Annotation[]): void {
    memoryFallback.length = 0;
    memoryFallback.push(...annotations.slice(0, MAX_ANNOTATIONS));
  }

  function read(): Annotation[] {
    return persistence === 'durable' ? readFromStorage() : readFromMemory();
  }

  function write(annotations: Annotation[]): void {
    const safe = parseAnnotations(annotations).slice(0, MAX_ANNOTATIONS);
    if (persistence === 'memory') {
      writeToMemory(safe);
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(safe));
    } catch (error) {
      // Preserve the user’s work for this tab, but surface that it is no longer
      // durable. The caller must not show a normal “saved” success state.
      persistence = 'memory';
      writeToMemory(safe);
      throw new PatchMarkPersistenceError(
        'Could not persist the annotation. It is available only for this browser session.',
        { cause: error },
      );
    }
  }

  return {
    get persistence() {
      return persistence;
    },

    async list(pagePath: string): Promise<Annotation[]> {
      return read().filter((annotation) => annotation.pagePath === pagePath);
    },

    async create(input: CreateAnnotationInput): Promise<Annotation> {
      const annotation: Annotation = {
        id: generateId(),
        pagePath: input.pagePath,
        pageTitle: input.pageTitle,
        message: input.message,
        element: input.element,
        createdAt: new Date().toISOString(),
        status: 'open',
        changes: input.changes,
      };
      const annotations = read();
      annotations.unshift(annotation);
      write(annotations);
      return annotation;
    },

    async update(id: string, patch: ResolveAnnotationPatch): Promise<Annotation> {
      const annotations = read();
      const index = annotations.findIndex((annotation) => annotation.id === id);
      if (index === -1) throw new Error(`Annotation ${id} not found`);
      const next = { ...annotations[index], ...parseResolvePatch(patch) };
      annotations[index] = parseAnnotation(next);
      write(annotations);
      return annotations[index];
    },

    async delete(id: string): Promise<void> {
      write(read().filter((annotation) => annotation.id !== id));
    },

    async reorder(ids: string[]): Promise<void> {
      const annotations = read();
      const idSet = new Set(ids);
      const reordered = ids
        .map((id) => annotations.find((annotation) => annotation.id === id))
        .filter((annotation): annotation is Annotation => annotation !== undefined);
      let index = 0;
      const result = annotations.map((annotation) =>
        idSet.has(annotation.id) ? reordered[index++] ?? annotation : annotation,
      );
      write(result);
    },
  };
}
