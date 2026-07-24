function P(t){let n=t.getBoundingClientRect(),e=t.tagName.toLowerCase(),o=ee(t,e);return{tagName:e,name:o,selector:te(t),text:(t.innerText||t.getAttribute("aria-label")||"").replace(/\s+/g," ").trim().slice(0,240),rect:{top:Math.round(n.top+window.scrollY),left:Math.round(n.left+window.scrollX),width:Math.round(n.width),height:Math.round(n.height)}}}function K(t){return{tagName:t.tagName,name:t.name,selector:t.selector,text:t.text,rect:t.rect}}function ee(t,n){if(t.id)return`#${t.id}`;let e=t.getAttribute("aria-label");if(e)return`${n}[aria-label="${e.slice(0,36)}"]`;let o=t.getAttribute("data-testid");if(o)return`[data-testid="${o}"]`;let r=t.parentElement?.closest("[id]");if(r?.id)return`#${r.id} \xB7 ${n}`;let s=Array.from(t.classList).filter(X).slice(0,2);return s.length?`${n}.${s.join(".")}`:n}function te(t){if(t.id)return`#${CSS.escape(t.id)}`;let n=[],e=t;for(;e&&e!==document.body&&n.length<5;){if(e.id){n.unshift(`#${CSS.escape(e.id)}`);break}let o=e.tagName.toLowerCase(),r=e.getAttribute("data-testid");if(r){n.unshift(`[data-testid="${CSS.escape(r)}"]`);break}let s=Array.from(e.classList).filter(X).slice(0,2),a=Array.from(e.parentElement?.children??[]).filter(u=>u.tagName===e?.tagName),c=a.length>1?`:nth-of-type(${a.indexOf(e)+1})`:"";n.unshift(`${o}${s.map(u=>`.${CSS.escape(u)}`).join("")}${c}`),e=e.parentElement}return n.join(" > ")}function X(t){return t.length<48&&!/^(css-|[a-z]+-[A-Za-z0-9]{6,}|[a-zA-Z0-9_-]*\d{4,})/.test(t)}function Y(t,n="zh-CN"){let e=new Date(t);return new Intl.DateTimeFormat(n,{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(e)}var v="patch-mark";var g="--pm",V="data-pm-global",O="data-pm-ui",D="pm-picker-active",G="patch-mark:annotations",$="visible",x="theme",w="require-auth",y="position",_="pm_token",L="patch-mark:token",ne=["blue","violet","emerald","orange","rose"],oe="0.7.0";var q=1e3;function re(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function se(){try{let t="__patch_mark_test__";return localStorage.setItem(t,t),localStorage.removeItem(t),!0}catch{return!1}}function R(t){let n=t?.key??G,e=se(),o=[];function r(){return[...o]}function s(){try{let d=localStorage.getItem(n);if(!d)return[];let h=JSON.parse(d);return Array.isArray(h)?h.filter(ie):[]}catch{return[]}}function a(d){try{localStorage.setItem(n,JSON.stringify(d.slice(0,q)))}catch{}}function c(){return e?s():r()}function u(d){e?a(d):(o.length=0,o.push(...d.slice(0,q)))}return{async list(d){return c().filter(h=>h.pagePath===d)},async create(d){let h={id:re(),pagePath:d.pagePath,pageTitle:d.pageTitle,message:d.message,element:d.element,createdAt:new Date().toISOString(),status:"open",changes:d.changes},m=c();return m.unshift(h),u(m),h},async update(d,h){let m=c(),b=m.findIndex(H=>H.id===d);if(b===-1)throw new Error(`Annotation ${d} not found`);return m[b]={...m[b],...h},u(m),m[b]},async delete(d){let h=c().filter(m=>m.id!==d);u(h)},async reorder(d){let h=c(),m=new Set(d),b=d.map(f=>h.find(Z=>Z.id===f)).filter(f=>f!==void 0),H=0,Q=h.map(f=>m.has(f.id)?b[H++]??f:f);u(Q)}}}function ie(t){if(typeof t!="object"||t===null)return!1;let n=t;return typeof n.id=="string"&&typeof n.pagePath=="string"&&typeof n.message=="string"&&typeof n.createdAt=="string"&&typeof n.element=="object"&&n.element!==null}var j={picker:"\u6279\u6CE8",pickerHint:"\u60AC\u505C\u67E5\u770B\u8303\u56F4\uFF0C\u70B9\u51FB\u540E\u6DFB\u52A0\u8BC4\u8BED",compose:"\u6279\u6CE8",targetLabel:"\u76EE\u6807\u5143\u7D20",placeholder:"\u7559\u4E0B\u8BC4\u8BED\u2026",send:"\u53D1\u9001",sending:"\u53D1\u9001\u4E2D",reselect:"\u91CD\u9009",list:"\u5DF2\u6279\u6CE8",locate:"\u5B9A\u4F4D",close:"\u5173\u95ED\u6279\u6CE8",empty:"\u5F53\u524D\u9875\u9762\u8FD8\u6CA1\u6709\u6279\u6CE8\u3002",loading:"\u6B63\u5728\u8BFB\u53D6\u2026",notFound:"\u672A\u627E\u5230\u8BE5\u5143\u7D20\uFF0C\u9875\u9762\u7ED3\u6784\u53EF\u80FD\u5DF2\u7ECF\u6539\u52A8\u3002",contentPrefix:"\u5185\u5BB9\uFF1A",copyAsPrompt:"Copy as prompt",copyHandoff:"\u590D\u5236\u6D3E\u5355 prompt",copied:"\u5DF2\u590D\u5236",resolve:"\u89E3\u51B3",resolved:"\u5DF2\u89E3\u51B3",collapse:"\u6536\u8D77",properties:"\u5C5E\u6027",propertiesHint:"\u76F4\u63A5\u4FEE\u6539\u6570\u503C\uFF0C\u53CD\u9988\u7ED9 agent \u7CBE\u786E\u6307\u4EE4",colorLabel:"\u989C\u8272",fontLabel:"\u5B57\u4F53",dragLabel:"\u62D6\u52A8\u6392\u5E8F",expandLabel:"\u6269\u5C55\u5230\u7236\u7EA7",shrinkLabel:"\u6536\u7F29\u5230\u5B50\u7EA7",lockedTitle:"\u9700\u8981\u8BBF\u95EE\u4EE4\u724C",lockedHint:"\u6B64\u9875\u9762\u7684\u6279\u6CE8\u529F\u80FD\u53D7\u4FDD\u62A4\uFF0C\u8BF7\u8F93\u5165\u5206\u4EAB\u94FE\u63A5\u4E2D\u7684\u8BBF\u95EE\u4EE4\u724C\u3002",lockedPlaceholder:"\u7C98\u8D34\u4EE4\u724C\u2026",lockedSubmit:"\u89E3\u9501",lockedError:"\u4EE4\u724C\u65E0\u6548\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u83B7\u53D6\u3002"};function z(t){let n=t.element,e=[`- **Element:** \`<${n.tagName}>\``,`- **Selector:** \`${n.selector}\``,`- **Name:** ${n.name}`];if(n.text&&e.push(`- **Text:** "${n.text}"`),e.push(`- **Position:** top=${n.rect.top}, left=${n.rect.left}, ${n.rect.width}x${n.rect.height}`,`- **Page:** ${t.pagePath}`),t.pageTitle&&e.push(`- **Page Title:** ${t.pageTitle}`),e.push(`- **Feedback:** ${t.message}`),t.changes&&t.changes.length>0){e.push("","- **Property Changes:**");for(let o of t.changes)e.push(`  - \`${o.property}\`: ${o.from} \u2192 ${o.to}`)}return e}function k(t){let n=["## UI Feedback","",...z(t)];return t.status&&n.push(`- **Status:** ${t.status}`),n.join(`
`)}function N(t,n){if(t.length===0)return`## UI Feedback

No feedback items.`;let e=["## UI Feedback Report","",`- **Page:** ${n||t[0].pagePath}`,`- **Total Items:** ${t.length}`,"- **Captured:** "+new Date().toISOString(),"","---"],o=t.map((r,s)=>`### Feedback #${s+1}

${k(r)}`);return[...e,...o.join(`

---

`)].join(`
`)}function F(t,n,e){let o=t.filter(c=>c.status!=="resolved");if(o.length===0)return`## UI Feedback

No open feedback items.`;let r=o[0].pagePath;if(e?.type==="rest"){let c=[`You are maintaining UI feedback annotations managed by patch-mark on ${n}.`,"","## Source of truth","Annotations live behind a REST API. Read the open items, fix each, then mark it resolved yourself \u2014 you own the lifecycle so nothing gets re-processed on the next pass.","",`- GET    ${e.endpoint}?page=${r}   \u2192 { annotations }  (process only status:"open")`,`- PATCH  ${e.endpoint}/{id}             \u2192 close an item with { "status": "resolved" }`,"","## Lifecycle rules",'- Only touch items with status "open". Already-resolved items are done \u2014 skip them.','- For each open item: locate the element in the codebase (grep the Selector\'s distinctive class/id, or the visible Text; the Page field maps to the route), apply the Feedback ("Property Changes" are exact `property: from \u2192 to`), then PATCH that item resolved.',"- Don't pause for confirmation between items \u2014 fix and move on.","- When every open item is resolved, reply with a numbered summary: what changed per item and which files you touched.","",`## Open items (${o.length})`,""],u=o.map((d,h)=>`### ${h+1}. \`<${d.element.tagName}>\` \u2014 ${d.element.name}

- **ID:** \`${d.id}\`
${z(d).join(`
`)}`);return[...c,...u.join(`

---

`)].join(`
`)}let s=["You are fixing a batch of UI feedback captured with patch-mark.","",`- **Page:** ${n}`,`- **Open Items:** ${o.length}`,"","How to work the batch:","1. Locate each element in the codebase: grep for a distinctive class or id from the Selector, or for the visible Text. The Page field maps to the route/component.",'2. Apply the Feedback. "Property Changes" lines are exact instructions (`property: from \u2192 to`); otherwise follow the Feedback text and match the project\'s existing styling conventions.',"3. Don't pause for confirmation between items \u2014 make the edit and move on.","","When finished, reply with a numbered summary: what changed per item and which files you touched. The user will verify in the browser and mark items resolved.","","---"],a=o.map((c,u)=>`### ${u+1}. \`<${c.element.tagName}>\` \u2014 ${c.element.name}

${z(c).join(`
`)}`);return[...s,...a.join(`

---

`)].join(`
`)}function ae(t){let n=`${t}-picker-active`;return`
.${n},
.${n} * {
  cursor: crosshair !important;
}
`}function le(t){let n=g;return`
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

  ${n}-accent: #0058d0;
  ${n}-accent-dark: #003f99;
  ${n}-accent-soft: rgba(0, 88, 208, 0.12);
  ${n}-ink: #0b1220;
  ${n}-muted: #506070;
  ${n}-foreground: #111827;
  ${n}-line: rgba(0, 54, 128, 0.14);
  ${n}-line-strong: rgba(0, 54, 128, 0.24);
  ${n}-panel-solid: #ffffff;
  ${n}-surface-muted: #eaf2ff;
  ${n}-on-accent: #ffffff;
  ${n}-font-mono: "IBM Plex Mono", "SFMono-Regular", "Consolas", monospace;
  ${n}-error: #b42318;
  ${n}-success: #087f5b;
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
  ${n}-accent: #7c3aed;
  ${n}-accent-dark: #5b21b6;
  ${n}-accent-soft: rgba(124, 58, 237, 0.12);
  ${n}-surface-muted: #f5f3ff;
  ${n}-line: rgba(76, 29, 149, 0.14);
  ${n}-line-strong: rgba(76, 29, 149, 0.24);
}

:host([theme="emerald"]) {
  ${n}-accent: #059669;
  ${n}-accent-dark: #065f46;
  ${n}-accent-soft: rgba(5, 150, 105, 0.12);
  ${n}-surface-muted: #ecfdf5;
  ${n}-line: rgba(6, 78, 59, 0.14);
  ${n}-line-strong: rgba(6, 78, 59, 0.24);
}

:host([theme="orange"]) {
  ${n}-accent: #ea580c;
  ${n}-accent-dark: #9a3412;
  ${n}-accent-soft: rgba(234, 88, 12, 0.12);
  ${n}-surface-muted: #fff7ed;
  ${n}-line: rgba(124, 45, 18, 0.14);
  ${n}-line-strong: rgba(124, 45, 18, 0.24);
}

:host([theme="rose"]) {
  ${n}-accent: #e11d48;
  ${n}-accent-dark: #9f1239;
  ${n}-accent-soft: rgba(225, 29, 72, 0.12);
  ${n}-surface-muted: #fff1f2;
  ${n}-line: rgba(136, 19, 55, 0.14);
  ${n}-line-strong: rgba(136, 19, 55, 0.24);
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
  background: linear-gradient(135deg, var(${n}-accent), var(${n}-accent-dark));
  color: var(${n}-on-accent);
  box-shadow: 0 2px 12px color-mix(in srgb, var(${n}-accent) 28%, transparent),
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
  translate: calc(var(--${n}-dodge-sign, -1) * var(--${n}-dodge-x, 0px)) 0;
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
  box-shadow: 0 8px 28px color-mix(in srgb, var(${n}-accent) 38%, transparent),
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
  background: var(${n}-accent-dark);
  box-shadow: 0 2px 8px color-mix(in srgb, var(${n}-accent-dark) 25%, transparent);
}

.${t}-launcher.is-active:hover {
  box-shadow: 0 6px 24px color-mix(in srgb, var(${n}-accent-dark) 35%, transparent),
              0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ---- Launcher: drag, collapse-to-edge, hover-peek ---- */
.${t}-launcher {
  position: relative;
}

.${t}-launcher.is-floating {
  position: fixed;
  translate: 0;
}

.${t}-launcher.is-dragging {
  transition: none;
  cursor: grabbing;
}

.${t}-launcher.is-collapsed {
  position: fixed;
  width: 0.5rem;
  min-width: 0;
  height: 4rem;
  padding: 0;
  border-radius: 0.4rem;
  overflow: hidden;
}

.${t}-launcher.is-collapsed > svg,
.${t}-launcher.is-collapsed > span {
  display: none;
}

.${t}-launcher.is-collapsed:hover {
  width: auto;
  padding: 0 0.9rem;
  border-radius: 0.9rem;
}

.${t}-launcher.is-collapsed:hover > svg {
  display: inline-flex;
}

.${t}-launcher.is-collapsed:hover > span {
  display: inline-flex;
  max-width: 5rem;
  opacity: 1;
  margin-left: 0.5rem;
}

.${t}-collapse-btn {
  position: absolute;
  top: -0.45rem;
  right: -0.45rem;
  width: 1.15rem;
  height: 1.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(${n}-panel-solid);
  color: var(${n}-accent);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
}

.${t}-launcher:hover .${t}-collapse-btn {
  opacity: 1;
  pointer-events: auto;
}

.${t}-launcher.is-collapsed .${t}-collapse-btn,
.${t}-launcher.is-dragging .${t}-collapse-btn {
  display: none;
}

.${t}-collapse-btn svg {
  width: 0.7rem;
  height: 0.7rem;
}

/* ---- Panel ---- */
.${t}-panel {
  /* Stack above the selection overlay (z-index 9999) so the compose/list
     panel isn't visually pierced by the highlight frame while typing. */
  position: relative;
  z-index: 10000;
  width: min(21rem, calc(100vw - 7.5rem));
  overflow: hidden;
  border: 1px solid var(--${n}-line-strong);
  border-radius: 1rem;
  background: var(${n}-panel-solid);
  box-shadow: 0 20px 56px rgba(7, 19, 33, 0.18);
  pointer-events: auto;
  cursor: auto;
  translate: calc(var(--${n}-dodge-sign, -1) * var(--${n}-dodge-x, 0px)) 0;
  transition: translate 260ms cubic-bezier(0.4, 0, 0.2, 1), opacity 160ms ease;
}

/* Picking mode: pointer over the panel body turns it into a ghost so the
   elements underneath stay hoverable and clickable */
.${t}-panel.is-ghost {
  /* Picking pointer-passes-through state: pointer-events:none does the
     actual pass-through; opacity just hints at it. Faint but visible. */
  opacity: 0.2;
  pointer-events: none;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .${t}-panel {
    background: var(${n}-panel-solid);
  }
}

.${t}-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(${n}-line);
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
  color: var(${n}-muted);
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
  background: var(${n}-accent-soft);
  color: var(${n}-accent-dark);
}

.${t}-close {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: transparent;
  color: var(${n}-muted);
  cursor: pointer;
}

.${t}-close:hover,
.${t}-back:hover {
  background: var(${n}-surface-muted);
  color: var(${n}-ink);
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
  color: var(${n}-accent);
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
  color: var(${n}-ink);
  font-size: 0.92rem;
  font-weight: 700;
}

.${t}-picker-note span {
  grid-column: 2;
  margin-top: 0.1rem;
  color: var(${n}-muted);
  font-size: 0.79rem;
  line-height: 1.45;
}

/* ---- Locked (access token) panel ---- */
.${t}-locked {
  display: grid;
  gap: 0.6rem;
  justify-items: start;
  padding: 1rem;
}

.${t}-locked > svg {
  width: 1.3rem;
  height: 1.3rem;
  color: var(${n}-accent);
}

.${t}-locked p {
  margin: 0;
  color: var(${n}-ink);
  font-size: 0.92rem;
  font-weight: 700;
}

.${t}-locked > span {
  color: var(${n}-muted);
  font-size: 0.79rem;
  line-height: 1.45;
}

.${t}-locked-input {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(${n}-line);
  border-radius: 0.45rem;
  padding: 0.5rem 0.6rem;
  outline: none;
  font: inherit;
  font-size: 0.84rem;
  color: var(${n}-ink);
  background: var(${n}-panel-solid);
}

.${t}-locked-input:focus {
  border-color: var(${n}-accent);
  box-shadow: 0 0 0 3px var(${n}-accent-soft);
}

.${t}-locked .${t}-send {
  justify-self: end;
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
  color: var(${n}-muted);
  font-family: var(${n}-font-mono);
  font-size: 0.72rem;
}

.${t}-target > strong {
  flex: 1;
  overflow: hidden;
  color: var(${n}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${t}-compose textarea {
  display: block;
  width: 100%;
  min-height: 7.5rem;
  resize: vertical;
  border: 1px solid var(${n}-line-strong);
  border-radius: 0.7rem;
  outline: none;
  background: var(${n}-panel-solid);
  padding: 0.65rem 0.7rem;
  color: var(${n}-ink);
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
}

.${t}-compose textarea:focus {
  border-color: var(${n}-accent);
  box-shadow: 0 0 0 3px var(${n}-accent-soft);
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
  color: var(${n}-muted);
}

.${t}-send {
  gap: 0.4rem;
  background: var(${n}-accent);
  color: var(${n}-on-accent);
}

.${t}-send:hover:not(:disabled) {
  background: var(${n}-accent-dark);
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
  border: 1px solid var(${n}-line-strong);
  border-radius: 0.6rem;
  background: transparent;
  padding: 0.3rem 0.55rem;
  color: var(${n}-muted);
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
}

.${t}-copy-btn:hover {
  background: var(${n}-surface-muted);
  color: var(${n}-ink);
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
  color: var(${n}-error);
}

.${t}-status.is-success {
  color: var(${n}-success);
}

/* ---- Selection level navigation ---- */
.${t}-select-nav {
  display: inline-flex;
  flex: none;
  gap: 0.15rem;
}

.${t}-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid var(${n}-line-strong);
  border-radius: 0.4rem;
  background: transparent;
  padding: 0;
  color: var(${n}-muted);
  cursor: pointer;
  transition: all 140ms ease;
}

.${t}-nav-btn:hover:not(:disabled) {
  border-color: var(${n}-accent);
  background: var(${n}-accent-soft);
  color: var(${n}-accent-dark);
}

.${t}-nav-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.${t}-nav-btn svg {
  width: 0.85rem;
  height: 0.85rem;
}

/* ---- Property panel ---- */
.${t}-prop-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid var(${n}-line-strong);
  border-radius: 0.4rem;
  background: transparent;
  padding: 0.18rem 0.45rem;
  color: var(${n}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 650;
  cursor: pointer;
  transition: all 140ms ease;
}

.${t}-prop-toggle:hover {
  background: var(${n}-surface-muted);
  color: var(${n}-ink);
}

.${t}-prop-toggle.is-active {
  border-color: var(${n}-accent);
  background: var(${n}-accent-soft);
  color: var(${n}-accent-dark);
}

.${t}-prop-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.55rem;
  background: var(${n}-accent);
  color: var(${n}-on-accent);
  font-size: 0.66rem;
  font-weight: 700;
  padding: 0 0.2rem;
}

.${t}-prop-panel {
  margin-bottom: 0.75rem;
  border: 1px solid var(${n}-line);
  border-radius: 0.6rem;
  overflow: hidden;
}

.${t}-prop-hint {
  margin: 0;
  padding: 0.4rem 0.55rem;
  background: var(${n}-surface-muted);
  color: var(${n}-muted);
  font-size: 0.7rem;
  line-height: 1.35;
}

.${t}-prop-row {
  display: grid;
  grid-template-columns: 5.5rem 1fr 4.5rem;
  align-items: center;
  gap: 0.4rem;
  border-top: 1px solid var(${n}-line);
  padding: 0.32rem 0.55rem;
}

.${t}-prop-row.is-changed {
  background: var(${n}-accent-soft);
}

.${t}-prop-name {
  color: var(${n}-muted);
  font-family: var(${n}-font-mono);
  font-size: 0.72rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.${t}-prop-current {
  color: var(${n}-ink);
  font-family: var(${n}-font-mono);
  font-size: 0.74rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.7;
}

.${t}-prop-input {
  width: 100%;
  border: 1px solid var(${n}-line);
  border-radius: 0.3rem;
  background: var(${n}-panel-solid);
  padding: 0.18rem 0.3rem;
  color: var(${n}-accent-dark);
  font-family: var(${n}-font-mono);
  font-size: 0.72rem;
  outline: none;
  text-align: center;
}

.${t}-prop-input:focus {
  border-color: var(${n}-accent);
  box-shadow: 0 0 0 2px var(${n}-accent-soft);
}

.${t}-prop-input::placeholder {
  color: var(${n}-muted);
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
  background: var(${n}-accent-soft);
  padding: 0.15rem 0.35rem;
  color: var(${n}-accent-dark);
  font-family: var(${n}-font-mono);
  font-size: 0.68rem;
  white-space: nowrap;
}

.${t}-change strong {
  color: var(${n}-accent);
}

/* ---- List ---- */
.${t}-list {
  display: grid;
  max-height: min(30rem, calc(100vh - 12rem));
  max-height: min(30rem, calc(100dvh - 12rem));
  overflow-y: auto;
  padding-block: 0.35rem;
}

/* ---- Handoff bar (batch copy CTA pinned under the list) ---- */
.${t}-handoff-bar {
  padding: 0.6rem 1rem 0.85rem;
  border-top: 1px solid var(${n}-line);
}

.${t}-handoff {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.7rem;
  background: linear-gradient(135deg, var(${n}-accent), var(${n}-accent-dark));
  color: var(${n}-on-accent);
  box-shadow: 0 2px 10px color-mix(in srgb, var(${n}-accent) 25%, transparent),
              0 1px 3px rgba(0, 0, 0, 0.06);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow 200ms ease, transform 200ms ease;
}

.${t}-handoff:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px color-mix(in srgb, var(${n}-accent) 32%, transparent),
              0 1px 3px rgba(0, 0, 0, 0.06);
}

.${t}-handoff:active {
  transform: translateY(0);
}

.${t}-handoff svg {
  width: 1rem;
  height: 1rem;
}

.${t}-empty {
  padding: 0.75rem 0.65rem;
  color: var(${n}-muted);
  font-size: 0.86rem;
}

.${t}-item {
  display: grid;
  gap: 0.35rem;
  border-bottom: 1px solid var(${n}-line);
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
  box-shadow: inset 0 2px 0 0 var(${n}-accent);
}

.${t}-item.is-drop-after {
  box-shadow: inset 0 -2px 0 0 var(${n}-accent);
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
  color: var(${n}-muted);
  cursor: grab;
  opacity: 0.35;
  transition: opacity 140ms ease, color 140ms ease;
}

.${t}-drag-handle:hover {
  opacity: 1;
  color: var(${n}-accent);
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
  color: var(${n}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
}

.${t}-item-actions button:hover {
  background: var(${n}-surface-muted);
  color: var(${n}-ink);
}

.${t}-item-actions button.is-resolve {
  color: var(${n}-accent-dark);
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
  color: var(${n}-success);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.${t}-item strong {
  overflow: hidden;
  color: var(${n}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${t}-item time {
  color: var(${n}-muted);
  font-family: var(${n}-font-mono);
  font-size: 0.72rem;
}

.${t}-item code,
.${t}-item-context {
  display: block;
  overflow: hidden;
  color: var(${n}-muted);
  font-size: 0.75rem;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${t}-item code {
  font-family: var(${n}-font-mono);
}

.${t}-item p {
  color: var(${n}-foreground);
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
  border: 2px solid var(${n}-accent);
  background: var(${n}-accent-soft);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85) inset;
}

.${t}-highlight.is-selected {
  background: transparent;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.85) inset,
    0 0 0 4px color-mix(in srgb, var(${n}-accent) 18%, transparent);
}

.${t}-element-label {
  position: fixed;
  display: flex;
  flex-direction: column;
  max-width: 15rem;
  gap: 0.1rem;
  overflow: hidden;
  border-radius: 0.38rem;
  background: var(${n}-accent);
  padding: 0.32rem 0.45rem;
  color: #fff;
  font-family: var(${n}-font-mono);
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
    box-shadow: 0 2px 12px color-mix(in srgb, var(${n}-accent) 28%, transparent),
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
`}var B=ae("pm"),U=le("pm");var C=null;function E(){if(C)return C;if(typeof window>"u")return null;try{return window.localStorage.getItem(L)}catch{return null}}function I(t){let n=t.trim();if(n){C=n;try{window.localStorage.setItem(L,n)}catch{}}}function ce(){C=null;try{window.localStorage.removeItem(L)}catch{}}function de(){if(!(typeof window>"u"))try{let t=new URL(window.location.href),n=t.searchParams.get(_);if(!n)return;I(n),t.searchParams.delete(_),window.history.replaceState(null,"",t)}catch{}}de();var he=1200,pe=["font-size","line-height","padding","margin","border-radius","gap","width","height","color","background-color"];function ue(t,n){let e=t.getPropertyValue(`${n}-top`),o=t.getPropertyValue(`${n}-right`),r=t.getPropertyValue(`${n}-bottom`),s=t.getPropertyValue(`${n}-left`);return e===o&&o===r&&r===s?e:e===r&&s===o?`${e} ${o}`:`${e} ${o} ${r} ${s}`}function me(t,n){return n==="padding"||n==="margin"?ue(t,n):t.getPropertyValue(n)}var p={crosshair:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>',list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',annotate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',grip:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>',chevronUp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',chevronDown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',chevronLeft:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'};function ge(t){let n=t.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);if(!n)return t;let e=o=>o.toString(16).padStart(2,"0");return`#${e(parseInt(n[1]))}${e(parseInt(n[2]))}${e(parseInt(n[3]))}`.toUpperCase()}function W(t){let n=window.getComputedStyle(t);return{color:ge(n.color),fontSize:n.fontSize,fontFamily:n.fontFamily.split(",")[0].replace(/['"]/g,"").trim()}}var J=!1;function ve(){if(J||typeof document>"u")return;let t=document.createElement("style");t.setAttribute(V,"global"),t.textContent=B,document.head.appendChild(t),J=!0}var fe=typeof HTMLElement>"u"?class{}:HTMLElement,T=class extends fe{constructor(){super(...arguments);this.store=R();this.labels={...j};this.onError=null;this._theme={};this.mode="closed";this.hoveredTarget=null;this.selectedTarget=null;this.message="";this.annotations=[];this.isLoading=!1;this.isSubmitting=!1;this.status=null;this.statusType=null;this.locatedTarget=null;this.selectedElement=null;this.selectionPath=[];this.dodgeX=0;this.launcherCollapsed=!1;this.launcherFloating=!1;this.launcherPos=null;this.dragState=null;this.suppressNextClick=!1;this.showProperties=!1;this.propertyChanges={};this.dragSrcId=null;this.dragOverId=null;this.dragOverPos="before";this.shadow=null;this.overlayEl=null;this.panelEl=null;this.launcherEl=null;this.boundMove=null;this.boundClick=null;this.boundKeyDown=null;this.pointerRef=null;this.refreshHover=()=>{this.pointerRef&&(this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId),this.rafId=window.requestAnimationFrame(()=>{this.pointerRef&&(this.hoveredTarget=this.getTargetAtPoint(this.pointerRef.clientX,this.pointerRef.clientY),this.updateOverlay())}))};this.refreshSelected=()=>{this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId),this.rafId=window.requestAnimationFrame(()=>this.updateOverlay())};this.boundLauncherMove=e=>{if(!this.dragState||!this.launcherEl)return;let o=e.clientX-this.dragState.startX,r=e.clientY-this.dragState.startY;if(!this.dragState.moved&&Math.hypot(o,r)<4)return;this.dragState.moved||(this.dragState.moved=!0,this.launcherFloating=!0,this.launcherEl.classList.add("is-floating","is-dragging"));let s=this.dragState.originX+o,a=this.dragState.originY+r;this.launcherPos={x:s,y:a},this.launcherEl.style.left=`${s}px`,this.launcherEl.style.top=`${a}px`,this.launcherEl.style.right=""};this.boundLauncherUp=()=>{if(document.removeEventListener("pointermove",this.boundLauncherMove),document.removeEventListener("pointerup",this.boundLauncherUp),!this.dragState)return;let e=this.dragState.moved;this.launcherEl?.classList.remove("is-dragging"),this.dragState=null,e&&(this.suppressNextClick=!0,this.launcherPos&&this.launcherEl&&this.snapToEdge()?this.collapseLauncher():this.persistLauncherState())}}get theme(){return this._theme}set theme(e){this._theme=e??{},this.applyTheme()}get themeName(){return this.getAttribute(x)??"blue"}set themeName(e){e?this.setAttribute(x,e):this.removeAttribute(x)}static get observedAttributes(){return["accent",$,w,y]}attributeChangedCallback(e,o,r){e==="accent"&&this.shadow&&this.style.setProperty(`${g}-accent`,r),e===$&&this.updateVisibility(),e===y&&this.applyDodgeSign()}get visible(){return this.hasAttribute($)}set visible(e){e?this.setAttribute($,""):this.removeAttribute($)}get requireAuth(){return this.hasAttribute(w)}set requireAuth(e){e?this.setAttribute(w,""):this.removeAttribute(w)}get position(){return this.getAttribute(y)??"right-center"}set position(e){e?this.setAttribute(y,e):this.removeAttribute(y)}get dockSide(){return this.position.startsWith("left")?"left":"right"}applyDodgeSign(){this.style.setProperty(`${g}-dodge-sign`,this.dockSide==="left"?"1":"-1")}applyTheme(){if(!this.shadow)return;let e=(o,r)=>{r?this.style.setProperty(o,r):this.style.removeProperty(o)};e(`${g}-accent`,this._theme.accent),e(`${g}-accent-dark`,this._theme.accentDark),e(`${g}-accent-soft`,this._theme.accentSoft)}updateVisibility(){let e=this.visible;this.launcherEl&&(this.launcherEl.style.display=e?"":"none"),!e&&this.mode!=="closed"&&this.closeTool()}connectedCallback(){ve(),this.shadow=this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=U,this.shadow.appendChild(e),this.overlayEl=document.createElement("div"),this.overlayEl.className=`${"pm"}-overlay`,this.overlayEl.style.display="none",this.overlayEl.setAttribute(O,""),this.shadow.appendChild(this.overlayEl),this.panelEl=document.createElement("div"),this.panelEl.className=`${"pm"}-panel`,this.panelEl.style.display="none",this.panelEl.setAttribute(O,""),this.shadow.appendChild(this.panelEl),this.launcherEl=document.createElement("button"),this.launcherEl.className=`${"pm"}-launcher`,this.launcherEl.type="button",this.setupLauncherInteraction(),this.shadow.appendChild(this.launcherEl),this.restoreLauncherState(),this.panelEl.addEventListener("click",o=>this.handlePanelClick(o)),this.panelEl.addEventListener("input",o=>this.handlePanelInput(o)),this.panelEl.addEventListener("keydown",o=>this.handlePanelKeyDown(o)),this.panelEl.addEventListener("mousedown",o=>this.handleDragHandleDown(o)),this.panelEl.addEventListener("mouseup",()=>this.resetDraggable()),this.panelEl.addEventListener("dragstart",o=>this.handleDragStart(o)),this.panelEl.addEventListener("dragover",o=>this.handleDragOver(o)),this.panelEl.addEventListener("drop",o=>this.handleDrop(o)),this.panelEl.addEventListener("dragend",()=>this.handleDragEnd()),this.applyTheme(),this.applyDodgeSign(),this.updateVisibility(),this.updatePanel()}disconnectedCallback(){this.cleanupPicking(),this.cleanupComposeTracking(),this.removeKeyDownListener(),window.clearTimeout(this.locateTimeout),this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId)}open(){this.openTool()}close(){this.closeTool()}openTool(){if(this.requireAuth&&!E()){this.mode="locked",this.status=null,this.statusType=null,this.updateOverlay(),this.updatePanel();return}this.startPicking()}closeTool(){this.mode="closed",this.hoveredTarget=null,this.selectedTarget=null,this.selectedElement=null,this.pointerRef=null,this.message="",this.status=null,this.statusType=null,this.showProperties=!1,this.propertyChanges={},this.cleanupPicking(),this.cleanupComposeTracking(),this.setDodgeSide("dock"),this.updateOverlay(),this.updatePanel()}startPicking(){this.mode="picking",this.hoveredTarget=null,this.selectedTarget=null,this.selectedElement=null,this.pointerRef=null,this.message="",this.status=null,this.statusType=null,this.showProperties=!1,this.propertyChanges={},this.cleanupComposeTracking(),this.setupPicking(),this.updateOverlay(),this.updatePanel()}async openList(){this.mode="list",this.cleanupPicking(),this.cleanupComposeTracking(),this.updateOverlay(),this.updatePanel(),await this.loadAnnotations()}setupPicking(){this.boundMove=e=>this.handleMove(e),this.boundClick=e=>this.handleClick(e),this.boundKeyDown=e=>this.handleKeyDown(e),document.addEventListener("mousemove",this.boundMove,!0),document.addEventListener("click",this.boundClick,!0),document.addEventListener("keydown",this.boundKeyDown),window.addEventListener("scroll",this.refreshHover,!0),window.addEventListener("resize",this.refreshHover),document.documentElement.classList.add(D)}cleanupPicking(){document.documentElement.classList.remove(D),this.panelEl?.classList.remove("is-ghost"),this.boundMove&&document.removeEventListener("mousemove",this.boundMove,!0),this.boundClick&&document.removeEventListener("click",this.boundClick,!0),this.boundKeyDown&&document.removeEventListener("keydown",this.boundKeyDown),window.removeEventListener("scroll",this.refreshHover,!0),window.removeEventListener("resize",this.refreshHover),this.boundMove=null,this.boundClick=null,this.boundKeyDown=null,this.rafId!==void 0&&(window.cancelAnimationFrame(this.rafId),this.rafId=void 0)}getTargetAtPoint(e,o){let r=document.elementFromPoint(e,o);if(!(r instanceof HTMLElement)||r.closest(v))return null;let s=r.getBoundingClientRect();return s.width<2||s.height<2?null:{...P(r),viewportRect:s,hoverInfo:W(r)}}handleMove(e){this.pointerRef={clientX:e.clientX,clientY:e.clientY},this.updatePickingGhost(e.clientX,e.clientY),this.hoveredTarget=this.getTargetAtPoint(e.clientX,e.clientY),this.updateOverlay()}updatePickingGhost(e,o){if(!this.panelEl||this.panelEl.style.display==="none")return;let r=this.panelEl.getBoundingClientRect(),s=this.panelEl.querySelector(`.${"pm"}-panel-header`),a=s?s.getBoundingClientRect().bottom:r.top,c=e>=r.left&&e<=r.right&&o>=a&&o<=r.bottom;this.panelEl.classList.toggle("is-ghost",c)}handleClick(e){let o=this.getTargetAtPoint(e.clientX,e.clientY);if(!o)return;e.preventDefault(),e.stopPropagation(),this.selectedTarget=K(o);let r=document.elementFromPoint(e.clientX,e.clientY);this.selectedElement=r instanceof HTMLElement?r:null,this.selectionPath=[],this.hoveredTarget=null,this.showProperties=!1,this.propertyChanges={},this.mode="compose",this.cleanupPicking(),this.setupComposeTracking(),this.updateOverlay(),this.updatePanel();let s=this.panelEl?.querySelector("textarea");s&&s.focus()}handleKeyDown(e){e.key==="Escape"&&this.closeTool()}setupComposeTracking(){window.addEventListener("scroll",this.refreshSelected,!0),window.addEventListener("resize",this.refreshSelected)}cleanupComposeTracking(){window.removeEventListener("scroll",this.refreshSelected,!0),window.removeEventListener("resize",this.refreshSelected)}canExpandSelection(){let e=this.selectedElement?.parentElement;return!!e&&e!==document.documentElement&&!e.closest(v)}canShrinkSelection(){if(this.selectionPath.length>0)return!0;let e=this.selectedElement?.firstElementChild;return e instanceof HTMLElement&&!e.closest(v)}expandSelection(){let e=this.selectedElement;!e||!this.canExpandSelection()||(this.selectionPath.push(e),this.applySelectedElement(e.parentElement))}shrinkSelection(){let e=this.selectionPath.pop();if(e?.isConnected){this.applySelectedElement(e);return}let o=this.selectedElement?.firstElementChild;o instanceof HTMLElement&&!o.closest(v)&&this.applySelectedElement(o)}applySelectedElement(e){this.selectedElement=e,this.selectedTarget=P(e),this.propertyChanges={},this.updateOverlay(),this.updatePanel()}setDodgeSide(e){if(e==="dock"){if(this.dodgeX===0)return;this.dodgeX=0,this.style.setProperty(`${g}-dodge-x`,"0px");return}if(this.dodgeX>0)return;let o=this.panelEl&&this.panelEl.style.display!=="none"?this.panelEl:this.launcherEl;if(!o)return;let r=20,s=o.getBoundingClientRect(),a=this.dockSide==="right"?Math.round(s.left-r):Math.round(window.innerWidth-s.right-r);a<=r||(this.dodgeX=a,this.style.setProperty(`${g}-dodge-x`,`${a}px`))}updateComposeDodge(e){if(!this.panelEl||window.innerWidth<=640)return;let o=this.panelEl.getBoundingClientRect();if(!(e.right>o.left&&e.left<o.right&&e.bottom>o.top&&e.top<o.bottom))return;let s=(e.left+e.right)/2,a=this.dockSide==="right"?s>window.innerWidth/2:s<window.innerWidth/2;this.setDodgeSide(a?"away":"dock")}removeKeyDownListener(){this.boundKeyDown&&(document.removeEventListener("keydown",this.boundKeyDown),this.boundKeyDown=null)}reportError(e,o){let r=e instanceof Error?e:new Error(String(e));if(this.onError)try{this.onError(r,o)}catch{}else console.warn(`[patch-mark] ${o.operation} failed:`,r)}handleStoreError(e,o){return this.reportError(e,o),be(e)?(this.mode="locked",this.status=this.labels.lockedError??"\u4EE4\u724C\u65E0\u6548\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u83B7\u53D6\u3002",this.statusType="error",this.cleanupPicking(),this.cleanupComposeTracking(),this.updateOverlay(),this.updatePanel(),!0):!1}async loadAnnotations(){this.isLoading=!0,this.status=null,this.statusType=null,this.updatePanel();try{let e=window.location.pathname;this.annotations=await this.store.list(e)}catch(e){this.handleStoreError(e,{operation:"list"})||(this.status=e instanceof Error?e.message:this.labels.loading,this.statusType="error")}finally{this.isLoading=!1,this.updatePanel()}}getChanges(){return Object.entries(this.propertyChanges).map(([e,{from:o,to:r}])=>({property:e,from:o,to:r}))}async submitAnnotation(){if(!(!this.selectedTarget||!this.message.trim()||this.isSubmitting)){this.isSubmitting=!0,this.status=null,this.statusType=null,this.updatePanel();try{let e=await this.store.create({pagePath:window.location.pathname,pageTitle:document.title,message:this.message.trim(),element:this.selectedTarget,changes:this.getChanges()});this.annotations=[e,...this.annotations],this.message="",this.selectedTarget=null,this.selectedElement=null,this.mode="list",this.cleanupComposeTracking(),this.updateOverlay()}catch(e){this.handleStoreError(e,{operation:"create"})||(this.status=e instanceof Error?e.message:"Failed to submit.",this.statusType="error")}finally{this.isSubmitting=!1,this.updatePanel()}}}locateAnnotation(e){let o=null;try{o=document.querySelector(e.element.selector)}catch{o=null}if(!(o instanceof HTMLElement)){this.status=this.labels.notFound,this.statusType="error",this.updatePanel();return}o.scrollIntoView({behavior:"smooth",block:"center"}),window.clearTimeout(this.locateTimeout),this.locateTimeout=window.setTimeout(()=>{o?.isConnected&&(this.locatedTarget={...P(o),viewportRect:o.getBoundingClientRect(),hoverInfo:W(o)},this.updateOverlay(),this.locateTimeout=window.setTimeout(()=>{this.locatedTarget=null,this.updateOverlay()},1800))},350)}async resolveAnnotation(e){if(this.store.update)try{let o=await this.store.update(e,{status:"resolved"});this.annotations=this.annotations.map(r=>r.id===e?o:r),this.updatePanel()}catch(o){this.handleStoreError(o,{operation:"resolve",annotationId:e})||(this.status=o instanceof Error?o.message:"Failed to resolve.",this.statusType="error",this.updatePanel())}}async unlock(e){I(e),await this.openList()}handleDragHandleDown(e){let r=e.target.closest("[data-drag-handle]");if(!r)return;let s=r.closest(`.${"pm"}-item`);s instanceof HTMLElement&&(s.draggable=!0)}resetDraggable(){this.panelEl&&this.panelEl.querySelectorAll(`.${"pm"}-item[draggable="true"]`).forEach(e=>{e.draggable=!1})}handleDragStart(e){let o=e.target.closest(`.${"pm"}-item`);if(!o)return;let r=o.getAttribute("data-annotation-id");r&&(this.dragSrcId=r,o.classList.add("is-dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",r)))}handleDragOver(e){if(!this.dragSrcId)return;let o=e.target.closest(`.${"pm"}-item`);if(!o)return;let r=o.getAttribute("data-annotation-id");if(!r||r===this.dragSrcId)return;e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");let s=o.getBoundingClientRect(),a=s.top+s.height/2,c=e.clientY<a?"before":"after";this.clearDragIndicators(),this.dragOverId=r,this.dragOverPos=c,o.classList.add(c==="before"?"is-drop-before":"is-drop-after")}clearDragIndicators(){this.panelEl&&(this.panelEl.querySelectorAll(".is-drop-before, .is-drop-after").forEach(e=>{e.classList.remove("is-drop-before","is-drop-after")}),this.dragOverId=null)}async handleDrop(e){if(e.preventDefault(),!this.dragSrcId||!this.dragOverId){this.handleDragEnd();return}let o=this.dragSrcId,r=this.dragOverId,s=this.dragOverPos,a=[...this.annotations],c=a.findIndex(h=>h.id===o);if(c===-1){this.handleDragEnd();return}let[u]=a.splice(c,1),d=a.findIndex(h=>h.id===r);if(d===-1){this.handleDragEnd();return}if(s==="after"&&d++,a.splice(d,0,u),this.annotations=a,this.store.reorder)try{await this.store.reorder(a.map(h=>h.id))}catch(h){this.handleStoreError(h,{operation:"reorder"})}this.handleDragEnd(),this.updatePanel()}handleDragEnd(){this.panelEl&&(this.panelEl.querySelectorAll(".is-dragging").forEach(e=>{e.classList.remove("is-dragging")}),this.clearDragIndicators(),this.resetDraggable()),this.dragSrcId=null,this.dragOverId=null}async copyAsPrompt(e){let o;if(e){let r=this.annotations.find(s=>s.id===e);if(!r)return;o=k(r)}else this.selectedTarget?o=k({id:"preview",pagePath:window.location.pathname,pageTitle:document.title,message:this.message.trim()||"(no message)",element:this.selectedTarget,createdAt:new Date().toISOString(),status:"open",changes:this.getChanges()}):o=N(this.annotations,window.location.pathname);await this.writeClipboard(o)}async writeClipboard(e){try{await navigator.clipboard.writeText(e),this.status=this.labels.copied,this.statusType="success"}catch{let o=document.createElement("textarea");o.value=e,o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.select();try{document.execCommand("copy"),this.status=this.labels.copied,this.statusType="success"}catch{this.status="Copy failed",this.statusType="error"}document.body.removeChild(o)}this.updatePanel(),this.statusType==="success"&&window.setTimeout(()=>{this.status===this.labels.copied&&(this.status=null,this.statusType=null,this.updatePanel())},1500)}async copyHandoff(){let e=`${window.location.origin}${window.location.pathname}`;await this.writeClipboard(F(this.annotations,e,this.store.source))}setupLauncherInteraction(){this.launcherEl&&(this.launcherEl.addEventListener("pointerdown",e=>this.onLauncherPointerDown(e)),this.launcherEl.addEventListener("click",e=>{if(e.target.closest(`.${"pm"}-collapse-btn`)){e.stopPropagation(),this.collapseLauncher();return}if(this.suppressNextClick){this.suppressNextClick=!1;return}if(this.launcherCollapsed){this.expandLauncher();return}this.mode!=="closed"?this.closeTool():this.openTool()}))}onLauncherPointerDown(e){if(this.launcherCollapsed||e.button!==0||!this.launcherEl)return;let o=this.launcherEl.getBoundingClientRect();this.dragState={startX:e.clientX,startY:e.clientY,moved:!1,originX:o.left,originY:o.top},document.addEventListener("pointermove",this.boundLauncherMove),document.addEventListener("pointerup",this.boundLauncherUp)}snapToEdge(){if(!this.launcherEl||!this.launcherPos)return!1;let e=this.launcherEl.getBoundingClientRect(),o=this.launcherPos.x+e.width/2,r=60;return o<r||o>window.innerWidth-r}collapseLauncher(){this.launcherCollapsed||(this.mode==="picking"&&this.closeTool(),this.launcherCollapsed=!0,this.updatePanel(),this.updateOverlay(),this.persistLauncherState())}expandLauncher(){!this.launcherCollapsed||!this.launcherEl||(this.launcherCollapsed=!1,this.launcherFloating&&this.launcherPos?(this.launcherEl.style.left=`${this.launcherPos.x}px`,this.launcherEl.style.top=`${this.launcherPos.y}px`,this.launcherEl.style.right=""):(this.launcherEl.style.left="",this.launcherEl.style.top="",this.launcherEl.style.right=""),this.updatePanel(),this.updateOverlay(),this.persistLauncherState())}persistLauncherState(){try{localStorage.setItem("patch-mark:launcher",JSON.stringify({collapsed:this.launcherCollapsed,floating:this.launcherFloating,pos:this.launcherPos}))}catch{}}restoreLauncherState(){if(this.launcherEl)try{let e=localStorage.getItem("patch-mark:launcher");if(!e)return;let o=JSON.parse(e);o.floating&&o.pos&&(this.launcherFloating=!0,this.launcherPos=o.pos,this.launcherEl.classList.add("is-floating"),this.launcherEl.style.left=`${o.pos.x}px`,this.launcherEl.style.top=`${o.pos.y}px`),o.collapsed&&this.collapseLauncher()}catch{}}handlePanelClick(e){let o=e.target.closest("[data-action]");if(!o)return;let r=o.getAttribute("data-action"),s=o.getAttribute("data-id");switch(r){case"pick":this.startPicking();break;case"list":this.openList();break;case"close":this.closeTool();break;case"send":this.submitAnnotation();break;case"reselect":this.startPicking();break;case"locate":if(s){let a=this.annotations.find(c=>c.id===s);a&&this.locateAnnotation(a)}break;case"copy":this.copyAsPrompt(s||void 0);break;case"copy-handoff":this.copyHandoff();break;case"resolve":s&&this.resolveAnnotation(s);break;case"unlock":{let a=this.panelEl?.querySelector(`.${"pm"}-locked-input`),c=a instanceof HTMLInputElement?a.value.trim():"";c&&this.unlock(c);break}case"toggle-properties":this.showProperties=!this.showProperties,this.updatePanel();break;case"expand-selection":this.expandSelection();break;case"shrink-selection":this.shrinkSelection();break}}handlePanelKeyDown(e){if(e.key!=="Enter")return;let o=e.target;if(o instanceof HTMLInputElement&&o.classList.contains(`${"pm"}-locked-input`)){let r=o.value.trim();r&&this.unlock(r)}}handlePanelInput(e){let o=e.target;if(o.tagName==="TEXTAREA"){this.message=o.value;let r=this.panelEl?.querySelector('button[data-action="send"]');r&&(r.disabled=!this.message.trim()||this.isSubmitting)}else if(o.tagName==="INPUT"&&o.hasAttribute("data-property")){let r=o.getAttribute("data-property"),s=o.getAttribute("data-original"),a=o.value.trim();a&&a!==s?this.propertyChanges[r]={from:s,to:a}:delete this.propertyChanges[r];let c=o.closest(`.${"pm"}-prop-row`);c&&c.classList.toggle("is-changed",!!this.propertyChanges[r]),this.updatePropToggleBadge()}}updatePropToggleBadge(){let e=this.panelEl?.querySelector(`.${"pm"}-prop-toggle`);if(!e)return;let o=Object.keys(this.propertyChanges).length,r=o>0?`<span class="${"pm"}-prop-count">${o}</span>`:"",s=this.showProperties?" \u2713":"";e.innerHTML=`${l(this.labels.properties)}${s}${r}`}updateOverlay(){if(!this.overlayEl)return;if(this.launcherCollapsed){this.overlayEl.style.display="none",this.overlayEl.innerHTML="";return}if(this.mode==="compose"){this.renderSelectedOverlay();return}let e=this.mode==="picking"?this.hoveredTarget:this.locatedTarget;if(!e){this.overlayEl.style.display="none",this.overlayEl.innerHTML="";return}let{viewportRect:o}=e,r=e.hoverInfo?72:34,s=o.top>r+10?o.top-r:o.bottom+8,a=Math.min(Math.max(o.left,8),window.innerWidth-240);this.overlayEl.style.display="",this.overlayEl.innerHTML=`
      <div class="${"pm"}-highlight" style="top:${o.top}px;left:${o.left}px;width:${o.width}px;height:${o.height}px"></div>
      <div class="${"pm"}-element-label" style="top:${s}px;left:${a}px">
        <div class="${"pm"}-label-row">
          <strong>${l(e.name)}</strong>
          <span>${Math.round(o.width)} \xD7 ${Math.round(o.height)}</span>
        </div>
        ${e.hoverInfo?`
        <div class="${"pm"}-label-row">
          <span class="${"pm"}-label-key">${l(this.labels.colorLabel??"\u989C\u8272")}</span>
          <span>${l(e.hoverInfo.color)}</span>
        </div>
        <div class="${"pm"}-label-row">
          <span class="${"pm"}-label-key">${l(this.labels.fontLabel??"\u5B57\u4F53")}</span>
          <span>${l(e.hoverInfo.fontSize)} ${l(e.hoverInfo.fontFamily)}</span>
        </div>
        `:""}
      </div>
    `}renderSelectedOverlay(){if(!this.overlayEl)return;let e=this.selectedElement;if(!e||!e.isConnected||!this.selectedTarget){this.overlayEl.style.display="none",this.overlayEl.innerHTML="";return}let o=e.getBoundingClientRect();this.updateComposeDodge(o);let r=o.top>44?o.top-34:o.bottom+8,s=Math.min(Math.max(o.left,8),window.innerWidth-240);this.overlayEl.style.display="",this.overlayEl.innerHTML=`
      <div class="${"pm"}-highlight is-selected" style="top:${o.top}px;left:${o.left}px;width:${o.width}px;height:${o.height}px"></div>
      <div class="${"pm"}-element-label" style="top:${r}px;left:${s}px">
        <div class="${"pm"}-label-row">
          <strong>${l(this.selectedTarget.name)}</strong>
          <span>${Math.round(o.width)} \xD7 ${Math.round(o.height)}</span>
        </div>
      </div>
    `}updatePanel(){if(!this.panelEl||!this.launcherEl)return;if(this.launcherCollapsed){this.panelEl.style.display="none",this.panelEl.innerHTML="",this.launcherEl.classList.add("is-collapsed");let a=this.dockSide;this.launcherEl.style.left=a==="left"?"0.5rem":"",this.launcherEl.style.right=a==="right"?"0.5rem":"",this.launcherEl.style.top=`${Math.round(window.innerHeight/2-32)}px`,this.launcherEl.innerHTML=`${p.annotate}<span>${this.labels.picker}</span>`;return}this.launcherEl.classList.remove("is-collapsed");let e=this.mode!=="closed";this.launcherEl.classList.toggle("is-active",e);let o=`<span class="${"pm"}-collapse-btn" role="button" tabindex="0" data-action="collapse" aria-label="${l(this.labels.collapse??"\u6536\u8D77")}">${p.chevronLeft}</span>`;if(this.launcherEl.innerHTML=e?`${p.x}<span>${this.labels.close}</span>${o}`:`${p.annotate}<span>${this.labels.picker}</span>${o}`,!e){this.panelEl.style.display="none",this.panelEl.innerHTML="";return}this.panelEl.style.display="";let r=this.mode==="picking"||this.mode==="compose",s=this.mode==="list";this.panelEl.innerHTML=`
      <div class="${"pm"}-panel-header">
        <div class="${"pm"}-panel-tabs">
          <button type="button" class="${r?"is-active":""}" data-action="pick" role="tab" aria-selected="${r}">
            ${p.crosshair}
            ${l(this.labels.picker)}
          </button>
          <button type="button" class="${s?"is-active":""}" data-action="list" role="tab" aria-selected="${s}">
            ${p.list}
            ${l(this.labels.list)}
          </button>
        </div>
        <button type="button" class="${"pm"}-close" data-action="close" aria-label="${l(this.labels.close)}">
          ${p.x}
        </button>
      </div>
      ${this.renderPanelContent()}
    `}renderPanelContent(){switch(this.mode){case"picking":return this.renderPickerNote();case"compose":return this.renderCompose();case"list":return this.renderList();case"locked":return this.renderLocked();default:return""}}renderPickerNote(){return`
      <div class="${"pm"}-picker-note">
        ${p.crosshair}
        <p>${l(this.labels.picker)}</p>
        <span>${l(this.labels.pickerHint)}</span>
      </div>
    `}renderLocked(){let e=this.status?`<p class="${"pm"}-status is-error">${l(this.status)}</p>`:"";return`
      <div class="${"pm"}-locked">
        ${p.lock}
        <p>${l(this.labels.lockedTitle??"\u9700\u8981\u8BBF\u95EE\u4EE4\u724C")}</p>
        <span>${l(this.labels.lockedHint??"\u6B64\u9875\u9762\u7684\u6279\u6CE8\u529F\u80FD\u53D7\u4FDD\u62A4\uFF0C\u8BF7\u8F93\u5165\u5206\u4EAB\u94FE\u63A5\u4E2D\u7684\u8BBF\u95EE\u4EE4\u724C\u3002")}</span>
        <input
          type="text"
          class="${"pm"}-locked-input"
          placeholder="${l(this.labels.lockedPlaceholder??"\u7C98\u8D34\u4EE4\u724C\u2026")}"
          aria-label="${l(this.labels.lockedPlaceholder??"\u7C98\u8D34\u4EE4\u724C\u2026")}"
          spellcheck="false"
          autocomplete="off"
        />
        ${e}
        <button type="button" class="${"pm"}-send" data-action="unlock">
          ${l(this.labels.lockedSubmit??"\u89E3\u9501")}
          ${p.send}
        </button>
      </div>
    `}renderCompose(){if(!this.selectedTarget)return"";let e=this.status?`<p class="${"pm"}-status ${this.statusType==="success"?"is-success":"is-error"}">${l(this.status)}</p>`:"",o=Object.keys(this.propertyChanges).length,r=this.showProperties?`${this.labels.properties} \u2713`:this.labels.properties,s=o>0?`<span class="${"pm"}-prop-count">${o}</span>`:"";return`
      <div class="${"pm"}-compose">
        <div class="${"pm"}-target">
          <span>${l(this.labels.targetLabel)}</span>
          <strong>${l(this.selectedTarget.name)}</strong>
          <span class="${"pm"}-select-nav">
            <button type="button" class="${"pm"}-nav-btn" data-action="expand-selection" title="${l(this.labels.expandLabel??"\u6269\u5C55\u5230\u7236\u7EA7")}" aria-label="${l(this.labels.expandLabel??"\u6269\u5C55\u5230\u7236\u7EA7")}" ${this.canExpandSelection()?"":"disabled"}>
              ${p.chevronUp}
            </button>
            <button type="button" class="${"pm"}-nav-btn" data-action="shrink-selection" title="${l(this.labels.shrinkLabel??"\u6536\u7F29\u5230\u5B50\u7EA7")}" aria-label="${l(this.labels.shrinkLabel??"\u6536\u7F29\u5230\u5B50\u7EA7")}" ${this.canShrinkSelection()?"":"disabled"}>
              ${p.chevronDown}
            </button>
          </span>
          <button type="button" class="${"pm"}-prop-toggle ${this.showProperties?"is-active":""}" data-action="toggle-properties">
            ${l(r)}${s}
          </button>
        </div>
        ${this.showProperties?this.renderPropertyPanel():""}
        <textarea maxlength="${he}" placeholder="${l(this.labels.placeholder)}" aria-label="${l(this.labels.placeholder)}">${l(this.message)}</textarea>
        ${e}
        <div class="${"pm"}-compose-actions">
          <button type="button" class="${"pm"}-copy-btn" data-action="copy">
            ${p.copy}
            ${l(this.labels.copyAsPrompt)}
          </button>
          <span style="display:flex;gap:0.5rem;align-items:center">
            <button type="button" class="${"pm"}-back" data-action="reselect">${l(this.labels.reselect)}</button>
            <button type="button" class="${"pm"}-send" data-action="send" ${!this.message.trim()||this.isSubmitting?"disabled":""}>
              ${this.isSubmitting?l(this.labels.sending):l(this.labels.send)}
              ${p.send}
            </button>
          </span>
        </div>
      </div>
    `}renderPropertyPanel(){if(!this.selectedElement)return"";let e=window.getComputedStyle(this.selectedElement),o=pe.map(r=>{let s=me(e,r).trim(),a=this.propertyChanges[r],c=a?a.to:"";return`
        <div class="${"pm"}-prop-row ${a?"is-changed":""}">
          <span class="${"pm"}-prop-name">${l(r)}</span>
          <span class="${"pm"}-prop-current">${l(s)}</span>
          <input
            type="text"
            class="${"pm"}-prop-input"
            data-property="${l(r)}"
            data-original="${l(s)}"
            value="${l(c)}"
            placeholder="${a?l(a.to):"\u2192"}"
            spellcheck="false"
          />
        </div>`}).join("");return`
      <div class="${"pm"}-prop-panel">
        <p class="${"pm"}-prop-hint">${l(this.labels.propertiesHint)}</p>
        ${o}
      </div>
    `}renderList(){let e="";this.isLoading?e=`<p class="${"pm"}-empty">${l(this.labels.loading)}</p>`:this.status&&this.statusType==="error"&&this.annotations.length===0?e=`<p class="${"pm"}-status is-error">${l(this.status)}</p>`:this.annotations.length===0?e=`<p class="${"pm"}-empty">${l(this.labels.empty)}</p>`:e=this.annotations.map(a=>this.renderItem(a)).join("");let o=this.status&&(this.statusType==="success"||this.annotations.length>0)?`<p class="${"pm"}-status ${this.statusType==="success"?"is-success":"is-error"}">${l(this.status)}</p>`:"",r=this.annotations.filter(a=>a.status!=="resolved").length,s=!this.isLoading&&r>0?`<div class="${"pm"}-handoff-bar">
          <button type="button" class="${"pm"}-handoff" data-action="copy-handoff">
            ${p.send}<span>${l(this.labels.copyHandoff??"Copy handoff prompt")} \xB7 ${r}</span>
          </button>
        </div>`:"";return`
      <div class="${"pm"}-list">
        ${o}
        ${e}
      </div>
      ${s}
    `}renderItem(e){let o=e.status==="resolved",r=e.element.text?`<span class="${"pm"}-item-context">${l(this.labels.contentPrefix)}${l(e.element.text)}</span>`:"",s=e.changes&&e.changes.length>0?`<div class="${"pm"}-item-changes">${e.changes.map(u=>`<span class="${"pm"}-change">${l(u.property)}: ${l(u.from)} \u2192 <strong>${l(u.to)}</strong></span>`).join("")}</div>`:"",a=o?`<span class="${"pm"}-item-status">${p.check}${l(this.labels.resolved)}</span>`:"",c=!o&&this.store.update?`<button type="button" class="is-resolve" data-action="resolve" data-id="${e.id}">${p.check}${l(this.labels.resolve)}</button>`:"";return`
      <article class="${"pm"}-item ${o?"is-resolved":""}" data-annotation-id="${e.id}">
        <div class="${"pm"}-item-header">
          <div class="${"pm"}-item-title">
            <button type="button" class="${"pm"}-drag-handle" data-drag-handle aria-label="${l(this.labels.dragLabel??"\u62D6\u52A8\u6392\u5E8F")}">
              ${p.grip}
            </button>
            <strong>${l(e.element.name)}</strong>
          </div>
          <div class="${"pm"}-item-actions">
            <button type="button" data-action="copy" data-id="${e.id}">${p.copy}</button>
            <button type="button" data-action="locate" data-id="${e.id}">${p.crosshair}${l(this.labels.locate)}</button>
            ${c}
          </div>
        </div>
        <code title="${l(e.element.selector)}">${l(e.element.selector)}</code>
        <p>${l(e.message)}</p>
        ${s}
        ${r}
        ${a}
        <time datetime="${e.createdAt}">${Y(e.createdAt)}</time>
      </article>
    `}};function be(t){return t instanceof Error&&t.name==="PatchMarkAuthError"}function l(t){let n=document.createElement("div");return n.textContent=t,n.innerHTML}var M=class extends Error{constructor(n){super(n),this.name="PatchMarkAuthError"}};function S(t){let n=E();return n?Object.keys(t).some(o=>o.toLowerCase()==="authorization")?t:{authorization:`Bearer ${n}`,...t}:t}function A(t){if(t.status===401)throw new M("Access token missing or rejected (401)")}function $e(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function ye(t){let{endpoint:n,headers:e={}}=t,o={"content-type":"application/json",...e};return{source:{type:"rest",endpoint:n},async list(r){let s=`${n}?page=${encodeURIComponent(r)}`,a=await fetch(s,{cache:"no-store",headers:S(e)});if(A(a),!a.ok)throw new Error(`Failed to load annotations (${a.status})`);return(await a.json()).annotations??[]},async create(r){let s=await fetch(n,{method:"POST",headers:S(o),body:JSON.stringify(r)});if(A(s),!s.ok){let c=await s.json().catch(()=>({error:"Unknown error"}));throw new Error(c.error||`Failed to create annotation (${s.status})`)}return(await s.json()).annotation},async update(r,s){let a=await fetch(`${n}/${r}`,{method:"PATCH",headers:S(o),body:JSON.stringify(s)});if(A(a),!a.ok)throw new Error(`Failed to update annotation (${a.status})`);return(await a.json()).annotation},async delete(r){let s=await fetch(`${n}/${r}`,{method:"DELETE",headers:S(o)});if(A(s),!s.ok)throw new Error(`Failed to delete annotation (${s.status})`)},async reorder(r){let s=await fetch(`${n}/reorder`,{method:"POST",headers:S(o),body:JSON.stringify({ids:r})});if(A(s),!s.ok)throw new Error(`Failed to reorder annotations (${s.status})`)}}}function we(t){return{id:$e(),pagePath:t.pagePath,pageTitle:t.pageTitle,message:t.message,element:t.element,createdAt:new Date().toISOString(),status:"open",changes:t.changes}}typeof customElements<"u"&&!customElements.get(v)&&customElements.define(v,T);export{T as PatchMark,M as PatchMarkAuthError,ne as THEME_NAMES,oe as VERSION,ce as clearAuthToken,ye as createFetchStore,we as createLocalAnnotation,R as createLocalStorageStore,j as defaultLabels,k as formatAnnotationAsPrompt,N as formatAnnotationsAsPrompt,F as formatHandoffPrompt,E as getAuthToken,B as globalStyles,I as setAuthToken,U as shadowStyles};
