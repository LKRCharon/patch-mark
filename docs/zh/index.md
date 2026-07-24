---
layout: home

hero:
  name: patch-mark
  text: 把批注编译成 prompt
  tagline: 在页面上指一个元素、写一句意见，把结构化上下文交给你的 AI 编程助手——选择器、位置、文本、反馈。
  actions:
    - theme: brand
      text: 在线演示
      link: https://lkrcharon.github.io/patch-mark/
    - theme: alt
      text: 快速开始
      link: /zh/guide/getting-started
    - theme: alt
      text: npm
      link: https://www.npmjs.com/package/patch-mark

features:
  - title: 指给 AI 看，别描述
    details: 悬停任意元素、点击选中、写下意见。AI 拿到的是 CSS 选择器、位置和可见文本，不是截图加猜测。
  - title: 一键复制成 prompt
    details: 一键导出结构化 Markdown，直接粘进 Cursor、Claude Code 或任何编程助手。
  - title: Store 适配器
    details: 默认存 localStorage；实现一个小接口就能把批注流到自己的后端，让 agent 直接读取。
  - title: 零依赖
    details: 单个 ESM 文件，gzip 约 11 KB。不绑定框架，任意页面一个 script 标签即可。
  - title: 访问控制（可选）
    details: 给共享的预览链接加 token 锁——分享链接里带 token，地址栏保持干净。
  - title: 解决生命周期
    details: 批注带 open / resolved 状态；agent 修完一项就标记解决，你在列表里看着闭环。
---

## 快速开始

```html
<script type="module" src="https://unpkg.com/patch-mark"></script>
<patch-mark visible></patch-mark>
```

点浮动按钮，悬停元素，点击选中，写下意见即可。后端接入、主题、框架集成见[快速开始指南](/zh/guide/getting-started)。
