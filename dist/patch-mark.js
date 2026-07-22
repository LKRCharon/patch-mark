function E(t){let e=t.getBoundingClientRect(),n=t.tagName.toLowerCase(),o=N(t,n);return{tagName:n,name:o,selector:B(t),text:(t.innerText||t.getAttribute("aria-label")||"").replace(/\s+/g," ").trim().slice(0,240),rect:{top:Math.round(e.top+window.scrollY),left:Math.round(e.left+window.scrollX),width:Math.round(e.width),height:Math.round(e.height)}}}function I(t){return{tagName:t.tagName,name:t.name,selector:t.selector,text:t.text,rect:t.rect}}function N(t,e){if(t.id)return`#${t.id}`;let n=t.getAttribute("aria-label");if(n)return`${e}[aria-label="${n.slice(0,36)}"]`;let o=t.getAttribute("data-testid");if(o)return`[data-testid="${o}"]`;let r=t.parentElement?.closest("[id]");if(r?.id)return`#${r.id} \xB7 ${e}`;let a=Array.from(t.classList).filter(M).slice(0,2);return a.length?`${e}.${a.join(".")}`:e}function B(t){if(t.id)return`#${CSS.escape(t.id)}`;let e=[],n=t;for(;n&&n!==document.body&&e.length<5;){if(n.id){e.unshift(`#${CSS.escape(n.id)}`);break}let o=n.tagName.toLowerCase(),r=n.getAttribute("data-testid");if(r){e.unshift(`[data-testid="${CSS.escape(r)}"]`);break}let a=Array.from(n.classList).filter(M).slice(0,2),l=Array.from(n.parentElement?.children??[]).filter(p=>p.tagName===n?.tagName),d=l.length>1?`:nth-of-type(${l.indexOf(n)+1})`:"";e.unshift(`${o}${a.map(p=>`.${CSS.escape(p)}`).join("")}${d}`),n=n.parentElement}return e.join(" > ")}function M(t){return t.length<48&&!/^(css-|[a-z]+-[A-Za-z0-9]{6,}|[a-zA-Z0-9_-]*\d{4,})/.test(t)}function D(t,e="zh-CN"){let n=new Date(t);return new Intl.DateTimeFormat(e,{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(n)}var b="patch-mark";var v="--pm",H="data-pm-global",T="data-pm-ui",A="pm-picker-active",O="patch-mark:annotations",f="visible";var z=1e3;function K(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function U(){try{let t="__patch_mark_test__";return localStorage.setItem(t,t),localStorage.removeItem(t),!0}catch{return!1}}function P(t){let e=t?.key??O,n=U(),o=[];function r(){return[...o]}function a(){try{let c=localStorage.getItem(e);if(!c)return[];let h=JSON.parse(c);return Array.isArray(h)?h.filter(V):[]}catch{return[]}}function l(c){try{localStorage.setItem(e,JSON.stringify(c.slice(0,z)))}catch{}}function d(){return n?a():r()}function p(c){n?l(c):(o.length=0,o.push(...c.slice(0,z)))}return{async list(c){return d().filter(h=>h.pagePath===c)},async create(c){let h={id:K(),pagePath:c.pagePath,pageTitle:c.pageTitle,message:c.message,element:c.element,createdAt:new Date().toISOString(),status:"open",changes:c.changes},m=d();return m.unshift(h),p(m),h},async update(c,h){let m=d(),$=m.findIndex(k=>k.id===c);if($===-1)throw new Error(`Annotation ${c} not found`);return m[$]={...m[$],...h},p(m),m[$]},async delete(c){let h=d().filter(m=>m.id!==c);p(h)},async reorder(c){let h=d(),m=new Set(c),$=c.map(g=>h.find(_=>_.id===g)).filter(g=>g!==void 0),k=0,F=h.map(g=>m.has(g.id)?$[k++]??g:g);p(F)}}}function V(t){if(typeof t!="object"||t===null)return!1;let e=t;return typeof e.id=="string"&&typeof e.pagePath=="string"&&typeof e.message=="string"&&typeof e.createdAt=="string"&&typeof e.element=="object"&&e.element!==null}var S={picker:"\u6279\u6CE8",pickerHint:"\u60AC\u505C\u67E5\u770B\u8303\u56F4\uFF0C\u70B9\u51FB\u540E\u6DFB\u52A0\u8BC4\u8BED",compose:"\u6279\u6CE8",targetLabel:"\u76EE\u6807\u5143\u7D20",placeholder:"\u7559\u4E0B\u8BC4\u8BED\u2026",send:"\u53D1\u9001",sending:"\u53D1\u9001\u4E2D",reselect:"\u91CD\u9009",list:"\u5DF2\u6279\u6CE8",locate:"\u5B9A\u4F4D",close:"\u5173\u95ED\u6279\u6CE8",empty:"\u5F53\u524D\u9875\u9762\u8FD8\u6CA1\u6709\u6279\u6CE8\u3002",loading:"\u6B63\u5728\u8BFB\u53D6\u2026",notFound:"\u672A\u627E\u5230\u8BE5\u5143\u7D20\uFF0C\u9875\u9762\u7ED3\u6784\u53EF\u80FD\u5DF2\u7ECF\u6539\u52A8\u3002",contentPrefix:"\u5185\u5BB9\uFF1A",copyAsPrompt:"Copy as prompt",copied:"\u5DF2\u590D\u5236",resolve:"\u89E3\u51B3",resolved:"\u5DF2\u89E3\u51B3",properties:"\u5C5E\u6027",propertiesHint:"\u76F4\u63A5\u4FEE\u6539\u6570\u503C\uFF0C\u53CD\u9988\u7ED9 agent \u7CBE\u786E\u6307\u4EE4",colorLabel:"\u989C\u8272",fontLabel:"\u5B57\u4F53",dragLabel:"\u62D6\u52A8\u6392\u5E8F"};function y(t){let e=t.element,n=["## UI Feedback","",`- **Element:** \`<${e.tagName}>\``,`- **Selector:** \`${e.selector}\``,`- **Name:** ${e.name}`];if(e.text&&n.push(`- **Text:** "${e.text}"`),n.push(`- **Position:** top=${e.rect.top}, left=${e.rect.left}, ${e.rect.width}x${e.rect.height}`,`- **Page:** ${t.pagePath}`),t.pageTitle&&n.push(`- **Page Title:** ${t.pageTitle}`),n.push(`- **Feedback:** ${t.message}`),t.changes&&t.changes.length>0){n.push("","- **Property Changes:**");for(let o of t.changes)n.push(`  - \`${o.property}\`: ${o.from} \u2192 ${o.to}`)}return t.status&&n.push(`- **Status:** ${t.status}`),n.join(`
`)}function x(t,e){if(t.length===0)return`## UI Feedback

No feedback items.`;let n=["## UI Feedback Report","",`- **Page:** ${e||t[0].pagePath}`,`- **Total Items:** ${t.length}`,"- **Captured:** "+new Date().toISOString(),"","---"],o=t.map((r,a)=>`### Feedback #${a+1}

${y(r)}`);return[...n,...o.join(`

---

`)].join(`
`)}function X(t){let e=`${t}-picker-active`;return`
.${e},
.${e} * {
  cursor: crosshair !important;
}
`}function Y(t){let e=v;return`
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

  --${e}-accent: #0058d0;
  --${e}-accent-dark: #003f99;
  --${e}-accent-soft: rgba(0, 88, 208, 0.12);
  --${e}-ink: #0b1220;
  --${e}-muted: #506070;
  --${e}-foreground: #111827;
  --${e}-line: rgba(0, 54, 128, 0.14);
  --${e}-line-strong: rgba(0, 54, 128, 0.24);
  --${e}-panel-solid: #ffffff;
  --${e}-surface-muted: #eaf2ff;
  --${e}-on-accent: #ffffff;
  --${e}-font-mono: "IBM Plex Mono", "SFMono-Regular", "Consolas", monospace;
  --${e}-error: #b42318;
  --${e}-success: #087f5b;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ---- Launcher button ---- */
.${t}-launcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: auto;
  padding: 0 0.9rem;
  border: none;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, var(--${e}-accent), var(--${e}-accent-dark));
  color: var(--${e}-on-accent);
  box-shadow: 0 2px 12px color-mix(in srgb, var(--${e}-accent) 28%, transparent),
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

.${t}-launcher svg {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

.${t}-launcher span {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 150ms ease,
              margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.${t}-launcher:hover {
  border-radius: 1.5rem;
  box-shadow: 0 8px 28px color-mix(in srgb, var(--${e}-accent) 38%, transparent),
              0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.${t}-launcher:hover span {
  max-width: 5rem;
  opacity: 1;
  margin-left: 0.5rem;
  transition: max-width 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 150ms ease 100ms,
              margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.${t}-launcher.is-active {
  background: var(--${e}-accent-dark);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--${e}-accent-dark) 25%, transparent);
}

.${t}-launcher.is-active:hover {
  box-shadow: 0 6px 24px color-mix(in srgb, var(--${e}-accent-dark) 35%, transparent),
              0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ---- Panel ---- */
.${t}-panel {
  width: min(21rem, calc(100vw - 7.5rem));
  overflow: hidden;
  border: 1px solid var(--${e}-line-strong);
  border-radius: 1rem;
  background: var(--${e}-panel-solid);
  background: color-mix(in srgb, var(--${e}-panel-solid) 96%, transparent);
  box-shadow: 0 20px 56px rgba(7, 19, 33, 0.18);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  pointer-events: auto;
  cursor: auto;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .${t}-panel {
    background: var(--${e}-panel-solid);
  }
}

.${t}-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--${e}-line);
  padding: 0.55rem 0.6rem 0.55rem 0.75rem;
}

.${t}-panel-tabs {
  display: flex;
  gap: 0.1rem;
}

.${t}-panel-tabs button,
.${t}-close,
.${t}-back,
.${t}-send,
.${t}-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  font: inherit;
}

.${t}-panel-tabs button {
  gap: 0.35rem;
  border-radius: 0.55rem;
  padding: 0.46rem 0.55rem;
  background: transparent;
  color: var(--${e}-muted);
  font-size: 0.84rem;
  font-weight: 650;
  cursor: pointer;
}

.${t}-panel-tabs button svg {
  width: 0.9rem;
  height: 0.9rem;
}

.${t}-panel-tabs button:hover,
.${t}-panel-tabs button.is-active {
  background: var(--${e}-accent-soft);
  color: var(--${e}-accent-dark);
}

.${t}-close {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--${e}-muted);
  cursor: pointer;
}

.${t}-close:hover,
.${t}-back:hover {
  background: var(--${e}-surface-muted);
  color: var(--${e}-ink);
}

.${t}-close svg {
  width: 1rem;
  height: 1rem;
}

/* ---- Picker note ---- */
.${t}-picker-note,
.${t}-compose,
.${t}-list {
  padding: 1rem;
}

.${t}-picker-note {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.65rem;
  align-items: center;
}

.${t}-picker-note svg {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--${e}-accent);
}

.${t}-picker-note p,
.${t}-target span,
.${t}-target strong,
.${t}-status,
.${t}-empty,
.${t}-item p,
.${t}-item time {
  margin: 0;
}

.${t}-picker-note p {
  color: var(--${e}-ink);
  font-size: 0.92rem;
  font-weight: 700;
}

.${t}-picker-note span {
  grid-column: 2;
  margin-top: 0.1rem;
  color: var(--${e}-muted);
  font-size: 0.79rem;
  line-height: 1.45;
}

/* ---- Compose ---- */
.${t}-target {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.22rem 0.5rem;
  margin-bottom: 0.75rem;
}

.${t}-target > span:first-child {
  width: 100%;
  color: var(--${e}-muted);
  font-family: var(--${e}-font-mono);
  font-size: 0.72rem;
}

.${t}-target > strong {
  flex: 1;
  overflow: hidden;
  color: var(--${e}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${t}-compose textarea {
  display: block;
  width: 100%;
  min-height: 7.5rem;
  resize: vertical;
  border: 1px solid var(--${e}-line-strong);
  border-radius: 0.7rem;
  outline: none;
  background: var(--${e}-panel-solid);
  padding: 0.65rem 0.7rem;
  color: var(--${e}-ink);
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
}

.${t}-compose textarea:focus {
  border-color: var(--${e}-accent);
  box-shadow: 0 0 0 3px var(--${e}-accent-soft);
}

.${t}-compose-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.${t}-back,
.${t}-send {
  min-height: 2.3rem;
  border-radius: 0.6rem;
  padding-inline: 0.75rem;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
}

.${t}-back {
  background: transparent;
  color: var(--${e}-muted);
}

.${t}-send {
  gap: 0.4rem;
  background: var(--${e}-accent);
  color: var(--${e}-on-accent);
}

.${t}-send:hover:not(:disabled) {
  background: var(--${e}-accent-dark);
}

.${t}-send:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.${t}-send svg {
  width: 0.9rem;
  height: 0.9rem;
}

.${t}-copy-btn {
  gap: 0.3rem;
  border: 1px solid var(--${e}-line-strong);
  border-radius: 0.6rem;
  background: transparent;
  padding: 0.3rem 0.55rem;
  color: var(--${e}-muted);
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
}

.${t}-copy-btn:hover {
  background: var(--${e}-surface-muted);
  color: var(--${e}-ink);
}

.${t}-copy-btn svg {
  width: 0.82rem;
  height: 0.82rem;
}

.${t}-status {
  margin-top: 0.6rem;
  font-size: 0.82rem;
  line-height: 1.45;
}

.${t}-status.is-error {
  color: var(--${e}-error);
}

.${t}-status.is-success {
  color: var(--${e}-success);
}

/* ---- Property panel ---- */
.${t}-prop-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid var(--${e}-line-strong);
  border-radius: 0.4rem;
  background: transparent;
  padding: 0.18rem 0.45rem;
  color: var(--${e}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 650;
  cursor: pointer;
  transition: all 140ms ease;
}

.${t}-prop-toggle:hover {
  background: var(--${e}-surface-muted);
  color: var(--${e}-ink);
}

.${t}-prop-toggle.is-active {
  border-color: var(--${e}-accent);
  background: var(--${e}-accent-soft);
  color: var(--${e}-accent-dark);
}

.${t}-prop-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.55rem;
  background: var(--${e}-accent);
  color: var(--${e}-on-accent);
  font-size: 0.66rem;
  font-weight: 700;
  padding: 0 0.2rem;
}

.${t}-prop-panel {
  margin-bottom: 0.75rem;
  border: 1px solid var(--${e}-line);
  border-radius: 0.6rem;
  overflow: hidden;
}

.${t}-prop-hint {
  margin: 0;
  padding: 0.4rem 0.55rem;
  background: var(--${e}-surface-muted);
  color: var(--${e}-muted);
  font-size: 0.7rem;
  line-height: 1.35;
}

.${t}-prop-row {
  display: grid;
  grid-template-columns: 5.5rem 1fr 4.5rem;
  align-items: center;
  gap: 0.4rem;
  border-top: 1px solid var(--${e}-line);
  padding: 0.32rem 0.55rem;
}

.${t}-prop-row.is-changed {
  background: var(--${e}-accent-soft);
}

.${t}-prop-name {
  color: var(--${e}-muted);
  font-family: var(--${e}-font-mono);
  font-size: 0.72rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.${t}-prop-current {
  color: var(--${e}-ink);
  font-family: var(--${e}-font-mono);
  font-size: 0.74rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.7;
}

.${t}-prop-input {
  width: 100%;
  border: 1px solid var(--${e}-line);
  border-radius: 0.3rem;
  background: var(--${e}-panel-solid);
  padding: 0.18rem 0.3rem;
  color: var(--${e}-accent-dark);
  font-family: var(--${e}-font-mono);
  font-size: 0.72rem;
  outline: none;
  text-align: center;
}

.${t}-prop-input:focus {
  border-color: var(--${e}-accent);
  box-shadow: 0 0 0 2px var(--${e}-accent-soft);
}

.${t}-prop-input::placeholder {
  color: var(--${e}-muted);
  opacity: 0.5;
}

/* ---- List changes ---- */
.${t}-item-changes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.${t}-change {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border-radius: 0.3rem;
  background: var(--${e}-accent-soft);
  padding: 0.15rem 0.35rem;
  color: var(--${e}-accent-dark);
  font-family: var(--${e}-font-mono);
  font-size: 0.68rem;
  white-space: nowrap;
}

.${t}-change strong {
  color: var(--${e}-accent);
}

/* ---- List ---- */
.${t}-list {
  display: grid;
  max-height: min(30rem, calc(100vh - 12rem));
  max-height: min(30rem, calc(100dvh - 12rem));
  overflow-y: auto;
  padding-block: 0.35rem;
}

.${t}-empty {
  padding: 0.75rem 0.65rem;
  color: var(--${e}-muted);
  font-size: 0.86rem;
}

.${t}-item {
  display: grid;
  gap: 0.35rem;
  border-bottom: 1px solid var(--${e}-line);
  padding: 0.9rem 0.65rem;
}

.${t}-item:last-child {
  border-bottom: 0;
}

.${t}-item.is-resolved {
  opacity: 0.55;
}

.${t}-item.is-dragging {
  opacity: 0.3;
}

.${t}-item.is-drop-before {
  box-shadow: inset 0 2px 0 0 var(--${e}-accent);
}

.${t}-item.is-drop-after {
  box-shadow: inset 0 -2px 0 0 var(--${e}-accent);
}

.${t}-item.is-resolved .${t}-item-header strong {
  text-decoration: line-through;
}

.${t}-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.${t}-item-title {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
}

.${t}-drag-handle {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.3rem;
  background: transparent;
  padding: 0.15rem;
  color: var(--${e}-muted);
  cursor: grab;
  opacity: 0.35;
  transition: opacity 140ms ease, color 140ms ease;
}

.${t}-drag-handle:hover {
  opacity: 1;
  color: var(--${e}-accent);
}

.${t}-drag-handle:active {
  cursor: grabbing;
}

.${t}-drag-handle svg {
  width: 0.8rem;
  height: 0.8rem;
}

.${t}-item-actions {
  display: flex;
  gap: 0.2rem;
}

.${t}-item-actions button {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.25rem;
  border: 0;
  border-radius: 0.35rem;
  background: transparent;
  padding: 0.25rem 0.35rem;
  color: var(--${e}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
}

.${t}-item-actions button:hover {
  background: var(--${e}-surface-muted);
  color: var(--${e}-ink);
}

.${t}-item-actions button.is-resolve {
  color: var(--${e}-accent-dark);
}

.${t}-item-actions button svg {
  width: 0.78rem;
  height: 0.78rem;
}

.${t}-item-status {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--${e}-success);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.${t}-item strong {
  overflow: hidden;
  color: var(--${e}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${t}-item time {
  color: var(--${e}-muted);
  font-family: var(--${e}-font-mono);
  font-size: 0.72rem;
}

.${t}-item code,
.${t}-item-context {
  display: block;
  overflow: hidden;
  color: var(--${e}-muted);
  font-size: 0.75rem;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${t}-item code {
  font-family: var(--${e}-font-mono);
}

.${t}-item p {
  color: var(--${e}-foreground);
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* ---- Overlay ---- */
.${t}-overlay {
  position: fixed;
  z-index: 9999;
  inset: 0;
  pointer-events: none;
}

.${t}-highlight {
  position: fixed;
  border: 2px solid var(--${e}-accent);
  background: var(--${e}-accent-soft);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85) inset;
}

.${t}-element-label {
  position: fixed;
  display: flex;
  flex-direction: column;
  max-width: 15rem;
  gap: 0.1rem;
  overflow: hidden;
  border-radius: 0.38rem;
  background: var(--${e}-accent);
  padding: 0.32rem 0.45rem;
  color: #fff;
  font-family: var(--${e}-font-mono);
  font-size: 0.72rem;
  line-height: 1.3;
  white-space: nowrap;
}

.${t}-label-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  min-width: 0;
}

.${t}-label-row strong {
  overflow: hidden;
  text-overflow: ellipsis;
}

.${t}-label-row > span {
  flex: none;
  opacity: 0.78;
}

.${t}-label-key {
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

  .${t}-launcher:hover {
    border-radius: 0.9rem;
    box-shadow: 0 2px 12px color-mix(in srgb, var(--${e}-accent) 28%, transparent),
                0 1px 3px rgba(0, 0, 0, 0.06);
    transform: none;
  }

  .${t}-launcher:hover span {
    max-width: 0;
    opacity: 0;
    margin-left: 0;
  }

  .${t}-panel {
    width: min(21rem, calc(100vw - 5.75rem));
  }
}
`}var L=X("pm"),C=Y("pm");var G=1200,q=["font-size","line-height","padding","margin","border-radius","gap","width","height","color","background-color"];function J(t,e){let n=t.getPropertyValue(`${e}-top`),o=t.getPropertyValue(`${e}-right`),r=t.getPropertyValue(`${e}-bottom`),a=t.getPropertyValue(`${e}-left`);return n===o&&o===r&&r===a?n:n===r&&a===o?`${n} ${o}`:`${n} ${o} ${r} ${a}`}function Z(t,e){return e==="padding"||e==="margin"?J(t,e):t.getPropertyValue(e)}var u={crosshair:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>',list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',annotate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',grip:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>'};function W(t){let e=t.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);if(!e)return t;let n=o=>o.toString(16).padStart(2,"0");return`#${n(parseInt(e[1]))}${n(parseInt(e[2]))}${n(parseInt(e[3]))}`.toUpperCase()}function R(t){let e=window.getComputedStyle(t);return{color:W(e.color),fontSize:e.fontSize,fontFamily:e.fontFamily.split(",")[0].replace(/['"]/g,"").trim()}}var j=!1;function Q(){if(j||typeof document>"u")return;let t=document.createElement("style");t.setAttribute(H,"global"),t.textContent=L,document.head.appendChild(t),j=!0}var tt=typeof HTMLElement>"u"?class{}:HTMLElement,w=class extends tt{constructor(){super(...arguments);this.store=P();this.labels={...S};this.theme={};this.mode="closed";this.hoveredTarget=null;this.selectedTarget=null;this.message="";this.annotations=[];this.isLoading=!1;this.isSubmitting=!1;this.status=null;this.statusType=null;this.locatedTarget=null;this.selectedElement=null;this.showProperties=!1;this.propertyChanges={};this.dragSrcId=null;this.dragOverId=null;this.dragOverPos="before";this.shadow=null;this.overlayEl=null;this.panelEl=null;this.launcherEl=null;this.boundMove=null;this.boundClick=null;this.boundKeyDown=null;this.pointerRef=null;this.refreshHover=()=>{this.pointerRef&&(this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId),this.rafId=window.requestAnimationFrame(()=>{this.pointerRef&&(this.hoveredTarget=this.getTargetAtPoint(this.pointerRef.clientX,this.pointerRef.clientY),this.updateOverlay())}))}}static get observedAttributes(){return["accent",f]}attributeChangedCallback(n,o,r){n==="accent"&&this.shadow&&this.style.setProperty(`${v}-accent`,r),n===f&&this.updateVisibility()}get visible(){return this.hasAttribute(f)}set visible(n){n?this.setAttribute(f,""):this.removeAttribute(f)}updateVisibility(){let n=this.visible;this.launcherEl&&(this.launcherEl.style.display=n?"":"none"),!n&&this.mode!=="closed"&&this.closeTool()}connectedCallback(){Q(),this.shadow=this.attachShadow({mode:"open"});let n=document.createElement("style");n.textContent=C,this.shadow.appendChild(n),this.overlayEl=document.createElement("div"),this.overlayEl.className=`${"pm"}-overlay`,this.overlayEl.style.display="none",this.overlayEl.setAttribute(T,""),this.shadow.appendChild(this.overlayEl),this.panelEl=document.createElement("div"),this.panelEl.className=`${"pm"}-panel`,this.panelEl.style.display="none",this.panelEl.setAttribute(T,""),this.shadow.appendChild(this.panelEl),this.launcherEl=document.createElement("button"),this.launcherEl.className=`${"pm"}-launcher`,this.launcherEl.type="button",this.launcherEl.innerHTML=`${u.annotate}<span>${this.labels.picker}</span>`,this.launcherEl.addEventListener("click",()=>{this.mode!=="closed"?this.closeTool():this.startPicking()}),this.shadow.appendChild(this.launcherEl),this.panelEl.addEventListener("click",o=>this.handlePanelClick(o)),this.panelEl.addEventListener("input",o=>this.handlePanelInput(o)),this.panelEl.addEventListener("mousedown",o=>this.handleDragHandleDown(o)),this.panelEl.addEventListener("mouseup",()=>this.resetDraggable()),this.panelEl.addEventListener("dragstart",o=>this.handleDragStart(o)),this.panelEl.addEventListener("dragover",o=>this.handleDragOver(o)),this.panelEl.addEventListener("drop",o=>this.handleDrop(o)),this.panelEl.addEventListener("dragend",()=>this.handleDragEnd()),this.theme.accent&&this.style.setProperty(`${v}-accent`,this.theme.accent),this.theme.accentDark&&this.style.setProperty(`${v}-accent-dark`,this.theme.accentDark),this.theme.accentSoft&&this.style.setProperty(`${v}-accent-soft`,this.theme.accentSoft),this.updateVisibility(),this.updatePanel()}disconnectedCallback(){this.cleanupPicking(),this.removeKeyDownListener(),window.clearTimeout(this.locateTimeout),this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId)}open(){this.startPicking()}close(){this.closeTool()}closeTool(){this.mode="closed",this.hoveredTarget=null,this.selectedTarget=null,this.selectedElement=null,this.pointerRef=null,this.message="",this.status=null,this.statusType=null,this.showProperties=!1,this.propertyChanges={},this.cleanupPicking(),this.updateOverlay(),this.updatePanel()}startPicking(){this.mode="picking",this.hoveredTarget=null,this.selectedTarget=null,this.selectedElement=null,this.pointerRef=null,this.message="",this.status=null,this.statusType=null,this.showProperties=!1,this.propertyChanges={},this.setupPicking(),this.updatePanel()}async openList(){this.mode="list",this.updatePanel(),await this.loadAnnotations()}setupPicking(){this.boundMove=n=>this.handleMove(n),this.boundClick=n=>this.handleClick(n),this.boundKeyDown=n=>this.handleKeyDown(n),document.addEventListener("mousemove",this.boundMove,!0),document.addEventListener("click",this.boundClick,!0),document.addEventListener("keydown",this.boundKeyDown),window.addEventListener("scroll",this.refreshHover,!0),window.addEventListener("resize",this.refreshHover),document.documentElement.classList.add(A)}cleanupPicking(){document.documentElement.classList.remove(A),this.boundMove&&document.removeEventListener("mousemove",this.boundMove,!0),this.boundClick&&document.removeEventListener("click",this.boundClick,!0),this.boundKeyDown&&document.removeEventListener("keydown",this.boundKeyDown),window.removeEventListener("scroll",this.refreshHover,!0),window.removeEventListener("resize",this.refreshHover),this.boundMove=null,this.boundClick=null,this.boundKeyDown=null,this.rafId!==void 0&&(window.cancelAnimationFrame(this.rafId),this.rafId=void 0)}getTargetAtPoint(n,o){let r=document.elementFromPoint(n,o);if(!(r instanceof HTMLElement)||r.closest(b))return null;let a=r.getBoundingClientRect();return a.width<2||a.height<2?null:{...E(r),viewportRect:a,hoverInfo:R(r)}}handleMove(n){this.pointerRef={clientX:n.clientX,clientY:n.clientY},this.hoveredTarget=this.getTargetAtPoint(n.clientX,n.clientY),this.updateOverlay()}handleClick(n){let o=this.getTargetAtPoint(n.clientX,n.clientY);if(!o)return;n.preventDefault(),n.stopPropagation(),this.selectedTarget=I(o);let r=document.elementFromPoint(n.clientX,n.clientY);this.selectedElement=r instanceof HTMLElement?r:null,this.hoveredTarget=null,this.showProperties=!1,this.propertyChanges={},this.mode="compose",this.cleanupPicking(),this.updateOverlay(),this.updatePanel();let a=this.panelEl?.querySelector("textarea");a&&a.focus()}handleKeyDown(n){n.key==="Escape"&&this.closeTool()}removeKeyDownListener(){this.boundKeyDown&&(document.removeEventListener("keydown",this.boundKeyDown),this.boundKeyDown=null)}async loadAnnotations(){this.isLoading=!0,this.status=null,this.statusType=null,this.updatePanel();try{let n=window.location.pathname;this.annotations=await this.store.list(n)}catch(n){this.status=n instanceof Error?n.message:this.labels.loading,this.statusType="error"}finally{this.isLoading=!1,this.updatePanel()}}getChanges(){return Object.entries(this.propertyChanges).map(([n,{from:o,to:r}])=>({property:n,from:o,to:r}))}async submitAnnotation(){if(!(!this.selectedTarget||!this.message.trim()||this.isSubmitting)){this.isSubmitting=!0,this.status=null,this.statusType=null,this.updatePanel();try{let n=await this.store.create({pagePath:window.location.pathname,pageTitle:document.title,message:this.message.trim(),element:this.selectedTarget,changes:this.getChanges()});this.annotations=[n,...this.annotations],this.message="",this.selectedTarget=null,this.mode="list"}catch(n){this.status=n instanceof Error?n.message:"Failed to submit.",this.statusType="error"}finally{this.isSubmitting=!1,this.updatePanel()}}}locateAnnotation(n){let o=null;try{o=document.querySelector(n.element.selector)}catch{o=null}if(!(o instanceof HTMLElement)){this.status=this.labels.notFound,this.statusType="error",this.updatePanel();return}o.scrollIntoView({behavior:"smooth",block:"center"}),window.clearTimeout(this.locateTimeout),this.locateTimeout=window.setTimeout(()=>{o?.isConnected&&(this.locatedTarget={...E(o),viewportRect:o.getBoundingClientRect(),hoverInfo:R(o)},this.updateOverlay(),this.locateTimeout=window.setTimeout(()=>{this.locatedTarget=null,this.updateOverlay()},1800))},350)}async resolveAnnotation(n){if(this.store.update)try{let o=await this.store.update(n,{status:"resolved"});this.annotations=this.annotations.map(r=>r.id===n?o:r),this.updatePanel()}catch{}}handleDragHandleDown(n){let r=n.target.closest("[data-drag-handle]");if(!r)return;let a=r.closest(`.${"pm"}-item`);a instanceof HTMLElement&&(a.draggable=!0)}resetDraggable(){this.panelEl&&this.panelEl.querySelectorAll(`.${"pm"}-item[draggable="true"]`).forEach(n=>{n.draggable=!1})}handleDragStart(n){let o=n.target.closest(`.${"pm"}-item`);if(!o)return;let r=o.getAttribute("data-annotation-id");r&&(this.dragSrcId=r,o.classList.add("is-dragging"),n.dataTransfer&&(n.dataTransfer.effectAllowed="move",n.dataTransfer.setData("text/plain",r)))}handleDragOver(n){if(!this.dragSrcId)return;let o=n.target.closest(`.${"pm"}-item`);if(!o)return;let r=o.getAttribute("data-annotation-id");if(!r||r===this.dragSrcId)return;n.preventDefault(),n.dataTransfer&&(n.dataTransfer.dropEffect="move");let a=o.getBoundingClientRect(),l=a.top+a.height/2,d=n.clientY<l?"before":"after";this.clearDragIndicators(),this.dragOverId=r,this.dragOverPos=d,o.classList.add(d==="before"?"is-drop-before":"is-drop-after")}clearDragIndicators(){this.panelEl&&(this.panelEl.querySelectorAll(".is-drop-before, .is-drop-after").forEach(n=>{n.classList.remove("is-drop-before","is-drop-after")}),this.dragOverId=null)}async handleDrop(n){if(n.preventDefault(),!this.dragSrcId||!this.dragOverId){this.handleDragEnd();return}let o=this.dragSrcId,r=this.dragOverId,a=this.dragOverPos,l=[...this.annotations],d=l.findIndex(h=>h.id===o);if(d===-1){this.handleDragEnd();return}let[p]=l.splice(d,1),c=l.findIndex(h=>h.id===r);if(c===-1){this.handleDragEnd();return}if(a==="after"&&c++,l.splice(c,0,p),this.annotations=l,this.store.reorder)try{await this.store.reorder(l.map(h=>h.id))}catch{}this.handleDragEnd(),this.updatePanel()}handleDragEnd(){this.panelEl&&(this.panelEl.querySelectorAll(".is-dragging").forEach(n=>{n.classList.remove("is-dragging")}),this.clearDragIndicators(),this.resetDraggable()),this.dragSrcId=null,this.dragOverId=null}async copyAsPrompt(n){let o;if(n){let r=this.annotations.find(a=>a.id===n);if(!r)return;o=y(r)}else this.selectedTarget?o=y({id:"preview",pagePath:window.location.pathname,pageTitle:document.title,message:this.message.trim()||"(no message)",element:this.selectedTarget,createdAt:new Date().toISOString(),status:"open",changes:this.getChanges()}):o=x(this.annotations,window.location.pathname);try{await navigator.clipboard.writeText(o),this.status=this.labels.copied,this.statusType="success"}catch{let r=document.createElement("textarea");r.value=o,r.style.position="fixed",r.style.opacity="0",document.body.appendChild(r),r.select();try{document.execCommand("copy"),this.status=this.labels.copied,this.statusType="success"}catch{this.status="Copy failed",this.statusType="error"}document.body.removeChild(r)}this.updatePanel(),this.statusType==="success"&&window.setTimeout(()=>{this.status===this.labels.copied&&(this.status=null,this.statusType=null,this.updatePanel())},1500)}handlePanelClick(n){let o=n.target.closest("[data-action]");if(!o)return;let r=o.getAttribute("data-action"),a=o.getAttribute("data-id");switch(r){case"pick":this.startPicking();break;case"list":this.openList();break;case"close":this.closeTool();break;case"send":this.submitAnnotation();break;case"reselect":this.startPicking();break;case"locate":if(a){let l=this.annotations.find(d=>d.id===a);l&&this.locateAnnotation(l)}break;case"copy":this.copyAsPrompt(a||void 0);break;case"resolve":a&&this.resolveAnnotation(a);break;case"toggle-properties":this.showProperties=!this.showProperties,this.updatePanel();break}}handlePanelInput(n){let o=n.target;if(o.tagName==="TEXTAREA")this.message=o.value;else if(o.tagName==="INPUT"&&o.hasAttribute("data-property")){let r=o.getAttribute("data-property"),a=o.getAttribute("data-original"),l=o.value.trim();l&&l!==a?this.propertyChanges[r]={from:a,to:l}:delete this.propertyChanges[r];let d=o.closest(`.${"pm"}-prop-row`);d&&d.classList.toggle("is-changed",!!this.propertyChanges[r]),this.updatePropToggleBadge()}}updatePropToggleBadge(){let n=this.panelEl?.querySelector(`.${"pm"}-prop-toggle`);if(!n)return;let o=Object.keys(this.propertyChanges).length,r=o>0?`<span class="${"pm"}-prop-count">${o}</span>`:"",a=this.showProperties?" \u2713":"";n.innerHTML=`${i(this.labels.properties)}${a}${r}`}updateOverlay(){if(!this.overlayEl)return;let n=this.mode==="picking"?this.hoveredTarget:this.locatedTarget;if(!n){this.overlayEl.style.display="none",this.overlayEl.innerHTML="";return}let{viewportRect:o}=n,r=n.hoverInfo?72:34,a=o.top>r+10?o.top-r:o.bottom+8,l=Math.min(Math.max(o.left,8),window.innerWidth-240);this.overlayEl.style.display="",this.overlayEl.innerHTML=`
      <div class="${"pm"}-highlight" style="top:${o.top}px;left:${o.left}px;width:${o.width}px;height:${o.height}px"></div>
      <div class="${"pm"}-element-label" style="top:${a}px;left:${l}px">
        <div class="${"pm"}-label-row">
          <strong>${i(n.name)}</strong>
          <span>${Math.round(o.width)} \xD7 ${Math.round(o.height)}</span>
        </div>
        ${n.hoverInfo?`
        <div class="${"pm"}-label-row">
          <span class="${"pm"}-label-key">${i(this.labels.colorLabel??"\u989C\u8272")}</span>
          <span>${i(n.hoverInfo.color)}</span>
        </div>
        <div class="${"pm"}-label-row">
          <span class="${"pm"}-label-key">${i(this.labels.fontLabel??"\u5B57\u4F53")}</span>
          <span>${i(n.hoverInfo.fontSize)} ${i(n.hoverInfo.fontFamily)}</span>
        </div>
        `:""}
      </div>
    `}updatePanel(){if(!this.panelEl||!this.launcherEl)return;let n=this.mode!=="closed";if(this.launcherEl.classList.toggle("is-active",n),this.launcherEl.innerHTML=n?`${u.x}<span>${this.labels.close}</span>`:`${u.annotate}<span>${this.labels.picker}</span>`,!n){this.panelEl.style.display="none",this.panelEl.innerHTML="";return}this.panelEl.style.display="";let o=this.mode==="picking"||this.mode==="compose",r=this.mode==="list";this.panelEl.innerHTML=`
      <div class="${"pm"}-panel-header">
        <div class="${"pm"}-panel-tabs">
          <button type="button" class="${o?"is-active":""}" data-action="pick" role="tab" aria-selected="${o}">
            ${u.crosshair}
            ${i(this.labels.picker)}
          </button>
          <button type="button" class="${r?"is-active":""}" data-action="list" role="tab" aria-selected="${r}">
            ${u.list}
            ${i(this.labels.list)}
          </button>
        </div>
        <button type="button" class="${"pm"}-close" data-action="close" aria-label="${i(this.labels.close)}">
          ${u.x}
        </button>
      </div>
      ${this.renderPanelContent()}
    `}renderPanelContent(){switch(this.mode){case"picking":return this.renderPickerNote();case"compose":return this.renderCompose();case"list":return this.renderList();default:return""}}renderPickerNote(){return`
      <div class="${"pm"}-picker-note">
        ${u.crosshair}
        <p>${i(this.labels.picker)}</p>
        <span>${i(this.labels.pickerHint)}</span>
      </div>
    `}renderCompose(){if(!this.selectedTarget)return"";let n=this.status?`<p class="${"pm"}-status ${this.statusType==="success"?"is-success":"is-error"}">${i(this.status)}</p>`:"",o=Object.keys(this.propertyChanges).length,r=this.showProperties?`${this.labels.properties} \u2713`:this.labels.properties,a=o>0?`<span class="${"pm"}-prop-count">${o}</span>`:"";return`
      <div class="${"pm"}-compose">
        <div class="${"pm"}-target">
          <span>${i(this.labels.targetLabel)}</span>
          <strong>${i(this.selectedTarget.name)}</strong>
          <button type="button" class="${"pm"}-prop-toggle ${this.showProperties?"is-active":""}" data-action="toggle-properties">
            ${i(r)}${a}
          </button>
        </div>
        ${this.showProperties?this.renderPropertyPanel():""}
        <textarea maxlength="${G}" placeholder="${i(this.labels.placeholder)}" aria-label="${i(this.labels.placeholder)}">${i(this.message)}</textarea>
        ${n}
        <div class="${"pm"}-compose-actions">
          <button type="button" class="${"pm"}-copy-btn" data-action="copy">
            ${u.copy}
            ${i(this.labels.copyAsPrompt)}
          </button>
          <span style="display:flex;gap:0.5rem;align-items:center">
            <button type="button" class="${"pm"}-back" data-action="reselect">${i(this.labels.reselect)}</button>
            <button type="button" class="${"pm"}-send" data-action="send" ${!this.message.trim()||this.isSubmitting?"disabled":""}>
              ${this.isSubmitting?i(this.labels.sending):i(this.labels.send)}
              ${u.send}
            </button>
          </span>
        </div>
      </div>
    `}renderPropertyPanel(){if(!this.selectedElement)return"";let n=window.getComputedStyle(this.selectedElement),o=q.map(r=>{let a=Z(n,r).trim(),l=this.propertyChanges[r],d=l?l.to:"";return`
        <div class="${"pm"}-prop-row ${l?"is-changed":""}">
          <span class="${"pm"}-prop-name">${i(r)}</span>
          <span class="${"pm"}-prop-current">${i(a)}</span>
          <input
            type="text"
            class="${"pm"}-prop-input"
            data-property="${i(r)}"
            data-original="${i(a)}"
            value="${i(d)}"
            placeholder="${l?i(l.to):"\u2192"}"
            spellcheck="false"
          />
        </div>`}).join("");return`
      <div class="${"pm"}-prop-panel">
        <p class="${"pm"}-prop-hint">${i(this.labels.propertiesHint)}</p>
        ${o}
      </div>
    `}renderList(){let n="";this.isLoading?n=`<p class="${"pm"}-empty">${i(this.labels.loading)}</p>`:this.status&&this.statusType==="error"&&this.annotations.length===0?n=`<p class="${"pm"}-status is-error">${i(this.status)}</p>`:this.annotations.length===0?n=`<p class="${"pm"}-empty">${i(this.labels.empty)}</p>`:n=this.annotations.map(r=>this.renderItem(r)).join("");let o=this.status&&this.statusType==="success"?`<p class="${"pm"}-status is-success">${i(this.status)}</p>`:"";return`
      <div class="${"pm"}-list">
        ${o}
        ${n}
      </div>
    `}renderItem(n){let o=n.status==="resolved",r=n.element.text?`<span class="${"pm"}-item-context">${i(this.labels.contentPrefix)}${i(n.element.text)}</span>`:"",a=n.changes&&n.changes.length>0?`<div class="${"pm"}-item-changes">${n.changes.map(p=>`<span class="${"pm"}-change">${i(p.property)}: ${i(p.from)} \u2192 <strong>${i(p.to)}</strong></span>`).join("")}</div>`:"",l=o?`<span class="${"pm"}-item-status">${u.check}${i(this.labels.resolved)}</span>`:"",d=!o&&this.store.update?`<button type="button" class="is-resolve" data-action="resolve" data-id="${n.id}">${u.check}${i(this.labels.resolve)}</button>`:"";return`
      <article class="${"pm"}-item ${o?"is-resolved":""}" data-annotation-id="${n.id}">
        <div class="${"pm"}-item-header">
          <div class="${"pm"}-item-title">
            <button type="button" class="${"pm"}-drag-handle" data-drag-handle aria-label="${i(this.labels.dragLabel??"\u62D6\u52A8\u6392\u5E8F")}">
              ${u.grip}
            </button>
            <strong>${i(n.element.name)}</strong>
          </div>
          <div class="${"pm"}-item-actions">
            <button type="button" data-action="copy" data-id="${n.id}">${u.copy}</button>
            <button type="button" data-action="locate" data-id="${n.id}">${u.crosshair}${i(this.labels.locate)}</button>
            ${d}
          </div>
        </div>
        <code title="${i(n.element.selector)}">${i(n.element.selector)}</code>
        <p>${i(n.message)}</p>
        ${a}
        ${r}
        ${l}
        <time datetime="${n.createdAt}">${D(n.createdAt)}</time>
      </article>
    `}};function i(t){let e=document.createElement("div");return e.textContent=t,e.innerHTML}function et(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function nt(t){let{endpoint:e,headers:n={}}=t,o={"content-type":"application/json",...n};return{async list(r){let a=`${e}?page=${encodeURIComponent(r)}`,l=await fetch(a,{cache:"no-store",headers:n});if(!l.ok)throw new Error(`Failed to load annotations (${l.status})`);return(await l.json()).annotations??[]},async create(r){let a=await fetch(e,{method:"POST",headers:o,body:JSON.stringify(r)});if(!a.ok){let d=await a.json().catch(()=>({error:"Unknown error"}));throw new Error(d.error||`Failed to create annotation (${a.status})`)}return(await a.json()).annotation},async update(r,a){let l=await fetch(`${e}/${r}`,{method:"PATCH",headers:o,body:JSON.stringify(a)});if(!l.ok)throw new Error(`Failed to update annotation (${l.status})`);return(await l.json()).annotation},async delete(r){let a=await fetch(`${e}/${r}`,{method:"DELETE",headers:o});if(!a.ok)throw new Error(`Failed to delete annotation (${a.status})`)},async reorder(r){let a=await fetch(`${e}/reorder`,{method:"POST",headers:o,body:JSON.stringify({ids:r})});if(!a.ok)throw new Error(`Failed to reorder annotations (${a.status})`)}}}function ot(t){return{id:et(),pagePath:t.pagePath,pageTitle:t.pageTitle,message:t.message,element:t.element,createdAt:new Date().toISOString(),status:"open",changes:t.changes}}typeof customElements<"u"&&!customElements.get(b)&&customElements.define(b,w);export{w as PatchMark,nt as createFetchStore,ot as createLocalAnnotation,P as createLocalStorageStore,S as defaultLabels,y as formatAnnotationAsPrompt,x as formatAnnotationsAsPrompt,L as globalStyles,C as shadowStyles};
