# Store adapter & REST contract

The store adapter is not an "extensibility feature" — it's the core of the product. This is how annotations get to where your agent can read them.

## Interface

```typescript
interface AnnotationStore {
  list(pagePath: string): Promise<Annotation[]>;
  create(input: CreateAnnotationInput): Promise<Annotation>;
  update?(id: string, patch: Partial<Annotation>): Promise<Annotation>;
  delete?(id: string): Promise<void>;
  reorder?(ids: string[]): Promise<void>;
}
```

## Built-in stores

**`createLocalStorageStore({ key? })`** — default. Persists to `localStorage` as JSON. Falls back to an in-memory array in private browsing mode (no errors, no data loss during the session).

**`createFetchStore({ endpoint, headers? })`** — REST API store. Talks to any backend that implements the endpoint contract below.

## REST endpoint contract

When using `createFetchStore`, your server implements these routes:

| Method | Path | Query | Request body | Response |
|--------|------|-------|-------------|----------|
| `GET` | `{endpoint}` | `?page=/dashboard` | — | `{ annotations: Annotation[] }` |
| `POST` | `{endpoint}` | — | `CreateAnnotationInput` | `{ annotation: Annotation }` (201) |
| `PATCH` | `{endpoint}/{id}` | — | `Partial<Annotation>` | `{ annotation: Annotation }` |
| `DELETE` | `{endpoint}/{id}` | — | — | 204 |
| `POST` | `{endpoint}/reorder` | — | `{ ids: string[] }` | 204 |

> **Server responsibilities:** the client sends `CreateAnnotationInput` only — your server assigns `id`, `createdAt`, and initializes `status: 'open'` on creation. Without `status`, the resolve lifecycle has no meaning. Incomplete implementations (e.g. a missing `PATCH`) fail loudly in the browser console (`[patch-mark] ...` warnings); set the component's `onError` callback to route them into your monitoring. When [access control](/guide/access-control) is enabled, every route — including `GET` — answers `401` to a missing or invalid Bearer token, and the component turns a 401 into its lock panel on its own.

## Example server implementation

Next.js Route Handler, file-based JSON store:

```ts
// app/api/annotations/route.ts
import { randomUUID } from 'crypto';
import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import type { Annotation } from 'patch-mark';

const storePath = path.join(process.cwd(), '.data', 'annotations.json');

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page');
  const annotations = await readAnnotations();
  return NextResponse.json({
    annotations: page ? annotations.filter(a => a.pagePath === page) : annotations,
  });
}

export async function POST(request: NextRequest) {
  const input = await request.json();
  const annotation = { id: randomUUID(), ...input, createdAt: new Date().toISOString(), status: 'open' };
  const annotations = await readAnnotations();
  annotations.unshift(annotation);
  await saveAnnotations(annotations.slice(0, 1000));
  return NextResponse.json({ annotation }, { status: 201 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const patch = await request.json();
  const annotations = await readAnnotations();
  const idx = annotations.findIndex(a => a.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  annotations[idx] = { ...annotations[idx], ...patch };
  await saveAnnotations(annotations);
  return NextResponse.json({ annotation: annotations[idx] });
}

async function readAnnotations(): Promise<Annotation[]> {
  try {
    return JSON.parse(await readFile(storePath, 'utf8'));
  } catch {
    return []; // no file yet
  }
}

async function saveAnnotations(annotations: Annotation[]): Promise<void> {
  await mkdir(path.dirname(storePath), { recursive: true });
  const tmp = `${storePath}.tmp`; // atomic write: tmp + rename
  await writeFile(tmp, JSON.stringify(annotations, null, 2));
  await rename(tmp, storePath);
}
```

Your agent reads the JSON file (or calls `GET /api/annotations`) and processes each annotation with `status: 'open'`. After fixing the code, it calls `PATCH /api/annotations/{id}` with `{ status: 'resolved' }` to close the loop.

The example above shows `GET`/`POST`/`PATCH`. For a copy-paste-ready implementation of all five routes (plus a matching client component, plus access control), see [`examples/nextjs-app-router/`](https://github.com/LKRCharon/patch-mark/tree/main/examples/nextjs-app-router) — it ships inside the npm package.

## Custom store

Implement the `AnnotationStore` interface and assign it:

```ts
tool.store = {
  async list(pagePath) { /* your logic */ },
  async create(input) { /* your logic */ },
  async update(id, patch) { /* optional */ },
  async delete(id) { /* optional */ },
};
```
