# 属性

| 属性 | 类型 | 默认 | 说明 |
|----------|------|---------|-------------|
| `store` | `AnnotationStore` | `createLocalStorageStore()` | 批注持久化/发送去向 |
| `onError` | `(error, context) => void \| null` | `null`（回退到 `console.warn`） | store 操作失败的错误上报——尽早发现不完整的后端 |
| `labels` | `AnnotationLabels` | `defaultLabels`（中文） | UI 文案覆盖 |
| `themeName` | `string` | `'blue'` | 预设主题名（属性：`theme`） |
| `theme` | `AnnotationTheme` | `{}` | 细粒度强调色覆盖，叠加在预设之上 |
| `visible` | `boolean` | `false` | 启动按钮是否显示（属性：`visible`） |
| `requireAuth` | `boolean` | `false` | 用访问 token 锁住工具（属性：`require-auth`） |
| `position` | `string` | `'right-center'` | 启动按钮/面板停靠位置：right-center / right-top / right-bottom / left-center / left-top / left-bottom（属性：`position`） |

## onError

失败的 store 操作（list / create / resolve / reorder）通过 `onError` 上报，附带 `PatchMarkErrorContext`：

```ts
type PatchMarkErrorContext = {
  operation: 'list' | 'create' | 'resolve' | 'reorder';
  annotationId?: string;
};
```

未设置时回退到 `console.warn`。后端用 `401` 拒绝请求（访问控制）时，组件抛 `PatchMarkAuthError` 并自动显示锁定面板——`onError` 仍会触发，可接到监控。

## 编程 API

```ts
import {
  createLocalStorageStore,
  createFetchStore,
  createLocalAnnotation,
  setAuthToken, getAuthToken, clearAuthToken,
  formatAnnotationAsPrompt, formatAnnotationsAsPrompt,
  defaultLabels,
  PatchMarkAuthError,
  VERSION,
} from 'patch-mark';
```
