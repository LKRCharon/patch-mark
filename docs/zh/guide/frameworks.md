# 框架集成

patch-mark 是 Web Component，到处都能用——React、Vue、Svelte 或原生 HTML。元素模块只能在客户端运行（它继承 `HTMLElement`，SSR 时未定义），所以框架集成的核心就是门控这个 import。

## React / Next.js

`patch-mark/react` 提供现成封装：SSR 安全的动态 import、全量 props、`visible` 默认为 true——渲染即启用。

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

在渲染处按环境门控，生产就保持干净：

```tsx
{process.env.NODE_ENV !== 'production' && <PatchMarkClient />}
```

每个元素属性都可作为 prop——`store`、`labels`、`theme`、`themeName`、`visible`、`onError`、`requireAuth`。

import `patch-mark/react`（任意位置一次）还会为原生标签声明 JSX 类型，所以 `<patch-mark visible theme="emerald" />` 能编译，含 `visible`、`theme`、`accent` 属性。

### 想自己写封装？

动态 import 模式照样能用——元素模块只在客户端运行：

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

::: warning Turbopack 可能丢掉动态导入
在 Next.js + Turbopack 下，对 npm 包的动态 `import('patch-mark')` 可能在**生产**构建里被悄悄丢掉——模块没执行、`customElements.define()` 没跑，`<patch-mark>` 留在 DOM 里却没有 shadow root，表现为空白/透明的框。判断信号：元素在 DOM 里但**没有 shadow root**。

踩到的话：

- 在 `next.config.ts` 的 [`transpilePackages`](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages) 里加上 `patch-mark`，让打包器始终包含它。
- 保持 `import()` 参数为字符串字面量——变量无法被任何打包器静态解析。
- 或者干脆绕过打包器，用 CDN 标签：`<script type="module" src="https://unpkg.com/patch-mark"></script>`。
:::

## Vue

```vue
<script setup>
import { ref, onMounted } from 'vue';
import 'patch-mark';

const tool = ref();

onMounted(() => {
  if (tool.value) {
    tool.value.store = { /* 你的 store */ };
  }
});
</script>

<template>
  <patch-mark ref="tool"></patch-mark>
</template>
```

## 原生 HTML

```html
<script type="module">
  import 'patch-mark';
  import { createFetchStore } from 'patch-mark';
  const tool = document.querySelector('patch-mark');
  tool.store = createFetchStore({ endpoint: '/api/annotations' });
</script>
<patch-mark></patch-mark>
```
