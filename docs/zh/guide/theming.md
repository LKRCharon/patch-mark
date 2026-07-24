# 主题

五个预设取自 Tailwind CSS 调色板。用 `theme` 属性选一个，整个 UI（启动按钮、面板、选中高亮）都会重新着色以贴合站点品牌。

| 主题 | 强调色 | 适配场景 |
| --- | --- | --- |
| `blue`（默认） | `#0058d0` | 中性 SaaS 仪表盘 |
| `violet` | `#7c3aed` | 创意 / AI 工具 |
| `emerald` | `#059669` | 文档、金融、后台 |
| `orange` | `#ea580c` | 营销站 |
| `rose` | `#e11d48` | 醒目消费品牌 |

```html
<patch-mark theme="emerald" visible></patch-mark>
```

```js
tool.themeName = 'rose';            // 运行时切预设
tool.theme = { accent: '#ff6d01' }; // 细粒度覆盖，优先级高于预设
```

## CSS 自定义属性

每个颜色令牌都是 CSS 自定义属性，宿主页可以用纯 CSS 重新着色，或注册自己的命名预设：

```css
patch-mark {
  --pm-accent: #ff6d01;
  --pm-accent-dark: #c25400;
}

/* 自定义预设，用作 <patch-mark theme="brand"> */
patch-mark[theme="brand"] {
  --pm-accent: #ff6d01;
}
```

一次性微调，可以内联或从自己的样式表设：

```html
<patch-mark style="--pm-accent: #0a84ff"></patch-mark>
```

| 变量 | 默认 | 控制 |
| --- | --- | --- |
| `--pm-accent` | `#0058d0` | 启动按钮、选中高亮、主按钮 |
| `--pm-accent-dark` | `#003f99` | 启动按钮渐变终点、hover/active 态 |
| `--pm-accent-soft` | `rgba(0, 88, 208, 0.12)` | 选中填充、淡色 chip 底 |
| `--pm-surface-muted` | `#eaf2ff` | 微妙 hover 面、提示条 |
| `--pm-line` / `--pm-line-strong` | `rgba(0, 54, 128, 0.14 / 0.24)` | 细线和边框 |
| `--pm-panel-solid` | `#ffffff` | 面板背景 |
| `--pm-ink` / `--pm-muted` / `--pm-foreground` | `#0b1220` / `#506070` / `#111827` | 文字色 |
| `--pm-on-accent` | `#ffffff` | 强调色上的文字与图标 |
| `--pm-font-mono` | IBM Plex Mono 栈 | 等宽字体 |
