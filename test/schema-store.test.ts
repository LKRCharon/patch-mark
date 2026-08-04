import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { PatchMarkValidationError, parseAnnotation, parseAnnotations, parseCreateAnnotation } from '../src/schema.js';
import { createFetchStore } from '../src/stores/fetch.js';
import { createLocalStorageStore, PatchMarkPersistenceError } from '../src/stores/localStorage.js';
import type { CreateAnnotationInput } from '../src/types.js';

function input(overrides: Partial<CreateAnnotationInput> = {}): CreateAnnotationInput {
  return {
    pagePath: '/dashboard?tab=main',
    pageTitle: 'Dashboard',
    message: 'Increase spacing',
    element: {
      tagName: 'button',
      name: '#save',
      selector: '#save',
      text: 'Save',
      rect: { top: 10, left: 20, width: 80, height: 32 },
    },
    ...overrides,
  };
}

function annotationPayload() {
  return {
    id: 'ann-1',
    pagePath: '/dashboard?tab=main',
    message: 'Increase spacing',
    element: input().element,
    createdAt: '2026-08-04T00:00:00.000Z',
    status: 'open',
  };
}

class MemoryStorage {
  private values = new Map<string, string>();
  failWrites = false;

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.failWrites) throw new Error('quota exceeded');
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

function installStorage(t: TestContext, storage: MemoryStorage): void {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  });
}

test('schema rejects mass-assignment fields and invalid response fields', () => {
  assert.throws(
    () => parseCreateAnnotation({ ...input(), id: '<img src=x onerror=alert(1)>' }),
    PatchMarkValidationError,
  );
  assert.throws(
    () => parseAnnotation({ ...annotationPayload(), createdAt: 'not-a-date' }),
    PatchMarkValidationError,
  );
  assert.throws(
    () => parseAnnotation({ ...annotationPayload(), injected: true }),
    PatchMarkValidationError,
  );
  assert.throws(
    () => parseAnnotations(Array.from({ length: 1001 }, () => annotationPayload())),
    PatchMarkValidationError,
  );
});

test('localStorage write failure preserves the session copy but rejects the claimed durable save', async (t) => {
  const storage = new MemoryStorage();
  installStorage(t, storage);
  const store = createLocalStorageStore({ key: 'schema-store-test' });
  assert.equal(store.persistence, 'durable');

  storage.failWrites = true;
  await assert.rejects(store.create(input()), PatchMarkPersistenceError);
  assert.equal(store.persistence, 'memory');
  const saved = await store.list('/dashboard?tab=main');
  assert.equal(saved.length, 1);
  assert.equal(saved[0].message, 'Increase spacing');
});

test('fetch store preserves endpoint query, encodes page input, and rejects malformed server output', async (t) => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  globalThis.fetch = (async (url: unknown, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify({ annotations: [{ ...annotationPayload(), unexpected: 'field' }] }), {
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const store = createFetchStore({ endpoint: 'https://feedback.example/api/annotations/?workspace=demo' });
  await assert.rejects(store.list('/dash board?tab=1'), PatchMarkValidationError);
  assert.equal(calls[0].url, 'https://feedback.example/api/annotations/?workspace=demo&page=%2Fdash+board%3Ftab%3D1');
});

test('fetch store requires a page scope before reordering', async () => {
  const store = createFetchStore({ endpoint: 'https://feedback.example/api/annotations' });
  await assert.rejects(store.reorder?.(['ann-1']) ?? Promise.resolve(), /pagePath/);
});

test('fetch store rejects non-HTTP endpoints and URL-embedded credentials', () => {
  assert.throws(
    () => createFetchStore({ endpoint: 'javascript:alert(1)' }),
    /Invalid patch-mark endpoint/,
  );
  assert.throws(
    () => createFetchStore({ endpoint: 'https://user:secret@feedback.example/api/annotations' }),
    /Invalid patch-mark endpoint/,
  );
});
