# patch-mark: annotations that compile to prompts

<p>
  <a href="https://www.npmjs.com/package/patch-mark"><img alt="npm version" src="https://img.shields.io/npm/v/patch-mark?style=flat-square&color=0058d0&label=npm"></a>
  <a href="https://www.npmjs.com/package/patch-mark"><img alt="npm downloads" src="https://img.shields.io/npm/dm/patch-mark?style=flat-square&color=0058d0"></a>
  <a href="https://bundlephobia.com/package/patch-mark"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/patch-mark?style=flat-square&color=0058d0&label=gzip"></a>
  <img alt="zero dependencies" src="https://img.shields.io/badge/dependencies-0-success?style=flat-square">
  <img alt="types included" src="https://img.shields.io/badge/types-included-3178c6?style=flat-square&logo=typescript&logoColor=white">
  <a href="https://github.com/LKRCharon/patch-mark/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square"></a>
  <img alt="web component" src="https://img.shields.io/badge/%3Cpatch--mark%3E-web%20component-e34f26?style=flat-square&logo=html5&logoColor=white">
</p>

UI feedback for AI coding agents.

Point at an element on a preview page, write a comment, and your coding agent gets the structured context it needs to fix the code — CSS selector, element name, position, visible text, and the feedback message. No more "the button on the left" screenshots.

## Why

When you use an AI coding agent to build frontends (v0, bolt, Cursor, Claude, etc.), the feedback loop is broken: you see something wrong in the preview, but communicating *what* is wrong means screenshots and vague descriptions. `patch-mark` closes that gap — you point, you comment, the agent gets machine-readable context.

This is not another annotation library for human review: `patch-mark` is specifically the **feedback channel between a human and an AI coding agent**.

## Quick start

### Zero config (localStorage)

```html
<script type="module" src="https://unpkg.com/patch-mark"></script>
<patch-mark visible></patch-mark>
```

That's it. Click the floating "批注" button, hover over any element, click to select, write your comment, and hit send. Annotations persist in `localStorage`.

> **Note:** The `visible` attribute controls whether the tool is shown on the page. It is **off by default**, so production builds stay clean — enable it only on preview/staging deployments where you collect feedback.

```html
<!-- hidden (default, production) -->
<patch-mark></patch-mark>

<!-- visible (staging, others can annotate) -->
<patch-mark visible></patch-mark>

<!-- or toggle at runtime -->
<script>
  document.querySelector('patch-mark').visible = true;
</script>
```

> **Production tip:** For production use, self-host the script or add [SRI integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) to the CDN tag to protect against supply-chain attacks.

### CDN (no install, no build step)

The package is mirrored on all major public CDNs the moment it's published. Drop one line into any HTML page — no npm, no bundler:

```html
<!-- unpkg, always latest -->
<script type="module" src="https://unpkg.com/patch-mark"></script>

<!-- jsdelivr, version pinned (recommended for anything shared) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/patch-mark@0.2.1"></script>
```

Can't use `type="module"`? (CMS code boxes, tag managers, legacy pipelines) — use the IIFE build, which registers the element and exposes a `PatchMark` global:

```html
<script src="https://unpkg.com/patch-mark/dist/patch-mark.iife.js"></script>
<patch-mark visible></patch-mark>
<script>
  // Programmatic API is available on the global:
  // PatchMark.createFetchStore, PatchMark.formatAnnotationsAsPrompt, ...
</script>
```

This makes the "collect feedback on staging" workflow one paste away in any project, regardless of its tech stack.

### Connect to a backend (agent consumption channel)

```ts
import 'patch-mark';
import { createFetchStore } from 'patch-mark';

const tool = document.querySelector('patch-mark')!;
tool.store = createFetchStore({ endpoint: '/api/annotations' });
```

Now annotations flow to your server, where your coding agent can read them as structured data and act on each item.

## Theming

Five presets drawn from the Tailwind CSS palette. Pick one with the `theme` attribute and the whole UI (launcher, panel, selection highlight) retints to match the host site's brand:

| Theme | Accent | Works well on |
| --- | --- | --- |
| `blue` (default) | `#0058d0` | neutral SaaS dashboards |
| `violet` | `#7c3aed` | creative / AI tools |
| `emerald` | `#059669` | docs, fintech, admin panels |
| `orange` | `#ea580c` | marketing sites |
| `rose` | `#e11d48` | bold consumer brands |

```html
<patch-mark theme="emerald" visible></patch-mark>
```

```js
tool.themeName = 'rose';            // switch preset at runtime
tool.theme = { accent: '#ff6d01' }; // fine-grained override, wins over the preset
```

