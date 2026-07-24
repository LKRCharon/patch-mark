# 批注数据模型

每条批注精确捕获 agent 定位和修复元素所需的全部信息：

```typescript
type Annotation = {
  id: string;
  pagePath: string;          // 如 "/dashboard"
  pageTitle?: string;
  message: string;            // 人的反馈
  element: {
    tagName: string;          // "button"
    name: string;             // "#submit-btn" 或 "button.submit-btn"
    selector: string;         // "div.header > button.submit-btn"
    text: string;             // 可见文本，截断到 240 字符
    rect: {
      top: number;            // 文档绝对位置
      left: number;
      width: number;
      height: number;
    };
  };
  createdAt: string;          // ISO 时间戳
  status?: 'open' | 'resolved';
};
```

## 兼容性

模型只通过新增可选字段来演进。旧版本写的批注（比如没有 `status`）到处都按 `open` 处理——可以放心升级，无需迁移数据。

## CreateAnnotationInput

创建时客户端发送的内容（服务器分配 `id`、`createdAt`、`status`）：

```typescript
type CreateAnnotationInput = {
  pagePath: string;
  pageTitle?: string;
  message: string;
  element: ElementTarget;
  changes?: PropertyChange[];
};
```
