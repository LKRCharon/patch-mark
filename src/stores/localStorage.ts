import type { Annotation, AnnotationStore, CreateAnnotationInput } from '../types.js';
import { STORAGE_KEY_DEFAULT } from '../identity.js';

const MAX_ANNOTATIONS = 1000;

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

export function createLocalStorageStore(options?: { key?: string }): AnnotationStore {
  const storageKey = options?.key ?? STORAGE_KEY_DEFAULT;
  const available = isLocalStorageAvailable();
  const memoryFallback: Annotation[] = [];

  function readFromMemory(): Annotation[] {
    return [...memoryFallback];
  }

  function readFromStorage(): Annotation[] {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const value: unknown = JSON.parse(raw);
      if (!Array.isArray(value)) return [];
      return value.filter(isAnnotation);
    } catch {
      return [];
    }
  }

  function writeFromStorage(annotations: Annotation[]): void {
    try {
      localStorage.setItem(storageKey, JSON.stringify(annotations.slice(0, MAX_ANNOTATIONS)));
    } catch {
      // Quota exceeded or other write error — silently degrade
    }
  }

  function read(): Annotation[] {
    return available ? readFromStorage() : readFromMemory();
  }

  function write(annotations: Annotation[]): void {
    if (available) {
      writeFromStorage(annotations);
    } else {
      memoryFallback.length = 0;
      memoryFallback.push(...annotations.slice(0, MAX_ANNOTATIONS));
    }
  }

  return {
    async list(pagePath: string): Promise<Annotation[]> {
      return read().filter((a) => a.pagePath === pagePath);
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

    async update(id: string, patch: Partial<Annotation>): Promise<Annotation> {
      const annotations = read();
      const index = annotations.findIndex((a) => a.id === id);
      if (index === -1) throw new Error(`Annotation ${id} not found`);
      annotations[index] = { ...annotations[index], ...patch };
      write(annotations);
      return annotations[index];
    },

    async delete(id: string): Promise<void> {
      const annotations = read().filter((a) => a.id !== id);
      write(annotations);
    },

    async reorder(ids: string[]): Promise<void> {
      const annotations = read();
      const idSet = new Set(ids);
      const reordered = ids
        .map((id) => annotations.find((a) => a.id === id))
        .filter((a): a is Annotation => a !== undefined);
      let idx = 0;
      const result = annotations.map((a) =>
        idSet.has(a.id) ? reordered[idx++] ?? a : a,
      );
      write(result);
    },
  };
}

function isAnnotation(value: unknown): value is Annotation {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.pagePath === 'string' &&
    typeof v.message === 'string' &&
    typeof v.createdAt === 'string' &&
    typeof v.element === 'object' &&
    v.element !== null
  );
}
