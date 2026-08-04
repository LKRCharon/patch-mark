# Store adapter & REST contract

The store boundary is a security boundary: values returned by a store are rendered in the page and may be handed to an agent. PatchMark validates the built-in adapters and validates store responses again before rendering, but your backend must still authorize and validate every request.

## Interface

```ts
interface AnnotationStore {
  list(pageKey: string, options?: StoreRequestOptions): Promise<Annotation[]>;
  create(input: CreateAnnotationInput, options?: StoreRequestOptions): Promise<Annotation>;
  update?(id: string, patch: { status: 'resolved' }, options?: StoreRequestOptions): Promise<Annotation>;
  delete?(id: string, options?: StoreRequestOptions): Promise<void>;
  reorder?(ids: string[], options?: StoreRequestOptions): Promise<void>;
  validateAccess?(options?: StoreRequestOptions): Promise<void>;
}
```

`StoreRequestOptions` carries an `AbortSignal`; reorder and access validation also receive the current `pagePath`. Built-in page keys default to `pathname + search + hash`. Back/forward and hash navigation reload an open list automatically. For a pushState router, set `tool.pageKey` whenever the active route/content identity changes.

`update` is intentionally narrow: the bundled client only resolves an annotation. Do not accept `Partial<Annotation>` from a browser or an agent. Give any richer workflow its own server command and authorization rule.

List reordering is opt-in too. PatchMark shows a drag handle only when the store implements `reorder()`, disables it while a reorder is pending, and restores the prior order if the request fails.

## Built-in stores

- `createLocalStorageStore({ key? })` is the default. It uses durable localStorage when available. If a later write fails, it preserves the current session in memory **and rejects the operation** so the UI never claims a durable save that did not happen. Inspect `store.persistence` (`'durable' | 'memory'`) if you need to surface this state yourself.
- `createFetchStore({ endpoint, headers?, timeoutMs? })` accepts a relative or absolute HTTP(S) endpoint without URL-embedded credentials. It uses URL-safe request construction, a 15-second default timeout, abort propagation, and strict request/response validation.

## REST endpoint contract

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| `GET` | `{endpoint}?page=<page-key>` | — | `{ annotations: Annotation[] }` |
| `POST` | `{endpoint}` | strict `CreateAnnotationInput` | `{ annotation: Annotation }` (201) |
| `PATCH` | `{endpoint}/{id}` | `{ "status": "resolved" }` only | `{ annotation: Annotation }` |
| `DELETE` | `{endpoint}/{id}` | — | `204` |
| `POST` | `{endpoint}/reorder` | `{ page: string, ids: string[] }` | `204` |

Server rules:

- Reject unknown fields and validate lengths, finite geometry, lifecycle values, and duplicate IDs at runtime.
- Assign `id`, `createdAt`, and initial `status: 'open'` on the server. Never spread a network payload onto a persisted annotation.
- Scope reorder to one exact page key and reject an ID set that does not exactly match that page.
- Return `401` from **every** protected route, including `GET`, and return `503` for storage corruption/IO failures instead of treating them as an empty collection.
- Use a transactional database or a real distributed lock in production. The included JSON-file backend is a single-process local/dev reference, not a multi-instance or serverless store.

The [`examples/nextjs-app-router/`](https://github.com/LKRCharon/patch-mark/tree/main/examples/nextjs-app-router) directory implements this restricted contract. It is a useful reference; replace its file store before a shared or horizontally scaled deployment.

## Custom store

```ts
tool.store = {
  async list(pageKey, { signal } = {}) { /* query only this page */ },
  async create(input, { signal } = {}) { /* validate and persist */ },
  async update(id, patch) { /* only accept patch.status === 'resolved' */ },
  async validateAccess() { /* protected server round-trip; reject 401 */ },
};
```

When `require-auth` is enabled, `validateAccess()` is required. It must make a server-authorized request and reject with `PatchMarkAuthError` on `401`; a token merely existing in browser storage is not considered a valid session.
