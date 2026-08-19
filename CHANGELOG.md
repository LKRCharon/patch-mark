# Changelog

All notable changes to this project are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-08-19

### Added

- Added a one-click completion action to the annotation list. It resolves the
  open annotations visible when clicked, uses at most four concurrent store
  updates, and leaves feedback created by other reviewers during the batch
  open for an explicit later review.

### Fixed

- Batch completion reports partial failures and leaves failed annotations open
  instead of claiming the whole page was completed. Route, store, auth, or
  component changes abort stale work without mutating the new view.

## [1.1.0] - 2026-08-14

### Added

- Entrance animations. Transitions cannot animate a first paint, so the panel
  and annotation rows had been appearing instantly; they now rise into place,
  with the list staggered per row.
- A motion scale on `:host`: three durations (`--pm-dur-fast/base/slow`) and
  three curves (`--pm-ease`, `--pm-ease-soft`, `--pm-ease-land`), replacing
  ad-hoc values scattered through the stylesheet. Overridable like any other
  `--pm-*` token.
- `prefers-reduced-motion` support: entrances and transitions collapse to
  instant, and the hover lift is dropped, for users who ask the OS for less
  motion.

### Changed

- Hover and press feedback is now perceptible: the launcher and handoff button
  lift 2px with a slight scale and settle with a short overshoot, instead of
  the previous 1px move that read as nothing happening.
- Removed the panel header's close button. It duplicated the launcher, which
  already turns into a close control while the panel is open; Escape still
  closes the tool.

### Fixed

- Host page CSS could pollute the component's typography. A `:host`
  declaration loses to any document rule matching the host element, so an
  outer `patch-mark { line-height: 3 }`, a universal reset, or a framework
  preflight leaked in through inheritance — measured case: the launcher's
  line-height became 40.8px instead of 20.4px. Typography is now re-pinned on
  the shadow tree's top-level children, where no document rule can reach.
  `--pm-*` theming is deliberately unaffected.

## [1.0.2] - 2026-08-07

### Fixed

- Restored the launcher's manual collapse control as a visible, independently
  focusable native button. It now works by mouse, Enter, and Space without
  closing the tool.
- Kept the editor reachable on short mobile screens: the panel is bounded to
  the viewport and long compose, picker, and access content scroll internally.

## [1.0.1] - 2026-08-07

### Fixed

- Constrained the resolved-status checkmark to the same compact icon size as
  other annotation controls. It previously fell back to the browser SVG
  default viewport and could occupy most of an annotation card.

## [1.0.0] - 2026-08-04

### Security

- **Closed the stored-XSS path.** Annotation records are strictly validated at
  every built-in store boundary and again before UI use. List items are now
  created with DOM APIs rather than interpolating record values into HTML.
- **Narrowed the write contract.** Creation rejects unknown/mass-assignment
  fields; the built-in browser and example backend only accept
  `{ status: 'resolved' }` for an update; reorder is page-scoped and exact.
- **Made auth state server-validated.** `require-auth` now requires a
  `validateAccess()` store round-trip before picker/list controls open. A 401
  clears the token and stale failures cannot invalidate a newer session.
- **Established an agent trust boundary.** Prompts, handoffs, and MCP results
  label annotation fields as untrusted data. The MCP server is read-only by
  default; `resolve_annotation` requires explicit `--allow-resolve` plus
  evidence of the verified change.
- **Bound transport input.** Built-in REST/MCP endpoints only accept
  credential-free HTTP(S) URLs, annotation collections are capped, and the
  MCP stdio transport drops oversized requests rather than retaining them.
- **Patched the documentation toolchain.** Vite is pinned to 6.4.3 and
  PostCSS to 8.5.25 through the lockfile/override, leaving `npm audit` clean.

### Added

- Modern MCP `2026-07-28` discovery/stateless request support alongside the
  legacy `2025-03-26` stdio handshake.
- URL-safe fetch endpoints, abort propagation, default request timeouts, and
  strict REST response validation.
- `pageKey` support; the default identity now includes pathname, query, and
  hash to keep routed views separate.
