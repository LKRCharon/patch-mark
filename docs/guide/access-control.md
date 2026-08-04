# Access control

`require-auth` improves the component’s session state; it is **not** backend authorization. A visitor can always inspect and alter browser code. Protect the API itself before enabling the UI lock.

```html
<patch-mark visible require-auth></patch-mark>
```

## What the component enforces

- A token from `?pm_token=` is captured, stored with an in-memory fallback, then removed from the URL.
- A protected session is not considered valid merely because a token exists. On opening, PatchMark calls `store.validateAccess({ pagePath })` before exposing picker/list controls.
- A `401` clears the stored token, cancels stale work, clears in-memory annotations, and returns to the lock screen. An older 401 cannot re-lock a newer token session.
- `require-auth` refuses a store without `validateAccess()`. The default localStorage store is intentionally not an auth store.

## Backend requirements

Every endpoint must independently require and verify the Bearer token:

- `GET`, `POST`, `PATCH`, `DELETE`, and reorder all return `401` for a missing, expired, or revoked token.
- Validate token scope server-side. A token that can list annotations should not automatically mint tokens or access unrelated APIs.
- Keep the token out of logs, analytics, error reports, screenshots, and referrers. Use short-lived/scoped credentials where practical.
- Enforce TLS, rate limiting, CORS/origin policy, and normal application authorization. PatchMark cannot provide these from a web component.

The Next.js example demonstrates a small staging-oriented token guard. Its file-backed token store is not a production identity system; use your existing auth provider and a database for shared environments.

## Custom protected stores

```ts
import { PatchMarkAuthError } from 'patch-mark';

tool.store = {
  async list(pageKey, { signal } = {}) { /* authenticated GET */ },
  async create(input, { signal } = {}) { /* authenticated POST */ },
  async validateAccess({ pagePath } = {}) {
    const response = await fetch(`/api/annotations?page=${encodeURIComponent(pagePath ?? '')}`);
    if (response.status === 401) throw new PatchMarkAuthError('Unauthorized');
    if (!response.ok) throw new Error('Could not validate access');
  },
};
```

Use `setAuthToken`, `getAuthToken`, and `clearAuthToken` only to manage the browser-side credential handoff. They do not establish trust without the server round-trip above.
