import { CLASS_PREFIX, CSS_VAR_PREFIX } from './identity.js';

/**
 * Global styles injected into document.head (for picker cursor on the whole page).
 * Must live outside Shadow DOM because it targets document.documentElement.
 */
function buildGlobalStyles(prefix: string): string {
  const pickerActive = `${prefix}-picker-active`;
  return `
.${pickerActive},
.${pickerActive} * {
  cursor: crosshair !important;
}

/* Freeze CSS animations while picking so animated elements hold still as
   selection targets. Transitions are left alone: pausing them mid-flight
   would snap elements to their end state and change the page's look. */
.${pickerActive} * {
  animation-play-state: paused !important;
}
`;
}

/**
 * Shadow DOM styles for the component.
 * Self-contained: defines its own CSS variable defaults, font stack, and box model reset.
 * Cross-browser fallbacks for color-mix, backdrop-filter, and 100vh.
 *
 * Bug fix 1: :host no longer uses transform (which created a containing block
 * for position:fixed descendants). Instead it spans full viewport height with
 * pointer-events:none, and children opt back in with pointer-events:auto.
 *
 * Bug fix 3: .pm-panel gets cursor:auto so the inherited crosshair cursor
 * from picking mode doesn't show on non-interactive panel areas.
 */
function buildShadowStyles(prefix: string): string {
  const cv = CSS_VAR_PREFIX;
  return `
:host {
  all: initial;
  position: fixed;
  z-index: 10000;
  top: 0;
  bottom: 0;
  right: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  pointer-events: none;
  font-family: system-ui, -apple-system, "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #0b1220;

  ${cv}-accent: #0058d0;
  ${cv}-accent-dark: #003f99;
  ${cv}-accent-soft: rgba(0, 88, 208, 0.12);
  ${cv}-ink: #0b1220;
  ${cv}-muted: #506070;
  ${cv}-foreground: #111827;
  ${cv}-line: rgba(0, 54, 128, 0.14);
  ${cv}-line-strong: rgba(0, 54, 128, 0.24);
  ${cv}-panel-solid: #ffffff;
  ${cv}-surface-muted: #eaf2ff;
  ${cv}-on-accent: #ffffff;
  ${cv}-font-mono: "IBM Plex Mono", "SFMono-Regular", "Consolas", monospace;
  ${cv}-error: #b42318;
  ${cv}-success: #087f5b;
}

/* ---- Launcher/panel dock positions (attribute: position) ----
   right-center is the :host default above. */
:host([position="right-top"]) { top: 1.5rem; bottom: auto; align-items: flex-start; }
:host([position="right-bottom"]) { top: auto; bottom: 1.5rem; align-items: flex-end; }
:host([position="left-center"]) { right: auto; left: 1.25rem; }
:host([position="left-top"]) { top: 1.5rem; bottom: auto; right: auto; left: 1.25rem; align-items: flex-start; }
:host([position="left-bottom"]) { top: auto; bottom: 1.5rem; right: auto; left: 1.25rem; align-items: flex-end; }

/* ---- Preset themes (Tailwind palette families) ----
   Selected with the theme attribute: <patch-mark theme="violet">.
   Each preset retunes the accent ramp plus the tinted neutrals
   (surface-muted, lines) so the UI blends with the host site's brand.
   Any value can still be overridden per-var from light-DOM CSS. */
:host([theme="violet"]) {
  ${cv}-accent: #7c3aed;
  ${cv}-accent-dark: #5b21b6;
  ${cv}-accent-soft: rgba(124, 58, 237, 0.12);
  ${cv}-surface-muted: #f5f3ff;
  ${cv}-line: rgba(76, 29, 149, 0.14);
  ${cv}-line-strong: rgba(76, 29, 149, 0.24);
}

:host([theme="emerald"]) {
  ${cv}-accent: #059669;
  ${cv}-accent-dark: #065f46;
  ${cv}-accent-soft: rgba(5, 150, 105, 0.12);
  ${cv}-surface-muted: #ecfdf5;
  ${cv}-line: rgba(6, 78, 59, 0.14);
  ${cv}-line-strong: rgba(6, 78, 59, 0.24);
}

:host([theme="orange"]) {
  ${cv}-accent: #ea580c;
  ${cv}-accent-dark: #9a3412;
  ${cv}-accent-soft: rgba(234, 88, 12, 0.12);
  ${cv}-surface-muted: #fff7ed;
  ${cv}-line: rgba(124, 45, 18, 0.14);
  ${cv}-line-strong: rgba(124, 45, 18, 0.24);
}

:host([theme="rose"]) {
  ${cv}-accent: #e11d48;
  ${cv}-accent-dark: #9f1239;
  ${cv}-accent-soft: rgba(225, 29, 72, 0.12);
  ${cv}-surface-muted: #fff1f2;
  ${cv}-line: rgba(136, 19, 55, 0.14);
  ${cv}-line-strong: rgba(136, 19, 55, 0.24);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ---- Launcher button ---- */
.${prefix}-launcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: auto;
  padding: 0 0.9rem;
  border: none;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, var(${cv}-accent), var(${cv}-accent-dark));
  color: var(${cv}-on-accent);
  box-shadow: 0 2px 12px color-mix(in srgb, var(${cv}-accent) 28%, transparent),
              0 1px 3px rgba(0, 0, 0, 0.06);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  transition: border-radius 300ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 200ms ease,
              transform 200ms ease,
              background 200ms ease,
              translate 260ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  pointer-events: auto;
  overflow: hidden;
  white-space: nowrap;
  translate: calc(var(${cv}-dodge-sign, -1) * var(${cv}-dodge-x, 0px)) 0;
}

.${prefix}-launcher svg {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

.${prefix}-launcher span {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 150ms ease,
              margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.${prefix}-launcher:hover {
  border-radius: 1.5rem;
  box-shadow: 0 8px 28px color-mix(in srgb, var(${cv}-accent) 38%, transparent),
              0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.${prefix}-launcher:hover span {
  max-width: 5rem;
  opacity: 1;
  margin-left: 0.5rem;
  transition: max-width 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 150ms ease 100ms,
              margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.${prefix}-launcher.is-active {
  background: var(${cv}-accent-dark);
  box-shadow: 0 2px 8px color-mix(in srgb, var(${cv}-accent-dark) 25%, transparent);
}

.${prefix}-launcher.is-active:hover {
  box-shadow: 0 6px 24px color-mix(in srgb, var(${cv}-accent-dark) 35%, transparent),
              0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ---- Launcher: drag, collapse-to-edge, hover-peek ---- */
.${prefix}-launcher {
  position: relative;
}

.${prefix}-launcher.is-floating {
  position: fixed;
  translate: 0;
}

.${prefix}-launcher.is-dragging {
  transition: none;
  cursor: grabbing;
}

.${prefix}-launcher.is-collapsed {
  position: fixed;
  width: 0.5rem;
  min-width: 0;
  height: 4rem;
  padding: 0;
  border-radius: 0.4rem;
  overflow: hidden;
}

.${prefix}-launcher.is-collapsed > svg,
.${prefix}-launcher.is-collapsed > span {
  display: none;
}

.${prefix}-launcher.is-collapsed:hover {
  width: auto;
  padding: 0 0.9rem;
  border-radius: 0.9rem;
}

.${prefix}-launcher.is-collapsed:hover > svg {
  display: inline-flex;
}

.${prefix}-launcher.is-collapsed:hover > span {
  display: inline-flex;
  max-width: 5rem;
  opacity: 1;
  margin-left: 0.5rem;
}

.${prefix}-collapse-btn {
  position: absolute;
  top: -0.45rem;
  right: -0.45rem;
  width: 1.15rem;
  height: 1.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(${cv}-panel-solid);
  color: var(${cv}-accent);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
}

.${prefix}-launcher:hover .${prefix}-collapse-btn {
  opacity: 1;
  pointer-events: auto;
}

.${prefix}-launcher.is-collapsed .${prefix}-collapse-btn,
.${prefix}-launcher.is-dragging .${prefix}-collapse-btn {
  display: none;
}

.${prefix}-collapse-btn svg {
  width: 0.7rem;
  height: 0.7rem;
}

/* ---- Panel ---- */
.${prefix}-panel {
  /* Stack above the selection overlay (z-index 9999) so the compose/list
     panel isn't visually pierced by the highlight frame while typing. */
  position: relative;
  z-index: 10000;
  width: min(21rem, calc(100vw - 7.5rem));
  overflow: hidden;
  border: 1px solid var(${cv}-line-strong);
  border-radius: 1rem;
  background: var(${cv}-panel-solid);
  box-shadow: 0 20px 56px rgba(7, 19, 33, 0.18);
  pointer-events: auto;
  cursor: auto;
  translate: calc(var(${cv}-dodge-sign, -1) * var(${cv}-dodge-x, 0px)) 0;
  transition: translate 260ms cubic-bezier(0.4, 0, 0.2, 1), opacity 160ms ease;
}

/* Picking mode: pointer over the panel body turns it into a ghost so the
   elements underneath stay hoverable and clickable */
.${prefix}-panel.is-ghost {
  /* Picking pointer-passes-through state: pointer-events:none does the
     actual pass-through; opacity just hints at it. Faint but visible. */
  opacity: 0.2;
  pointer-events: none;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .${prefix}-panel {
    background: var(${cv}-panel-solid);
  }
}

.${prefix}-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(${cv}-line);
  padding: 0.55rem 0.6rem 0.55rem 0.75rem;
}

.${prefix}-panel-tabs {
  display: flex;
  gap: 0.1rem;
}

.${prefix}-panel-tabs button,
.${prefix}-close,
.${prefix}-back,
.${prefix}-send,
.${prefix}-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  font: inherit;
}

.${prefix}-panel-tabs button {
  gap: 0.35rem;
  border-radius: 0.55rem;
  padding: 0.46rem 0.55rem;
  background: transparent;
  color: var(${cv}-muted);
  font-size: 0.84rem;
  font-weight: 650;
  cursor: pointer;
}

.${prefix}-panel-tabs button svg {
  width: 0.9rem;
  height: 0.9rem;
}

.${prefix}-panel-tabs button:hover,
.${prefix}-panel-tabs button.is-active {
  background: var(${cv}-accent-soft);
  color: var(${cv}-accent-dark);
}

.${prefix}-close {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: transparent;
  color: var(${cv}-muted);
  cursor: pointer;
}

.${prefix}-close:hover,
.${prefix}-back:hover {
  background: var(${cv}-surface-muted);
  color: var(${cv}-ink);
}

.${prefix}-close svg {
  width: 1rem;
  height: 1rem;
}

/* ---- Picker note ---- */
.${prefix}-picker-note,
.${prefix}-compose,
.${prefix}-list {
  padding: 1rem;
}

.${prefix}-picker-note {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.65rem;
  align-items: center;
}

.${prefix}-picker-note svg {
  width: 1.15rem;
  height: 1.15rem;
  color: var(${cv}-accent);
}

.${prefix}-picker-note p,
.${prefix}-target span,
.${prefix}-target strong,
.${prefix}-status,
.${prefix}-empty,
.${prefix}-item p,
.${prefix}-item time {
  margin: 0;
}

.${prefix}-picker-note p {
  color: var(${cv}-ink);
  font-size: 0.92rem;
  font-weight: 700;
}

.${prefix}-picker-note span {
  grid-column: 2;
  margin-top: 0.1rem;
  color: var(${cv}-muted);
  font-size: 0.79rem;
  line-height: 1.45;
}

/* ---- Locked (access token) panel ---- */
.${prefix}-locked {
  display: grid;
  gap: 0.6rem;
  justify-items: start;
  padding: 1rem;
}

.${prefix}-locked > svg {
  width: 1.3rem;
  height: 1.3rem;
  color: var(${cv}-accent);
}

.${prefix}-locked p {
  margin: 0;
  color: var(${cv}-ink);
  font-size: 0.92rem;
  font-weight: 700;
}

.${prefix}-locked > span {
  color: var(${cv}-muted);
  font-size: 0.79rem;
  line-height: 1.45;
}

.${prefix}-locked-input {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(${cv}-line);
  border-radius: 0.45rem;
  padding: 0.5rem 0.6rem;
  outline: none;
  font: inherit;
  font-size: 0.84rem;
  color: var(${cv}-ink);
  background: var(${cv}-panel-solid);
}

.${prefix}-locked-input:focus {
  border-color: var(${cv}-accent);
  box-shadow: 0 0 0 3px var(${cv}-accent-soft);
}

.${prefix}-locked .${prefix}-send {
  justify-self: end;
}

/* ---- Compose ---- */
.${prefix}-target {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.22rem 0.5rem;
  margin-bottom: 0.75rem;
}

.${prefix}-target > span:first-child {
  width: 100%;
  color: var(${cv}-muted);
  font-family: var(${cv}-font-mono);
  font-size: 0.72rem;
}

.${prefix}-target > strong {
  flex: 1;
  overflow: hidden;
  color: var(${cv}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${prefix}-compose textarea {
  display: block;
  width: 100%;
  min-height: 7.5rem;
  resize: vertical;
  border: 1px solid var(${cv}-line-strong);
  border-radius: 0.7rem;
  outline: none;
  background: var(${cv}-panel-solid);
  padding: 0.65rem 0.7rem;
  color: var(${cv}-ink);
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
}

.${prefix}-compose textarea:focus {
  border-color: var(${cv}-accent);
  box-shadow: 0 0 0 3px var(${cv}-accent-soft);
}

.${prefix}-compose-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.${prefix}-back,
.${prefix}-send {
  min-height: 2.3rem;
  border-radius: 0.6rem;
  padding-inline: 0.75rem;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
}

.${prefix}-back {
  background: transparent;
  color: var(${cv}-muted);
}

.${prefix}-send {
  gap: 0.4rem;
  background: var(${cv}-accent);
  color: var(${cv}-on-accent);
}

.${prefix}-send:hover:not(:disabled) {
  background: var(${cv}-accent-dark);
}

.${prefix}-send:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.${prefix}-send svg {
  width: 0.9rem;
  height: 0.9rem;
}

.${prefix}-copy-btn {
  gap: 0.3rem;
  border: 1px solid var(${cv}-line-strong);
  border-radius: 0.6rem;
  background: transparent;
  padding: 0.3rem 0.55rem;
  color: var(${cv}-muted);
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
}

.${prefix}-copy-btn:hover {
  background: var(${cv}-surface-muted);
  color: var(${cv}-ink);
}

.${prefix}-copy-btn svg {
  width: 0.82rem;
  height: 0.82rem;
}

.${prefix}-status {
  margin-top: 0.6rem;
  font-size: 0.82rem;
  line-height: 1.45;
}

.${prefix}-status.is-error {
  color: var(${cv}-error);
}

.${prefix}-status.is-success {
  color: var(${cv}-success);
}

/* ---- Selection level navigation ---- */
.${prefix}-select-nav {
  display: inline-flex;
  flex: none;
  gap: 0.15rem;
}

.${prefix}-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid var(${cv}-line-strong);
  border-radius: 0.4rem;
  background: transparent;
  padding: 0;
  color: var(${cv}-muted);
  cursor: pointer;
  transition: all 140ms ease;
}

.${prefix}-nav-btn:hover:not(:disabled) {
  border-color: var(${cv}-accent);
  background: var(${cv}-accent-soft);
  color: var(${cv}-accent-dark);
}

.${prefix}-nav-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.${prefix}-nav-btn svg {
  width: 0.85rem;
  height: 0.85rem;
}

/* ---- Property panel ---- */
.${prefix}-prop-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid var(${cv}-line-strong);
  border-radius: 0.4rem;
  background: transparent;
  padding: 0.18rem 0.45rem;
  color: var(${cv}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 650;
  cursor: pointer;
  transition: all 140ms ease;
}

.${prefix}-prop-toggle:hover {
  background: var(${cv}-surface-muted);
  color: var(${cv}-ink);
}

.${prefix}-prop-toggle.is-active {
  border-color: var(${cv}-accent);
  background: var(${cv}-accent-soft);
  color: var(${cv}-accent-dark);
}

.${prefix}-prop-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.55rem;
  background: var(${cv}-accent);
  color: var(${cv}-on-accent);
  font-size: 0.66rem;
  font-weight: 700;
  padding: 0 0.2rem;
}

.${prefix}-prop-panel {
  margin-bottom: 0.75rem;
  border: 1px solid var(${cv}-line);
  border-radius: 0.6rem;
  overflow: hidden;
}

.${prefix}-prop-hint {
  margin: 0;
  padding: 0.4rem 0.55rem;
  background: var(${cv}-surface-muted);
  color: var(${cv}-muted);
  font-size: 0.7rem;
  line-height: 1.35;
}

.${prefix}-prop-row {
  display: grid;
  grid-template-columns: 5.5rem 1fr 4.5rem;
  align-items: center;
  gap: 0.4rem;
  border-top: 1px solid var(${cv}-line);
  padding: 0.32rem 0.55rem;
}

.${prefix}-prop-row.is-changed {
  background: var(${cv}-accent-soft);
}

.${prefix}-prop-name {
  color: var(${cv}-muted);
  font-family: var(${cv}-font-mono);
  font-size: 0.72rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.${prefix}-prop-current {
  color: var(${cv}-ink);
  font-family: var(${cv}-font-mono);
  font-size: 0.74rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.7;
}

.${prefix}-prop-input {
  width: 100%;
  border: 1px solid var(${cv}-line);
  border-radius: 0.3rem;
  background: var(${cv}-panel-solid);
  padding: 0.18rem 0.3rem;
  color: var(${cv}-accent-dark);
  font-family: var(${cv}-font-mono);
  font-size: 0.72rem;
  outline: none;
  text-align: center;
}

.${prefix}-prop-input:focus {
  border-color: var(${cv}-accent);
  box-shadow: 0 0 0 2px var(${cv}-accent-soft);
}

.${prefix}-prop-input::placeholder {
  color: var(${cv}-muted);
  opacity: 0.5;
}

/* ---- List changes ---- */
.${prefix}-item-changes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.${prefix}-change {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border-radius: 0.3rem;
  background: var(${cv}-accent-soft);
  padding: 0.15rem 0.35rem;
  color: var(${cv}-accent-dark);
  font-family: var(${cv}-font-mono);
  font-size: 0.68rem;
  white-space: nowrap;
}

.${prefix}-change strong {
  color: var(${cv}-accent);
}

/* ---- List ---- */
.${prefix}-list {
  display: grid;
  max-height: min(30rem, calc(100vh - 12rem));
  max-height: min(30rem, calc(100dvh - 12rem));
  overflow-y: auto;
  padding-block: 0.35rem;
}

/* ---- Handoff bar (batch copy CTA pinned under the list) ---- */
.${prefix}-handoff-bar {
  padding: 0.6rem 1rem 0.85rem;
  border-top: 1px solid var(${cv}-line);
}

.${prefix}-handoff {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.7rem;
  background: linear-gradient(135deg, var(${cv}-accent), var(${cv}-accent-dark));
  color: var(${cv}-on-accent);
  box-shadow: 0 2px 10px color-mix(in srgb, var(${cv}-accent) 25%, transparent),
              0 1px 3px rgba(0, 0, 0, 0.06);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow 200ms ease, transform 200ms ease;
}

.${prefix}-handoff:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px color-mix(in srgb, var(${cv}-accent) 32%, transparent),
              0 1px 3px rgba(0, 0, 0, 0.06);
}

.${prefix}-handoff:active {
  transform: translateY(0);
}

.${prefix}-handoff svg {
  width: 1rem;
  height: 1rem;
}

.${prefix}-empty {
  padding: 0.75rem 0.65rem;
  color: var(${cv}-muted);
  font-size: 0.86rem;
}

.${prefix}-item {
  display: grid;
  gap: 0.35rem;
  border-bottom: 1px solid var(${cv}-line);
  padding: 0.9rem 0.65rem;
}

.${prefix}-item:last-child {
  border-bottom: 0;
}

.${prefix}-item.is-resolved {
  opacity: 0.55;
}

.${prefix}-item.is-dragging {
  opacity: 0.3;
}

.${prefix}-item.is-drop-before {
  box-shadow: inset 0 2px 0 0 var(${cv}-accent);
}

.${prefix}-item.is-drop-after {
  box-shadow: inset 0 -2px 0 0 var(${cv}-accent);
}

.${prefix}-item.is-resolved .${prefix}-item-header strong {
  text-decoration: line-through;
}

.${prefix}-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.${prefix}-item-title {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
}

.${prefix}-drag-handle {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.3rem;
  background: transparent;
  padding: 0.15rem;
  color: var(${cv}-muted);
  cursor: grab;
  opacity: 0.35;
  transition: opacity 140ms ease, color 140ms ease;
}

.${prefix}-drag-handle:hover {
  opacity: 1;
  color: var(${cv}-accent);
}

.${prefix}-drag-handle:active {
  cursor: grabbing;
}

.${prefix}-drag-handle svg {
  width: 0.8rem;
  height: 0.8rem;
}

.${prefix}-item-actions {
  display: flex;
  gap: 0.2rem;
}

.${prefix}-item-actions button {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.25rem;
  border: 0;
  border-radius: 0.35rem;
  background: transparent;
  padding: 0.25rem 0.35rem;
  color: var(${cv}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
}

.${prefix}-item-actions button:hover {
  background: var(${cv}-surface-muted);
  color: var(${cv}-ink);
}

.${prefix}-item-actions button.is-resolve {
  color: var(${cv}-accent-dark);
}

.${prefix}-item-actions button svg {
  width: 0.78rem;
  height: 0.78rem;
}

.${prefix}-item-status {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(${cv}-success);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.${prefix}-item strong {
  overflow: hidden;
  color: var(${cv}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${prefix}-item time {
  color: var(${cv}-muted);
  font-family: var(${cv}-font-mono);
  font-size: 0.72rem;
}

.${prefix}-item code,
.${prefix}-item-context {
  display: block;
  overflow: hidden;
  color: var(${cv}-muted);
  font-size: 0.75rem;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${prefix}-item code {
  font-family: var(${cv}-font-mono);
}

.${prefix}-item p {
  color: var(${cv}-foreground);
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* ---- Overlay ---- */
.${prefix}-overlay {
  position: fixed;
  z-index: 9999;
  inset: 0;
  pointer-events: none;
}

.${prefix}-highlight {
  position: fixed;
  border: 2px solid var(${cv}-accent);
  /* Hover should identify the target, not wash out the content the reviewer
     is trying to inspect. The selected state adds a slightly stronger ring. */
  background: transparent;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85) inset,
    0 0 0 2px color-mix(in srgb, var(${cv}-accent) 14%, transparent);
}

.${prefix}-highlight.is-selected {
  background: transparent;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.85) inset,
    0 0 0 4px color-mix(in srgb, var(${cv}-accent) 18%, transparent);
}

.${prefix}-element-label {
  position: fixed;
  display: flex;
  flex-direction: column;
  max-width: 15rem;
  gap: 0.1rem;
  overflow: hidden;
  border-radius: 0.38rem;
  background: var(${cv}-accent);
  padding: 0.32rem 0.45rem;
  color: #fff;
  font-family: var(${cv}-font-mono);
  font-size: 0.72rem;
  line-height: 1.3;
  white-space: nowrap;
}

.${prefix}-label-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  min-width: 0;
}

.${prefix}-label-row strong {
  overflow: hidden;
  text-overflow: ellipsis;
}

.${prefix}-label-row > span {
  flex: none;
  opacity: 0.78;
}

.${prefix}-label-key {
  opacity: 0.55;
  font-size: 0.66rem;
}

/* ---- Responsive ---- */
@media (max-width: 640px) {
  :host {
    top: auto;
    right: 0.75rem;
    bottom: 0.75rem;
    align-items: flex-end;
  }

  .${prefix}-launcher:hover {
    border-radius: 0.9rem;
    box-shadow: 0 2px 12px color-mix(in srgb, var(${cv}-accent) 28%, transparent),
                0 1px 3px rgba(0, 0, 0, 0.06);
    transform: none;
  }

  .${prefix}-launcher:hover span {
    max-width: 0;
    opacity: 0;
    margin-left: 0;
  }

  .${prefix}-panel {
    width: min(21rem, calc(100vw - 5.75rem));
  }
}
`;
}

export const globalStyles = buildGlobalStyles(CLASS_PREFIX);
export const shadowStyles = buildShadowStyles(CLASS_PREFIX);