- Persistence status for the local store and `PatchMarkPersistenceError` so a
  failed durable write is never reported as a normal success.
- Pull-request CI for typecheck, tests, build artifact drift, docs, and npm
  pack validation.

### Changed

- React props are fully declarative: omitted store/labels/theme/themeName/
  position/pageKey values reset to documented defaults, and refs are exposed
  after the custom element is upgraded.
- Picker highlights are outline-only. Hover labels measure themselves, avoid
  target/mouse collisions on all sides, and compact when space is tight.
- Multiple mounted components now coordinate document-level picker resources;
  only the most recently opened tool is active.

### Fixed

- Restored functional compose-panel dodge CSS and return-to-dock behavior.
- Made edge-collapse reachable by snapping from the release pointer rather
  than an on-screen-clamped launcher centre.
- Prevented expansion to `<body>` from producing an empty selector.
- Prevented stale list/create requests from mixing annotations across page
  keys or overwriting current loading state.
- Hide non-persistent reorder controls, serialize a page reorder while it is
  pending, and keep stale resolve/reorder results from changing a new route or
  replacement store.
- Kept a live text-selection range for overlay geometry through reflow and
  preserved quote context when expanding/shrinking selection.

## [0.9.4] - 2026-08-03

### Fixed

- **Submitting an annotation now returns directly to element picking.**
  The saved-annotation list remains available from its tab, but no longer
  interrupts users who are capturing several annotations in a row.

## [0.9.3] - 2026-07-29

### Fixed

- **Launcher no longer collapses on a tiny drag from the default dock.**
  The snap-to-edge threshold was 60px, but the default right-center dock
  already puts the launcher centre ~24px from the edge — so any small
  drag snapped it into the collapsed peek-tab and the user had to click
  (not drag) to get it back. The threshold is now 12px (under half the
  launcher width), so the launcher only collapses when pushed almost
  fully to an edge. Regression introduced in 0.7.0 (free-drag launch).

## [0.9.2] - 2026-07-23

### Fixed

- **Stray click after a text-selection gesture no longer reaches the
  page.** The browser dispatches a click to the gesture's common ancestor
  after the mouseup that formed the selection — by then the picking
  capture listener is gone, so the click toggled checkboxes inside labels,
  followed links, or opened modals. A one-shot suppressor now swallows
  exactly that click (and disarms itself if the gesture produced none).
- **Text-selection annotations spanning to `<body>` no longer save an
  empty selector.** Cross-paragraph selections whose common ancestor is
  `document.body` are now skipped, matching the 0.9.0 guard for
  background clicks.
- **Re-attaching the element while the tool is open restores the mode
  listeners.** The 0.9.0 shadow-reuse fix re-registered only the global
  keydown; picking (mousemove/click/mouseup) and compose (scroll/resize
  tracking) went silently dead after a DOM move until reopened.
- **Right-button mouseup no longer turns an existing selection into an
  annotation.** Only the primary button completes the gesture.
- **`patch-mark-mcp` rejects a malformed `--endpoint` at startup**
  (`new URL` check) instead of failing every tool call at runtime — e.g.
  when the flag swallowed the following argument.

## [0.9.1] - 2026-07-23

### Added

- **Text-selection annotations.** Dragging across text in picking mode
  annotates the exact phrase: the quote lands in a new `**Quote:**` prompt
  line (the agent greps for it verbatim), the ancestor element supplies
  the selector and styles, and the compose frame hugs the selection rect.
  Handoff prompts (both modes) now list the Quote as a locating hint.
- Docs: MCP server added to the README main flow; text-selection note in
  getting started (EN/ZH).

## [0.9.0] - 2026-07-23

### Added

- **MCP server (`patch-mark-mcp`).** Agents that speak MCP (Claude Code,
  Cursor, Codex, …) now read and resolve annotations directly — no prompt
  copying at all. Two tools: `list_open_annotations` (GET open items,
  optionally filtered by page) and `resolve_annotation` (PATCH an item
  resolved). Zero-runtime-dependency stdio server (newline-delimited
  JSON-RPC), with `--token` / `PATCH_MARK_TOKEN` matching the fetch
  store's Bearer convention:
  `npx patch-mark-mcp --endpoint http://localhost:3000/api/annotations`.

