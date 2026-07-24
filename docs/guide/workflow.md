# Workflow

The day-to-day loop: write annotations, copy them as prompts, and watch the agent resolve each one.

## Reorder annotations

In the list panel, drag the grip handle on any annotation to reorder it. The order is persisted via `store.reorder(ids)` and flows into the "Copy as prompt" output — top items land first in the agent's instruction, so you can mark priority by dragging the most important item to the top.

## Copy as prompt

Every annotation can be copied as structured Markdown, ready to paste into any AI coding agent's chat:

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

The compose panel and list panel each have a "Copy as prompt" button. You can also call it programmatically:

```ts
import { formatAnnotationAsPrompt } from 'patch-mark';

const markdown = formatAnnotationAsPrompt(annotation);
```

## Resolve lifecycle

Annotations have a `status` field: `'open'` or `'resolved'`. When your agent finishes fixing an issue, it marks the annotation as resolved:

```ts
await tool.store.update(annotationId, { status: 'resolved' });
```

The list panel shows resolved annotations with a visual indicator, so the human can see the feedback loop close in real time.
