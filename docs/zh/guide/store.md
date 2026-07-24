# Store 适配器与 REST 契约

Store 适配器不是"扩展特性"——它是产品的核心。批注通过它到达 agent 能读取的位置。

## 接口

```typescript
interface AnnotationStore {
  list(pagePath: string): Promise<Annotation[]>;
  create(input: CreateAnnotationInput): Promise<Annotation>;
  update?(id: string, patch: Partial<Annotation>): Promise<Annotation>;
  delete?(id: string): Promise<void>;
  reorder?(ids: string[]): Promise<void>;
}
```

## 内置 store

**`createLocalStorageStore({ key? })`** — 默认。以 JSON 存到 `localStorage`。隐私模式下回退为内存数组（不报错、会话内不丢数据）。

**`createFetchStore({ endpoint, headers? })`** — REST API store。对接任何实现了下列端点契约的后端。

## REST 端点契约

用 `createFetchStore` 时，服务器实现这些路由：

| Method | Path | Query | Request body | Response |
|--------|------|-------|-------------|----------|
| `GET` | `{endpoint}` | `?page=/dashboard` | — | `{ annotations: Annotation[] }` |
| `POST` | `{endpoint}` | — | `CreateAnnotationInput` | `{ annotation: Annotation }` (201) |
| `PATCH` | `{endpoint}/{id}` | — | `Partial<Annotation>` | `{ annotation: Annotation }` |
| `DELETE` | `{endpoint}/{id}` | — | — | 204 |
| `POST` | `{endpoint}/reorder` | — | `{ ids: string[] }` | 204 |

> **服务端职责：** 客户端只发 `CreateAnnotationInput`——由服务器分配 `id`、`createdAt`，并初始化 `status: 'open'`。没有 `status`，解决生命周期就没有意义。不完整的实现（比如缺 `PATCH`）会在浏览器控制台大声报错（`[patch-mark] ...` 警告）；把组件的 `onError` 回调接到你的监控里。开启[访问控制](/zh/guide/access-control)后，所有路由（含 `GET`）对缺失或无效的 Bearer token 返回 `401`，组件据此自动显示锁定面板。

## 服务端示例

Next.js Route Handler，基于文件的 JSON store：

```ts
// app/api/annotations/route.ts
import { randomUUID } from 'crypto';
import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import type { Annotation } from 'patch-mark';

const storePath = path.join(process.cwd(), '.data', 'annotations.json');

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page');
  const annotations = await readAnnotations();
  return NextResponse.json({
    annotations: page ? annotations.filter(a => a.pagePath === page) : annotations,
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

async function readAnnotations(): Promise<Annotation[]> {
  try {
    return JSON.parse(await readFile(storePath, 'utf8'));
  } catch {
    return []; // 还没有文件
  }
}

async function saveAnnotations(annotations: Annotation[]): Promise<void> {
  await mkdir(path.dirname(storePath), { recursive: true });
  const tmp = `${storePath}.tmp`; // 原子写：tmp + rename
  await writeFile(tmp, JSON.stringify(annotations, null, 2));
  await rename(tmp, storePath);
}
```

你的 agent 读 JSON 文件（或调 `GET /api/annotations`），处理每条 `status: 'open'` 的批注。修完代码后调 `PATCH /api/annotations/{id}` 传 `{ status: 'resolved' }` 闭环。

上面示例展示了 `GET`/`POST`/`PATCH`。全五个路由（加客户端组件、加访问控制）的即拷即用实现见 [`examples/nextjs-app-router/`](https://github.com/LKRCharon/patch-mark/tree/main/examples/nextjs-app-router)——它随 npm 包发布。

## 自定义 store

实现 `AnnotationStore` 接口并赋值：

```ts
tool.store = {
  async list(pagePath) { /* 你的逻辑 */ },
  async create(input) { /* 你的逻辑 */ },
  async update(id, patch) { /* 可选 */ },
  async delete(id) { /* 可选 */ },
};
```
