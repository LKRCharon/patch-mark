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

## 把一批批注交给任意 agent

单条批注复制出来是数据；一批批注复制出来是完整指令。当列表里有待处理项时，列表面板底部会出现**派单栏**——点一下「复制派单 prompt · N」，复制的就是一段自包含的 prompt：工作指令加全部 open 批注（已解决的自动排除），粘给任何 agent 就能直接开工，不用自己垫话。编程调用：`formatHandoffPrompt(annotations, pageUrl)`。

**粘贴模式**（默认 localStorage，零基础设施）——派单栏复制的内容，完整长这样：

```text
You are fixing a batch of UI feedback captured with patch-mark.

- **Page:** http://localhost:3000/dashboard
- **Open Items:** 10

How to work the batch:
1. Locate each element in the codebase: grep for a distinctive class or id
   from the Selector, or for the visible Text. The Page field maps to the
   route/component.
2. Apply the Feedback. "Property Changes" lines are exact instructions
   (`property: from → to`); otherwise follow the Feedback text and match
   the project's existing styling conventions.
3. Don't pause for confirmation between items — make the edit and move on.

When finished, reply with a numbered summary: what changed per item and
which files you touched. The user will verify in the browser and mark
items resolved.

---

### 1. `<button>` — #submit-btn

- **Element:** `<button>`
- **Selector:** `div.header > button.submit-btn`
- **Text:** "Submit Application"
- **Position:** top=320, left=480, 128x40
- **Page:** /dashboard
- **Feedback:** 按钮文字在移动端太小，建议增大到 16px

---

### 2. …
```

生成的 prompt 统一用英文（对 agent 最稳），批注内容保留你写的原文。

**自服务模式**（REST store）——当 store 用 `createFetchStore` 时，派单栏已经知道 endpoint，直接复制自服务 prompt。agent 全程托管闭环：读 open 项、逐个改、PATCH 标 resolved——下次派单只含新 open，不会重复处理。每条带 `id`，agent 能自己关闭。产出格式：

```text
这个项目用 patch-mark 收集 UI 批注，批注在一个小 REST API 后面：

- GET   <endpoint>?page=<路由>   → { annotations }（取 status 为 "open" 的）
- PATCH <endpoint>/<id>          → 用 { "status": "resolved" } 关闭一条

循环：拉取 <路由> 的 open 批注，逐条在代码库里修（用 element.selector
里的 class/id 或可见文本定位；changes[] 视为精确的属性改动），改完
PATCH 标 resolved。一轮清完所有 open 项，最后输出编号汇总。
```

localStorage 模式下 agent 摸不到 store，所以标记 resolved 靠手动——验收后在列表面板逐条点勾。REST 模式下 agent 自己闭环，面板里的条目会实时逐项打勾。

## 解决生命周期

批注带 `status` 字段：`'open'` 或 `'resolved'`。agent 修完一个问题后，把批注标记为已解决：

```ts
await tool.store.update(annotationId, { status: 'resolved' });
```

列表面板会用视觉标记显示已解决的批注，人能实时看到反馈闭环合上。