### Fixed

- **Framework detection fields never reached saved annotations.**
  `toElementTarget` copied an explicit field list and silently dropped the
  0.8.0 `component`/`source` fields on the pick → submit path (only
  expand/shrink kept them). It now strips picker extras by destructuring,
  so future `ElementTarget` fields survive too.
- **IME composition no longer triggers shortcuts.** Esc/Enter pressed to
  drive a CJK candidate window (`isComposing`) no longer unwinds the tool
  or submits the draft.
- **Re-entering picking no longer leaks listeners or strands paused
  videos.** A second `startPicking` (panel "picker" tab, `open()` API)
  left the old mousemove/click listeners attached and cleared the video
  resume list — freezing page videos until reload. setupPicking now cleans
  up first.
- **Element re-attachment no longer breaks the component.** Moving the
  `<patch-mark>` node in the DOM re-fired `connectedCallback` and
  `attachShadow` threw on the existing root; the shadow is now reused and
  document-level listeners re-registered.
- **Cmd/Ctrl+Enter only fires from inside the panel** — the host page's
  own binding keeps working while composing.
- **Escape keeps the draft and covers locked mode.** compose → picking no
  longer discards the typed message; the locked panel can now be closed
  with Esc.
- **Videos that ended while paused are not restarted** on resume.
- **Clicks on the page background (`<body>`/`<html>`) no longer create
  annotations with an empty selector** that could never be located later.

### Changed

- Docs: **Source** line caveat for React 19 (JSX source mapping removed;
  **Component** still works), MCP setup section in the workflow guide
  (EN/ZH).

## [0.8.0] - 2026-07-23

### Added

- **Framework component detection (React/Vue dev builds).** Annotations now
  carry `Component` and `Source` lines — e.g. `<SubmitButton>` and
  `src/Button.tsx:42` — read from the React fiber tree / Vue component
  instance and the JSX dev source mapping. The agent jumps straight to the
  file instead of grepping for the selector. Production/minified builds
  expose no such metadata; output there is unchanged.
- **Keyboard shortcuts.** `Esc` unwinds one layer at a time
  (compose → picking → closed; also closes the list panel);
  `Cmd/Ctrl+Enter` submits the annotation being composed. Both are inert
  while the tool is closed, so page-level shortcuts are never hijacked.
- **Animation freeze while picking.** CSS animations pause and looping
  background videos halt on entering picking mode, so animated targets
  hold still long enough to be selected. Everything resumes on exit;
  transitions are left untouched so elements don't snap to their end
  state mid-pick.

## [0.7.2] - 2026-07-24

### Fixed

- **Launcher drag: `pointercancel` now handled.** Touch interruptions
  (notifications, scroll takeover) no longer leave pointer listeners
  dangling and the launcher stuck in the grabbing state.
- **Launcher drag clamped to viewport; saved position clamped on restore.**
  The launcher can no longer be dragged fully off-screen, and a saved
  position that lands outside a smaller viewport (window switch / display
  change) is clamped back into view.
- **Collapse tab no longer jumps sides.** The peek tab renders on the edge
  the launcher was actually dragged to, not the configured dock side —
  expand/restore no longer ping-pongs.
- **Compose-mode tracking cleaned up on collapse, restored on expand.**
  scroll/resize listeners no longer leak while peeked.
- **Launcher drag listeners removed on disconnect.** Unmounting the
  component mid-drag (e.g. React conditional render) no longer leaks
  document pointer listeners.
- **Self-serve handoff prompt: `pagePath` now URL-encoded.** Matches the
  store's own GET encoding; routes with `?` / `&` / non-ASCII no longer
  break the agent's URL.

## [0.7.1] - 2026-07-24

### Fixed

- **Batch handoff prompt had every character on its own line.**
  `[...header, ...items.join(...)]` spread the joined string char-by-char
  (strings are iterable), so the copied prompt was one character per line.
  Affects `formatHandoffPrompt` (both modes) and `formatAnnotationsAsPrompt`.
  Single-item copy was unaffected.

