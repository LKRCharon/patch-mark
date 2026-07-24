# Theming

Five presets drawn from the Tailwind CSS palette. Pick one with the `theme` attribute and the whole UI (launcher, panel, selection highlight) retints to match the host site's brand.

| Theme | Accent | Works well on |
| --- | --- | --- |
| `blue` (default) | <span class="pm-swatch" style="background:#0058d0"></span> `#0058d0` | neutral SaaS dashboards |
| `violet` | <span class="pm-swatch" style="background:#7c3aed"></span> `#7c3aed` | creative / AI tools |
| `emerald` | <span class="pm-swatch" style="background:#059669"></span> `#059669` | docs, fintech, admin panels |
| `orange` | <span class="pm-swatch" style="background:#ea580c"></span> `#ea580c` | marketing sites |
| `rose` | <span class="pm-swatch" style="background:#e11d48"></span> `#e11d48` | bold consumer brands |

```html
<patch-mark theme="emerald" visible></patch-mark>
```

```js
tool.themeName = 'rose';            // switch preset at runtime
tool.theme = { accent: '#ff6d01' }; // fine-grained override, wins over the preset
```

## CSS custom properties

Every color token is a CSS custom property, so host pages can restyle the component from plain CSS or register their own named preset:

```css
patch-mark {
  --pm-accent: #ff6d01;
  --pm-accent-dark: #c25400;
}

/* custom preset, used as <patch-mark theme="brand"> */
patch-mark[theme="brand"] {
  --pm-accent: #ff6d01;
}
```

For one-off tweaks, set the variables inline or from your own stylesheet:

```html
<patch-mark style="--pm-accent: #0a84ff"></patch-mark>
```

| Variable | Default | Controls |
| --- | --- | --- |
| `--pm-accent` | <span class="pm-swatch" style="background:#0058d0"></span> `#0058d0` | launcher, selection highlight, primary buttons |
| `--pm-accent-dark` | <span class="pm-swatch" style="background:#003f99"></span> `#003f99` | launcher gradient end, hover/active states |
| `--pm-accent-soft` | <span class="pm-swatch" style="background:rgba(0, 88, 208, 0.12)"></span> `rgba(0, 88, 208, 0.12)` | selection fill, tinted chip backgrounds |
| `--pm-surface-muted` | <span class="pm-swatch" style="background:#eaf2ff"></span> `#eaf2ff` | subtle hover surface, hint bars |
| `--pm-line` / `--pm-line-strong` | <span class="pm-swatch" style="background:rgba(0, 54, 128, 0.14)"></span><span class="pm-swatch" style="background:rgba(0, 54, 128, 0.24)"></span> `rgba(0, 54, 128, 0.14 / 0.24)` | hairlines and borders |
| `--pm-panel-solid` | <span class="pm-swatch" style="background:#ffffff"></span> `#ffffff` | panel background |
| `--pm-ink` / `--pm-muted` / `--pm-foreground` | <span class="pm-swatch" style="background:#0b1220"></span> `#0b1220` / <span class="pm-swatch" style="background:#506070"></span> `#506070` / <span class="pm-swatch" style="background:#111827"></span> `#111827` | text colors |
| `--pm-on-accent` | <span class="pm-swatch" style="background:#ffffff"></span> `#ffffff` | text and icons on accent |
| `--pm-font-mono` | IBM Plex Mono stack | monospace font |
