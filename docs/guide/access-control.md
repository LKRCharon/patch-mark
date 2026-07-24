# Access control (optional)

When the tool is `visible` on a shared staging URL, anyone who finds the page can write annotations to your backend — or read the feedback others left. If that matters, turn on token-based access control; small sites can skip this section entirely.

```html
<patch-mark visible require-auth></patch-mark>
```

With `require-auth` set, the launcher opens a lock panel instead of the picker until a valid access token is present. Tokens reach people through sharing links:

```
https://staging.example.com/dashboard?pm_token=<token>
```

The component captures the parameter on load, persists it (localStorage with an in-memory fallback), and scrubs it from the address bar so it can't leak through screenshots or forwarded URLs. Every fetch-store request then carries `authorization: Bearer <token>`. Visitors who only got the token string can paste it into the lock panel instead.

## Backend contract

With auth enabled, **every** endpoint (including `GET`) answers `401` to a missing or invalid token. The component recognizes the 401 and shows the lock panel automatically — even mid-session, e.g. after a token was revoked.

The [`examples/nextjs-app-router/`](https://github.com/LKRCharon/patch-mark/tree/main/examples/nextjs-app-router) backend implements the whole flow:

- an `ANNOTATION_AUTH=1` env switch
- an initial token minted and logged on the first authenticated request
- an admin-guarded `POST /api/annotations/tokens` endpoint to mint more tokens
- revocation by removing the token from `.data/tokens.json`

See its README for setup.

## Programmatic control

```ts
import { setAuthToken, getAuthToken, clearAuthToken } from 'patch-mark';
```

The localStorage store needs no auth — data never leaves the browser.
