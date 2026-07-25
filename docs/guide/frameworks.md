# Framework integration

patch-mark is a Web Component, so it works anywhere — React, Vue, Svelte, or plain HTML. The element module must only run client-side (it extends `HTMLElement`, undefined during SSR), so framework integration is mostly about gating that import.

## React / Next.js

`patch-mark/react` ships a ready-made wrapper: SSR-safe dynamic import, props for every option, and `visible` defaults to true — rendering the component is the opt-in.

```tsx
'use client';
import { useMemo } from 'react';
import { PatchMark } from 'patch-mark/react';
import { createFetchStore } from 'patch-mark';

export default function PatchMarkClient() {
  const store = useMemo(() => createFetchStore({ endpoint: '/api/annotations' }), []);
  return <PatchMark store={store} />;
}
```

Gate it by environment where you render it, and production stays clean:

```tsx
{process.env.NODE_ENV !== 'production' && <PatchMarkClient />}
```

Every element property is available as a prop — `store`, `labels`, `theme`, `themeName`, `visible`, `onError`, and `requireAuth`.

Importing `patch-mark/react` (once, anywhere) also types the raw element for JSX, so `<patch-mark visible theme="emerald" />` compiles with the `visible`, `theme`, and `accent` attributes.

### Prefer your own wrapper?

The dynamic-import pattern still works — the element module must only run client-side:

```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function PatchMark() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    import('patch-mark').then(({ createFetchStore }) => {
      if (ref.current) {
        ref.current.store = createFetchStore({ endpoint: '/api/annotations' });
      }
    });
  }, []);

  return <patch-mark ref={ref as any} visible></patch-mark>;
}
```

::: warning Turbopack may drop the dynamic import
With Next.js + Turbopack, a dynamic `import('patch-mark')` into an npm package can be silently left out of the **production** bundle — the module never runs, `customElements.define()` never fires, and `<patch-mark>` sits in the DOM with no shadow root, showing up as a blank/transparent box. Telltale sign: the element exists in the DOM but has **no shadow root**.

If you hit this:

- Add `patch-mark` to [`transpilePackages`](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages) in `next.config.ts` so the bundler always includes it.
- Keep the `import()` argument a string literal — a variable can't be statically resolved by any bundler.
- Or sidestep the bundler entirely with the CDN tag: `<script type="module" src="https://unpkg.com/patch-mark"></script>`.
:::

## Vue

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

## Vanilla HTML

```html
<script type="module">
  import 'patch-mark';
  import { createFetchStore } from 'patch-mark';
  const tool = document.querySelector('patch-mark');
  tool.store = createFetchStore({ endpoint: '/api/annotations' });
</script>
<patch-mark></patch-mark>
```