Every color token is a CSS custom property, so host pages can restyle the component from plain CSS or even register their own named preset:

```css
patch-mark {
  --pm-accent: #ff6d01;
  --pm-accent-dark: #c25400;
}

/* custom preset, used as <patch-mark theme="brand"> */
patch-mark[theme="brand"] {
  --pm-accent: #ff6d01;
}
```

For one-off tweaks, set the variables inline or from your own stylesheet:

```html
<patch-mark style="--pm-accent: #0a84ff"></patch-mark>
```

| Variable | Default | Controls |
| --- | --- | --- |
| `--pm-accent` | `#0058d0` | launcher, selection highlight, primary buttons |
| `--pm-accent-dark` | `#003f99` | launcher gradient end, hover/active states |
| `--pm-accent-soft` | `rgba(0, 88, 208, 0.12)` | selection fill, tinted chip backgrounds |
| `--pm-surface-muted` | `#eaf2ff` | subtle hover surface, hint bars |
| `--pm-line` / `--pm-line-strong` | `rgba(0, 54, 128, 0.14 / 0.24)` | hairlines and borders |
| `--pm-panel-solid` | `#ffffff` | panel background |
| `--pm-ink` / `--pm-muted` / `--pm-foreground` | `#0b1220` / `#506070` / `#111827` | text colors |
| `--pm-on-accent` | `#ffffff` | text and icons on accent |
| `--pm-font-mono` | IBM Plex Mono stack | monospace font |

## The annotation data model

Every annotation captures exactly what an agent needs to locate and fix an element:

```typescript
type Annotation = {
  id: string;
  pagePath: string;          // e.g. "/dashboard"
  pageTitle?: string;
  message: string;            // the human's feedback
  element: {
    tagName: string;          // "button"
    name: string;             // "#submit-btn" or "button.submit-btn"
    selector: string;         // "div.header > button.submit-btn"
    text: string;             // visible text, truncated to 240 chars
    rect: {
      top: number;            // absolute document position
      left: number;
      width: number;
      height: number;
    };
  };
  createdAt: string;          // ISO timestamp
  status?: 'open' | 'resolved';
};
```

## Store adapter: the agent consumption channel

The store adapter is not an "extensibility feature" — it's the core of the product. This is how annotations get to where your agent can read them.

### Interface

```typescript
interface AnnotationStore {
  list(pagePath: string): Promise<Annotation[]>;
  create(input: CreateAnnotationInput): Promise<Annotation>;
  update?(id: string, patch: Partial<Annotation>): Promise<Annotation>;
  delete?(id: string): Promise<void>;
  reorder?(ids: string[]): Promise<void>;
}
```

### Built-in stores

**`createLocalStorageStore({ key? })`** — default. Persists to `localStorage` as JSON. Falls back to an in-memory array in private browsing mode (no errors, no data loss during the session).

**`createFetchStore({ endpoint, headers? })`** — REST API store. Talks to any backend that implements the endpoint contract below.

### REST endpoint contract

When using `createFetchStore`, your server implements these routes:

| Method | Path | Query | Request body | Response |
|--------|------|-------|-------------|----------|
| `GET` | `{endpoint}` | `?page=/dashboard` | — | `{ annotations: Annotation[] }` |
| `POST` | `{endpoint}` | — | `CreateAnnotationInput` | `{ annotation: Annotation }` (201) |
| `PATCH` | `{endpoint}/{id}` | — | `Partial<Annotation>` | `{ annotation: Annotation }` |
| `DELETE` | `{endpoint}/{id}` | — | — | 204 |
| `POST` | `{endpoint}/reorder` | — | `{ ids: string[] }` | 204 |

**Example server implementation** (Next.js Route Handler, file-based JSON store):

```ts
// app/api/annotations/route.ts
import { randomUUID } from 'crypto';
import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const storePath = path.join(process.cwd(), '.data', 'annotations.json');

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page');
  const annotations = await readAnnotations();
  return NextResponse.json({
    annotations: page
      ? annotations.filter(a => a.pagePath === page)
      : annotations,
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

// readAnnotations / saveAnnotations helpers omitted for brevity
```

Your agent reads the JSON file (or calls `GET /api/annotations`) and processes each annotation with `status: 'open'`. After fixing the code, it calls `PATCH /api/annotations/{id}` with `{ status: 'resolved' }` to close the loop.

### Custom store

Implement the `AnnotationStore` interface and assign it:

```ts
tool.store = {
  async list(pagePath) { /* your logic */ },
  async create(input) { /* your logic */ },
  async update(id, patch) { /* optional */ },
  async delete(id) { /* optional */ },
};
```

