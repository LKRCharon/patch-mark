---
layout: home

hero:
  name: patch-mark
  text: annotations that compile to prompts
  tagline: Point at an element, write a comment, hand your AI coding agent a structured prompt — selector, position, text, feedback.
  actions:
    - theme: brand
      text: Live demo
      link: https://lkrcharon.github.io/patch-mark/
    - theme: alt
      text: Getting started
      link: /guide/getting-started
    - theme: alt
      text: npm
      link: https://www.npmjs.com/package/patch-mark

features:
  - title: Point, don't describe
    details: Hover any element, click to select, write feedback. The agent gets the CSS selector, position, and visible text — not a screenshot and a guess.
  - title: Copy as prompt
    details: One click exports structured Markdown ready to paste into Cursor, Claude Code, or any agent.
  - title: Store adapter
    details: localStorage out of the box; implement a tiny interface to stream annotations to your own backend where the agent reads them.
  - title: Zero dependencies
    details: A single ESM file, ~11 KB gzipped. No framework lock-in. One script tag on any page.
  - title: Access control, optional
    details: Token-based lock for shared staging URLs — sharing links carry the token, the address bar stays clean.
  - title: Resolve lifecycle
    details: Annotations carry open / resolved status; watch the feedback loop close in real time as the agent fixes each item.
---

## Quick start

```html
<script type="module" src="https://unpkg.com/patch-mark"></script>
<patch-mark visible></patch-mark>
```

That's it — click the floating button, hover an element, click to select, write your comment. Read the [getting started guide](/guide/getting-started) for backends, theming, and framework integration.
