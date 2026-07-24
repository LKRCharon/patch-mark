# 访问控制（可选）

工具在共享预发布 URL 上 `visible` 时，任何找到页面的人都能往后端写批注——或读到别人留的反馈。如果这对你重要，开启基于 token 的访问控制；小站点可以整段跳过。

```html
<patch-mark visible require-auth></patch-mark>
```

设了 `require-auth` 后，启动按钮在拿到有效 token 前会打开锁定面板而不是选择器。token 通过分享链接到达批注者：

```
https://staging.example.com/dashboard?pm_token=<token>
```

组件在加载时捕获这个参数、持久化（localStorage，带内存回退），并把它从地址栏抹掉，防止截图或转发链接泄露。之后每个 fetch-store 请求都带 `authorization: Bearer <token>`。只拿到 token 字符串的人也可以在锁定面板里手动粘贴。

## 后端契约

开启鉴权后，**所有**端点（含 `GET`）对缺失或无效 token 返回 `401`。组件识别 401 并自动显示锁定面板——哪怕是会话中途（比如 token 被吊销）。

[`examples/nextjs-app-router/`](https://github.com/LKRCharon/patch-mark/tree/main/examples/nextjs-app-router) 后端实现了完整流程：

- `ANNOTATION_AUTH=1` 环境开关
- 首个鉴权请求时生成初始 token 并打到日志
- 受 admin 保护的 `POST /api/annotations/tokens` 端点用于续发 token
- 从 `.data/tokens.json` 删除即吊销

设置见它的 README。

## 编程控制

```ts
import { setAuthToken, getAuthToken, clearAuthToken } from 'patch-mark';
```

localStorage store 无需鉴权——数据不出浏览器。
