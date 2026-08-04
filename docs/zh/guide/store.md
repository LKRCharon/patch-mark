# Store 适配器与 REST 契约

Store 是安全边界：它返回的数据会被渲染到页面，也可能交给 agent。PatchMark 会校验内置 store，并在渲染前再次校验 store 返回值；但后端仍必须对每个请求做鉴权和运行时校验。

## 接口

```ts
interface AnnotationStore {
  list(pageKey: string, options?: StoreRequestOptions): Promise<Annotation[]>;
  create(input: CreateAnnotationInput, options?: StoreRequestOptions): Promise<Annotation>;
  update?(id: string, patch: { status: 'resolved' }, options?: StoreRequestOptions): Promise<Annotation>;
  delete?(id: string, options?: StoreRequestOptions): Promise<void>;
  reorder?(ids: string[], options?: StoreRequestOptions): Promise<void>;
  validateAccess?(options?: StoreRequestOptions): Promise<void>;
}
```

`StoreRequestOptions` 带有 `AbortSignal`；重排和访问验证还会收到当前 `pagePath`。默认页面 key 是 `pathname + search + hash`。前进/后退和 hash 路由会自动刷新已打开的列表；使用 pushState 路由时，请在路由或内容标识变化时设置 `tool.pageKey`。

`update` 故意收窄为 resolve。不要让浏览器或 agent 传 `Partial<Annotation>`；更复杂的工作流应使用单独的后端命令和授权规则。

列表重排也是可选能力。只有 store 实现 `reorder()` 时 PatchMark 才显示拖动手柄；请求进行中手柄会禁用，失败则恢复原有顺序。

## 内置 store

- `createLocalStorageStore({ key? })` 是默认值。可用时写入 localStorage；后续写入失败时会把当前会话保留在内存里，**同时拒绝这次操作**，绝不假装持久化成功。可读 `store.persistence`（`'durable' | 'memory'`）。
- `createFetchStore({ endpoint, headers?, timeoutMs? })` 接受相对或绝对的 HTTP(S) 地址，且不允许在 URL 中携带凭据；它使用安全 URL 构造、默认 15 秒超时、取消信号和严格的请求/响应校验。

## REST 契约

| Method | Path | 请求 | 响应 |
| --- | --- | --- | --- |
| `GET` | `{endpoint}?page=<page-key>` | — | `{ annotations: Annotation[] }` |
| `POST` | `{endpoint}` | 严格的 `CreateAnnotationInput` | `{ annotation: Annotation }` (201) |
| `PATCH` | `{endpoint}/{id}` | 仅 `{ "status": "resolved" }` | `{ annotation: Annotation }` |
| `DELETE` | `{endpoint}/{id}` | — | `204` |
| `POST` | `{endpoint}/reorder` | `{ page: string, ids: string[] }` | `204` |

服务端规则：

- 运行时拒绝未知字段，并校验长度、有限几何值、状态和重复 ID。
- `id`、`createdAt`、初始 `status: 'open'` 必须由服务端生成；不要把网络 payload 直接 spread 到持久化对象。
- 重排只作用于一个精确 page key；提交的 ID 集合必须与该页完全一致。
- 受保护的每个路由（包括 `GET`）都要返回 `401`；文件损坏/IO 失败要返回 `503`，不能伪装成空列表。
- 生产环境使用事务数据库或分布式锁。随包的 JSON 文件后端只适合单进程本地/开发，不适合多实例或 serverless。

[`examples/nextjs-app-router/`](https://github.com/LKRCharon/patch-mark/tree/main/examples/nextjs-app-router) 实现了这套收窄契约。它适合作为参考；部署到共享环境前请替换文件 store。

## 自定义 store

```ts
tool.store = {
  async list(pageKey, { signal } = {}) { /* 只查询这个页面 */ },
  async create(input, { signal } = {}) { /* 校验并持久化 */ },
  async update(id, patch) { /* 只接受 patch.status === 'resolved' */ },
  async validateAccess() { /* 受保护的服务端往返；401 时 reject */ },
};
```

启用 `require-auth` 时必须实现 `validateAccess()`。它必须实际请求受鉴权保护的服务端，并在 `401` 时抛出 `PatchMarkAuthError`；浏览器里“恰好有一个 token”不代表会话有效。
