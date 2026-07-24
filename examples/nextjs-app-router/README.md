# patch-mark + Next.js (App Router) example

A copy-paste-ready backend for `createFetchStore`, implementing the full REST
contract — `GET`, `POST`, `PATCH`, `DELETE`, and reorder — plus a client
component wired with `patch-mark/react`.

## Files

| File | What it does |
| --- | --- |
| `app/api/annotations/route.ts` | `GET ?page=` list, `POST` create (server assigns `id`, `createdAt`, `status: 'open'`) |
| `app/api/annotations/[id]/route.ts` | `PATCH` update, `DELETE` remove |
| `app/api/annotations/reorder/route.ts` | `POST { ids }` — persist drag order |
| `app/api/annotations/tokens/route.ts` | `POST` — mint access tokens (admin-guarded) |
| `lib/annotations-store.ts` | JSON file persistence with atomic writes (`.data/annotations.json`) |
| `lib/tokens.ts` / `lib/auth.ts` | Token storage and the `checkAuth` guard |
| `app/components/PatchMark.tsx` | Client component wiring `patch-mark/react` to the API |

## Usage

1. Copy `app/api/annotations/` and `lib/annotations-store.ts` into your Next.js app.
2. Copy `app/components/PatchMark.tsx` and render it where you collect feedback:

   ```tsx
   // e.g. in app/layout.tsx
   {process.env.NODE_ENV !== 'production' && <PatchMarkClient />}
   ```

3. Annotations land in `.data/annotations.json` — add `.data/` to your
   `.gitignore` (a ready-made one sits next to this README in the repo; npm
   strips ignore files from tarballs). Your coding agent reads that file —
   or calls `GET /api/annotations` — and closes the loop with
   `PATCH /api/annotations/{id}` and `{ "status": "resolved" }`.

The route handlers `await params`, which works on both Next 15+ and Next 14
(the await is a harmless no-op there). Swap the JSON file for your database by
editing `lib/annotations-store.ts` only — the route code stays untouched.

## Access control (optional)

By default the API is open — fine for a local or throwaway preview. On a
shared staging deployment you probably don't want strangers writing (or
reading) annotations. To lock the API down:

1. Set `ANNOTATION_AUTH=1` and `ADMIN_TOKEN=<something-long>` in the
   environment.
2. On the first request, the server mints an initial token and logs it
   (`[patch-mark example] initial access token: ...`) — grab it from the
   server logs.
3. Share pages as `https://your-host/some/page?pm_token=<token>`. The
   component picks the token up, stores it, and scrubs it from the address
   bar.
4. Turn on the component side of the lock, so tokenless visitors get the
   lock panel instead of the picker:

   ```tsx
   <PatchMark store={store} requireAuth />
   ```

5. Mint more tokens for more people:

   ```bash
   curl -X POST https://your-host/api/annotations/tokens \
     -H "x-admin-token: <something-long>"
   ```

Revoking is manual: remove the token from `.data/tokens.json`. Every endpoint
answers `401` to a missing or invalid token, and the component turns that
into its unlock UI on its own.
