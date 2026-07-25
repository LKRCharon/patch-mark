# Changelog

All notable changes to this project are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.6.0]: https://github.com/LKRCharon/patch-mark/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/LKRCharon/patch-mark/compare/v0.3.0...v0.5.0
[0.3.0]: https://github.com/LKRCharon/patch-mark/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/LKRCharon/patch-mark/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/LKRCharon/patch-mark/compare/2e9dc24...v0.2.0