## [0.7.0] - 2026-07-24

### Added

- **Launcher: drag, collapse-to-edge, hover-peek.** The launcher can now be
  dragged anywhere on the viewport; dragging near a screen edge snaps it
  into a slim peek tab. A small collapse button (top-right on hover) does
  the same explicitly. While peeked, panel and overlay hide; hovering the
  tab slides the launcher out, clicking restores it. Drag position and
  collapse state persist in localStorage.
- **Handoff self-serve loop (REST store).** When the store is a
  `createFetchStore`, the handoff bar knows the endpoint and copies a
  self-serve prompt: GET open items, fix each, PATCH it resolved. Each
  item carries its `id`, and the lifecycle rules tell the agent to skip
  already-resolved items — so nothing gets re-processed on the next pass.
  The agent owns the whole loop.

### Changed

- **Panel is now opaque.** Dropped the 96% white + 18px backdrop-blur
  frost: on content-heavy host pages the 4% bleed-through showed blurred
  shadows of underlying text inside the input/list area. Panel is now
  solid `--pm-panel-solid`.
- **Ghost opacity 0.12 → 0.2.** Picking pointer-pass-through state was so
  faint it looked broken; slightly more visible now (penetration still
  comes from `pointer-events: none`, not opacity).

### Fixed

- **Send button stayed disabled after typing.** `handlePanelInput` updated
  `this.message` on textarea input but never re-toggled the Send button's
  `disabled`, so Send was stuck and only Copy worked. Send now enables the
  moment you type.

## [0.6.1] - 2026-07-24

### Added

- **Handoff bar**: when the list has open annotations, a CTA bar appears at
  the bottom of the list panel — one click copies a self-contained batch
  prompt (working instructions plus every open annotation, resolved items
  excluded), ready to paste to any agent as-is. Label key `copyHandoff`
  (default: 复制派单 prompt), button shows the open count.
- **`formatHandoffPrompt(annotations, pageUrl)`** export — the generator
  behind the handoff bar, for programmatic use. Single annotations keep
  copying as raw data (`formatAnnotationAsPrompt`); the batch now carries
  its own instructions.

### Fixed

- **Compose/list panel now stacks above the selection overlay.** The
  overlay carried `z-index: 9999` while the panel was unpositioned, so the
  selection highlight frame pierced through the panel while typing
  feedback. Panel gets `position: relative; z-index: 10000`.
- **List panel came up ghosted when entered from picking.** Picking's
  mousemove listener keeps re-applying the `is-ghost` class (transparent,
  pointer-events:none) as long as it runs; switching to the list tab via
  the header didn't tear it down, so the whole annotation list rendered
  at ~12% opacity and was unclickable. `openList` now calls
  `cleanupPicking` first.

## [0.6.0] - 2026-07-24

### Added

- **Launcher `position` attribute**: dock the launcher/panel at `right-center`
  (default), `right-top`, `right-bottom`, `left-center`, `left-top`, or
  `left-bottom`. The compose dodge now slides the panel to the opposite side
  based on the dock side, so left-docked positions dodge rightwards.
- **Docs site** (VitePress) at https://lkrcharon.github.io/patch-mark/docs/ —
  bilingual (English default, 中文 at `/zh/`), dark mode, brand-tinted to
  patch-mark's accent. Built and deployed by a new `docs.yml` workflow
  (landing page stays at `/`, docs at `/docs/`).
- `homepage` field in package.json (shows on the npm page); Live demo link in
  the README and the landing nav.

### Changed

- README slimmed to a quick-start overview; full theming / API / store / REST
  / access-control / framework content moved to the docs site.
- Docs theme restyled after tailwindcss.com's visual language: Inter + IBM
  Plex Mono, slate neutrals, always-dark slate code blocks in both color
  modes, blueprint-grid hero, crosshair logo/favicon, and color swatches
  rendered inline in the theming tables.

## [0.5.0] - 2026-07-23

Shaped by real-world integration feedback from the first external consumer.

### Added

