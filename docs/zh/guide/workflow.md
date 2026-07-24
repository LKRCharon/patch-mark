# 工作流

日常闭环：写批注、复制成 prompt、看着 agent 一项项解决。

## 排序批注

在列表面板里拖任意批注的握把即可重排。顺序通过 `store.reorder(ids)` 持久化，并流入"Copy as prompt"输出——靠前的项在 agent 指令里也靠前，所以把最重要的拖到顶部就能标优先级。

## 复制成 prompt

每条批注都能复制为结构化 Markdown，直接粘进任何 AI 编程助手的对话框：

```markdown
## UI Feedback

- **Element:** `<button>`
- **Selector:** `div.header > button.submit-btn`
- **Name:** `#submit-btn`
- **Text:** "Submit Application"
- **Position:** top=320, left=480, 128x40
- **Page:** /dashboard
- **Feedback:** 按钮文字在移动端太小，建议增大到 16px
- **Status:** open
```

compose 面板和 list 面板各有一个"Copy as prompt"按钮。也可以编程调用：

```ts
import { formatAnnotationAsPrompt } from 'patch-mark';

const markdown = formatAnnotationAsPrompt(annotation);
```

## 解决生命周期

批注带 `status` 字段：`'open'` 或 `'resolved'`。agent 修完一个问题后，把批注标记为已解决：

```ts
await tool.store.update(annotationId, { status: 'resolved' });
```

列表面板会用视觉标记显示已解决的批注，人能实时看到反馈闭环合上。
