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

> Try the **[live demo](https://lkrcharon.github.io/patch-mark/)** — the whole landing page is interactive.
> Full docs (EN / 中文): **[lkrcharon.github.io/patch-mark/docs/](https://lkrcharon.github.io/patch-mark/docs/)**

UI feedback for AI coding agents. Point at an element on a preview page, write a comment, and your coding agent gets the structured context it needs to fix the code — CSS selector, element name, position, visible text, and the feedback message. No more "the button on the left" screenshots.

This is not an annotation library for human review — it's specifically the **feedback channel between a human and an AI coding agent**.

## Quick start

```html
<script type="module" src="https://unpkg.com/patch-mark"></script>
<patch-mark visible></patch-mark>
```

Click the floating button, hover an element, click to select, write your comment. Annotations persist in `localStorage`. The `visible` attribute is off by default on the raw element — enable it on preview/staging only. (`patch-mark/react` renders visible by default.)

### npm

```bash
npm install patch-mark
```

```ts
import 'patch-mark';
import { createFetchStore } from 'patch-mark';
const tool = document.querySelector('patch-mark')!;
tool.store = createFetchStore({ endpoint: '/api/annotations' });
```

### React / Next.js

```tsx
'use client';
import { PatchMark } from 'patch-mark/react';
import { createFetchStore } from 'patch-mark';

export default function PatchMarkClient() {
  return <PatchMark store={createFetchStore({ endpoint: '/api/annotations' })} />;
}
```

Gate it by environment where you render it: `{process.env.NODE_ENV !== 'production' && <PatchMarkClient />}`.

## Let the agent read annotations itself (MCP)

With a REST store (`createFetchStore`), agents that speak MCP — Claude Code, Cursor, Codex — pull open annotations and mark them resolved directly. No copy-pasting:

```json
{
  "mcpServers": {
    "patch-mark": {
      "command": "npx",
      "args": ["-y", "patch-mark-mcp", "--endpoint", "http://localhost:3000/api/annotations"]
    }
  }
}
```

Two tools: `list_open_annotations` and `resolve_annotation`. No MCP? The list panel's **handoff bar** copies a self-serve prompt that walks any agent through the same loop. Annotate a batch, hand it off, watch the panel tick items off.

## Themes

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

Every color token is a CSS custom property — see the [theming docs](https://lkrcharon.github.io/patch-mark/docs/guide/theming) for the full variable table and custom presets.

## Properties

| Property | Default | Description |
|----------|---------|-------------|
| `store` | `createLocalStorageStore()` | Where annotations are persisted/sent |
| `visible` | `false` | Show the launcher (attribute: `visible`) |
| `themeName` | `'blue'` | Preset theme (attribute: `theme`) |
| `requireAuth` | `false` | Token lock (attribute: `require-auth`) |
| `onError` | `null` | Error reporter for failed store ops |

Full API reference, REST contract, access control, and framework recipes (Vue, vanilla HTML) are in the [docs](https://lkrcharon.github.io/patch-mark/docs/).

## Links

- [Live demo](https://lkrcharon.github.io/patch-mark/) · [Docs (EN)](https://lkrcharon.github.io/patch-mark/docs/) · [中文文档](https://lkrcharon.github.io/patch-mark/docs/zh/)
- [GitHub](https://github.com/LKRCharon/patch-mark) · [npm](https://www.npmjs.com/package/patch-mark)
- [CHANGELOG](CHANGELOG.md) · [Release checklist](RELEASE.md) · [Next.js example](examples/nextjs-app-router/)

## License

MIT
