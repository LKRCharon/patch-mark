var ne="__reactFiber$";function X(n){return oe(n)??ie(n)??{}}function oe(n){let t=Object.keys(n).find(a=>a.startsWith(ne));if(!t)return;let e=n[t],o,r,i=0;for(;e&&i<30&&!(o&&r);)!r&&e._debugSource?.fileName&&(r=V(e._debugSource.fileName,e._debugSource.lineNumber)),o||(o=re(e.type)),e=e.return??void 0,i++;if(!(e===void 0&&i===0))return o||r?{component:o,source:r}:{}}function re(n){if(typeof n=="function"){let t=n;return t.displayName||t.name||void 0}if(typeof n=="object"&&n!==null){let t=n;return t.displayName||t.render?.name||t.type?.displayName||t.type?.name||void 0}}function ie(n){let t=n.__vueParentComponent,e=0;for(;t&&e<30;){let o=t.type,r=o?.name||o?.__name;if(r||o?.__file)return{component:r,source:o?.__file?V(o.__file):void 0};t=t.parent??void 0,e++}}function V(n,t){let e=n.replace(/\\/g,"/");if(!e.startsWith("src/")){let o=e.indexOf("/src/");if(o>=0)e=e.slice(o+1);else{let r=e.split("/").filter(Boolean);r.length>2&&(e=r.slice(-2).join("/"))}}return t?`${e}:${t}`:e}function w(n){let t=n.getBoundingClientRect(),e=n.tagName.toLowerCase(),o=se(n,e);return{tagName:e,name:o,selector:ae(n),text:(n.innerText||n.getAttribute("aria-label")||"").replace(/\s+/g," ").trim().slice(0,240),rect:{top:Math.round(t.top+window.scrollY),left:Math.round(t.left+window.scrollX),width:Math.round(t.width),height:Math.round(t.height)},...X(n)}}function Y(n){let{viewportRect:t,hoverInfo:e,...o}=n;return o}function se(n,t){if(n.id)return`#${n.id}`;let e=n.getAttribute("aria-label");if(e)return`${t}[aria-label="${e.slice(0,36)}"]`;let o=n.getAttribute("data-testid");if(o)return`[data-testid="${o}"]`;let r=n.parentElement?.closest("[id]");if(r?.id)return`#${r.id} \xB7 ${t}`;let i=Array.from(n.classList).filter(K).slice(0,2);return i.length?`${t}.${i.join(".")}`:t}function ae(n){if(n.id)return`#${CSS.escape(n.id)}`;let t=[],e=n;for(;e&&e!==document.body&&t.length<5;){if(e.id){t.unshift(`#${CSS.escape(e.id)}`);break}let o=e.tagName.toLowerCase(),r=e.getAttribute("data-testid");if(r){t.unshift(`[data-testid="${CSS.escape(r)}"]`);break}let i=Array.from(e.classList).filter(K).slice(0,2),a=Array.from(e.parentElement?.children??[]).filter(h=>h.tagName===e?.tagName),c=a.length>1?`:nth-of-type(${a.indexOf(e)+1})`:"";t.unshift(`${o}${i.map(h=>`.${CSS.escape(h)}`).join("")}${c}`),e=e.parentElement}return t.join(" > ")}function K(n){return n.length<48&&!/^(css-|[a-z]+-[A-Za-z0-9]{6,}|[a-zA-Z0-9_-]*\d{4,})/.test(n)}function q(n,t="zh-CN"){let e=new Date(n);return new Intl.DateTimeFormat(t,{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(e)}var f="patch-mark";var g="--pm",G="data-pm-global",_="data-pm-ui",R="pm-picker-active",W="patch-mark:annotations",$="visible",A="theme",E="require-auth",y="position",O="pm_token",L="patch-mark:token",le=["blue","violet","emerald","orange","rose"],ce="0.9.2";var J=1e3;function de(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function he(){try{let n="__patch_mark_test__";return localStorage.setItem(n,n),localStorage.removeItem(n),!0}catch{return!1}}function D(n){let t=n?.key??W,e=he(),o=[];function r(){return[...o]}function i(){try{let d=localStorage.getItem(t);if(!d)return[];let p=JSON.parse(d);return Array.isArray(p)?p.filter(pe):[]}catch{return[]}}function a(d){try{localStorage.setItem(t,JSON.stringify(d.slice(0,J)))}catch{}}function c(){return e?i():r()}function h(d){e?a(d):(o.length=0,o.push(...d.slice(0,J)))}return{async list(d){return c().filter(p=>p.pagePath===d)},async create(d){let p={id:de(),pagePath:d.pagePath,pageTitle:d.pageTitle,message:d.message,element:d.element,createdAt:new Date().toISOString(),status:"open",changes:d.changes},m=c();return m.unshift(p),h(m),p},async update(d,p){let m=c(),b=m.findIndex(H=>H.id===d);if(b===-1)throw new Error(`Annotation ${d} not found`);return m[b]={...m[b],...p},h(m),m[b]},async delete(d){let p=c().filter(m=>m.id!==d);h(p)},async reorder(d){let p=c(),m=new Set(d),b=d.map(v=>p.find(te=>te.id===v)).filter(v=>v!==void 0),H=0,ee=p.map(v=>m.has(v.id)?b[H++]??v:v);h(ee)}}}function pe(n){if(typeof n!="object"||n===null)return!1;let t=n;return typeof t.id=="string"&&typeof t.pagePath=="string"&&typeof t.message=="string"&&typeof t.createdAt=="string"&&typeof t.element=="object"&&t.element!==null}var F={picker:"\u6279\u6CE8",pickerHint:"\u60AC\u505C\u67E5\u770B\u8303\u56F4\uFF0C\u70B9\u51FB\u540E\u6DFB\u52A0\u8BC4\u8BED",compose:"\u6279\u6CE8",targetLabel:"\u76EE\u6807\u5143\u7D20",placeholder:"\u7559\u4E0B\u8BC4\u8BED\u2026",send:"\u53D1\u9001",sending:"\u53D1\u9001\u4E2D",reselect:"\u91CD\u9009",list:"\u5DF2\u6279\u6CE8",locate:"\u5B9A\u4F4D",close:"\u5173\u95ED\u6279\u6CE8",empty:"\u5F53\u524D\u9875\u9762\u8FD8\u6CA1\u6709\u6279\u6CE8\u3002",loading:"\u6B63\u5728\u8BFB\u53D6\u2026",notFound:"\u672A\u627E\u5230\u8BE5\u5143\u7D20\uFF0C\u9875\u9762\u7ED3\u6784\u53EF\u80FD\u5DF2\u7ECF\u6539\u52A8\u3002",contentPrefix:"\u5185\u5BB9\uFF1A",copyAsPrompt:"Copy as prompt",copyHandoff:"\u590D\u5236\u6D3E\u5355 prompt",copied:"\u5DF2\u590D\u5236",resolve:"\u89E3\u51B3",resolved:"\u5DF2\u89E3\u51B3",collapse:"\u6536\u8D77",properties:"\u5C5E\u6027",propertiesHint:"\u76F4\u63A5\u4FEE\u6539\u6570\u503C\uFF0C\u53CD\u9988\u7ED9 agent \u7CBE\u786E\u6307\u4EE4",colorLabel:"\u989C\u8272",fontLabel:"\u5B57\u4F53",dragLabel:"\u62D6\u52A8\u6392\u5E8F",expandLabel:"\u6269\u5C55\u5230\u7236\u7EA7",shrinkLabel:"\u6536\u7F29\u5230\u5B50\u7EA7",lockedTitle:"\u9700\u8981\u8BBF\u95EE\u4EE4\u724C",lockedHint:"\u6B64\u9875\u9762\u7684\u6279\u6CE8\u529F\u80FD\u53D7\u4FDD\u62A4\uFF0C\u8BF7\u8F93\u5165\u5206\u4EAB\u94FE\u63A5\u4E2D\u7684\u8BBF\u95EE\u4EE4\u724C\u3002",lockedPlaceholder:"\u7C98\u8D34\u4EE4\u724C\u2026",lockedSubmit:"\u89E3\u9501",lockedError:"\u4EE4\u724C\u65E0\u6548\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u83B7\u53D6\u3002"};function N(n){let t=n.element,e=[`- **Element:** \`<${t.tagName}>\``,`- **Selector:** \`${t.selector}\``,`- **Name:** ${t.name}`];if(t.component&&e.push(`- **Component:** \`<${t.component}>\``),t.source&&e.push(`- **Source:** ${t.source}`),t.text&&e.push(`- **Text:** "${t.text}"`),t.quote&&e.push(`- **Quote:** "${t.quote}"`),e.push(`- **Position:** top=${t.rect.top}, left=${t.rect.left}, ${t.rect.width}x${t.rect.height}`,`- **Page:** ${n.pagePath}`),n.pageTitle&&e.push(`- **Page Title:** ${n.pageTitle}`),e.push(`- **Feedback:** ${n.message}`),n.changes&&n.changes.length>0){e.push("","- **Property Changes:**");for(let o of n.changes)e.push(`  - \`${o.property}\`: ${o.from} \u2192 ${o.to}`)}return e}function k(n){let t=["## UI Feedback","",...N(n)];return n.status&&t.push(`- **Status:** ${n.status}`),t.join(`
`)}function j(n,t){if(n.length===0)return`## UI Feedback

No feedback items.`;let e=["## UI Feedback Report","",`- **Page:** ${t||n[0].pagePath}`,`- **Total Items:** ${n.length}`,"- **Captured:** "+new Date().toISOString(),"","---"],o=n.map((r,i)=>`### Feedback #${i+1}

${k(r)}`);return[...e,o.join(`

---

`)].join(`
`)}function z(n,t,e){let o=n.filter(c=>c.status!=="resolved");if(o.length===0)return`## UI Feedback

No open feedback items.`;let r=o[0].pagePath;if(e?.type==="rest"){let c=[`You are maintaining UI feedback annotations managed by patch-mark on ${t}.`,"","## Source of truth","Annotations live behind a REST API. Read the open items, fix each, then mark it resolved yourself \u2014 you own the lifecycle so nothing gets re-processed on the next pass.","",`- GET    ${e.endpoint}?page=${encodeURIComponent(r)}   \u2192 { annotations }  (process only status:"open")`,`- PATCH  ${e.endpoint}/{id}             \u2192 close an item with { "status": "resolved" }`,"","## Lifecycle rules",'- Only touch items with status "open". Already-resolved items are done \u2014 skip them.','- For each open item: locate the element in the codebase (grep the Selector\'s distinctive class/id, the visible Text, or the exact Quote; the Page field maps to the route), apply the Feedback ("Property Changes" are exact `property: from \u2192 to`), then PATCH that item resolved.',"- Don't pause for confirmation between items \u2014 fix and move on.","- When every open item is resolved, reply with a numbered summary: what changed per item and which files you touched.","",`## Open items (${o.length})`,""],h=o.map((d,p)=>`### ${p+1}. \`<${d.element.tagName}>\` \u2014 ${d.element.name}

- **ID:** \`${d.id}\`
${N(d).join(`
`)}`);return[...c,h.join(`

---

`)].join(`
`)}let i=["You are fixing a batch of UI feedback captured with patch-mark.","",`- **Page:** ${t}`,`- **Open Items:** ${o.length}`,"","How to work the batch:","1. Locate each element in the codebase: grep for a distinctive class or id from the Selector, for the visible Text, or for the exact Quote. The Page field maps to the route/component.",'2. Apply the Feedback. "Property Changes" lines are exact instructions (`property: from \u2192 to`); otherwise follow the Feedback text and match the project\'s existing styling conventions.',"3. Don't pause for confirmation between items \u2014 make the edit and move on.","","When finished, reply with a numbered summary: what changed per item and which files you touched. The user will verify in the browser and mark items resolved.","","---"],a=o.map((c,h)=>`### ${h+1}. \`<${c.element.tagName}>\` \u2014 ${c.element.name}

${N(c).join(`
`)}`);return[...i,a.join(`

---

`)].join(`
`)}function ue(n){let t=`${n}-picker-active`;return`
.${t},
.${t} * {
  cursor: crosshair !important;
}

/* Freeze CSS animations while picking so animated elements hold still as
   selection targets. Transitions are left alone: pausing them mid-flight
   would snap elements to their end state and change the page's look. */
.${t} * {
  animation-play-state: paused !important;
}
`}function me(n){let t=g;return`
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

  ${t}-accent: #0058d0;
  ${t}-accent-dark: #003f99;
  ${t}-accent-soft: rgba(0, 88, 208, 0.12);
  ${t}-ink: #0b1220;
  ${t}-muted: #506070;
  ${t}-foreground: #111827;
  ${t}-line: rgba(0, 54, 128, 0.14);
  ${t}-line-strong: rgba(0, 54, 128, 0.24);
  ${t}-panel-solid: #ffffff;
  ${t}-surface-muted: #eaf2ff;
  ${t}-on-accent: #ffffff;
  ${t}-font-mono: "IBM Plex Mono", "SFMono-Regular", "Consolas", monospace;
  ${t}-error: #b42318;
  ${t}-success: #087f5b;
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
  ${t}-accent: #7c3aed;
  ${t}-accent-dark: #5b21b6;
  ${t}-accent-soft: rgba(124, 58, 237, 0.12);
  ${t}-surface-muted: #f5f3ff;
  ${t}-line: rgba(76, 29, 149, 0.14);
  ${t}-line-strong: rgba(76, 29, 149, 0.24);
}

:host([theme="emerald"]) {
  ${t}-accent: #059669;
  ${t}-accent-dark: #065f46;
  ${t}-accent-soft: rgba(5, 150, 105, 0.12);
  ${t}-surface-muted: #ecfdf5;
  ${t}-line: rgba(6, 78, 59, 0.14);
  ${t}-line-strong: rgba(6, 78, 59, 0.24);
}

:host([theme="orange"]) {
  ${t}-accent: #ea580c;
  ${t}-accent-dark: #9a3412;
  ${t}-accent-soft: rgba(234, 88, 12, 0.12);
  ${t}-surface-muted: #fff7ed;
  ${t}-line: rgba(124, 45, 18, 0.14);
  ${t}-line-strong: rgba(124, 45, 18, 0.24);
}

:host([theme="rose"]) {
  ${t}-accent: #e11d48;
  ${t}-accent-dark: #9f1239;
  ${t}-accent-soft: rgba(225, 29, 72, 0.12);
  ${t}-surface-muted: #fff1f2;
  ${t}-line: rgba(136, 19, 55, 0.14);
  ${t}-line-strong: rgba(136, 19, 55, 0.24);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ---- Launcher button ---- */
.${n}-launcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: auto;
  padding: 0 0.9rem;
  border: none;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, var(${t}-accent), var(${t}-accent-dark));
  color: var(${t}-on-accent);
  box-shadow: 0 2px 12px color-mix(in srgb, var(${t}-accent) 28%, transparent),
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
  translate: calc(var(--${t}-dodge-sign, -1) * var(--${t}-dodge-x, 0px)) 0;
}

.${n}-launcher svg {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

.${n}-launcher span {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 150ms ease,
              margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.${n}-launcher:hover {
  border-radius: 1.5rem;
  box-shadow: 0 8px 28px color-mix(in srgb, var(${t}-accent) 38%, transparent),
              0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.${n}-launcher:hover span {
  max-width: 5rem;
  opacity: 1;
  margin-left: 0.5rem;
  transition: max-width 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 150ms ease 100ms,
              margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.${n}-launcher.is-active {
  background: var(${t}-accent-dark);
  box-shadow: 0 2px 8px color-mix(in srgb, var(${t}-accent-dark) 25%, transparent);
}

.${n}-launcher.is-active:hover {
  box-shadow: 0 6px 24px color-mix(in srgb, var(${t}-accent-dark) 35%, transparent),
              0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ---- Launcher: drag, collapse-to-edge, hover-peek ---- */
.${n}-launcher {
  position: relative;
}

.${n}-launcher.is-floating {
  position: fixed;
  translate: 0;
}

.${n}-launcher.is-dragging {
  transition: none;
  cursor: grabbing;
}

.${n}-launcher.is-collapsed {
  position: fixed;
  width: 0.5rem;
  min-width: 0;
  height: 4rem;
  padding: 0;
  border-radius: 0.4rem;
  overflow: hidden;
}

.${n}-launcher.is-collapsed > svg,
.${n}-launcher.is-collapsed > span {
  display: none;
}

.${n}-launcher.is-collapsed:hover {
  width: auto;
  padding: 0 0.9rem;
  border-radius: 0.9rem;
}

.${n}-launcher.is-collapsed:hover > svg {
  display: inline-flex;
}

.${n}-launcher.is-collapsed:hover > span {
  display: inline-flex;
  max-width: 5rem;
  opacity: 1;
  margin-left: 0.5rem;
}

.${n}-collapse-btn {
  position: absolute;
  top: -0.45rem;
  right: -0.45rem;
  width: 1.15rem;
  height: 1.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(${t}-panel-solid);
  color: var(${t}-accent);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
}

.${n}-launcher:hover .${n}-collapse-btn {
  opacity: 1;
  pointer-events: auto;
}

.${n}-launcher.is-collapsed .${n}-collapse-btn,
.${n}-launcher.is-dragging .${n}-collapse-btn {
  display: none;
}

.${n}-collapse-btn svg {
  width: 0.7rem;
  height: 0.7rem;
}

/* ---- Panel ---- */
.${n}-panel {
  /* Stack above the selection overlay (z-index 9999) so the compose/list
     panel isn't visually pierced by the highlight frame while typing. */
  position: relative;
  z-index: 10000;
  width: min(21rem, calc(100vw - 7.5rem));
  overflow: hidden;
  border: 1px solid var(--${t}-line-strong);
  border-radius: 1rem;
  background: var(${t}-panel-solid);
  box-shadow: 0 20px 56px rgba(7, 19, 33, 0.18);
  pointer-events: auto;
  cursor: auto;
  translate: calc(var(--${t}-dodge-sign, -1) * var(--${t}-dodge-x, 0px)) 0;
  transition: translate 260ms cubic-bezier(0.4, 0, 0.2, 1), opacity 160ms ease;
}

/* Picking mode: pointer over the panel body turns it into a ghost so the
   elements underneath stay hoverable and clickable */
.${n}-panel.is-ghost {
  /* Picking pointer-passes-through state: pointer-events:none does the
     actual pass-through; opacity just hints at it. Faint but visible. */
  opacity: 0.2;
  pointer-events: none;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .${n}-panel {
    background: var(${t}-panel-solid);
  }
}

.${n}-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(${t}-line);
  padding: 0.55rem 0.6rem 0.55rem 0.75rem;
}

.${n}-panel-tabs {
  display: flex;
  gap: 0.1rem;
}

.${n}-panel-tabs button,
.${n}-close,
.${n}-back,
.${n}-send,
.${n}-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  font: inherit;
}

.${n}-panel-tabs button {
  gap: 0.35rem;
  border-radius: 0.55rem;
  padding: 0.46rem 0.55rem;
  background: transparent;
  color: var(${t}-muted);
  font-size: 0.84rem;
  font-weight: 650;
  cursor: pointer;
}

.${n}-panel-tabs button svg {
  width: 0.9rem;
  height: 0.9rem;
}

.${n}-panel-tabs button:hover,
.${n}-panel-tabs button.is-active {
  background: var(${t}-accent-soft);
  color: var(${t}-accent-dark);
}

.${n}-close {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: transparent;
  color: var(${t}-muted);
  cursor: pointer;
}

.${n}-close:hover,
.${n}-back:hover {
  background: var(${t}-surface-muted);
  color: var(${t}-ink);
}

.${n}-close svg {
  width: 1rem;
  height: 1rem;
}

/* ---- Picker note ---- */
.${n}-picker-note,
.${n}-compose,
.${n}-list {
  padding: 1rem;
}

.${n}-picker-note {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.65rem;
  align-items: center;
}

.${n}-picker-note svg {
  width: 1.15rem;
  height: 1.15rem;
  color: var(${t}-accent);
}

.${n}-picker-note p,
.${n}-target span,
.${n}-target strong,
.${n}-status,
.${n}-empty,
.${n}-item p,
.${n}-item time {
  margin: 0;
}

.${n}-picker-note p {
  color: var(${t}-ink);
  font-size: 0.92rem;
  font-weight: 700;
}

.${n}-picker-note span {
  grid-column: 2;
  margin-top: 0.1rem;
  color: var(${t}-muted);
  font-size: 0.79rem;
  line-height: 1.45;
}

/* ---- Locked (access token) panel ---- */
.${n}-locked {
  display: grid;
  gap: 0.6rem;
  justify-items: start;
  padding: 1rem;
}

.${n}-locked > svg {
  width: 1.3rem;
  height: 1.3rem;
  color: var(${t}-accent);
}

.${n}-locked p {
  margin: 0;
  color: var(${t}-ink);
  font-size: 0.92rem;
  font-weight: 700;
}

.${n}-locked > span {
  color: var(${t}-muted);
  font-size: 0.79rem;
  line-height: 1.45;
}

.${n}-locked-input {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(${t}-line);
  border-radius: 0.45rem;
  padding: 0.5rem 0.6rem;
  outline: none;
  font: inherit;
  font-size: 0.84rem;
  color: var(${t}-ink);
  background: var(${t}-panel-solid);
}

.${n}-locked-input:focus {
  border-color: var(${t}-accent);
  box-shadow: 0 0 0 3px var(${t}-accent-soft);
}

.${n}-locked .${n}-send {
  justify-self: end;
}

/* ---- Compose ---- */
.${n}-target {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.22rem 0.5rem;
  margin-bottom: 0.75rem;
}

.${n}-target > span:first-child {
  width: 100%;
  color: var(${t}-muted);
  font-family: var(${t}-font-mono);
  font-size: 0.72rem;
}

.${n}-target > strong {
  flex: 1;
  overflow: hidden;
  color: var(${t}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${n}-compose textarea {
  display: block;
  width: 100%;
  min-height: 7.5rem;
  resize: vertical;
  border: 1px solid var(${t}-line-strong);
  border-radius: 0.7rem;
  outline: none;
  background: var(${t}-panel-solid);
  padding: 0.65rem 0.7rem;
  color: var(${t}-ink);
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
}

.${n}-compose textarea:focus {
  border-color: var(${t}-accent);
  box-shadow: 0 0 0 3px var(${t}-accent-soft);
}

.${n}-compose-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.${n}-back,
.${n}-send {
  min-height: 2.3rem;
  border-radius: 0.6rem;
  padding-inline: 0.75rem;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
}

.${n}-back {
  background: transparent;
  color: var(${t}-muted);
}

.${n}-send {
  gap: 0.4rem;
  background: var(${t}-accent);
  color: var(${t}-on-accent);
}

.${n}-send:hover:not(:disabled) {
  background: var(${t}-accent-dark);
}

.${n}-send:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.${n}-send svg {
  width: 0.9rem;
  height: 0.9rem;
}

.${n}-copy-btn {
  gap: 0.3rem;
  border: 1px solid var(${t}-line-strong);
  border-radius: 0.6rem;
  background: transparent;
  padding: 0.3rem 0.55rem;
  color: var(${t}-muted);
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
}

.${n}-copy-btn:hover {
  background: var(${t}-surface-muted);
  color: var(${t}-ink);
}

.${n}-copy-btn svg {
  width: 0.82rem;
  height: 0.82rem;
}

.${n}-status {
  margin-top: 0.6rem;
  font-size: 0.82rem;
  line-height: 1.45;
}

.${n}-status.is-error {
  color: var(${t}-error);
}

.${n}-status.is-success {
  color: var(${t}-success);
}

/* ---- Selection level navigation ---- */
.${n}-select-nav {
  display: inline-flex;
  flex: none;
  gap: 0.15rem;
}

.${n}-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid var(${t}-line-strong);
  border-radius: 0.4rem;
  background: transparent;
  padding: 0;
  color: var(${t}-muted);
  cursor: pointer;
  transition: all 140ms ease;
}

.${n}-nav-btn:hover:not(:disabled) {
  border-color: var(${t}-accent);
  background: var(${t}-accent-soft);
  color: var(${t}-accent-dark);
}

.${n}-nav-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.${n}-nav-btn svg {
  width: 0.85rem;
  height: 0.85rem;
}

/* ---- Property panel ---- */
.${n}-prop-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid var(${t}-line-strong);
  border-radius: 0.4rem;
  background: transparent;
  padding: 0.18rem 0.45rem;
  color: var(${t}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 650;
  cursor: pointer;
  transition: all 140ms ease;
}

.${n}-prop-toggle:hover {
  background: var(${t}-surface-muted);
  color: var(${t}-ink);
}

.${n}-prop-toggle.is-active {
  border-color: var(${t}-accent);
  background: var(${t}-accent-soft);
  color: var(${t}-accent-dark);
}

.${n}-prop-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.55rem;
  background: var(${t}-accent);
  color: var(${t}-on-accent);
  font-size: 0.66rem;
  font-weight: 700;
  padding: 0 0.2rem;
}

.${n}-prop-panel {
  margin-bottom: 0.75rem;
  border: 1px solid var(${t}-line);
  border-radius: 0.6rem;
  overflow: hidden;
}

.${n}-prop-hint {
  margin: 0;
  padding: 0.4rem 0.55rem;
  background: var(${t}-surface-muted);
  color: var(${t}-muted);
  font-size: 0.7rem;
  line-height: 1.35;
}

.${n}-prop-row {
  display: grid;
  grid-template-columns: 5.5rem 1fr 4.5rem;
  align-items: center;
  gap: 0.4rem;
  border-top: 1px solid var(${t}-line);
  padding: 0.32rem 0.55rem;
}

.${n}-prop-row.is-changed {
  background: var(${t}-accent-soft);
}

.${n}-prop-name {
  color: var(${t}-muted);
  font-family: var(${t}-font-mono);
  font-size: 0.72rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.${n}-prop-current {
  color: var(${t}-ink);
  font-family: var(${t}-font-mono);
  font-size: 0.74rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.7;
}

.${n}-prop-input {
  width: 100%;
  border: 1px solid var(${t}-line);
  border-radius: 0.3rem;
  background: var(${t}-panel-solid);
  padding: 0.18rem 0.3rem;
  color: var(${t}-accent-dark);
  font-family: var(${t}-font-mono);
  font-size: 0.72rem;
  outline: none;
  text-align: center;
}

.${n}-prop-input:focus {
  border-color: var(${t}-accent);
  box-shadow: 0 0 0 2px var(${t}-accent-soft);
}

.${n}-prop-input::placeholder {
  color: var(${t}-muted);
  opacity: 0.5;
}

/* ---- List changes ---- */
.${n}-item-changes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.${n}-change {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border-radius: 0.3rem;
  background: var(${t}-accent-soft);
  padding: 0.15rem 0.35rem;
  color: var(${t}-accent-dark);
  font-family: var(${t}-font-mono);
  font-size: 0.68rem;
  white-space: nowrap;
}

.${n}-change strong {
  color: var(${t}-accent);
}

/* ---- List ---- */
.${n}-list {
  display: grid;
  max-height: min(30rem, calc(100vh - 12rem));
  max-height: min(30rem, calc(100dvh - 12rem));
  overflow-y: auto;
  padding-block: 0.35rem;
}

/* ---- Handoff bar (batch copy CTA pinned under the list) ---- */
.${n}-handoff-bar {
  padding: 0.6rem 1rem 0.85rem;
  border-top: 1px solid var(${t}-line);
}

.${n}-handoff {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.7rem;
  background: linear-gradient(135deg, var(${t}-accent), var(${t}-accent-dark));
  color: var(${t}-on-accent);
  box-shadow: 0 2px 10px color-mix(in srgb, var(${t}-accent) 25%, transparent),
              0 1px 3px rgba(0, 0, 0, 0.06);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow 200ms ease, transform 200ms ease;
}

.${n}-handoff:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px color-mix(in srgb, var(${t}-accent) 32%, transparent),
              0 1px 3px rgba(0, 0, 0, 0.06);
}

.${n}-handoff:active {
  transform: translateY(0);
}

.${n}-handoff svg {
  width: 1rem;
  height: 1rem;
}

.${n}-empty {
  padding: 0.75rem 0.65rem;
  color: var(${t}-muted);
  font-size: 0.86rem;
}

.${n}-item {
  display: grid;
  gap: 0.35rem;
  border-bottom: 1px solid var(${t}-line);
  padding: 0.9rem 0.65rem;
}

.${n}-item:last-child {
  border-bottom: 0;
}

.${n}-item.is-resolved {
  opacity: 0.55;
}

.${n}-item.is-dragging {
  opacity: 0.3;
}

.${n}-item.is-drop-before {
  box-shadow: inset 0 2px 0 0 var(${t}-accent);
}

.${n}-item.is-drop-after {
  box-shadow: inset 0 -2px 0 0 var(${t}-accent);
}

.${n}-item.is-resolved .${n}-item-header strong {
  text-decoration: line-through;
}

.${n}-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.${n}-item-title {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
}

.${n}-drag-handle {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.3rem;
  background: transparent;
  padding: 0.15rem;
  color: var(${t}-muted);
  cursor: grab;
  opacity: 0.35;
  transition: opacity 140ms ease, color 140ms ease;
}

.${n}-drag-handle:hover {
  opacity: 1;
  color: var(${t}-accent);
}

.${n}-drag-handle:active {
  cursor: grabbing;
}

.${n}-drag-handle svg {
  width: 0.8rem;
  height: 0.8rem;
}

.${n}-item-actions {
  display: flex;
  gap: 0.2rem;
}

.${n}-item-actions button {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.25rem;
  border: 0;
  border-radius: 0.35rem;
  background: transparent;
  padding: 0.25rem 0.35rem;
  color: var(${t}-muted);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
}

.${n}-item-actions button:hover {
  background: var(${t}-surface-muted);
  color: var(${t}-ink);
}

.${n}-item-actions button.is-resolve {
  color: var(${t}-accent-dark);
}

.${n}-item-actions button svg {
  width: 0.78rem;
  height: 0.78rem;
}

.${n}-item-status {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(${t}-success);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.${n}-item strong {
  overflow: hidden;
  color: var(${t}-ink);
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${n}-item time {
  color: var(${t}-muted);
  font-family: var(${t}-font-mono);
  font-size: 0.72rem;
}

.${n}-item code,
.${n}-item-context {
  display: block;
  overflow: hidden;
  color: var(${t}-muted);
  font-size: 0.75rem;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.${n}-item code {
  font-family: var(${t}-font-mono);
}

.${n}-item p {
  color: var(${t}-foreground);
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* ---- Overlay ---- */
.${n}-overlay {
  position: fixed;
  z-index: 9999;
  inset: 0;
  pointer-events: none;
}

.${n}-highlight {
  position: fixed;
  border: 2px solid var(${t}-accent);
  background: var(${t}-accent-soft);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85) inset;
}

.${n}-highlight.is-selected {
  background: transparent;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.85) inset,
    0 0 0 4px color-mix(in srgb, var(${t}-accent) 18%, transparent);
}

.${n}-element-label {
  position: fixed;
  display: flex;
  flex-direction: column;
  max-width: 15rem;
  gap: 0.1rem;
  overflow: hidden;
  border-radius: 0.38rem;
  background: var(${t}-accent);
  padding: 0.32rem 0.45rem;
  color: #fff;
  font-family: var(${t}-font-mono);
  font-size: 0.72rem;
  line-height: 1.3;
  white-space: nowrap;
}

.${n}-label-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  min-width: 0;
}

.${n}-label-row strong {
  overflow: hidden;
  text-overflow: ellipsis;
}

.${n}-label-row > span {
  flex: none;
  opacity: 0.78;
}

.${n}-label-key {
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

  .${n}-launcher:hover {
    border-radius: 0.9rem;
    box-shadow: 0 2px 12px color-mix(in srgb, var(${t}-accent) 28%, transparent),
                0 1px 3px rgba(0, 0, 0, 0.06);
    transform: none;
  }

  .${n}-launcher:hover span {
    max-width: 0;
    opacity: 0;
    margin-left: 0;
  }

  .${n}-panel {
    width: min(21rem, calc(100vw - 5.75rem));
  }
}
`}var B=ue("pm"),U=me("pm");var C=null;function T(){if(C)return C;if(typeof window>"u")return null;try{return window.localStorage.getItem(L)}catch{return null}}function I(n){let t=n.trim();if(t){C=t;try{window.localStorage.setItem(L,t)}catch{}}}function ge(){C=null;try{window.localStorage.removeItem(L)}catch{}}function fe(){if(!(typeof window>"u"))try{let n=new URL(window.location.href),t=n.searchParams.get(O);if(!t)return;I(t),n.searchParams.delete(O),window.history.replaceState(null,"",n)}catch{}}fe();var ve=1200,be=["font-size","line-height","padding","margin","border-radius","gap","width","height","color","background-color"];function $e(n,t){let e=n.getPropertyValue(`${t}-top`),o=n.getPropertyValue(`${t}-right`),r=n.getPropertyValue(`${t}-bottom`),i=n.getPropertyValue(`${t}-left`);return e===o&&o===r&&r===i?e:e===r&&i===o?`${e} ${o}`:`${e} ${o} ${r} ${i}`}function ye(n,t){return t==="padding"||t==="margin"?$e(n,t):n.getPropertyValue(t)}var u={crosshair:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>',list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',annotate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',grip:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>',chevronUp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',chevronDown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',chevronLeft:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'};function we(n){let t=n.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);if(!t)return n;let e=o=>o.toString(16).padStart(2,"0");return`#${e(parseInt(t[1]))}${e(parseInt(t[2]))}${e(parseInt(t[3]))}`.toUpperCase()}function Q(n){let t=window.getComputedStyle(n);return{color:we(t.color),fontSize:t.fontSize,fontFamily:t.fontFamily.split(",")[0].replace(/['"]/g,"").trim()}}var Z=!1;function Ee(){if(Z||typeof document>"u")return;let n=document.createElement("style");n.setAttribute(G,"global"),n.textContent=B,document.head.appendChild(n),Z=!0}var ke=typeof HTMLElement>"u"?class{}:HTMLElement,S=class extends ke{constructor(){super(...arguments);this.store=D();this.labels={...F};this.onError=null;this._theme={};this.mode="closed";this.hoveredTarget=null;this.selectedTarget=null;this.message="";this.annotations=[];this.isLoading=!1;this.isSubmitting=!1;this.status=null;this.statusType=null;this.locatedTarget=null;this.selectedElement=null;this.selectionPath=[];this.dodgeX=0;this.launcherCollapsed=!1;this.launcherFloating=!1;this.launcherPos=null;this.dragState=null;this.suppressNextClick=!1;this.showProperties=!1;this.propertyChanges={};this.dragSrcId=null;this.dragOverId=null;this.dragOverPos="before";this.shadow=null;this.overlayEl=null;this.panelEl=null;this.launcherEl=null;this.boundMove=null;this.boundClick=null;this.pausedVideos=[];this.pointerRef=null;this.handleMouseUp=e=>{if(this.mode!=="picking"||e.button!==0||e.composedPath().includes(this))return;let o=window.getSelection();if(!o||o.isCollapsed||o.rangeCount===0)return;let r=o.toString().replace(/\s+/g," ").trim();if(!r)return;let i=o.getRangeAt(0),a=i.commonAncestorContainer,c=a instanceof HTMLElement?a:a.parentElement;if(!c||c===document.body||c===document.documentElement||c.closest(f))return;let h=i.getBoundingClientRect();if(h.width<2||h.height<2)return;this.enterCompose({...w(c),quote:r.slice(0,240),rect:{top:Math.round(h.top+window.scrollY),left:Math.round(h.left+window.scrollX),width:Math.round(h.width),height:Math.round(h.height)}},c),o.removeAllRanges();let d=p=>{p.preventDefault(),p.stopPropagation()};document.addEventListener("click",d,{capture:!0,once:!0}),document.addEventListener("mousedown",()=>document.removeEventListener("click",d,!0),{capture:!0,once:!0})};this.globalKeyDownHandler=e=>{if(!e.isComposing){if(e.key==="Escape"){if(this.mode==="picking"||this.mode==="list"||this.mode==="locked")this.closeTool();else if(this.mode==="compose"){let o=this.message;this.startPicking(),this.message=o}return}if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)&&this.mode==="compose"){if(!this.panelEl||!e.composedPath().includes(this.panelEl))return;this.message.trim()&&!this.isSubmitting&&(e.preventDefault(),this.submitAnnotation())}}};this.refreshHover=()=>{this.pointerRef&&(this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId),this.rafId=window.requestAnimationFrame(()=>{this.pointerRef&&(this.hoveredTarget=this.getTargetAtPoint(this.pointerRef.clientX,this.pointerRef.clientY),this.updateOverlay())}))};this.refreshSelected=()=>{this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId),this.rafId=window.requestAnimationFrame(()=>this.updateOverlay())};this.boundLauncherMove=e=>{if(!this.dragState||!this.launcherEl)return;let o=e.clientX-this.dragState.startX,r=e.clientY-this.dragState.startY;if(!this.dragState.moved&&Math.hypot(o,r)<4)return;this.dragState.moved||(this.dragState.moved=!0,this.launcherFloating=!0,this.launcherEl.classList.add("is-floating","is-dragging"));let i=window.innerWidth-this.launcherEl.offsetWidth,a=window.innerHeight-this.launcherEl.offsetHeight,c=Math.max(0,Math.min(this.dragState.originX+o,i)),h=Math.max(0,Math.min(this.dragState.originY+r,a));this.launcherPos={x:c,y:h},this.launcherEl.style.left=`${c}px`,this.launcherEl.style.top=`${h}px`,this.launcherEl.style.right=""};this.boundLauncherUp=()=>{if(document.removeEventListener("pointermove",this.boundLauncherMove),document.removeEventListener("pointerup",this.boundLauncherUp),document.removeEventListener("pointercancel",this.boundLauncherUp),!this.dragState)return;let e=this.dragState.moved;this.launcherEl?.classList.remove("is-dragging"),this.dragState=null,e&&(this.suppressNextClick=!0,this.launcherPos&&this.launcherEl&&this.snapToEdge()?this.collapseLauncher():this.persistLauncherState())}}get theme(){return this._theme}set theme(e){this._theme=e??{},this.applyTheme()}get themeName(){return this.getAttribute(A)??"blue"}set themeName(e){e?this.setAttribute(A,e):this.removeAttribute(A)}static get observedAttributes(){return["accent",$,E,y]}attributeChangedCallback(e,o,r){e==="accent"&&this.shadow&&this.style.setProperty(`${g}-accent`,r),e===$&&this.updateVisibility(),e===y&&this.applyDodgeSign()}get visible(){return this.hasAttribute($)}set visible(e){e?this.setAttribute($,""):this.removeAttribute($)}get requireAuth(){return this.hasAttribute(E)}set requireAuth(e){e?this.setAttribute(E,""):this.removeAttribute(E)}get position(){return this.getAttribute(y)??"right-center"}set position(e){e?this.setAttribute(y,e):this.removeAttribute(y)}get dockSide(){return this.position.startsWith("left")?"left":"right"}applyDodgeSign(){this.style.setProperty(`${g}-dodge-sign`,this.dockSide==="left"?"1":"-1")}applyTheme(){if(!this.shadow)return;let e=(o,r)=>{r?this.style.setProperty(o,r):this.style.removeProperty(o)};e(`${g}-accent`,this._theme.accent),e(`${g}-accent-dark`,this._theme.accentDark),e(`${g}-accent-soft`,this._theme.accentSoft)}updateVisibility(){let e=this.visible;this.launcherEl&&(this.launcherEl.style.display=e?"":"none"),!e&&this.mode!=="closed"&&this.closeTool()}connectedCallback(){Ee();let e=this.shadowRoot!==null;if(e)this.shadow=this.shadowRoot;else{this.shadow=this.attachShadow({mode:"open"});let o=document.createElement("style");o.textContent=U,this.shadow.appendChild(o),this.overlayEl=document.createElement("div"),this.overlayEl.className=`${"pm"}-overlay`,this.overlayEl.style.display="none",this.overlayEl.setAttribute(_,""),this.shadow.appendChild(this.overlayEl),this.panelEl=document.createElement("div"),this.panelEl.className=`${"pm"}-panel`,this.panelEl.style.display="none",this.panelEl.setAttribute(_,""),this.shadow.appendChild(this.panelEl),this.launcherEl=document.createElement("button"),this.launcherEl.className=`${"pm"}-launcher`,this.launcherEl.type="button",this.setupLauncherInteraction(),this.shadow.appendChild(this.launcherEl),this.restoreLauncherState(),this.panelEl.addEventListener("click",r=>this.handlePanelClick(r)),this.panelEl.addEventListener("input",r=>this.handlePanelInput(r)),this.panelEl.addEventListener("keydown",r=>this.handlePanelKeyDown(r)),this.panelEl.addEventListener("mousedown",r=>this.handleDragHandleDown(r)),this.panelEl.addEventListener("mouseup",()=>this.resetDraggable()),this.panelEl.addEventListener("dragstart",r=>this.handleDragStart(r)),this.panelEl.addEventListener("dragover",r=>this.handleDragOver(r)),this.panelEl.addEventListener("drop",r=>this.handleDrop(r)),this.panelEl.addEventListener("dragend",()=>this.handleDragEnd())}document.addEventListener("keydown",this.globalKeyDownHandler),e&&(this.mode==="picking"?this.setupPicking():this.mode==="compose"&&this.setupComposeTracking(),this.updateOverlay()),this.applyTheme(),this.applyDodgeSign(),this.updateVisibility(),this.updatePanel()}disconnectedCallback(){this.cleanupPicking(),this.cleanupComposeTracking(),document.removeEventListener("keydown",this.globalKeyDownHandler),document.removeEventListener("pointermove",this.boundLauncherMove),document.removeEventListener("pointerup",this.boundLauncherUp),document.removeEventListener("pointercancel",this.boundLauncherUp),window.clearTimeout(this.locateTimeout),this.rafId!==void 0&&window.cancelAnimationFrame(this.rafId)}open(){this.openTool()}close(){this.closeTool()}openTool(){if(this.requireAuth&&!T()){this.mode="locked",this.status=null,this.statusType=null,this.updateOverlay(),this.updatePanel();return}this.startPicking()}closeTool(){this.mode="closed",this.hoveredTarget=null,this.selectedTarget=null,this.selectedElement=null,this.pointerRef=null,this.message="",this.status=null,this.statusType=null,this.showProperties=!1,this.propertyChanges={},this.cleanupPicking(),this.cleanupComposeTracking(),this.setDodgeSide("dock"),this.updateOverlay(),this.updatePanel()}startPicking(){this.mode="picking",this.hoveredTarget=null,this.selectedTarget=null,this.selectedElement=null,this.pointerRef=null,this.message="",this.status=null,this.statusType=null,this.showProperties=!1,this.propertyChanges={},this.cleanupComposeTracking(),this.setupPicking(),this.updateOverlay(),this.updatePanel()}async openList(){this.mode="list",this.cleanupPicking(),this.cleanupComposeTracking(),this.updateOverlay(),this.updatePanel(),await this.loadAnnotations()}setupPicking(){this.cleanupPicking(),this.boundMove=e=>this.handleMove(e),this.boundClick=e=>this.handleClick(e),document.addEventListener("mousemove",this.boundMove,!0),document.addEventListener("click",this.boundClick,!0),document.addEventListener("mouseup",this.handleMouseUp),window.addEventListener("scroll",this.refreshHover,!0),window.addEventListener("resize",this.refreshHover),document.documentElement.classList.add(R),this.pausedVideos=[],document.querySelectorAll("video").forEach(e=>{e.paused||(e.pause(),this.pausedVideos.push(e))})}cleanupPicking(){document.documentElement.classList.remove(R),this.panelEl?.classList.remove("is-ghost"),this.boundMove&&document.removeEventListener("mousemove",this.boundMove,!0),this.boundClick&&document.removeEventListener("click",this.boundClick,!0),document.removeEventListener("mouseup",this.handleMouseUp),window.removeEventListener("scroll",this.refreshHover,!0),window.removeEventListener("resize",this.refreshHover),this.boundMove=null,this.boundClick=null;for(let e of this.pausedVideos)e.ended||e.play().catch(()=>{});this.pausedVideos=[],this.rafId!==void 0&&(window.cancelAnimationFrame(this.rafId),this.rafId=void 0)}getTargetAtPoint(e,o){let r=document.elementFromPoint(e,o);if(!(r instanceof HTMLElement)||r===document.body||r===document.documentElement||r.closest(f))return null;let i=r.getBoundingClientRect();return i.width<2||i.height<2?null:{...w(r),viewportRect:i,hoverInfo:Q(r)}}handleMove(e){this.pointerRef={clientX:e.clientX,clientY:e.clientY},this.updatePickingGhost(e.clientX,e.clientY),this.hoveredTarget=this.getTargetAtPoint(e.clientX,e.clientY),this.updateOverlay()}updatePickingGhost(e,o){if(!this.panelEl||this.panelEl.style.display==="none")return;let r=this.panelEl.getBoundingClientRect(),i=this.panelEl.querySelector(`.${"pm"}-panel-header`),a=i?i.getBoundingClientRect().bottom:r.top,c=e>=r.left&&e<=r.right&&o>=a&&o<=r.bottom;this.panelEl.classList.toggle("is-ghost",c)}handleClick(e){let o=this.getTargetAtPoint(e.clientX,e.clientY);if(!o)return;e.preventDefault(),e.stopPropagation();let r=document.elementFromPoint(e.clientX,e.clientY);this.enterCompose(Y(o),r instanceof HTMLElement?r:null)}enterCompose(e,o){this.selectedTarget=e,this.selectedElement=o,this.selectionPath=[],this.hoveredTarget=null,this.showProperties=!1,this.propertyChanges={},this.mode="compose",this.cleanupPicking(),this.setupComposeTracking(),this.updateOverlay(),this.updatePanel();let r=this.panelEl?.querySelector("textarea");r&&r.focus()}setupComposeTracking(){window.addEventListener("scroll",this.refreshSelected,!0),window.addEventListener("resize",this.refreshSelected)}cleanupComposeTracking(){window.removeEventListener("scroll",this.refreshSelected,!0),window.removeEventListener("resize",this.refreshSelected)}canExpandSelection(){let e=this.selectedElement?.parentElement;return!!e&&e!==document.documentElement&&!e.closest(f)}canShrinkSelection(){if(this.selectionPath.length>0)return!0;let e=this.selectedElement?.firstElementChild;return e instanceof HTMLElement&&!e.closest(f)}expandSelection(){let e=this.selectedElement;!e||!this.canExpandSelection()||(this.selectionPath.push(e),this.applySelectedElement(e.parentElement))}shrinkSelection(){let e=this.selectionPath.pop();if(e?.isConnected){this.applySelectedElement(e);return}let o=this.selectedElement?.firstElementChild;o instanceof HTMLElement&&!o.closest(f)&&this.applySelectedElement(o)}applySelectedElement(e){this.selectedElement=e,this.selectedTarget=w(e),this.propertyChanges={},this.updateOverlay(),this.updatePanel()}setDodgeSide(e){if(e==="dock"){if(this.dodgeX===0)return;this.dodgeX=0,this.style.setProperty(`${g}-dodge-x`,"0px");return}if(this.dodgeX>0)return;let o=this.panelEl&&this.panelEl.style.display!=="none"?this.panelEl:this.launcherEl;if(!o)return;let r=20,i=o.getBoundingClientRect(),a=this.dockSide==="right"?Math.round(i.left-r):Math.round(window.innerWidth-i.right-r);a<=r||(this.dodgeX=a,this.style.setProperty(`${g}-dodge-x`,`${a}px`))}updateComposeDodge(e){if(!this.panelEl||window.innerWidth<=640)return;let o=this.panelEl.getBoundingClientRect();if(!(e.right>o.left&&e.left<o.right&&e.bottom>o.top&&e.top<o.bottom))return;let i=(e.left+e.right)/2,a=this.dockSide==="right"?i>window.innerWidth/2:i<window.innerWidth/2;this.setDodgeSide(a?"away":"dock")}reportError(e,o){let r=e instanceof Error?e:new Error(String(e));if(this.onError)try{this.onError(r,o)}catch{}else console.warn(`[patch-mark] ${o.operation} failed:`,r)}handleStoreError(e,o){return this.reportError(e,o),Te(e)?(this.mode="locked",this.status=this.labels.lockedError??"\u4EE4\u724C\u65E0\u6548\u6216\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u83B7\u53D6\u3002",this.statusType="error",this.cleanupPicking(),this.cleanupComposeTracking(),this.updateOverlay(),this.updatePanel(),!0):!1}async loadAnnotations(){this.isLoading=!0,this.status=null,this.statusType=null,this.updatePanel();try{let e=window.location.pathname;this.annotations=await this.store.list(e)}catch(e){this.handleStoreError(e,{operation:"list"})||(this.status=e instanceof Error?e.message:this.labels.loading,this.statusType="error")}finally{this.isLoading=!1,this.updatePanel()}}getChanges(){return Object.entries(this.propertyChanges).map(([e,{from:o,to:r}])=>({property:e,from:o,to:r}))}async submitAnnotation(){if(!(!this.selectedTarget||!this.message.trim()||this.isSubmitting)){this.isSubmitting=!0,this.status=null,this.statusType=null,this.updatePanel();try{let e=await this.store.create({pagePath:window.location.pathname,pageTitle:document.title,message:this.message.trim(),element:this.selectedTarget,changes:this.getChanges()});this.annotations=[e,...this.annotations],this.message="",this.selectedTarget=null,this.selectedElement=null,this.mode="list",this.cleanupComposeTracking(),this.updateOverlay()}catch(e){this.handleStoreError(e,{operation:"create"})||(this.status=e instanceof Error?e.message:"Failed to submit.",this.statusType="error")}finally{this.isSubmitting=!1,this.updatePanel()}}}locateAnnotation(e){let o=null;try{o=document.querySelector(e.element.selector)}catch{o=null}if(!(o instanceof HTMLElement)){this.status=this.labels.notFound,this.statusType="error",this.updatePanel();return}o.scrollIntoView({behavior:"smooth",block:"center"}),window.clearTimeout(this.locateTimeout),this.locateTimeout=window.setTimeout(()=>{o?.isConnected&&(this.locatedTarget={...w(o),viewportRect:o.getBoundingClientRect(),hoverInfo:Q(o)},this.updateOverlay(),this.locateTimeout=window.setTimeout(()=>{this.locatedTarget=null,this.updateOverlay()},1800))},350)}async resolveAnnotation(e){if(this.store.update)try{let o=await this.store.update(e,{status:"resolved"});this.annotations=this.annotations.map(r=>r.id===e?o:r),this.updatePanel()}catch(o){this.handleStoreError(o,{operation:"resolve",annotationId:e})||(this.status=o instanceof Error?o.message:"Failed to resolve.",this.statusType="error",this.updatePanel())}}async unlock(e){I(e),await this.openList()}handleDragHandleDown(e){let r=e.target.closest("[data-drag-handle]");if(!r)return;let i=r.closest(`.${"pm"}-item`);i instanceof HTMLElement&&(i.draggable=!0)}resetDraggable(){this.panelEl&&this.panelEl.querySelectorAll(`.${"pm"}-item[draggable="true"]`).forEach(e=>{e.draggable=!1})}handleDragStart(e){let o=e.target.closest(`.${"pm"}-item`);if(!o)return;let r=o.getAttribute("data-annotation-id");r&&(this.dragSrcId=r,o.classList.add("is-dragging"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",r)))}handleDragOver(e){if(!this.dragSrcId)return;let o=e.target.closest(`.${"pm"}-item`);if(!o)return;let r=o.getAttribute("data-annotation-id");if(!r||r===this.dragSrcId)return;e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");let i=o.getBoundingClientRect(),a=i.top+i.height/2,c=e.clientY<a?"before":"after";this.clearDragIndicators(),this.dragOverId=r,this.dragOverPos=c,o.classList.add(c==="before"?"is-drop-before":"is-drop-after")}clearDragIndicators(){this.panelEl&&(this.panelEl.querySelectorAll(".is-drop-before, .is-drop-after").forEach(e=>{e.classList.remove("is-drop-before","is-drop-after")}),this.dragOverId=null)}async handleDrop(e){if(e.preventDefault(),!this.dragSrcId||!this.dragOverId){this.handleDragEnd();return}let o=this.dragSrcId,r=this.dragOverId,i=this.dragOverPos,a=[...this.annotations],c=a.findIndex(p=>p.id===o);if(c===-1){this.handleDragEnd();return}let[h]=a.splice(c,1),d=a.findIndex(p=>p.id===r);if(d===-1){this.handleDragEnd();return}if(i==="after"&&d++,a.splice(d,0,h),this.annotations=a,this.store.reorder)try{await this.store.reorder(a.map(p=>p.id))}catch(p){this.handleStoreError(p,{operation:"reorder"})}this.handleDragEnd(),this.updatePanel()}handleDragEnd(){this.panelEl&&(this.panelEl.querySelectorAll(".is-dragging").forEach(e=>{e.classList.remove("is-dragging")}),this.clearDragIndicators(),this.resetDraggable()),this.dragSrcId=null,this.dragOverId=null}async copyAsPrompt(e){let o;if(e){let r=this.annotations.find(i=>i.id===e);if(!r)return;o=k(r)}else this.selectedTarget?o=k({id:"preview",pagePath:window.location.pathname,pageTitle:document.title,message:this.message.trim()||"(no message)",element:this.selectedTarget,createdAt:new Date().toISOString(),status:"open",changes:this.getChanges()}):o=j(this.annotations,window.location.pathname);await this.writeClipboard(o)}async writeClipboard(e){try{await navigator.clipboard.writeText(e),this.status=this.labels.copied,this.statusType="success"}catch{let o=document.createElement("textarea");o.value=e,o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.select();try{document.execCommand("copy"),this.status=this.labels.copied,this.statusType="success"}catch{this.status="Copy failed",this.statusType="error"}document.body.removeChild(o)}this.updatePanel(),this.statusType==="success"&&window.setTimeout(()=>{this.status===this.labels.copied&&(this.status=null,this.statusType=null,this.updatePanel())},1500)}async copyHandoff(){let e=`${window.location.origin}${window.location.pathname}`;await this.writeClipboard(z(this.annotations,e,this.store.source))}setupLauncherInteraction(){this.launcherEl&&(this.launcherEl.addEventListener("pointerdown",e=>this.onLauncherPointerDown(e)),this.launcherEl.addEventListener("click",e=>{if(e.target.closest(`.${"pm"}-collapse-btn`)){e.stopPropagation(),this.collapseLauncher();return}if(this.suppressNextClick){this.suppressNextClick=!1;return}if(this.launcherCollapsed){this.expandLauncher();return}this.mode!=="closed"?this.closeTool():this.openTool()}))}onLauncherPointerDown(e){if(this.launcherCollapsed||e.button!==0||!this.launcherEl)return;let o=this.launcherEl.getBoundingClientRect();this.dragState={startX:e.clientX,startY:e.clientY,moved:!1,originX:o.left,originY:o.top},document.addEventListener("pointermove",this.boundLauncherMove),document.addEventListener("pointerup",this.boundLauncherUp),document.addEventListener("pointercancel",this.boundLauncherUp)}snapToEdge(){if(!this.launcherEl||!this.launcherPos)return!1;let e=this.launcherEl.getBoundingClientRect(),o=this.launcherPos.x+e.width/2,r=60;return o<r||o>window.innerWidth-r}collapseLauncher(){this.launcherCollapsed||(this.mode==="picking"?this.closeTool():this.mode==="compose"&&this.cleanupComposeTracking(),this.launcherCollapsed=!0,this.updatePanel(),this.updateOverlay(),this.persistLauncherState())}expandLauncher(){!this.launcherCollapsed||!this.launcherEl||(this.launcherCollapsed=!1,this.launcherFloating&&this.launcherPos?(this.launcherEl.style.left=`${this.launcherPos.x}px`,this.launcherEl.style.top=`${this.launcherPos.y}px`,this.launcherEl.style.right=""):(this.launcherEl.style.left="",this.launcherEl.style.top="",this.launcherEl.style.right=""),this.updatePanel(),this.updateOverlay(),this.mode==="compose"&&this.setupComposeTracking(),this.persistLauncherState())}persistLauncherState(){try{localStorage.setItem("patch-mark:launcher",JSON.stringify({collapsed:this.launcherCollapsed,floating:this.launcherFloating,pos:this.launcherPos}))}catch{}}restoreLauncherState(){if(this.launcherEl)try{let e=localStorage.getItem("patch-mark:launcher");if(!e)return;let o=JSON.parse(e);if(o.floating&&o.pos){let r=Math.max(0,Math.min(o.pos.x,window.innerWidth-60)),i=Math.max(0,Math.min(o.pos.y,window.innerHeight-60));this.launcherFloating=!0,this.launcherPos={x:r,y:i},this.launcherEl.classList.add("is-floating"),this.launcherEl.style.left=`${r}px`,this.launcherEl.style.top=`${i}px`}o.collapsed&&this.collapseLauncher()}catch{}}handlePanelClick(e){let o=e.target.closest("[data-action]");if(!o)return;let r=o.getAttribute("data-action"),i=o.getAttribute("data-id");switch(r){case"pick":this.startPicking();break;case"list":this.openList();break;case"close":this.closeTool();break;case"send":this.submitAnnotation();break;case"reselect":this.startPicking();break;case"locate":if(i){let a=this.annotations.find(c=>c.id===i);a&&this.locateAnnotation(a)}break;case"copy":this.copyAsPrompt(i||void 0);break;case"copy-handoff":this.copyHandoff();break;case"resolve":i&&this.resolveAnnotation(i);break;case"unlock":{let a=this.panelEl?.querySelector(`.${"pm"}-locked-input`),c=a instanceof HTMLInputElement?a.value.trim():"";c&&this.unlock(c);break}case"toggle-properties":this.showProperties=!this.showProperties,this.updatePanel();break;case"expand-selection":this.expandSelection();break;case"shrink-selection":this.shrinkSelection();break}}handlePanelKeyDown(e){if(e.key!=="Enter")return;let o=e.target;if(o instanceof HTMLInputElement&&o.classList.contains(`${"pm"}-locked-input`)){let r=o.value.trim();r&&this.unlock(r)}}handlePanelInput(e){let o=e.target;if(o.tagName==="TEXTAREA"){this.message=o.value;let r=this.panelEl?.querySelector('button[data-action="send"]');r&&(r.disabled=!this.message.trim()||this.isSubmitting)}else if(o.tagName==="INPUT"&&o.hasAttribute("data-property")){let r=o.getAttribute("data-property"),i=o.getAttribute("data-original"),a=o.value.trim();a&&a!==i?this.propertyChanges[r]={from:i,to:a}:delete this.propertyChanges[r];let c=o.closest(`.${"pm"}-prop-row`);c&&c.classList.toggle("is-changed",!!this.propertyChanges[r]),this.updatePropToggleBadge()}}updatePropToggleBadge(){let e=this.panelEl?.querySelector(`.${"pm"}-prop-toggle`);if(!e)return;let o=Object.keys(this.propertyChanges).length,r=o>0?`<span class="${"pm"}-prop-count">${o}</span>`:"",i=this.showProperties?" \u2713":"";e.innerHTML=`${l(this.labels.properties)}${i}${r}`}updateOverlay(){if(!this.overlayEl)return;if(this.launcherCollapsed){this.overlayEl.style.display="none",this.overlayEl.innerHTML="";return}if(this.mode==="compose"){this.renderSelectedOverlay();return}let e=this.mode==="picking"?this.hoveredTarget:this.locatedTarget;if(!e){this.overlayEl.style.display="none",this.overlayEl.innerHTML="";return}let{viewportRect:o}=e,r=e.hoverInfo?72:34,i=o.top>r+10?o.top-r:o.bottom+8,a=Math.min(Math.max(o.left,8),window.innerWidth-240);this.overlayEl.style.display="",this.overlayEl.innerHTML=`
      <div class="${"pm"}-highlight" style="top:${o.top}px;left:${o.left}px;width:${o.width}px;height:${o.height}px"></div>
      <div class="${"pm"}-element-label" style="top:${i}px;left:${a}px">
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
    `}renderSelectedOverlay(){if(!this.overlayEl)return;let e=this.selectedElement;if(!e||!e.isConnected||!this.selectedTarget){this.overlayEl.style.display="none",this.overlayEl.innerHTML="";return}let o=this.selectedTarget.quote?{top:this.selectedTarget.rect.top-window.scrollY,left:this.selectedTarget.rect.left-window.scrollX,width:this.selectedTarget.rect.width,height:this.selectedTarget.rect.height,right:this.selectedTarget.rect.left-window.scrollX+this.selectedTarget.rect.width,bottom:this.selectedTarget.rect.top-window.scrollY+this.selectedTarget.rect.height}:e.getBoundingClientRect();this.updateComposeDodge(o);let r=o.top>44?o.top-34:o.bottom+8,i=Math.min(Math.max(o.left,8),window.innerWidth-240);this.overlayEl.style.display="",this.overlayEl.innerHTML=`
      <div class="${"pm"}-highlight is-selected" style="top:${o.top}px;left:${o.left}px;width:${o.width}px;height:${o.height}px"></div>
      <div class="${"pm"}-element-label" style="top:${r}px;left:${i}px">
        <div class="${"pm"}-label-row">
          <strong>${l(this.selectedTarget.name)}</strong>
          <span>${Math.round(o.width)} \xD7 ${Math.round(o.height)}</span>
        </div>
      </div>
    `}updatePanel(){if(!this.panelEl||!this.launcherEl)return;if(this.launcherCollapsed){this.panelEl.style.display="none",this.panelEl.innerHTML="",this.launcherEl.classList.add("is-collapsed");let a=this.launcherFloating&&this.launcherPos?this.launcherPos.x+this.launcherEl.offsetWidth/2<window.innerWidth/2?"left":"right":this.dockSide;this.launcherEl.style.left=a==="left"?"0.5rem":"",this.launcherEl.style.right=a==="right"?"0.5rem":"",this.launcherEl.style.top=`${Math.round(window.innerHeight/2-32)}px`,this.launcherEl.innerHTML=`${u.annotate}<span>${this.labels.picker}</span>`;return}this.launcherEl.classList.remove("is-collapsed");let e=this.mode!=="closed";this.launcherEl.classList.toggle("is-active",e);let o=`<span class="${"pm"}-collapse-btn" role="button" tabindex="0" data-action="collapse" aria-label="${l(this.labels.collapse??"\u6536\u8D77")}">${u.chevronLeft}</span>`;if(this.launcherEl.innerHTML=e?`${u.x}<span>${this.labels.close}</span>${o}`:`${u.annotate}<span>${this.labels.picker}</span>${o}`,!e){this.panelEl.style.display="none",this.panelEl.innerHTML="";return}this.panelEl.style.display="";let r=this.mode==="picking"||this.mode==="compose",i=this.mode==="list";this.panelEl.innerHTML=`
      <div class="${"pm"}-panel-header">
        <div class="${"pm"}-panel-tabs">
          <button type="button" class="${r?"is-active":""}" data-action="pick" role="tab" aria-selected="${r}">
            ${u.crosshair}
            ${l(this.labels.picker)}
          </button>
          <button type="button" class="${i?"is-active":""}" data-action="list" role="tab" aria-selected="${i}">
            ${u.list}
            ${l(this.labels.list)}
          </button>
        </div>
        <button type="button" class="${"pm"}-close" data-action="close" aria-label="${l(this.labels.close)}">
          ${u.x}
        </button>
      </div>
      ${this.renderPanelContent()}
    `}renderPanelContent(){switch(this.mode){case"picking":return this.renderPickerNote();case"compose":return this.renderCompose();case"list":return this.renderList();case"locked":return this.renderLocked();default:return""}}renderPickerNote(){return`
      <div class="${"pm"}-picker-note">
        ${u.crosshair}
        <p>${l(this.labels.picker)}</p>
        <span>${l(this.labels.pickerHint)}</span>
      </div>
    `}renderLocked(){let e=this.status?`<p class="${"pm"}-status is-error">${l(this.status)}</p>`:"";return`
      <div class="${"pm"}-locked">
        ${u.lock}
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
          ${u.send}
        </button>
      </div>
    `}renderCompose(){if(!this.selectedTarget)return"";let e=this.status?`<p class="${"pm"}-status ${this.statusType==="success"?"is-success":"is-error"}">${l(this.status)}</p>`:"",o=Object.keys(this.propertyChanges).length,r=this.showProperties?`${this.labels.properties} \u2713`:this.labels.properties,i=o>0?`<span class="${"pm"}-prop-count">${o}</span>`:"";return`
      <div class="${"pm"}-compose">
        <div class="${"pm"}-target">
          <span>${l(this.labels.targetLabel)}</span>
          <strong>${l(this.selectedTarget.name)}</strong>
          <span class="${"pm"}-select-nav">
            <button type="button" class="${"pm"}-nav-btn" data-action="expand-selection" title="${l(this.labels.expandLabel??"\u6269\u5C55\u5230\u7236\u7EA7")}" aria-label="${l(this.labels.expandLabel??"\u6269\u5C55\u5230\u7236\u7EA7")}" ${this.canExpandSelection()?"":"disabled"}>
              ${u.chevronUp}
            </button>
            <button type="button" class="${"pm"}-nav-btn" data-action="shrink-selection" title="${l(this.labels.shrinkLabel??"\u6536\u7F29\u5230\u5B50\u7EA7")}" aria-label="${l(this.labels.shrinkLabel??"\u6536\u7F29\u5230\u5B50\u7EA7")}" ${this.canShrinkSelection()?"":"disabled"}>
              ${u.chevronDown}
            </button>
          </span>
          <button type="button" class="${"pm"}-prop-toggle ${this.showProperties?"is-active":""}" data-action="toggle-properties">
            ${l(r)}${i}
          </button>
        </div>
        ${this.showProperties?this.renderPropertyPanel():""}
        <textarea maxlength="${ve}" placeholder="${l(this.labels.placeholder)}" aria-label="${l(this.labels.placeholder)}">${l(this.message)}</textarea>
        ${e}
        <div class="${"pm"}-compose-actions">
          <button type="button" class="${"pm"}-copy-btn" data-action="copy">
            ${u.copy}
            ${l(this.labels.copyAsPrompt)}
          </button>
          <span style="display:flex;gap:0.5rem;align-items:center">
            <button type="button" class="${"pm"}-back" data-action="reselect">${l(this.labels.reselect)}</button>
            <button type="button" class="${"pm"}-send" data-action="send" title="\u2318/Ctrl+Enter" ${!this.message.trim()||this.isSubmitting?"disabled":""}>
              ${this.isSubmitting?l(this.labels.sending):l(this.labels.send)}
              ${u.send}
            </button>
          </span>
        </div>
      </div>
    `}renderPropertyPanel(){if(!this.selectedElement)return"";let e=window.getComputedStyle(this.selectedElement),o=be.map(r=>{let i=ye(e,r).trim(),a=this.propertyChanges[r],c=a?a.to:"";return`
        <div class="${"pm"}-prop-row ${a?"is-changed":""}">
          <span class="${"pm"}-prop-name">${l(r)}</span>
          <span class="${"pm"}-prop-current">${l(i)}</span>
          <input
            type="text"
            class="${"pm"}-prop-input"
            data-property="${l(r)}"
            data-original="${l(i)}"
            value="${l(c)}"
            placeholder="${a?l(a.to):"\u2192"}"
            spellcheck="false"
          />
        </div>`}).join("");return`
      <div class="${"pm"}-prop-panel">
        <p class="${"pm"}-prop-hint">${l(this.labels.propertiesHint)}</p>
        ${o}
      </div>
    `}renderList(){let e="";this.isLoading?e=`<p class="${"pm"}-empty">${l(this.labels.loading)}</p>`:this.status&&this.statusType==="error"&&this.annotations.length===0?e=`<p class="${"pm"}-status is-error">${l(this.status)}</p>`:this.annotations.length===0?e=`<p class="${"pm"}-empty">${l(this.labels.empty)}</p>`:e=this.annotations.map(a=>this.renderItem(a)).join("");let o=this.status&&(this.statusType==="success"||this.annotations.length>0)?`<p class="${"pm"}-status ${this.statusType==="success"?"is-success":"is-error"}">${l(this.status)}</p>`:"",r=this.annotations.filter(a=>a.status!=="resolved").length,i=!this.isLoading&&r>0?`<div class="${"pm"}-handoff-bar">
          <button type="button" class="${"pm"}-handoff" data-action="copy-handoff">
            ${u.send}<span>${l(this.labels.copyHandoff??"Copy handoff prompt")} \xB7 ${r}</span>
          </button>
        </div>`:"";return`
      <div class="${"pm"}-list">
        ${o}
        ${e}
      </div>
      ${i}
    `}renderItem(e){let o=e.status==="resolved",r=e.element.text?`<span class="${"pm"}-item-context">${l(this.labels.contentPrefix)}${l(e.element.text)}</span>`:"",i=e.changes&&e.changes.length>0?`<div class="${"pm"}-item-changes">${e.changes.map(h=>`<span class="${"pm"}-change">${l(h.property)}: ${l(h.from)} \u2192 <strong>${l(h.to)}</strong></span>`).join("")}</div>`:"",a=o?`<span class="${"pm"}-item-status">${u.check}${l(this.labels.resolved)}</span>`:"",c=!o&&this.store.update?`<button type="button" class="is-resolve" data-action="resolve" data-id="${e.id}">${u.check}${l(this.labels.resolve)}</button>`:"";return`
      <article class="${"pm"}-item ${o?"is-resolved":""}" data-annotation-id="${e.id}">
        <div class="${"pm"}-item-header">
          <div class="${"pm"}-item-title">
            <button type="button" class="${"pm"}-drag-handle" data-drag-handle aria-label="${l(this.labels.dragLabel??"\u62D6\u52A8\u6392\u5E8F")}">
              ${u.grip}
            </button>
            <strong>${l(e.element.name)}</strong>
          </div>
          <div class="${"pm"}-item-actions">
            <button type="button" data-action="copy" data-id="${e.id}">${u.copy}</button>
            <button type="button" data-action="locate" data-id="${e.id}">${u.crosshair}${l(this.labels.locate)}</button>
            ${c}
          </div>
        </div>
        <code title="${l(e.element.selector)}">${l(e.element.selector)}</code>
        <p>${l(e.message)}</p>
        ${i}
        ${r}
        ${a}
        <time datetime="${e.createdAt}">${q(e.createdAt)}</time>
      </article>
    `}};function Te(n){return n instanceof Error&&n.name==="PatchMarkAuthError"}function l(n){let t=document.createElement("div");return t.textContent=n,t.innerHTML}var M=class extends Error{constructor(t){super(t),this.name="PatchMarkAuthError"}};function P(n){let t=T();return t?Object.keys(n).some(o=>o.toLowerCase()==="authorization")?n:{authorization:`Bearer ${t}`,...n}:n}function x(n){if(n.status===401)throw new M("Access token missing or rejected (401)")}function Se(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function Pe(n){let{endpoint:t,headers:e={}}=n,o={"content-type":"application/json",...e};return{source:{type:"rest",endpoint:t},async list(r){let i=`${t}?page=${encodeURIComponent(r)}`,a=await fetch(i,{cache:"no-store",headers:P(e)});if(x(a),!a.ok)throw new Error(`Failed to load annotations (${a.status})`);return(await a.json()).annotations??[]},async create(r){let i=await fetch(t,{method:"POST",headers:P(o),body:JSON.stringify(r)});if(x(i),!i.ok){let c=await i.json().catch(()=>({error:"Unknown error"}));throw new Error(c.error||`Failed to create annotation (${i.status})`)}return(await i.json()).annotation},async update(r,i){let a=await fetch(`${t}/${r}`,{method:"PATCH",headers:P(o),body:JSON.stringify(i)});if(x(a),!a.ok)throw new Error(`Failed to update annotation (${a.status})`);return(await a.json()).annotation},async delete(r){let i=await fetch(`${t}/${r}`,{method:"DELETE",headers:P(o)});if(x(i),!i.ok)throw new Error(`Failed to delete annotation (${i.status})`)},async reorder(r){let i=await fetch(`${t}/reorder`,{method:"POST",headers:P(o),body:JSON.stringify({ids:r})});if(x(i),!i.ok)throw new Error(`Failed to reorder annotations (${i.status})`)}}}function xe(n){return{id:Se(),pagePath:n.pagePath,pageTitle:n.pageTitle,message:n.message,element:n.element,createdAt:new Date().toISOString(),status:"open",changes:n.changes}}typeof customElements<"u"&&!customElements.get(f)&&customElements.define(f,S);export{S as PatchMark,M as PatchMarkAuthError,le as THEME_NAMES,ce as VERSION,ge as clearAuthToken,Pe as createFetchStore,xe as createLocalAnnotation,D as createLocalStorageStore,F as defaultLabels,k as formatAnnotationAsPrompt,j as formatAnnotationsAsPrompt,z as formatHandoffPrompt,T as getAuthToken,B as globalStyles,I as setAuthToken,U as shadowStyles};
