function E(e){let n=e.getBoundingClientRect(),t=e.tagName.toLowerCase(),o=N(e,t);return{tagName:t,name:o,selector:B(e),text:(e.innerText||e.getAttribute("aria-label")||"").replace(/\s+/g," ").trim().slice(0,240),rect:{top:Math.round(n.top+window.scrollY),left:Math.round(n.left+window.scrollX),width:Math.round(n.width),height:Math.round(n.height)}}}function I(e){return{tagName:e.tagName,name:e.name,selector:e.selector,text:e.text,rect:e.rect}}function N(e,n){if(e.id)return`#${e.id}`;let t=e.getAttribute("aria-label");if(t)return`${n}[aria-label="${t.slice(0,36)}"]`;let o=e.getAttribute("data-testid");if(o)return`[data-testid="${o}"]`;let r=e.parentElement?.closest("[id]");if(r?.id)return`#${r.id} \xB7 ${n}`;let s=Array.from(e.classList).filter(M).slice(0,2);return s.length?`${n}.${s.join(".")}`:n}function B(e){if(e.id)return`#${CSS.escape(e.id)}`;let n=[],t=e;for(;t&&t!==document.body&&n.length<5;){if(t.id){n.unshift(`#${CSS.escape(t.id)}`);break}let o=t.tagName.toLowerCase(),r=t.getAttribute("data-testid");if(r){n.unshift(`[data-testid="${CSS.escape(r)}"]`);break}let s=Array.from(t.classList).filter(M).slice(0,2),l=Array.from(t.parentElement?.children??[]).filter(u=>u.tagName===t?.tagName),d=l.length>1?`:nth-of-type(${l.indexOf(t)+1})`:"";n.unshift(`${o}${s.map(u=>`.${CSS.escape(u)}`).join("")}${d}`),t=t.parentElement}return n.join(" > ")}function M(e){return e.length<48&&!/^(css-|[a-z]+-[A-Za-z0-9]{6,}|[a-zA-Z0-9_-]*\d{4,})/.test(e)}function H(e,n="zh-CN"){let t=new Date(e);return new Intl.DateTimeFormat(n,{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(t)}var g="patch-mark";var $="--pm",D="data-pm-global",T="data-pm-ui",A="pm-picker-active",O="patch-mark:annotations",f="visible";var z=1e3;function K(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function U(){try{let e="__patch_mark_test__";return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch{return!1}}function S(e){let n=e?.key??O,t=U(),o=[];function r(){return[...o]}function s(){try{let c=localStorage.getItem(n);if(!c)return[];let h=JSON.parse(c);return Array.isArray(h)?h.filter(V):[]}catch{return[]}}function l(c){try{localStorage.setItem(n,JSON.stringify(c.slice(0,z)))}catch{}}function d(){return t?s():r()}function u(c){t?l(c):(o.length=0,o.push(...c.slice(0,z)))}return{async list(c){return d().filter(h=>h.pagePath===c)},async create(c){let h={id:K(),pagePath:c.pagePath,pageTitle:c.pageTitle,message:c.message,element:c.element,createdAt:new Date().toISOString(),status:"open",changes:c.changes},m=d();return m.unshift(h),u(m),h},async update(c,h){let m=d(),b=m.findIndex(k=>k.id===c);if(b===-1)throw new Error(`Annotation ${c} not found`);return m[b]={...m[b],...h},u(m),m[b]},async delete(c){let h=d().filter(m=>m.id!==c);u(h)},async reorder(c){let h=d(),m=new Set(c),b=c.map(v=>h.find(_=>_.id===v)).filter(v=>v!==void 0),k=0,F=h.map(v=>m.has(v.id)?b[k++]??v:v);u(F)}}}function V(e){if(typeof e!="object"||e===null)return!1;let n=e;return typeof n.id=="string"&&typeof n.pagePath=="string"&&typeof n.message=="string"&&typeof n.createdAt=="string"&&typeof n.element=="object"&&n.element!==null}var P={picker:"\u6279\u6CE8",pickerHint:"\u60AC\u505C\u67E5\u770B\u8303\u56F4\uFF0C\u70B9\u51FB\u540E\u6DFB\u52A0\u8BC4\u8BED",compose:"\u6279\u6CE8",targetLabel:"\u76EE\u6807\u5143\u7D20",placeholder:"\u7559\u4E0B\u8BC4\u8BED\u2026",send:"\u53D1\u9001",sending:"\u53D1\u9001\u4E2D",reselect:"\u91CD\u9009",list:"\u5DF2\u6279\u6CE8",locate:"\u5B9A\u4F4D",close:"\u5173\u95ED\u6279\u6CE8",empty:"\u5F53\u524D\u9875\u9762\u8FD8\u6CA1\u6709\u6279\u6CE8\u3002",loading:"\u6B63\u5728\u8BFB\u53D6\u2026",notFound:"\u672A\u627E\u5230\u8BE5\u5143\u7D20\uFF0C\u9875\u9762\u7ED3\u6784\u53EF\u80FD\u5DF2\u7ECF\u6539\u52A8\u3002",contentPrefix:"\u5185\u5BB9\uFF1A",copyAsPrompt:"Copy as prompt",copied:"\u5DF2\u590D\u5236",resolve:"\u89E3\u51B3",resolved:"\u5DF2\u89E3\u51B3",properties:"\u5C5E\u6027",propertiesHint:"\u76F4\u63A5\u4FEE\u6539\u6570\u503C\uFF0C\u53CD\u9988\u7ED9 agent \u7CBE\u786E\u6307\u4EE4",colorLabel:"\u989C\u8272",fontLabel:"\u5B57\u4F53",dragLabel:"\u62D6\u52A8\u6392\u5E8F",expandLabel:"\u6269\u5C55\u5230\u7236\u7EA7",shrinkLabel:"\u6536\u7F29\u5230\u5B50\u7EA7"};function y(e){let n=e.element,t=["## UI Feedback","",`- **Element:** \`<${n.tagName}>\``,`- **Selector:** \`${n.selector}\``,`- **Name:** ${n.name}`];if(n.text&&t.push(`- **Text:** "${n.text}"`),t.push(`- **Position:** top=${n.rect.top}, left=${n.rect.left}, ${n.rect.width}x${n.rect.height}`,`- **Page:** ${e.pagePath}`),e.pageTitle&&t.push(`- **Page Title:** ${e.pageTitle}`),t.push(`- **Feedback:** ${e.message}`),e.changes&&e.changes.length>0){t.push("","- **Property Changes:**");for(let o of e.changes)t.push(`  - \`${o.property}\`: ${o.from} \u2192 ${o.to}`)}return e.status&&t.push(`- **Status:** ${e.status}`),t.join(`
`)}function x(e,n){if(e.length===0)return`## UI Feedback

No feedback items.`;let t=["## UI Feedback Report","",`- **Page:** ${n||e[0].pagePath}`,`- **Total Items:** ${e.length}`,"- **Captured:** "+new Date().toISOString(),"","---"],o=e.map((r,s)=>`### Feedback #${s+1}

${y(r)}`);return[...t,...o.join(`

---

`)].join(`
`)}function X(e){let n=`${e}-picker-active`;return`
.${n},
.${n} * {
  cursor: crosshair !important;
}
`}function Y(e){let n=$;return`
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

  --${n}-accent: #0058d0;
  --${n}-accent-dark: #003f99;
  --${n}-accent-soft: rgba(0, 88, 208, 0.12);
  --${n}-ink: #0b1220;
  --${n}-muted: #506070;
  --${n}-foreground: #111827;
  --${n}-line: rgba(0, 54, 128, 0.14);
  --${n}-line-strong: rgba(0, 54, 128, 0.24);
  --${n}-panel-solid: #ffffff;
  --${n}-surface-muted: #eaf2ff;
  --${n}-on-accent: #ffffff;
  --${n}-font-mono: "IBM Plex Mono", "SFMono-Regular", "Consolas", monospace;
  --${n}-error: #b42318;
  --${n}-success: #087f5b;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ---- Launcher button ---- */
.${e}-launcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: auto;
  padding: 0 0.9rem;
  border: none;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, var(--${n}-accent), var(--${n}-accent-dark));
  color: var(--${n}-on-accent);
  box-shadow: 0 2px 12px color-mix(in srgb, var(--${n}-accent) 28%, transparent),
              0 1px 3px rgba(0, 0, 0, 0.06);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  transition: border-radius 300ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 200ms ease,
              transform 200ms ease,
              background 200ms ease;
  cursor: pointer;
  pointer-events: auto;
  overflow: hidden;
  white-space: nowrap;
}

.${e}-launcher svg {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

.${e}-launcher span {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 150ms ease,
              margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.${e}-launcher:hover {
  border-radius: 1.5rem;
  box-shadow: 0 8px 28px color-mix(in srgb, var(--${n}-accent) 38%, transparent),
              0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.${e}-launcher:hover span {
  max-width: 5rem;
  opacity: 1;
  margin-left: 0.5rem;
  transition: max-width 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 150ms ease 100ms,
              margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.${e}-launcher.is-active {
  background: var(--${n}-accent-dark);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--${n}-accent-dark) 25%, transparent);
}

.${e}-launcher.is-active:hover {
  box-shadow: 0 6px 24px color-mix(in srgb, var(--${n}-accent-dark) 35%, transparent),
              0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ---- Panel ---- */
.${e}-panel {
  width: min(21rem, calc(100vw - 7.5rem));
  overflow: hidden;
  border: 1px solid var(--${n}-line-strong);
  border-radius: 1rem;
  background: var(--${n}-panel-solid);
  background: color-mix(in srgb, var(--${n}-panel-solid) 96%, transparent);
  box-shadow: 0 20px 56px rgba(7, 19, 33, 0.18);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  pointer-events: auto;
  cursor: auto;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .${e}-panel {
    background: var(--${n}-panel-solid);
  }
}

.${e}-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--${n}-line);
  padding: 0.55rem 0.6rem 0.55rem 0.75rem;
}

.${e}-panel-tabs {
  display: flex;
  gap: 0.1rem;
}

.${e}-panel-tabs button,
.${e}-close,
.${e}-back,
.${e}-send,
.${e}-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  font: inherit;
}

.${e}-panel-tabs button {
  gap: 0.35rem;
  border-radius: 0.55rem;
  padding: 0.46rem 0.55rem;
  background: transparent;
  color: var(--${n}-muted);
  font-size: 0.84rem;
  font-weight: 650;
  cursor: pointer;
}

.${e}-panel-tabs button svg {
  width: 0.9rem;
  height: 0.9rem;
}

.${e}-panel-tabs button:hover,
.${e}-panel-tabs button.is-active {
  background: var(--${n}-accent-soft);
  color: var(--${n}-accent-dark);
}

.${e}-close {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--${n}-muted);
  cursor: pointer;
}

.${e}-close:hover,
.${e}-back:hover {
  background: var(--${n}-surface-muted);
  color: var(--${n}-ink);
}

.${e}-close svg {
  width: 1rem;
  height: 1rem;
}

/* ---- Picker note ---- */
.${e}-picker-note,
.${e}-compose,
.${e}-list {
  padding: 1rem;
}

.${e}-picker-note {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.65rem;
  align-items: center;
}

.${e}-picker-note svg {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--${n}-accent);
}

.${e}-picker-note p,
.${e}-target span,
.${e}-target strong,
.${e}-status,
.${e}-empty,
.${e}-item p,
.${e}-item time {
  margin: 0;
}

.${e}-picker-note p {
  color: var(--${n}-ink);
  font-size: 0.92rem;
  font-weight: 700;
}

.${e}-picker-note span {
  grid-column: 2;
  margin-top: 0.1rem;
  color: var(--${n}-muted);
  font-size: 0.79rem;
  line-height: 1.45;
}

/* ---- Compose ---- */
.${e}-target {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.22rem 0.5rem;
  margin-bottom: 0.75rem;
}

.${e}-target > span:first-child {
  width: 100%;
  color: var(--${n}-muted);
  font-family: var(--${n}-font-mono);
  font-size: 0.72rem;
}

.${e}-target > strong {
  flex: 1;
  overflow: hidden;
  color: var(--${n}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${e}-compose textarea {
  display: block;
  width: 100%;
  min-height: 7.5rem;
  resize: vertical;
  border: 1px solid var(--${n}-line-strong);
  border-radius: 0.7rem;
  outline: none;
  background: var(--${n}-panel-solid);
  padding: 0.65rem 0.7rem;
  color: var(--${n}-ink);
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
}

.${e}-compose textarea:focus {
  border-color: var(--${n}-accent);
  box-shadow: 0 0 0 3px var(--${n}-accent-soft);
}

.${e}-compose-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.${e}-back,
.${e}-send {
  min-height: 2.3rem;
  border-radius: 0.6rem;
  padding-inline: 0.75rem;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
}

.${e}-back {
  background: transparent;
  color: var(--${n}-muted);
}

.${e}-send {
  gap: 0.4rem;
  background: var(--${n}-accent);
  color: var(--${n}-on-accent);
}

.${e}-send:hover:not(:disabled) {
  background: var(--${n}-accent-dark);
}

.${e}-send:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.${e}-send svg {
  width: 0.9rem;
  height: 0.9rem;
}

.${e}-copy-btn {
  gap: 0.3rem;
  border: 1px solid var(--${n}-line-strong);
  border-radius: 0.6rem;
  background: transparent;
  padding: 0.3rem 0.55rem;
  color: var(--${n}-muted);
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
}

.${e}-copy-btn:hover {
  background: var(--${n}-surface-muted);
  color: var(--${n}-ink);
}

.${e}-copy-btn svg {
  width: 0.82rem;
  height: 0.82rem;
}

.${e}-status {
  margin-top: 0.6rem;
  font-size: 0.82rem;
  line-height: 1.45;
}

.${e}-status.is-error {
  color: var(--${n}-error);
}

.${e}-status.is-success {
  color: var(--${n}-success);
}

/* ---- Selection level navigation ---- */
.${e}-select-nav {
  display: inline-flex;
  flex: none;
  gap: 0.15rem;
}

.${e}-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid var(--${n}-line-strong);
  border-radius: 0.4rem;
  background: transparent;
  padding: 0;
  color: var(--${n}-muted);
  cursor: pointer;
  transition: all 140ms ease;
}

.${e}-nav-btn:hover:not(:disabled) {
  border-color: var(--${n}-accent);
  background: var(--${n}-accent-soft);
  color: var(--${n}-accent-dark);
}

.${e}-nav-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.${e}-nav-btn svg {
  width: 0.85rem;
  height: 0.85rem;
}

/* ---- Property panel ---- */
.${e}-prop-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid var(--${n}-line-strong);
  border-radius: 0.4rem;
  background: transparent;
  padding: 0.18rem 0.45rem;
  color: var(--${n}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 650;
  cursor: pointer;
  transition: all 140ms ease;
}

.${e}-prop-toggle:hover {
  background: var(--${n}-surface-muted);
  color: var(--${n}-ink);
}

.${e}-prop-toggle.is-active {
  border-color: var(--${n}-accent);
  background: var(--${n}-accent-soft);
  color: var(--${n}-accent-dark);
}

.${e}-prop-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.55rem;
  background: var(--${n}-accent);
  color: var(--${n}-on-accent);
  font-size: 0.66rem;
  font-weight: 700;
  padding: 0 0.2rem;
}

.${e}-prop-panel {
  margin-bottom: 0.75rem;
  border: 1px solid var(--${n}-line);
  border-radius: 0.6rem;
  overflow: hidden;
}

.${e}-prop-hint {
  margin: 0;
  padding: 0.4rem 0.55rem;
  background: var(--${n}-surface-muted);
  color: var(--${n}-muted);
  font-size: 0.7rem;
  line-height: 1.35;
}

.${e}-prop-row {
  display: grid;
  grid-template-columns: 5.5rem 1fr 4.5rem;
  align-items: center;
  gap: 0.4rem;
  border-top: 1px solid var(--${n}-line);
  padding: 0.32rem 0.55rem;
}

.${e}-prop-row.is-changed {
  background: var(--${n}-accent-soft);
}

.${e}-prop-name {
  color: var(--${n}-muted);
  font-family: var(--${n}-font-mono);
  font-size: 0.72rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.${e}-prop-current {
  color: var(--${n}-ink);
  font-family: var(--${n}-font-mono);
  font-size: 0.74rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.7;
}

.${e}-prop-input {
  width: 100%;
  border: 1px solid var(--${n}-line);
  border-radius: 0.3rem;
  background: var(--${n}-panel-solid);
  padding: 0.18rem 0.3rem;
  color: var(--${n}-accent-dark);
  font-family: var(--${n}-font-mono);
  font-size: 0.72rem;
  outline: none;
  text-align: center;
}

.${e}-prop-input:focus {
  border-color: var(--${n}-accent);
  box-shadow: 0 0 0 2px var(--${n}-accent-soft);
}

.${e}-prop-input::placeholder {
  color: var(--${n}-muted);
  opacity: 0.5;
}

/* ---- List changes ---- */
.${e}-item-changes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.${e}-change {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border-radius: 0.3rem;
  background: var(--${n}-accent-soft);
  padding: 0.15rem 0.35rem;
  color: var(--${n}-accent-dark);
  font-family: var(--${n}-font-mono);
  font-size: 0.68rem;
  white-space: nowrap;
}

.${e}-change strong {
  color: var(--${n}-accent);
}

/* ---- List ---- */
.${e}-list {
  display: grid;
  max-height: min(30rem, calc(100vh - 12rem));
  max-height: min(30rem, calc(100dvh - 12rem));
  overflow-y: auto;
  padding-block: 0.35rem;
}

.${e}-empty {
  padding: 0.75rem 0.65rem;
  color: var(--${n}-muted);
  font-size: 0.86rem;
}

.${e}-item {
  display: grid;
  gap: 0.35rem;
  border-bottom: 1px solid var(--${n}-line);
  padding: 0.9rem 0.65rem;
}

.${e}-item:last-child {
  border-bottom: 0;
}

.${e}-item.is-resolved {
  opacity: 0.55;
}

.${e}-item.is-dragging {
  opacity: 0.3;
}

.${e}-item.is-drop-before {
  box-shadow: inset 0 2px 0 0 var(--${n}-accent);
}

.${e}-item.is-drop-after {
  box-shadow: inset 0 -2px 0 0 var(--${n}-accent);
}

.${e}-item.is-resolved .${e}-item-header strong {
  text-decoration: line-through;
}

.${e}-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.${e}-item-title {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
}

.${e}-drag-handle {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.3rem;
  background: transparent;
  padding: 0.15rem;
  color: var(--${n}-muted);
  cursor: grab;
  opacity: 0.35;
  transition: opacity 140ms ease, color 140ms ease;
}

.${e}-drag-handle:hover {
  opacity: 1;
  color: var(--${n}-accent);
}

.${e}-drag-handle:active {
  cursor: grabbing;
}

.${e}-drag-handle svg {
  width: 0.8rem;
  height: 0.8rem;
}

.${e}-item-actions {
  display: flex;
  gap: 0.2rem;
}

.${e}-item-actions button {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.25rem;
  border: 0;
  border-radius: 0.35rem;
  background: transparent;
  padding: 0.25rem 0.35rem;
  color: var(--${n}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
}

.${e}-item-actions button:hover {
  background: var(--${n}-surface-muted);
  color: var(--${n}-ink);
}

.${e}-item-actions button.is-resolve {
  color: var(--${n}-accent-dark);
}

.${e}-item-actions button svg {
  width: 0.78rem;
  height: 0.78rem;
}

.${e}-item-status {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--${n}-success);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.${e}-item strong {
  overflow: hidden;
  color: var(--${n}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${e}-item time {
  color: var(--${n}-muted);
  font-family: var(--${n}-font-mono);
  font-size: 0.72rem;
}

.${e}-item code,
.${e}-item-context {
  display: block;
  overflow: hidden;
  color: var(--${n}-muted);
  font-size: 0.75rem;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${e}-item code {
  font-family: var(--${n}-font-mono);
}

.${e}-item p {
  color: var(--${n}-foreground);
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* ---- Overlay ---- */
.${e}-overlay {
  position: fixed;
  z-index: 9999;
  inset: 0;
  pointer-events: none;
}

.${e}-highlight {
  position: fixed;
  border: 2px solid var(--${n}-accent);
  background: var(--${n}-accent-soft);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85) inset;
}

.${e}-highlight.is-selected {
  background: transparent;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.85) inset,
    0 0 0 4px color-mix(in srgb, var(--${n}-accent) 18%, transparent);
}

.${e}-element-label {
  position: fixed;
  display: flex;
  flex-direction: column;
  max-width: 15rem;
  gap: 0.1rem;
  overflow: hidden;
  border-radius: 0.38rem;
  background: var(--${n}-accent);
  padding: 0.32rem 0.45rem;
  color: #fff;
  font-family: var(--${n}-font-mono);
  font-size: 0.72rem;
  line-height: 1.3;
  white-space: nowrap;
}

.${e}-label-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  min-width: 0;
}

.${e}-label-row strong {
  overflow: hidden;
  text-overflow: ellipsis;
}

.${e}-label-row > span {
  flex: none;
  opacity: 0.78;
}

.${e}-label-key {
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

  .${e}-launcher:hover {
    border-radius: 0.9rem;
    box-shadow: 0 2px 12px color-mix(in srgb, var(--${n}-accent) 28%, transparent),
                0 1px 3px rgba(0, 0, 0, 0.06);
    transform: none;
  }

  .${e}-launcher:hover span {
    max-width: 0;
    opacity: 0;
    margin-left: 0;
  }

  .${e}-panel {
    width: min(21rem, calc(100vw - 5.75rem));
  }
}
`}var L=X("pm"),C=Y("pm");var G=1200,q=["font-size","line-height","padding","margin","border-radius","gap","width","height","color","background-color"];function J(e,n){let t=e.getPropertyValue(`${n}-top`),o=e.getPropertyValue(`${n}-right`),r=e.getPropertyValue(`${n}-bottom`),s=e.getPropertyValue(`${n}-left`);return t===o&&o===r&&r===s?t:t===r&&s===o?`${t} ${o}`:`${t} ${o} ${r} ${s}`}function W(e,n){return n==="padding"||n==="margin"?J(e,n):e.getPropertyValue(n)}var p={crosshair:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>',list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',annotate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',grip:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>',chevronUp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',chevronDown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'};function Z(e){let n=e.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);if(!n)return e;let t=o=>o.toString(16).padStart(2,"0");return`#${t(parseInt(n[1]))}${t(parseInt(n[2]))}${t(parseInt(n[3]))}`.toUpperCase()}function R(e){let n=window.getComputedStyle(e);return{color:Z(n.color),fontSize:n.fontSize,fontFamily:n.fontFamily.split(",")[0].replace(/['"]/g,"").trim()}}var j=!1;function Q(){if(j||typeof document>"u")return;let e=document.createElement("style");e.setAttribute(D,"global"),e.textContent=L,document.head.appendChild(e),j=!0}var ee=typeof HTMLElement>"u"?class{}:HTMLElement,w=class extends ee{constructor(){super(...arguments);this.store=S();this.labels={...P};this.theme={};this.mode="closed";this.hoveredTarget=null;this.selectedTarget=null;this.message="";this.annotations=[];this.isLoading=!1;this.isSubmitting=!1;this.status=null;this.statusType=null;this.locatedTarget=null;this.selectedElement=null;this.selectionPath=[];this.showProperties=!1;this.propertyChanges={};this.dragSrcId=null;this.dragOverId=null;this.dragOverPos="before";this.shadow=null;this.overlayEl=null;this.panelEl=null;this.launcherEl=null;this.boundMove=null;this.boundClick=null;this.boundKeyDown=null;this.pointerRef=null;this.refreshHover=()=>{this.pointerRef&&(this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId),this.rafId=window.requestAnimationFrame(()=>{this.pointerRef&&(this.hoveredTarget=this.getTargetAtPoint(this.pointerRef.clientX,this.pointerRef.clientY),this.updateOverlay())}))};this.refreshSelected=()=>{this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId),this.rafId=window.requestAnimationFrame(()=>this.updateOverlay())}}static get observedAttributes(){return["accent",f]}attributeChangedCallback(t,o,r){t==="accent"&&this.shadow&&this.style.setProperty(`${$}-accent`,r),t===f&&this.updateVisibility()}get visible(){return this.hasAttribute(f)}set visible(t){t?this.setAttribute(f,""):this.removeAttribute(f)}updateVisibility(){let t=this.visible;this.launcherEl&&(this.launcherEl.style.display=t?"":"none"),!t&&this.mode!=="closed"&&this.closeTool()}connectedCallback(){Q(),this.shadow=this.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=C,this.shadow.appendChild(t),this.overlayEl=document.createElement("div"),this.overlayEl.className=`${"pm"}-overlay`,this.overlayEl.style.display="none",this.overlayEl.setAttribute(T,""),this.shadow.appendChild(this.overlayEl),this.panelEl=document.createElement("div"),this.panelEl.className=`${"pm"}-panel`,this.panelEl.style.display="none",this.panelEl.setAttribute(T,""),this.shadow.appendChild(this.panelEl),this.launcherEl=document.createElement("button"),this.launcherEl.className=`${"pm"}-launcher`,this.launcherEl.type="button",this.launcherEl.innerHTML=`${p.annotate}<span>${this.labels.picker}</span>`,this.launcherEl.addEventListener("click",()=>{this.mode!=="closed"?this.closeTool():this.startPicking()}),this.shadow.appendChild(this.launcherEl),this.panelEl.addEventListener("click",o=>this.handlePanelClick(o)),this.panelEl.addEventListener("input",o=>this.handlePanelInput(o)),this.panelEl.addEventListener("mousedown",o=>this.handleDragHandleDown(o)),this.panelEl.addEventListener("mouseup",()=>this.resetDraggable()),this.panelEl.addEventListener("dragstart",o=>this.handleDragStart(o)),this.panelEl.addEventListener("dragover",o=>this.handleDragOver(o)),this.panelEl.addEventListener("drop",o=>this.handleDrop(o)),this.panelEl.addEventListener("dragend",()=>this.handleDragEnd()),this.theme.accent&&this.style.setProperty(`${$}-accent`,this.theme.accent),this.theme.accentDark&&this.style.setProperty(`${$}-accent-dark`,this.theme.accentDark),this.theme.accentSoft&&this.style.setProperty(`${$}-accent-soft`,this.theme.accentSoft),this.updateVisibility(),this.updatePanel()}disconnectedCallback(){this.cleanupPicking(),this.cleanupComposeTracking(),this.removeKeyDownListener(),window.clearTimeout(this.locateTimeout),this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId)}open(){this.startPicking()}close(){this.closeTool()}closeTool(){this.mode="closed",this.hoveredTarget=null,this.selectedTarget=null,this.selectedElement=null,this.pointerRef=null,this.message="",this.status=null,this.statusType=null,this.showProperties=!1,this.propertyChanges={},this.cleanupPicking(),this.cleanupComposeTracking(),this.updateOverlay(),this.updatePanel()}startPicking(){this.mode="picking",this.hoveredTarget=null,this.selectedTarget=null,this.selectedElement=null,this.pointerRef=null,this.message="",this.status=null,this.statusType=null,this.showProperties=!1,this.propertyChanges={},this.cleanupComposeTracking(),this.setupPicking(),this.updateOverlay(),this.updatePanel()}async openList(){this.mode="list",this.cleanupComposeTracking(),this.updateOverlay(),this.updatePanel(),await this.loadAnnotations()}setupPicking(){this.boundMove=t=>this.handleMove(t),this.boundClick=t=>this.handleClick(t),this.boundKeyDown=t=>this.handleKeyDown(t),document.addEventListener("mousemove",this.boundMove,!0),document.addEventListener("click",this.boundClick,!0),document.addEventListener("keydown",this.boundKeyDown),window.addEventListener("scroll",this.refreshHover,!0),window.addEventListener("resize",this.refreshHover),document.documentElement.classList.add(A)}cleanupPicking(){document.documentElement.classList.remove(A),this.boundMove&&document.removeEventListener("mousemove",this.boundMove,!0),this.boundClick&&document.removeEventListener("click",this.boundClick,!0),this.boundKeyDown&&document.removeEventListener("keydown",this.boundKeyDown),window.removeEventListener("scroll",this.refreshHover,!0),window.removeEventListener("resize",this.refreshHover),this.boundMove=null,this.boundClick=null,this.boundKeyDown=null,this.rafId!==void 0&&(window.cancelAnimationFrame(this.rafId),this.rafId=void 0)}getTargetAtPoint(t,o){let r=document.elementFromPoint(t,o);if(!(r instanceof HTMLElement)||r.closest(g))return null;let s=r.getBoundingClientRect();return s.width<2||s.height<2?null:{...E(r),viewportRect:s,hoverInfo:R(r)}}handleMove(t){this.pointerRef={clientX:t.clientX,clientY:t.clientY},this.hoveredTarget=this.getTargetAtPoint(t.clientX,t.clientY),this.updateOverlay()}handleClick(t){let o=this.getTargetAtPoint(t.clientX,t.clientY);if(!o)return;t.preventDefault(),t.stopPropagation(),this.selectedTarget=I(o);let r=document.elementFromPoint(t.clientX,t.clientY);this.selectedElement=r instanceof HTMLElement?r:null,this.selectionPath=[],this.hoveredTarget=null,this.showProperties=!1,this.propertyChanges={},this.mode="compose",this.cleanupPicking(),this.setupComposeTracking(),this.updateOverlay(),this.updatePanel();let s=this.panelEl?.querySelector("textarea");s&&s.focus()}handleKeyDown(t){t.key==="Escape"&&this.closeTool()}setupComposeTracking(){window.addEventListener("scroll",this.refreshSelected,!0),window.addEventListener("resize",this.refreshSelected)}cleanupComposeTracking(){window.removeEventListener("scroll",this.refreshSelected,!0),window.removeEventListener("resize",this.refreshSelected)}canExpandSelection(){let t=this.selectedElement?.parentElement;return!!t&&t!==document.documentElement&&!t.closest(g)}canShrinkSelection(){if(this.selectionPath.length>0)return!0;let t=this.selectedElement?.firstElementChild;return t instanceof HTMLElement&&!t.closest(g)}expandSelection(){let t=this.selectedElement;!t||!this.canExpandSelection()||(this.selectionPath.push(t),this.applySelectedElement(t.parentElement))}shrinkSelection(){let t=this.selectionPath.pop();if(t?.isConnected){this.applySelectedElement(t);return}let o=this.selectedElement?.firstElementChild;o instanceof HTMLElement&&!o.closest(g)&&this.applySelectedElement(o)}applySelectedElement(t){this.selectedElement=t,this.selectedTarget=E(t),this.propertyChanges={},this.updateOverlay(),this.updatePanel()}removeKeyDownListener(){this.boundKeyDown&&(document.removeEventListener("keydown",this.boundKeyDown),this.boundKeyDown=null)}async loadAnnotations(){this.isLoading=!0,this.status=null,this.statusType=null,this.updatePanel();try{let t=window.location.pathname;this.annotations=await this.store.list(t)}catch(t){this.status=t instanceof Error?t.message:this.labels.loading,this.statusType="error"}finally{this.isLoading=!1,this.updatePanel()}}getChanges(){return Object.entries(this.propertyChanges).map(([t,{from:o,to:r}])=>({property:t,from:o,to:r}))}async submitAnnotation(){if(!(!this.selectedTarget||!this.message.trim()||this.isSubmitting)){this.isSubmitting=!0,this.status=null,this.statusType=null,this.updatePanel();try{let t=await this.store.create({pagePath:window.location.pathname,pageTitle:document.title,message:this.message.trim(),element:this.selectedTarget,changes:this.getChanges()});this.annotations=[t,...this.annotations],this.message="",this.selectedTarget=null,this.selectedElement=null,this.mode="list",this.cleanupComposeTracking(),this.updateOverlay()}catch(t){this.status=t instanceof Error?t.message:"Failed to submit.",this.statusType="error"}finally{this.isSubmitting=!1,this.updatePanel()}}}locateAnnotation(t){let o=null;try{o=document.querySelector(t.element.selector)}catch{o=null}if(!(o instanceof HTMLElement)){this.status=this.labels.notFound,this.statusType="error",this.updatePanel();return}o.scrollIntoView({behavior:"smooth",block:"center"}),window.clearTimeout(this.locateTimeout),this.locateTimeout=window.setTimeout(()=>{o?.isConnected&&(this.locatedTarget={...E(o),viewportRect:o.getBoundingClientRect(),hoverInfo:R(o)},this.updateOverlay(),this.locateTimeout=window.setTimeout(()=>{this.locatedTarget=null,this.updateOverlay()},1800))},350)}async resolveAnnotation(t){if(this.store.update)try{let o=await this.store.update(t,{status:"resolved"});this.annotations=this.annotations.map(r=>r.id===t?o:r),this.updatePanel()}catch{}}handleDragHandleDown(t){let r=t.target.closest("[data-drag-handle]");if(!r)return;let s=r.closest(`.${"pm"}-item`);s instanceof HTMLElement&&(s.draggable=!0)}resetDraggable(){this.panelEl&&this.panelEl.querySelectorAll(`.${"pm"}-item[draggable="true"]`).forEach(t=>{t.draggable=!1})}handleDragStart(t){let o=t.target.closest(`.${"pm"}-item`);if(!o)return;let r=o.getAttribute("data-annotation-id");r&&(this.dragSrcId=r,o.classList.add("is-dragging"),t.dataTransfer&&(t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",r)))}handleDragOver(t){if(!this.dragSrcId)return;let o=t.target.closest(`.${"pm"}-item`);if(!o)return;let r=o.getAttribute("data-annotation-id");if(!r||r===this.dragSrcId)return;t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move");let s=o.getBoundingClientRect(),l=s.top+s.height/2,d=t.clientY<l?"before":"after";this.clearDragIndicators(),this.dragOverId=r,this.dragOverPos=d,o.classList.add(d==="before"?"is-drop-before":"is-drop-after")}clearDragIndicators(){this.panelEl&&(this.panelEl.querySelectorAll(".is-drop-before, .is-drop-after").forEach(t=>{t.classList.remove("is-drop-before","is-drop-after")}),this.dragOverId=null)}async handleDrop(t){if(t.preventDefault(),!this.dragSrcId||!this.dragOverId){this.handleDragEnd();return}let o=this.dragSrcId,r=this.dragOverId,s=this.dragOverPos,l=[...this.annotations],d=l.findIndex(h=>h.id===o);if(d===-1){this.handleDragEnd();return}let[u]=l.splice(d,1),c=l.findIndex(h=>h.id===r);if(c===-1){this.handleDragEnd();return}if(s==="after"&&c++,l.splice(c,0,u),this.annotations=l,this.store.reorder)try{await this.store.reorder(l.map(h=>h.id))}catch{}this.handleDragEnd(),this.updatePanel()}handleDragEnd(){this.panelEl&&(this.panelEl.querySelectorAll(".is-dragging").forEach(t=>{t.classList.remove("is-dragging")}),this.clearDragIndicators(),this.resetDraggable()),this.dragSrcId=null,this.dragOverId=null}async copyAsPrompt(t){let o;if(t){let r=this.annotations.find(s=>s.id===t);if(!r)return;o=y(r)}else this.selectedTarget?o=y({id:"preview",pagePath:window.location.pathname,pageTitle:document.title,message:this.message.trim()||"(no message)",element:this.selectedTarget,createdAt:new Date().toISOString(),status:"open",changes:this.getChanges()}):o=x(this.annotations,window.location.pathname);try{await navigator.clipboard.writeText(o),this.status=this.labels.copied,this.statusType="success"}catch{let r=document.createElement("textarea");r.value=o,r.style.position="fixed",r.style.opacity="0",document.body.appendChild(r),r.select();try{document.execCommand("copy"),this.status=this.labels.copied,this.statusType="success"}catch{this.status="Copy failed",this.statusType="error"}document.body.removeChild(r)}this.updatePanel(),this.statusType==="success"&&window.setTimeout(()=>{this.status===this.labels.copied&&(this.status=null,this.statusType=null,this.updatePanel())},1500)}handlePanelClick(t){let o=t.target.closest("[data-action]");if(!o)return;let r=o.getAttribute("data-action"),s=o.getAttribute("data-id");switch(r){case"pick":this.startPicking();break;case"list":this.openList();break;case"close":this.closeTool();break;case"send":this.submitAnnotation();break;case"reselect":this.startPicking();break;case"locate":if(s){let l=this.annotations.find(d=>d.id===s);l&&this.locateAnnotation(l)}break;case"copy":this.copyAsPrompt(s||void 0);break;case"resolve":s&&this.resolveAnnotation(s);break;case"toggle-properties":this.showProperties=!this.showProperties,this.updatePanel();break;case"expand-selection":this.expandSelection();break;case"shrink-selection":this.shrinkSelection();break}}handlePanelInput(t){let o=t.target;if(o.tagName==="TEXTAREA")this.message=o.value;else if(o.tagName==="INPUT"&&o.hasAttribute("data-property")){let r=o.getAttribute("data-property"),s=o.getAttribute("data-original"),l=o.value.trim();l&&l!==s?this.propertyChanges[r]={from:s,to:l}:delete this.propertyChanges[r];let d=o.closest(`.${"pm"}-prop-row`);d&&d.classList.toggle("is-changed",!!this.propertyChanges[r]),this.updatePropToggleBadge()}}updatePropToggleBadge(){let t=this.panelEl?.querySelector(`.${"pm"}-prop-toggle`);if(!t)return;let o=Object.keys(this.propertyChanges).length,r=o>0?`<span class="${"pm"}-prop-count">${o}</span>`:"",s=this.showProperties?" \u2713":"";t.innerHTML=`${i(this.labels.properties)}${s}${r}`}updateOverlay(){if(!this.overlayEl)return;if(this.mode==="compose"){this.renderSelectedOverlay();return}let t=this.mode==="picking"?this.hoveredTarget:this.locatedTarget;if(!t){this.overlayEl.style.display="none",this.overlayEl.innerHTML="";return}let{viewportRect:o}=t,r=t.hoverInfo?72:34,s=o.top>r+10?o.top-r:o.bottom+8,l=Math.min(Math.max(o.left,8),window.innerWidth-240);this.overlayEl.style.display="",this.overlayEl.innerHTML=`
      <div class="${"pm"}-highlight" style="top:${o.top}px;left:${o.left}px;width:${o.width}px;height:${o.height}px"></div>
      <div class="${"pm"}-element-label" style="top:${s}px;left:${l}px">
        <div class="${"pm"}-label-row">
          <strong>${i(t.name)}</strong>
          <span>${Math.round(o.width)} \xD7 ${Math.round(o.height)}</span>
        </div>
        ${t.hoverInfo?`
        <div class="${"pm"}-label-row">
          <span class="${"pm"}-label-key">${i(this.labels.colorLabel??"\u989C\u8272")}</span>
          <span>${i(t.hoverInfo.color)}</span>
        </div>
        <div class="${"pm"}-label-row">
          <span class="${"pm"}-label-key">${i(this.labels.fontLabel??"\u5B57\u4F53")}</span>
          <span>${i(t.hoverInfo.fontSize)} ${i(t.hoverInfo.fontFamily)}</span>
        </div>
        `:""}
      </div>
    `}renderSelectedOverlay(){if(!this.overlayEl)return;let t=this.selectedElement;if(!t||!t.isConnected||!this.selectedTarget){this.overlayEl.style.display="none",this.overlayEl.innerHTML="";return}let o=t.getBoundingClientRect(),r=o.top>44?o.top-34:o.bottom+8,s=Math.min(Math.max(o.left,8),window.innerWidth-240);this.overlayEl.style.display="",this.overlayEl.innerHTML=`
      <div class="${"pm"}-highlight is-selected" style="top:${o.top}px;left:${o.left}px;width:${o.width}px;height:${o.height}px"></div>
      <div class="${"pm"}-element-label" style="top:${r}px;left:${s}px">
        <div class="${"pm"}-label-row">
          <strong>${i(this.selectedTarget.name)}</strong>
          <span>${Math.round(o.width)} \xD7 ${Math.round(o.height)}</span>
        </div>
      </div>
    `}updatePanel(){if(!this.panelEl||!this.launcherEl)return;let t=this.mode!=="closed";if(this.launcherEl.classList.toggle("is-active",t),this.launcherEl.innerHTML=t?`${p.x}<span>${this.labels.close}</span>`:`${p.annotate}<span>${this.labels.picker}</span>`,!t){this.panelEl.style.display="none",this.panelEl.innerHTML="";return}this.panelEl.style.display="";let o=this.mode==="picking"||this.mode==="compose",r=this.mode==="list";this.panelEl.innerHTML=`
      <div class="${"pm"}-panel-header">
        <div class="${"pm"}-panel-tabs">
          <button type="button" class="${o?"is-active":""}" data-action="pick" role="tab" aria-selected="${o}">
            ${p.crosshair}
            ${i(this.labels.picker)}
          </button>
          <button type="button" class="${r?"is-active":""}" data-action="list" role="tab" aria-selected="${r}">
            ${p.list}
            ${i(this.labels.list)}
          </button>
        </div>
        <button type="button" class="${"pm"}-close" data-action="close" aria-label="${i(this.labels.close)}">
          ${p.x}
        </button>
      </div>
      ${this.renderPanelContent()}
    `}renderPanelContent(){switch(this.mode){case"picking":return this.renderPickerNote();case"compose":return this.renderCompose();case"list":return this.renderList();default:return""}}renderPickerNote(){return`
      <div class="${"pm"}-picker-note">
        ${p.crosshair}
        <p>${i(this.labels.picker)}</p>
        <span>${i(this.labels.pickerHint)}</span>
      </div>
    `}renderCompose(){if(!this.selectedTarget)return"";let t=this.status?`<p class="${"pm"}-status ${this.statusType==="success"?"is-success":"is-error"}">${i(this.status)}</p>`:"",o=Object.keys(this.propertyChanges).length,r=this.showProperties?`${this.labels.properties} \u2713`:this.labels.properties,s=o>0?`<span class="${"pm"}-prop-count">${o}</span>`:"";return`
      <div class="${"pm"}-compose">
        <div class="${"pm"}-target">
          <span>${i(this.labels.targetLabel)}</span>
          <strong>${i(this.selectedTarget.name)}</strong>
          <span class="${"pm"}-select-nav">
            <button type="button" class="${"pm"}-nav-btn" data-action="expand-selection" title="${i(this.labels.expandLabel??"\u6269\u5C55\u5230\u7236\u7EA7")}" aria-label="${i(this.labels.expandLabel??"\u6269\u5C55\u5230\u7236\u7EA7")}" ${this.canExpandSelection()?"":"disabled"}>
              ${p.chevronUp}
            </button>
            <button type="button" class="${"pm"}-nav-btn" data-action="shrink-selection" title="${i(this.labels.shrinkLabel??"\u6536\u7F29\u5230\u5B50\u7EA7")}" aria-label="${i(this.labels.shrinkLabel??"\u6536\u7F29\u5230\u5B50\u7EA7")}" ${this.canShrinkSelection()?"":"disabled"}>
              ${p.chevronDown}
            </button>
          </span>
          <button type="button" class="${"pm"}-prop-toggle ${this.showProperties?"is-active":""}" data-action="toggle-properties">
            ${i(r)}${s}
          </button>
        </div>
        ${this.showProperties?this.renderPropertyPanel():""}
        <textarea maxlength="${G}" placeholder="${i(this.labels.placeholder)}" aria-label="${i(this.labels.placeholder)}">${i(this.message)}</textarea>
        ${t}
        <div class="${"pm"}-compose-actions">
          <button type="button" class="${"pm"}-copy-btn" data-action="copy">
            ${p.copy}
            ${i(this.labels.copyAsPrompt)}
          </button>
          <span style="display:flex;gap:0.5rem;align-items:center">
            <button type="button" class="${"pm"}-back" data-action="reselect">${i(this.labels.reselect)}</button>
            <button type="button" class="${"pm"}-send" data-action="send" ${!this.message.trim()||this.isSubmitting?"disabled":""}>
              ${this.isSubmitting?i(this.labels.sending):i(this.labels.send)}
              ${p.send}
            </button>
          </span>
        </div>
      </div>
    `}renderPropertyPanel(){if(!this.selectedElement)return"";let t=window.getComputedStyle(this.selectedElement),o=q.map(r=>{let s=W(t,r).trim(),l=this.propertyChanges[r],d=l?l.to:"";return`
        <div class="${"pm"}-prop-row ${l?"is-changed":""}">
          <span class="${"pm"}-prop-name">${i(r)}</span>
          <span class="${"pm"}-prop-current">${i(s)}</span>
          <input
            type="text"
            class="${"pm"}-prop-input"
            data-property="${i(r)}"
            data-original="${i(s)}"
            value="${i(d)}"
            placeholder="${l?i(l.to):"\u2192"}"
            spellcheck="false"
          />
        </div>`}).join("");return`
      <div class="${"pm"}-prop-panel">
        <p class="${"pm"}-prop-hint">${i(this.labels.propertiesHint)}</p>
        ${o}
      </div>
    `}renderList(){let t="";this.isLoading?t=`<p class="${"pm"}-empty">${i(this.labels.loading)}</p>`:this.status&&this.statusType==="error"&&this.annotations.length===0?t=`<p class="${"pm"}-status is-error">${i(this.status)}</p>`:this.annotations.length===0?t=`<p class="${"pm"}-empty">${i(this.labels.empty)}</p>`:t=this.annotations.map(r=>this.renderItem(r)).join("");let o=this.status&&this.statusType==="success"?`<p class="${"pm"}-status is-success">${i(this.status)}</p>`:"";return`
      <div class="${"pm"}-list">
        ${o}
        ${t}
      </div>
    `}renderItem(t){let o=t.status==="resolved",r=t.element.text?`<span class="${"pm"}-item-context">${i(this.labels.contentPrefix)}${i(t.element.text)}</span>`:"",s=t.changes&&t.changes.length>0?`<div class="${"pm"}-item-changes">${t.changes.map(u=>`<span class="${"pm"}-change">${i(u.property)}: ${i(u.from)} \u2192 <strong>${i(u.to)}</strong></span>`).join("")}</div>`:"",l=o?`<span class="${"pm"}-item-status">${p.check}${i(this.labels.resolved)}</span>`:"",d=!o&&this.store.update?`<button type="button" class="is-resolve" data-action="resolve" data-id="${t.id}">${p.check}${i(this.labels.resolve)}</button>`:"";return`
      <article class="${"pm"}-item ${o?"is-resolved":""}" data-annotation-id="${t.id}">
        <div class="${"pm"}-item-header">
          <div class="${"pm"}-item-title">
            <button type="button" class="${"pm"}-drag-handle" data-drag-handle aria-label="${i(this.labels.dragLabel??"\u62D6\u52A8\u6392\u5E8F")}">
              ${p.grip}
            </button>
            <strong>${i(t.element.name)}</strong>
          </div>
          <div class="${"pm"}-item-actions">
            <button type="button" data-action="copy" data-id="${t.id}">${p.copy}</button>
            <button type="button" data-action="locate" data-id="${t.id}">${p.crosshair}${i(this.labels.locate)}</button>
            ${d}
          </div>
        </div>
        <code title="${i(t.element.selector)}">${i(t.element.selector)}</code>
        <p>${i(t.message)}</p>
        ${s}
        ${r}
        ${l}
        <time datetime="${t.createdAt}">${H(t.createdAt)}</time>
      </article>
    `}};function i(e){let n=document.createElement("div");return n.textContent=e,n.innerHTML}function te(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function ne(e){let{endpoint:n,headers:t={}}=e,o={"content-type":"application/json",...t};return{async list(r){let s=`${n}?page=${encodeURIComponent(r)}`,l=await fetch(s,{cache:"no-store",headers:t});if(!l.ok)throw new Error(`Failed to load annotations (${l.status})`);return(await l.json()).annotations??[]},async create(r){let s=await fetch(n,{method:"POST",headers:o,body:JSON.stringify(r)});if(!s.ok){let d=await s.json().catch(()=>({error:"Unknown error"}));throw new Error(d.error||`Failed to create annotation (${s.status})`)}return(await s.json()).annotation},async update(r,s){let l=await fetch(`${n}/${r}`,{method:"PATCH",headers:o,body:JSON.stringify(s)});if(!l.ok)throw new Error(`Failed to update annotation (${l.status})`);return(await l.json()).annotation},async delete(r){let s=await fetch(`${n}/${r}`,{method:"DELETE",headers:o});if(!s.ok)throw new Error(`Failed to delete annotation (${s.status})`)},async reorder(r){let s=await fetch(`${n}/reorder`,{method:"POST",headers:o,body:JSON.stringify({ids:r})});if(!s.ok)throw new Error(`Failed to reorder annotations (${s.status})`)}}}function oe(e){return{id:te(),pagePath:e.pagePath,pageTitle:e.pageTitle,message:e.message,element:e.element,createdAt:new Date().toISOString(),status:"open",changes:e.changes}}typeof customElements<"u"&&!customElements.get(g)&&customElements.define(g,w);export{w as PatchMark,ne as createFetchStore,oe as createLocalAnnotation,S as createLocalStorageStore,P as defaultLabels,y as formatAnnotationAsPrompt,x as formatAnnotationsAsPrompt,L as globalStyles,C as shadowStyles};
