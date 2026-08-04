# 主题

五个预设取自 Tailwind CSS 调色板。用 `theme` 属性选一个，整个 UI（启动按钮、面板、选中高亮）都会重新着色以贴合站点品牌。

| 主题 | 强调色 | 适配场景 |
| --- | --- | --- |
| `blue`（默认） | <span class="pm-swatch" style="background:#0058d0"></span> `#0058d0` | 中性 SaaS 仪表盘 |
| `violet` | <span class="pm-swatch" style="background:#7c3aed"></span> `#7c3aed` | 创意 / AI 工具 |
| `emerald` | <span class="pm-swatch" style="background:#059669"></span> `#059669` | 文档、金融、后台 |
| `orange` | <span class="pm-swatch" style="background:#ea580c"></span> `#ea580c` | 营销站 |
| `rose` | <span class="pm-swatch" style="background:#e11d48"></span> `#e11d48` | 醒目消费品牌 |

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

::: warning 淡色强调必须保持半透明
选取元素时，`--pm-accent-soft` 会覆盖在目标区域上。如果把默认半透明值
改成 `#dfe4ff` 这类实色，目标就会被遮住，看起来很像 z-index 错误。
请保留 alpha 通道；如果只想显示轮廓，可以直接设为透明：

```js
tool.theme = { accentSoft: 'transparent' };
```

组件使用较高层级是为了让选取器稳定显示在宿主页之上。自定义填充不透明时，
正确修法是恢复半透明或透明色，而不是降低 z-index。
:::

| 变量 | 默认 | 控制 |
| --- | --- | --- |
| `--pm-accent` | <span class="pm-swatch" style="background:#0058d0"></span> `#0058d0` | 启动按钮、选中高亮、主按钮 |
| `--pm-accent-dark` | <span class="pm-swatch" style="background:#003f99"></span> `#003f99` | 启动按钮渐变终点、hover/active 态 |
| `--pm-accent-soft` | <span class="pm-swatch" style="background:rgba(0, 88, 208, 0.12)"></span> `rgba(0, 88, 208, 0.12)` | 选中填充、淡色 chip 底 |
| `--pm-surface-muted` | <span class="pm-swatch" style="background:#eaf2ff"></span> `#eaf2ff` | 微妙 hover 面、提示条 |
| `--pm-line` / `--pm-line-strong` | <span class="pm-swatch" style="background:rgba(0, 54, 128, 0.14)"></span><span class="pm-swatch" style="background:rgba(0, 54, 128, 0.24)"></span> `rgba(0, 54, 128, 0.14 / 0.24)` | 细线和边框 |
| `--pm-panel-solid` | <span class="pm-swatch" style="background:#ffffff"></span> `#ffffff` | 面板背景 |
| `--pm-ink` / `--pm-muted` / `--pm-foreground` | <span class="pm-swatch" style="background:#0b1220"></span> `#0b1220` / <span class="pm-swatch" style="background:#506070"></span> `#506070` / <span class="pm-swatch" style="background:#111827"></span> `#111827` | 文字色 |
| `--pm-on-accent` | <span class="pm-swatch" style="background:#ffffff"></span> `#ffffff` | 强调色上的文字与图标 |
| `--pm-font-mono` | IBM Plex Mono 栈 | 等宽字体 |