## Reorder annotations

In the list panel, drag the grip handle on any annotation to reorder it. The order is persisted via `store.reorder(ids)` and flows into the "Copy as prompt" output — top items land first in the agent's instruction, so you can mark priority by dragging the most important item to the top.

## Copy as prompt

Every annotation can be copied as structured Markdown, ready to paste into any AI coding agent's chat:

```markdown
## UI Feedback

- **Element:** `<button>`
- **Selector:** `div.header > button.submit-btn`
- **Name:** `#submit-btn`
- **Text:** "Submit Application"
- **Position:** top=320, left=480, 128x40
- **Page:** /dashboard
- **Feedback:** 按钮文字在移动端太小，建议增大到 16px
- **Status:** open
```

The compose panel and list panel each have a "Copy as prompt" button. You can also call it programmatically:

```ts
import { formatAnnotationAsPrompt } from 'patch-mark';

const markdown = formatAnnotationAsPrompt(annotation);
```

## Resolve lifecycle

Annotations have a `status` field: `'open'` or `'resolved'`. When your agent finishes fixing an issue, it marks the annotation as resolved:

```ts
await tool.store.update(annotationId, { status: 'resolved' });
```

The list panel shows resolved annotations with a visual indicator, so the human can see the feedback loop close in real time.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `store` | `AnnotationStore` | `createLocalStorageStore()` | Where annotations are persisted/sent |
| `labels` | `AnnotationLabels` | `defaultLabels` (Chinese) | UI text overrides |
| `themeName` | `string` | `'blue'` | Preset theme name (attribute: `theme`) |
| `theme` | `AnnotationTheme` | `{}` | Fine-grained accent overrides, applied on top of the preset |
| `visible` | `boolean` | `false` | Whether the launcher is shown on the page (attribute: `visible`) |

## Labels

Override any or all UI text:

```ts
tool.labels = {
  picker: 'Annotate',
  pickerHint: 'Hover to inspect, click to select',
  compose: 'Feedback',
  targetLabel: 'Target element',
  placeholder: 'Write feedback…',
  send: 'Send',
  sending: 'Sending…',
  reselect: 'Reselect',
  list: 'Notes',
  locate: 'Locate',
  close: 'Close',
  empty: 'No annotations on this page yet.',
  loading: 'Loading…',
  notFound: 'Element not found. The page may have changed.',
  contentPrefix: 'Content:',
  copyAsPrompt: 'Copy as prompt',
  copied: 'Copied',
  resolve: 'Resolve',
  resolved: 'Resolved',
  dragLabel: 'Drag to reorder',
};
```

## Framework integration

### React / Next.js

```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function PatchMark() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // Dynamic import — the module extends HTMLElement,
    // so it must only run in the browser, not during SSR.
    import('patch-mark').then(({ createFetchStore }) => {
      if (ref.current) {
        ref.current.store = createFetchStore({ endpoint: '/api/annotations' });
      }
    });
  }, []);

  return <patch-mark ref={ref as any}></patch-mark>;
}
```

TypeScript: add this to your `env.d.ts` for JSX support:

```ts
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'patch-mark': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
```

### Vue

```vue
<script setup>
import { ref, onMounted } from 'vue';
import 'patch-mark';

const tool = ref();

onMounted(() => {
  if (tool.value) {
    tool.value.store = { /* your store */ };
  }
});
</script>

<template>
  <patch-mark ref="tool"></patch-mark>
</template>
```

### Vanilla HTML

```html
<script type="module">
  import 'patch-mark';
  // Optional: connect a store
  import { createFetchStore } from 'patch-mark';
  const tool = document.querySelector('patch-mark');
  tool.store = createFetchStore({ endpoint: '/api/annotations' });
</script>
<patch-mark></patch-mark>
```

## Browser support

Chrome 111+ / Firefox 113+ / Safari 16.2+ (the `color-mix` support line).

Cross-browser fallbacks are built in:
- `color-mix()` → solid color fallback on older browsers
- `backdrop-filter` → `-webkit-` prefix + `@supports` solid background fallback
- `100vh` → `100dvh` with `vh` fallback (mobile viewport fix)
- `localStorage` → in-memory array in private browsing mode

No polyfills needed. Shadow DOM, Custom Elements, and CSS custom properties are all natively supported in the target range.

## Build

```bash
npm install
npm run build
# Output: dist/patch-mark.js       (ESM,  ~11 KB gzip, zero dependencies)
#         dist/patch-mark.iife.js (IIFE, for plain <script> tags)
```

## License

MIT
