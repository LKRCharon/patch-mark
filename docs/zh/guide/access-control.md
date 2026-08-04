# 访问控制

`require-auth` 改善的是组件的会话状态，**不是**后端鉴权。访问者始终可以检查或改动浏览器代码；先保护 API，再开启 UI 锁。

```html
<patch-mark visible require-auth></patch-mark>
```

## 组件实际保证什么

- 从 `?pm_token=` 取到 token 后写入存储（有内存回退），随后从 URL 中移除。
- 有 token 不等于有效会话。打开工具时，PatchMark 会先调用 `store.validateAccess({ pagePath })`，成功前不开放 picker/list。
- 收到 `401` 会清除 token、取消旧请求、清掉内存批注并回到锁屏。旧请求迟到的 401 不会把新 token 会话重新锁住。
- `require-auth` 会拒绝没有 `validateAccess()` 的 store；默认 localStorage store 刻意不是鉴权 store。

## 后端必须做什么

每个端点都必须独立校验 Bearer token：

- `GET`、`POST`、`PATCH`、`DELETE`、重排对缺失、过期、撤销 token 都返回 `401`。
- 服务端校验 scope。能读取批注的 token 不应自动拥有发 token 或访问其他 API 的权限。
- 不要让 token 进入日志、分析、错误报告、截图或 referrer；可行时使用短期、限权凭证。
- TLS、限流、CORS/origin policy 和正常应用授权仍由后端负责，web component 无法替代。

Next.js 示例展示的是小型 staging 用 token guard。文件 token store 不是生产身份系统；共享环境请接现有认证系统和数据库。

## 自定义受保护 store

```ts
import { PatchMarkAuthError } from 'patch-mark';

tool.store = {
  async list(pageKey, { signal } = {}) { /* 带鉴权的 GET */ },
  async create(input, { signal } = {}) { /* 带鉴权的 POST */ },
  async validateAccess({ pagePath } = {}) {
    const response = await fetch(`/api/annotations?page=${encodeURIComponent(pagePath ?? '')}`);
    if (response.status === 401) throw new PatchMarkAuthError('Unauthorized');
    if (!response.ok) throw new Error('Could not validate access');
  },
};
```

`setAuthToken`、`getAuthToken`、`clearAuthToken` 只用于浏览器侧 token 交接；没有上述服务端往返，它们不建立信任。
