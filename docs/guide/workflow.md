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
- **Component:** `<SubmitButton>`
- **Source:** src/components/SubmitButton.tsx:42
- **Text:** "Submit Application"
- **Position:** top=320, left=480, 128x40
- **Page:** /dashboard
- **Feedback:** 按钮文字在移动端太小，建议增大到 16px
- **Status:** open
```

The **Component** and **Source** lines appear when the page runs a React or Vue **dev build**: patch-mark reads the framework's component tree and the JSX source mapping, so the agent jumps straight to the file instead of grepping for the selector. Production/minified builds expose no such metadata — output there is exactly as before.

The compose panel and list panel each have a "Copy as prompt" button. You can also call it programmatically:

```ts
import { formatAnnotationAsPrompt } from 'patch-mark';

const markdown = formatAnnotationAsPrompt(annotation);
```

## Hand off a batch to any agent

Single annotations copy as raw data; a batch copies as a complete
instruction. When the list has open items, a **handoff bar** appears at the
bottom of the list panel — one click on *Copy handoff prompt · N* copies a
self-contained prompt: working instructions plus every open annotation
(resolved items are excluded). Paste it to any agent as-is, no prepending
required. Programmatically: `formatHandoffPrompt(annotations, pageUrl)`.

**Paste-off mode** (default localStorage, zero infrastructure) — exactly
what the handoff bar copies, shown in full:

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
- **Feedback:** Make this primary and 2px larger

---

### 2. …
```

**Self-serve mode** (REST store) — when the store is a `createFetchStore`,
the handoff bar already knows the endpoint and copies a self-serve prompt
directly. The agent owns the whole loop: read open items, fix each, PATCH
it resolved — so nothing gets re-processed on the next pass. Each item
carries its `id` so the agent can close it. The shape it produces:

```text
This project collects UI feedback via patch-mark. Annotations live behind
a small REST API:

- GET   <endpoint>?page=<route>  → { annotations } (pick status "open")
- PATCH <endpoint>/<id>          → close an item with { "status": "resolved" }

Loop: fetch the open annotations for <route>, fix each one in the codebase
(locate elements by their `element.selector` class/id or visible text;
treat `changes[]` as exact property edits), then PATCH it resolved. Clear
all open items in one pass, then report a numbered summary.
```

With localStorage the agent can't reach the store, so resolving stays
manual — you click the check button per item in the list panel after
verifying. With the REST store the agent closes the loop itself, and the
panel ticks items off in real time.

## Resolve lifecycle

Annotations have a `status` field: `'open'` or `'resolved'`. When your agent finishes fixing an issue, it marks the annotation as resolved:

```ts
await tool.store.update(annotationId, { status: 'resolved' });
```

The list panel shows resolved annotations with a visual indicator, so the human can see the feedback loop close in real time.
