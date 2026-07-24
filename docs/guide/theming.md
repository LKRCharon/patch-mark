# Theming

Five presets drawn from the Tailwind CSS palette. Pick one with the `theme` attribute and the whole UI (launcher, panel, selection highlight) retints to match the host site's brand.

| Theme | Accent | Works well on |
| --- | --- | --- |
| `blue` (default) | `#0058d0` | neutral SaaS dashboards |
| `violet` | `#7c3aed` | creative / AI tools |
| `emerald` | `#059669` | docs, fintech, admin panels |
| `orange` | `#ea580c` | marketing sites |
| `rose` | `#e11d48` | bold consumer brands |

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
| `--pm-accent` | `#0058d0` | launcher, selection highlight, primary buttons |
| `--pm-accent-dark` | `#003f99` | launcher gradient end, hover/active states |
| `--pm-accent-soft` | `rgba(0, 88, 208, 0.12)` | selection fill, tinted chip backgrounds |
| `--pm-surface-muted` | `#eaf2ff` | subtle hover surface, hint bars |
| `--pm-line` / `--pm-line-strong` | `rgba(0, 54, 128, 0.14 / 0.24)` | hairlines and borders |
| `--pm-panel-solid` | `#ffffff` | panel background |
| `--pm-ink` / `--pm-muted` / `--pm-foreground` | `#0b1220` / `#506070` / `#111827` | text colors |
| `--pm-on-accent` | `#ffffff` | text and icons on accent |
| `--pm-font-mono` | IBM Plex Mono stack | monospace font |
