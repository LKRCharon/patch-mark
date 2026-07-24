# Getting started

patch-mark is a zero-dependency Web Component: point at an element on a preview page, write a comment, and your AI coding agent gets the structured context it needs to fix the code — CSS selector, element name, position, visible text, and the feedback message. No more "the button on the left" screenshots.

This is not an annotation library for human review — it's specifically the **feedback channel between a human and an AI coding agent**.

## Zero config (localStorage)

```html
<script type="module" src="https://unpkg.com/patch-mark"></script>
<patch-mark visible></patch-mark>
```

Click the floating button, hover over any element, click to select, write your comment, and hit send. Annotations persist in `localStorage`.

> The `visible` attribute controls whether the tool is shown. It is **off by default** on the raw element, so production builds stay clean — enable it only on preview/staging. The `patch-mark/react` wrapper flips this: it renders visible by default, so gating the render is the only switch you need.

```html
<!-- hidden (default, production) -->
<patch-mark></patch-mark>

<!-- visible (staging) -->
<patch-mark visible></patch-mark>
```

```js
document.querySelector('patch-mark').visible = true; // toggle at runtime
```

> For production use, self-host the script or add [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) to the CDN tag.

## CDN (no install, no build step)

```html
<!-- unpkg, always latest -->
<script type="module" src="https://unpkg.com/patch-mark"></script>

<!-- jsdelivr, version pinned (recommended for anything shared) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/patch-mark@0.5.0"></script>
```

Can't use `type="module"`? (CMS code boxes, tag managers, legacy pipelines) — use the IIFE build, which registers the element and exposes a `PatchMark` global:

```html
<script src="https://unpkg.com/patch-mark/dist/patch-mark.iife.js"></script>
<patch-mark visible></patch-mark>
<script>
  // Programmatic API on the global:
  // PatchMark.createFetchStore, PatchMark.formatAnnotationsAsPrompt, ...
</script>
```

## Connect to a backend

```ts
import 'patch-mark';
import { createFetchStore } from 'patch-mark';

const tool = document.querySelector('patch-mark')!;
tool.store = createFetchStore({ endpoint: '/api/annotations' });
```

Now annotations flow to your server, where your coding agent reads them as structured data. See [Store adapter & REST contract](/guide/store).

## Browser support

Chrome 111+ / Firefox 113+ / Safari 16.2+ (the `color-mix` support line).

Cross-browser fallbacks are built in:

- `color-mix()` → solid color fallback on older browsers
- `backdrop-filter` → `-webkit-` prefix + `@supports` solid background fallback
- `100vh` → `100dvh` with `vh` fallback (mobile viewport fix)
- `localStorage` → in-memory array in private browsing mode

No polyfills needed. Shadow DOM, Custom Elements, and CSS custom properties are all natively supported in the target range.

## Build from source

```bash
npm install
npm run build
# dist/patch-mark.js       (ESM,  ~11 KB gzip, zero dependencies)
# dist/patch-mark.iife.js (IIFE, for plain <script> tags)
```
