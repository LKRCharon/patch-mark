# 属性

| 属性 | 类型 | 默认 | 说明 |
|----------|------|---------|-------------|
| `store` | `AnnotationStore` | `createLocalStorageStore()` | 批注持久化/发送去向 |
| `onError` | `(error, context) => void \| null` | `null`（回退到 `console.warn`） | store 操作失败的错误上报——尽早发现不完整的后端 |
| `labels` | `Partial<AnnotationLabels>` | `defaultLabels`（中文） | UI 文案覆盖；重新赋值会立即更新界面，未提供的字段回退到默认值 |
| `pageKey` | `string \| null` | pathname + query + hash | 稳定页面身份；前进/后退和 hash 路由会自动刷新，pushState 路由需在路由变化时设置它 |
| `themeName` | `string` | `'blue'` | 预设主题名（属性：`theme`） |
| `theme` | `AnnotationTheme` | `{}` | 细粒度强调色覆盖，叠加在预设之上 |
| `visible` | `boolean` | `false` | 启动按钮是否显示（属性：`visible`） |
| `requireAuth` | `boolean` | `false` | 要求服务端验证的 token 会话（属性：`require-auth`） |
| `position` | `string` | `'right-center'` | 启动按钮/面板停靠位置：right-center / right-top / right-bottom / left-center / left-top / left-bottom（属性：`position`） |

## onError

失败的 store 操作（list / create / resolve / reorder）通过 `onError` 上报，附带 `PatchMarkErrorContext`：

```ts
type PatchMarkErrorContext = {
  operation: 'list' | 'create' | 'resolve' | 'reorder';
  annotationId?: string;
};
```

未设置时回退到 `console.warn`。后端用 `401` 拒绝请求时，PatchMark 会清除 token 并显示锁定面板——`onError` 仍会触发，可接到监控。开启 `requireAuth` 时，store 必须实现 `validateAccess()`；见[访问控制](/zh/guide/access-control)。

## 编程 API

```ts
import {
  createLocalStorageStore,
  createFetchStore,
  createLocalAnnotation,
  setAuthToken, getAuthToken, clearAuthToken,
  formatAnnotationAsPrompt, formatAnnotationsAsPrompt,
  defaultLabels,
  PatchMarkAuthError, PatchMarkPersistenceError,
  VERSION,
} from 'patch-mark';
```