- **`onError` callback** on the element (and as a React prop). Failed store
  operations report through it with a `PatchMarkErrorContext`
  (`operation: 'list' | 'create' | 'resolve' | 'reorder'`, `annotationId?`),
  so an incomplete backend shows up in your monitoring instead of failing
  silently. Falls back to a `console.warn` when unset.
- **`patch-mark/react` subpath export**:
  - `<PatchMark>` wrapper component — SSR-safe dynamic import, props for
    `store` / `labels` / `theme` / `themeName` / `onError`, and `visible`
    defaults to `true` so environment-gated rendering
    (`{cond && <PatchMark />}`) just works.
  - JSX type declarations for the raw `<patch-mark>` element, including the
    `visible`, `theme`, and `accent` attributes — no more hand-written
    `env.d.ts`.
  - `react` is an optional peer dependency: non-React installs stay
    dependency-free.
- **Token-based access control (opt-in)**. Set `require-auth` and the
  launcher opens a lock panel until a valid token is present. Tokens spread
  through sharing links (`?pm_token=...`) — captured on load, persisted,
  then scrubbed from the address bar — with a paste-in fallback inside the
  lock panel. Every fetch-store request carries `authorization: Bearer`,
  and a `401` (even mid-session, e.g. after revocation) returns the user to
  the lock panel. Off by default; the example backend implements the
  matching guard (`ANNOTATION_AUTH=1`), an initial token, and an
  admin-guarded minting endpoint.
- **`examples/nextjs-app-router/`**, shipped inside the npm package: a
  copy-paste-ready backend implementing all five REST routes (GET, POST,
  PATCH, DELETE, reorder) with atomic JSON writes, plus a wired client
  component.
- **This changelog**, and a GitHub Actions publish workflow that releases
  with `npm publish --provenance`.

### Changed

- **No more silent failures.** `resolve` and `reorder` used to swallow store
  errors; they now warn (or call `onError`), and a failed resolve also
  surfaces as an error banner in the list panel.
- README: the REST contract table now states server responsibilities
  explicitly (the server assigns `id`, `createdAt`, `status: 'open'`); the
  Next.js example includes its `readAnnotations`/`saveAnnotations` helpers;
  the React section recommends the official wrapper.

## [0.3.0] - 2026-07-22

### Added

- Five preset themes drawn from the Tailwind palette (`blue`, `violet`,
  `emerald`, `orange`, `rose`), switchable via the `theme` attribute and
  extensible from host CSS.
- Anti-occlusion picking: the panel ghosts while you hover elements beneath
  it, so every part of the page stays selectable.
- Compose dodge: the panel slides to the opposite side when it would cover
  the selected element.

### Fixed

- `--pm-*` custom property name mismatch that silently broke accent/theme
  overrides.

## [0.2.1] - 2026-07-22

### Added

- Build-time version injection: `VERSION` is defined from `package.json`
  during the build, keeping a single source of truth.

## [0.2.0] - 2026-07-22

### Added

- Persistent selection frame that tracks the selected element while
  composing.
- Selection level navigation: expand to parent / shrink to child.
- IIFE build (`dist/patch-mark.iife.js`) for plain `<script>` tags, exposing
  a `PatchMark` global.

## [0.1.0] - 2026-07-22

Initial release: the `<patch-mark>` element with localStorage and fetch
stores, copy-as-prompt output, label overrides, and the resolve lifecycle.

---

## Upgrade notes

**Data-model compatibility.** The annotation model only grows by adding
optional fields. Annotations written by older versions (e.g. without
`status`) are treated as `open` everywhere, so upgrading never requires a
data migration.

[0.9.4]: https://github.com/LKRCharon/patch-mark/compare/v0.9.3...v0.9.4
[0.9.3]: https://github.com/LKRCharon/patch-mark/compare/v0.9.2...v0.9.3
[0.6.0]: https://github.com/LKRCharon/patch-mark/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/LKRCharon/patch-mark/compare/v0.3.0...v0.5.0
[0.3.0]: https://github.com/LKRCharon/patch-mark/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/LKRCharon/patch-mark/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/LKRCharon/patch-mark/compare/2e9dc24...v0.2.0
