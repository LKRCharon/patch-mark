import type { Annotation, AnnotationLabels, AnnotationStore, AnnotationTheme, ElementTarget, HoverInfo, PatchMarkErrorContext, PickerTarget, PropertyChange, ThemeName, ToolMode } from './types.js';
import { describeElement, toElementTarget, formatTime, shouldSnapToEdge } from './utils.js';
import { createLocalStorageStore } from './stores/localStorage.js';
import { defaultLabels } from './labels.js';
import { formatAnnotationAsPrompt, formatAnnotationsAsPrompt, formatHandoffPrompt } from './prompt.js';
import { shadowStyles, globalStyles } from './styles.js';
import { CLASS_PREFIX, CSS_VAR_PREFIX, ELEMENT_TAG, GLOBAL_STYLE_ATTR, PICKER_ACTIVE_CLASS, POSITION_ATTR, REQUIRE_AUTH_ATTR, THEME_ATTR, UI_ATTR, VISIBLE_ATTR } from './identity.js';
import { clearAuthToken, getAuthToken, setAuthToken } from './auth.js';
import { parseAnnotation, parseAnnotations, parseCreateAnnotation } from './schema.js';

const MAX_MESSAGE_LENGTH = 1200;

// Properties to inspect in the property panel
const INSPECTABLE_PROPERTIES = [
  'font-size',
  'line-height',
  'padding',
  'margin',
  'border-radius',
  'gap',
  'width',
  'height',
  'color',
  'background-color',
] as const;

function computeShorthand(style: CSSStyleDeclaration, prop: string): string {
  const top = style.getPropertyValue(`${prop}-top`);
  const right = style.getPropertyValue(`${prop}-right`);
  const bottom = style.getPropertyValue(`${prop}-bottom`);
  const left = style.getPropertyValue(`${prop}-left`);
  if (top === right && right === bottom && bottom === left) return top;
  if (top === bottom && left === right) return `${top} ${right}`;
  return `${top} ${right} ${bottom} ${left}`;
}

function getComputedProperty(style: CSSStyleDeclaration, prop: string): string {
  if (prop === 'padding' || prop === 'margin') return computeShorthand(style, prop);
  return style.getPropertyValue(prop);
}

// ---- SVG icons (inline, zero dependencies) ----
const ICONS = {
  crosshair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  annotate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  grip: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>',
  chevronUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
};

function rgbToHex(color: string): string {
  const match = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return color;
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(parseInt(match[1]))}${toHex(parseInt(match[2]))}${toHex(parseInt(match[3]))}`.toUpperCase();
}

function computeHoverInfo(element: HTMLElement): HoverInfo {
  const style = window.getComputedStyle(element);
  return {
    color: rgbToHex(style.color),
    fontSize: style.fontSize,
    fontFamily: style.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
  };
}

type ViewportRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

type OverlayLabelPlacement = { left: number; top: number; safe: boolean };

function intersectArea(a: ViewportRect, b: ViewportRect): number {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Place a hover label around (rather than over) the target. The caller gives
 * us the real measured label size, so this remains correct under translated
 * labels, different fonts, or a host page's zoom setting.
 */
function chooseOverlayLabelPlacement(
  target: ViewportRect,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
  pointer: { clientX: number; clientY: number } | null,
): OverlayLabelPlacement {
  const gap = 8;
  const margin = 8;
  const centerX = target.left + target.width / 2;
  const centerY = target.top + target.height / 2;
  const candidates = [
    { left: centerX - width / 2, top: target.top - height - gap },
    { left: centerX - width / 2, top: target.bottom + gap },
    { left: target.left - width - gap, top: centerY - height / 2 },
    { left: target.right + gap, top: centerY - height / 2 },
  ];
  const pointerRect: ViewportRect | null = pointer
    ? {
        left: pointer.clientX - 18,
        top: pointer.clientY - 18,
        right: pointer.clientX + 18,
        bottom: pointer.clientY + 18,
        width: 36,
        height: 36,
      }
    : null;

  let best: OverlayLabelPlacement & { score: number } | null = null;
  for (const candidate of candidates) {
    const overflow =
      Math.max(0, margin - candidate.left) +
      Math.max(0, candidate.left + width - (viewportWidth - margin)) +
      Math.max(0, margin - candidate.top) +
      Math.max(0, candidate.top + height - (viewportHeight - margin));
    const left = clamp(candidate.left, margin, Math.max(margin, viewportWidth - width - margin));
    const top = clamp(candidate.top, margin, Math.max(margin, viewportHeight - height - margin));
    const label: ViewportRect = { left, top, right: left + width, bottom: top + height, width, height };
    const targetOverlap = intersectArea(label, target);
    const pointerOverlap = pointerRect ? intersectArea(label, pointerRect) : 0;
    const safe = overflow === 0 && targetOverlap === 0 && pointerOverlap === 0;
    // Pointer overlap is deliberately very expensive: a label should never
    // sit under the mouse that is being used to inspect the page.
    const score = overflow * 1000 + targetOverlap * 100 + pointerOverlap * 10_000;
    if (!best || score < best.score) best = { left, top, safe, score };
  }
  return best ?? { left: margin, top: margin, safe: false };
}

let globalStyleInjected = false;
// Document-level capture listeners, animation pausing, and the cursor class
// are inherently singleton resources. Keep exactly one active tool/picker so
// multiple <patch-mark> mounts cannot process the same click or undo each
// other's cleanup.
let activeInstance: PatchMark | null = null;
let activePicker: PatchMark | null = null;

function injectGlobalStyles(): void {
  if (globalStyleInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute(GLOBAL_STYLE_ATTR, 'global');
  style.textContent = globalStyles;
  document.head.appendChild(style);
  globalStyleInjected = true;
}

// SSR safety: HTMLElement is undefined in Node. Fall back to a plain class
// so the module can be imported without throwing during server-side evaluation.
const BaseHTMLElement: typeof HTMLElement =
  typeof HTMLElement === 'undefined'
    ? (class {} as unknown as typeof HTMLElement)
    : HTMLElement;

export class PatchMark extends BaseHTMLElement {
  // Public configuration
  private _store: AnnotationStore = createLocalStorageStore();
  private _labels: AnnotationLabels = { ...defaultLabels };
  private _pageKey: string | null = null;

  get store(): AnnotationStore {
    return this._store;
  }

  /**
   * Replacing a store is a data-boundary change, not a cosmetic assignment.
   * Abort the old store's in-flight work and re-check protected sessions so
   * React/custom-element users cannot retain data or auth from a prior store.
   */
  set store(value: AnnotationStore | null | undefined) {
    const next = value ?? createLocalStorageStore();
    if (next === this._store) return;
    this._store = next;
    this.handleStoreChange();
  }

  get labels(): AnnotationLabels {
    return this._labels;
  }

  /** Labels are reactive and always start from the complete package defaults. */
  set labels(value: Partial<AnnotationLabels> | null | undefined) {
    this._labels = { ...defaultLabels, ...(value ?? {}) };
    if (this.shadow) {
      this.updatePanel();
      this.updateOverlay();
    }
  }

  /**
   * Optional stable identity for the currently rendered page. When unset,
   * PatchMark uses pathname + query + hash so query/hash-routed views do not
   * silently share annotation records.
   */
  get pageKey(): string | null {
    return this._pageKey;
  }

  set pageKey(value: string | null | undefined) {
    const next = typeof value === 'string' && value.trim() ? value.trim() : null;
    if (next === this._pageKey) return;
    this._pageKey = next;
    this.syncPageIdentity();
  }

  /**
   * Error reporter for failed store operations. When set, it replaces the
   * default console.warn — wire it to your monitoring to detect incomplete
   * backends (e.g. a missing PATCH endpoint) early.
   */
  onError: ((error: Error, context: PatchMarkErrorContext) => void) | null = null;

  private _theme: AnnotationTheme = {};

  /**
   * Fine-grained color overrides, applied on top of the active preset.
   * Reactive: reassigning applies immediately (and clears keys left out).
   */
  get theme(): AnnotationTheme {
    return this._theme;
  }

  set theme(value: AnnotationTheme | null | undefined) {
    this._theme = value ?? {};
    this.applyTheme();
  }

  /**
   * Preset theme name, reflected to the theme attribute. Unknown values are
   * passed through so host CSS can define custom presets
   * (patch-mark[theme="brand"] { --pm-accent: ... }).
   */
  get themeName(): ThemeName | (string & {}) {
    return this.getAttribute(THEME_ATTR) ?? 'blue';
  }

  set themeName(value: string | null | undefined) {
    if (value) this.setAttribute(THEME_ATTR, value);
    else this.removeAttribute(THEME_ATTR);
  }

  // Internal state
  private mode: ToolMode = 'closed';
  private hoveredTarget: PickerTarget | null = null;
  private selectedTarget: ElementTarget | null = null;
  private selectedPagePath: string | null = null;
  /** Live range for text annotations; keeps its highlight aligned after reflow. */
  private selectedRange: Range | null = null;
  private message = '';
  private annotations: Annotation[] = [];
  private annotationsPagePath: string | null = null;
  private lastKnownPagePath: string | null = null;
  private isLoading = false;
  private isSubmitting = false;
  private status: string | null = null;
  private statusType: 'error' | 'success' | null = null;
  private authState: 'unauthenticated' | 'validating' | 'authenticated' = 'unauthenticated';
  private validatedAuthToken: string | null = null;
  private authAttempt = 0;
  private listGeneration = 0;
  private listAbortController: AbortController | null = null;
  private submitGeneration = 0;
  private submitAbortController: AbortController | null = null;
  private reorderGeneration = 0;
  private reorderAbortController: AbortController | null = null;
  private resolveGeneration = 0;
  private resolveRequests = new Map<string, { generation: number; controller: AbortController }>();
  private locatedTarget: PickerTarget | null = null;
  private selectedElement: HTMLElement | null = null;
  private selectionPath: HTMLElement[] = [];
  private dodgeX = 0;
  // Launcher: free-drag, collapse-to-edge, hover-peek.
  private launcherCollapsed = false;
  private launcherFloating = false;
  private launcherPos: { x: number; y: number } | null = null;
  private dragState: { startX: number; startY: number; moved: boolean; originX: number; originY: number } | null = null;
  private suppressNextClick = false;
  private showProperties = false;
  private propertyChanges: Record<string, { from: string; to: string }> = {};

  // Drag-and-drop state
  private dragSrcId: string | null = null;
  private dragOverId: string | null = null;
  private dragOverPos: 'before' | 'after' = 'before';

  // DOM refs
  private shadow: ShadowRoot | null = null;
  private overlayEl: HTMLElement | null = null;
  private panelEl: HTMLElement | null = null;
  private launcherEl: HTMLButtonElement | null = null;

  // Event handler refs (for cleanup)
  private boundMove: ((e: MouseEvent) => void) | null = null;
  private boundClick: ((e: MouseEvent) => void) | null = null;
  /** Videos we paused on entering picking mode; resumed on cleanup. */
  private pausedVideos: HTMLVideoElement[] = [];
  private pointerRef: { clientX: number; clientY: number } | null = null;
  private locateTimeout: number | undefined;
  private rafId: number | undefined;

  static get observedAttributes(): string[] {
    return ['accent', VISIBLE_ATTR, REQUIRE_AUTH_ATTR, POSITION_ATTR];
  }

  attributeChangedCallback(name: string, _old: string, value: string): void {
    if (name === 'accent' && this.shadow) {
      this.style.setProperty(`${CSS_VAR_PREFIX}-accent`, value);
    }
    if (name === VISIBLE_ATTR) {
      this.updateVisibility();
    }
    if (name === POSITION_ATTR) {
      this.applyDodgeSign();
    }
    if (name === REQUIRE_AUTH_ATTR) {
      this.syncAuthRequirement();
    }
  }

  get visible(): boolean {
    return this.hasAttribute(VISIBLE_ATTR);
  }

  set visible(value: boolean) {
    if (value) {
      this.setAttribute(VISIBLE_ATTR, '');
    } else {
      this.removeAttribute(VISIBLE_ATTR);
    }
  }

  /**
   * When enabled, the tool stays locked until a valid access token is
   * present (captured from ?pm_token= sharing links, or entered into the
   * lock panel). Off by default — small sites should not have to bother.
   */
  get requireAuth(): boolean {
    // The SSR fallback base class intentionally has no DOM attribute methods.
    // Keeping this guard makes internal logic testable before custom elements
    // exist, and keeps importing the package on the server inert.
    return typeof this.hasAttribute === 'function' && this.hasAttribute(REQUIRE_AUTH_ATTR);
  }

  set requireAuth(value: boolean) {
    if (value) {
      this.setAttribute(REQUIRE_AUTH_ATTR, '');
    } else {
      this.removeAttribute(REQUIRE_AUTH_ATTR);
    }
  }

  /**
   * Attribute changes may happen while a panel is already open. Resetting the
   * validated session here prevents a late `require-auth` toggle from leaving
   * the old picker/list controls usable without a server round-trip.
   */
  private syncAuthRequirement(): void {
    this.authAttempt += 1;
    this.validatedAuthToken = null;
    this.authState = this.requireAuth ? 'unauthenticated' : 'authenticated';
    if (!this.isConnected) return;

    if (this.requireAuth) {
      if (this.mode !== 'closed') this.ensureAuthorizedSession();
    } else if (this.mode === 'locked') {
      this.startPicking();
    }
  }

  /**
   * Dock position of the launcher/panel: right-center (default), right-top,
   * right-bottom, left-center, left-top, left-bottom. The panel slides to
   * the opposite side when it covers the selection (dodge), so left positions
   * dodge rightwards.
   */
  get position(): string {
    return this.getAttribute(POSITION_ATTR) ?? 'right-center';
  }

  set position(value: string) {
    if (value) this.setAttribute(POSITION_ATTR, value);
    else this.removeAttribute(POSITION_ATTR);
  }

  private get dockSide(): 'left' | 'right' {
    return this.position.startsWith('left') ? 'left' : 'right';
  }

  private applyDodgeSign(): void {
    this.style.setProperty(`${CSS_VAR_PREFIX}-dodge-sign`, this.dockSide === 'left' ? '1' : '-1');
  }

  private applyTheme(): void {
    if (!this.shadow) return;
    const set = (name: string, value: string | undefined): void => {
      if (value) this.style.setProperty(name, value);
      else this.style.removeProperty(name);
    };
    set(`${CSS_VAR_PREFIX}-accent`, this._theme.accent);
    set(`${CSS_VAR_PREFIX}-accent-dark`, this._theme.accentDark);
    set(`${CSS_VAR_PREFIX}-accent-soft`, this._theme.accentSoft);
  }

  private updateVisibility(): void {
    const isVisible = this.visible;
    if (this.launcherEl) {
      this.launcherEl.style.display = isVisible ? '' : 'none';
    }
    if (!isVisible && this.mode !== 'closed') {
      this.closeTool();
    }
  }

  connectedCallback(): void {
    injectGlobalStyles();

    // Re-attachment guard: moving this element in the DOM re-fires
    // connectedCallback, and attachShadow throws when a root already exists.
    // Reuse the existing shadow (its DOM-level listeners survive); only
    // document-level listeners need re-registering below.
    const reattached = this.shadowRoot !== null;
    if (reattached) {
      this.shadow = this.shadowRoot;
    } else {
      this.shadow = this.attachShadow({ mode: 'open' });

      // Inject styles
      const styleEl = document.createElement('style');
      styleEl.textContent = shadowStyles;
      this.shadow.appendChild(styleEl);

      // Build overlay container
      this.overlayEl = document.createElement('div');
      this.overlayEl.className = `${CLASS_PREFIX}-overlay`;
      this.overlayEl.style.display = 'none';
      this.overlayEl.setAttribute(UI_ATTR, '');
      this.shadow.appendChild(this.overlayEl);

      // Build panel container
      this.panelEl = document.createElement('div');
      this.panelEl.className = `${CLASS_PREFIX}-panel`;
      this.panelEl.style.display = 'none';
      this.panelEl.setAttribute(UI_ATTR, '');
      this.shadow.appendChild(this.panelEl);

      // Build launcher
      this.launcherEl = document.createElement('button');
      this.launcherEl.className = `${CLASS_PREFIX}-launcher`;
      this.launcherEl.type = 'button';
      this.setupLauncherInteraction();
      this.shadow.appendChild(this.launcherEl);
      this.restoreLauncherState();

      // Delegate panel clicks
      this.panelEl.addEventListener('click', (e) => this.handlePanelClick(e));
      this.panelEl.addEventListener('input', (e) => this.handlePanelInput(e));
      this.panelEl.addEventListener('keydown', (e) => this.handlePanelKeyDown(e));

      // Drag-and-drop for list reordering
      this.panelEl.addEventListener('mousedown', (e) => this.handleDragHandleDown(e));
      this.panelEl.addEventListener('mouseup', () => this.resetDraggable());
      this.panelEl.addEventListener('dragstart', (e) => this.handleDragStart(e));
      this.panelEl.addEventListener('dragover', (e) => this.handleDragOver(e));
      this.panelEl.addEventListener('drop', (e) => this.handleDrop(e));
      this.panelEl.addEventListener('dragend', () => this.handleDragEnd());
    }

    // Global shortcuts (Escape / Cmd+Enter); inert while the tool is closed
    document.addEventListener('keydown', this.globalKeyDownHandler);
    this.lastKnownPagePath = this.currentPagePath();
    window.addEventListener('popstate', this.routeChangeHandler);
    window.addEventListener('hashchange', this.routeChangeHandler);

    if (reattached) {
      // disconnectedCallback tore down the mode-specific listeners while
      // the tool was open — restore them for the current mode.
      if (this.mode === 'picking') this.setupPicking();
      else if (this.mode === 'compose') this.setupComposeTracking();
      this.updateOverlay();
    }

    // Apply theme overrides
    this.applyTheme();
    this.applyDodgeSign();

    this.updateVisibility();
    this.updatePanel();
  }

  disconnectedCallback(): void {
    this.cancelListRequest();
    this.cancelSubmitRequest();
    this.cancelMutationRequests();
    this.cleanupPicking();
    this.cleanupComposeTracking();
    this.releaseActiveInstance();
    document.removeEventListener('keydown', this.globalKeyDownHandler);
    window.removeEventListener('popstate', this.routeChangeHandler);
    window.removeEventListener('hashchange', this.routeChangeHandler);
    document.removeEventListener('pointermove', this.boundLauncherMove);
    document.removeEventListener('pointerup', this.boundLauncherUp);
    document.removeEventListener('pointercancel', this.boundLauncherUp);
    window.clearTimeout(this.locateTimeout);
    if (this.rafId !== undefined) window.cancelAnimationFrame(this.rafId);
  }

  // ---- Public API ----

  open(): void {
    this.openTool();
  }

  close(): void {
    this.closeTool();
  }

  // ---- Mode transitions ----

  private claimActiveInstance(): void {
    if (activeInstance && activeInstance !== this) activeInstance.closeTool();
    activeInstance = this;
  }

  private releaseActiveInstance(): void {
    if (activeInstance === this) activeInstance = null;
  }

  private currentPagePath(): string {
    const configured = this.pageKey?.trim();
    if (configured) return configured;
    const location = window.location;
    return `${location.pathname || '/'}${location.search ?? ''}${location.hash ?? ''}`;
  }

  /**
   * Browser back/forward and hash navigation are observable without patching
   * the host app's History API. Apps using pushState should set pageKey from
   * their router; its setter takes the same safe transition below.
   */
  private routeChangeHandler = (): void => {
    this.syncPageIdentity();
  };

  private syncPageIdentity(): void {
    if (!this.shadow) return;
    const pagePath = this.currentPagePath();
    if (pagePath === this.lastKnownPagePath) return;
    this.lastKnownPagePath = pagePath;

    // Do not let a request or cached row from the prior route leak into the
    // newly rendered route. An aborted remote write may still reach a server,
    // but its response is generation-guarded and can never mutate this view.
    this.cancelListRequest();
    this.cancelSubmitRequest();
    this.cancelMutationRequests();
    this.annotations = [];
    this.annotationsPagePath = null;
    this.locatedTarget = null;

    // Authorization is scoped by pageKey too. Revalidate on navigation rather
    // than treating a token accepted for one protected route as global proof.
    if (this.requireAuth && this.mode !== 'closed') {
      this.authAttempt += 1;
      this.authState = 'unauthenticated';
      this.validatedAuthToken = null;
      this.ensureAuthorizedSession();
      return;
    }

    if (this.mode === 'list') {
      void this.loadAnnotations();
      return;
    }
    if (this.mode === 'compose' && this.selectedPagePath !== null && this.selectedPagePath !== pagePath) {
      this.status = 'The page changed. Select the element again before submitting feedback.';
      this.statusType = 'error';
    }
    this.updateOverlay();
    this.updatePanel();
  }

  private handleStoreChange(): void {
    if (!this.shadow) return;
    this.cancelListRequest();
    this.cancelSubmitRequest();
    this.cancelMutationRequests();
    this.annotations = [];
    this.annotationsPagePath = null;

    if (this.requireAuth && this.mode !== 'closed') {
      this.authAttempt += 1;
      this.authState = 'unauthenticated';
      this.validatedAuthToken = null;
      this.ensureAuthorizedSession();
      return;
    }
    if (this.mode === 'list') {
      void this.loadAnnotations();
      return;
    }
    this.updatePanel();
  }

  private cancelListRequest(): void {
    this.listGeneration += 1;
    this.listAbortController?.abort();
    this.listAbortController = null;
    this.isLoading = false;
  }

  private cancelSubmitRequest(): void {
    this.submitGeneration += 1;
    this.submitAbortController?.abort();
    this.submitAbortController = null;
    this.isSubmitting = false;
  }

  private cancelMutationRequests(): void {
    this.reorderGeneration += 1;
    this.reorderAbortController?.abort();
    this.reorderAbortController = null;
    this.resolveGeneration += 1;
    for (const request of this.resolveRequests.values()) request.controller.abort();
    this.resolveRequests.clear();
  }

  /** Move the open panel to a non-interactive state without retaining data. */
  private enterLockedMode(message: string | null = null): void {
    this.cancelListRequest();
    this.cancelSubmitRequest();
    this.cancelMutationRequests();
    this.mode = 'locked';
    this.hoveredTarget = null;
    this.locatedTarget = null;
    this.selectedTarget = null;
    this.selectedPagePath = null;
    this.selectedRange = null;
    this.selectedElement = null;
    this.selectionPath = [];
    this.pointerRef = null;
    this.message = '';
    this.annotations = [];
    this.annotationsPagePath = null;
    this.showProperties = false;
    this.propertyChanges = {};
    this.status = message;
    this.statusType = message ? 'error' : null;
    this.cleanupPicking();
    this.cleanupComposeTracking();
    this.setDodgeSide('dock');
    this.updateOverlay();
    this.updatePanel();
  }

  /**
   * In require-auth mode, a token must have been validated by the store for
   * this exact browser session. Presence in localStorage alone is not access.
   */
  private ensureAuthorizedSession(): boolean {
    if (!this.requireAuth) return true;
    const token = getAuthToken();
    if (token && this.authState === 'authenticated' && this.validatedAuthToken === token) {
      return true;
    }
    if (!token) {
      this.enterLockedMode();
    } else if (this.authState !== 'validating') {
      void this.validateAccess(token);
    }
    return false;
  }

  private async validateAccess(token: string): Promise<void> {
    if (!this.store.validateAccess) {
      this.authState = 'unauthenticated';
      this.validatedAuthToken = null;
      this.enterLockedMode('require-auth needs a server-backed store with validateAccess().');
      return;
    }

    const attempt = ++this.authAttempt;
    this.authState = 'validating';
    this.validatedAuthToken = null;
    this.enterLockedMode();
    try {
      await this.store.validateAccess({ pagePath: this.currentPagePath() });
      // A user may have pasted a replacement token while this request was in
      // flight. Never upgrade the newer session based on an older response.
      if (
        attempt !== this.authAttempt ||
        !this.requireAuth ||
        getAuthToken() !== token
      ) return;
      this.authState = 'authenticated';
      this.validatedAuthToken = token;
      this.startPicking();
    } catch (error) {
      if (attempt !== this.authAttempt || getAuthToken() !== token) return;
      if (!this.handleStoreError(error, { operation: 'list' }, token, attempt)) {
        this.authState = 'unauthenticated';
        this.validatedAuthToken = null;
        this.enterLockedMode(error instanceof Error ? error.message : 'Could not validate access.');
      }
    }
  }

  // Single entry point for opening the tool. Authenticated stores validate the
  // token before exposing either picker or list controls.
  private openTool(): void {
    this.claimActiveInstance();
    if (!this.ensureAuthorizedSession()) return;
    this.startPicking();
  }

  private closeTool(): void {
    this.cancelListRequest();
    this.cancelSubmitRequest();
    this.cancelMutationRequests();
    this.mode = 'closed';
    this.hoveredTarget = null;
    this.selectedTarget = null;
    this.selectedPagePath = null;
    this.selectedRange = null;
    this.selectedElement = null;
    this.pointerRef = null;
    this.message = '';
    this.annotations = [];
    this.annotationsPagePath = null;
    this.status = null;
    this.statusType = null;
    this.showProperties = false;
    this.propertyChanges = {};
    this.cleanupPicking();
    this.cleanupComposeTracking();
    this.releaseActiveInstance();
    this.setDodgeSide('dock');
    this.updateOverlay();
    this.updatePanel();
  }

  private startPicking(): void {
    if (!this.ensureAuthorizedSession()) return;
    this.claimActiveInstance();
    this.cancelListRequest();
    this.mode = 'picking';
    this.hoveredTarget = null;
    this.selectedTarget = null;
    this.selectedPagePath = null;
    this.selectedRange = null;
    this.selectedElement = null;
    this.pointerRef = null;
    this.message = '';
    this.status = null;
    this.statusType = null;
    this.showProperties = false;
    this.propertyChanges = {};
    this.cleanupComposeTracking();
    this.setupPicking();
    this.updateOverlay();
    this.updatePanel();
  }

  private async openList(): Promise<void> {
    if (!this.ensureAuthorizedSession()) return;
    this.claimActiveInstance();
    this.mode = 'list';
    // Picking's mousemove listener keeps re-adding is-ghost (transparent,
    // pointer-events:none) as long as it runs; tear it down or the list
    // panel comes up ghosted and unclickable when entered from picking.
    this.cleanupPicking();
    this.cleanupComposeTracking();
    this.updateOverlay();
    this.updatePanel();
    await this.loadAnnotations();
  }

  // ---- Picking mode ----

  private setupPicking(): void {
    // Re-entry guard: a second startPicking (panel "picker" tab, open() API)
    // must not leak the previous listeners or strand the videos we paused.
    this.cleanupPicking();
    activePicker = this;

    this.boundMove = (e: MouseEvent) => this.handleMove(e);
    this.boundClick = (e: MouseEvent) => this.handleClick(e);

    document.addEventListener('mousemove', this.boundMove, true);
    document.addEventListener('click', this.boundClick, true);
    document.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('scroll', this.refreshHover, true);
    window.addEventListener('resize', this.refreshHover);

    document.documentElement.classList.add(PICKER_ACTIVE_CLASS);

    // Freeze looping background videos for a stable picking target (CSS
    // animations are paused by the picker-active global styles). Only the
    // videos we paused get resumed in cleanupPicking.
    this.pausedVideos = [];
    document.querySelectorAll('video').forEach((video) => {
      if (!video.paused) {
        video.pause();
        this.pausedVideos.push(video);
      }
    });
  }

  private cleanupPicking(): void {
    if (activePicker === this) {
      document.documentElement.classList.remove(PICKER_ACTIVE_CLASS);
      activePicker = null;
    }
    this.panelEl?.classList.remove('is-ghost');

    if (this.boundMove) document.removeEventListener('mousemove', this.boundMove, true);
    if (this.boundClick) document.removeEventListener('click', this.boundClick, true);
    document.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('scroll', this.refreshHover, true);
    window.removeEventListener('resize', this.refreshHover);

    this.boundMove = null;
    this.boundClick = null;

    for (const video of this.pausedVideos) {
      // A video that ended on its own while paused must not restart from zero.
      if (!video.ended) video.play().catch(() => {});
    }
    this.pausedVideos = [];

    if (this.rafId !== undefined) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  private getTargetAtPoint(clientX: number, clientY: number): PickerTarget | null {
    const element = document.elementFromPoint(clientX, clientY);
    if (!(element instanceof HTMLElement)) return null;
    // Page background clicks yield an empty selector that can never be
    // located later — treat them as no target.
    if (element === document.body || element === document.documentElement) return null;
    // Exclude the component itself
    if (element.closest(ELEMENT_TAG)) return null;

    const rect = element.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return null;

    return {
      ...describeElement(element),
      viewportRect: rect,
      hoverInfo: computeHoverInfo(element),
    };
  }

  private handleMove(e: MouseEvent): void {
    this.pointerRef = { clientX: e.clientX, clientY: e.clientY };
    this.updatePickingGhost(e.clientX, e.clientY);
    this.hoveredTarget = this.getTargetAtPoint(e.clientX, e.clientY);
    this.updateOverlay();
  }

  // Picking mode: pointer over the panel body ghosts the panel (see styles)
  // so elements underneath stay hoverable; the header strip stays interactive.
  private updatePickingGhost(x: number, y: number): void {
    if (!this.panelEl || this.panelEl.style.display === 'none') return;
    const rect = this.panelEl.getBoundingClientRect();
    const header = this.panelEl.querySelector(`.${CLASS_PREFIX}-panel-header`);
    const headerBottom = header ? header.getBoundingClientRect().bottom : rect.top;
    const inBody = x >= rect.left && x <= rect.right && y >= headerBottom && y <= rect.bottom;
    this.panelEl.classList.toggle('is-ghost', inBody);
  }

  private handleClick(e: MouseEvent): void {
    const target = this.getTargetAtPoint(e.clientX, e.clientY);
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const element = document.elementFromPoint(e.clientX, e.clientY);
    this.enterCompose(toElementTarget(target), element instanceof HTMLElement ? element : null);
  }

  // Text-selection annotations: dragging across text in picking mode turns
  // the selection into an annotation target — the quote is what the agent
  // greps for; the ancestor element supplies selector/styles.
  private handleMouseUp = (e: MouseEvent): void => {
    if (this.mode !== 'picking') return;
    if (e.button !== 0) return;
    // Events originating from our own UI must not start an annotation.
    if (e.composedPath().includes(this)) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;
    const quote = selection.toString().replace(/\s+/g, ' ').trim();
    if (!quote) return;
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const element = container instanceof HTMLElement ? container : container.parentElement;
    // Same guard as getTargetAtPoint: a body/html ancestor yields an empty
    // selector that could never be located later.
    if (!element || element === document.body || element === document.documentElement) return;
    if (element.closest(ELEMENT_TAG)) return;
    const rect = range.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    this.enterCompose(
      {
        ...describeElement(element),
        quote: quote.slice(0, 240),
        rect: {
          top: Math.round(rect.top + window.scrollY),
          left: Math.round(rect.left + window.scrollX),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      },
      element,
      range.cloneRange(),
    );
    // Our overlay draws the persistent frame; the native selection would
    // fight it visually.
    selection.removeAllRanges();

    // The browser still dispatches a click to the gesture's common ancestor
    // after the mouseup that formed the selection. Our capture listener is
    // already gone (cleanupPicking ran inside enterCompose), so without this
    // one-shot suppressor the stray click reaches the page — toggling
    // checkboxes inside labels, following links, opening modals.
    const suppress = (ev: Event): void => {
      ev.preventDefault();
      ev.stopPropagation();
    };
    document.addEventListener('click', suppress, { capture: true, once: true });
    // Disarm if the next mousedown arrives first (the gesture produced no
    // click, e.g. mouseup happened outside the window) so the suppressor
    // can't eat a later, legitimate click.
    document.addEventListener(
      'mousedown',
      () => document.removeEventListener('click', suppress, true),
      { capture: true, once: true },
    );
  };

  private enterCompose(target: ElementTarget, element: HTMLElement | null, range: Range | null = null): void {
    this.selectedTarget = target;
    this.selectedPagePath = this.currentPagePath();
    this.selectedRange = range;
    this.selectedElement = element;
    this.selectionPath = [];
    this.hoveredTarget = null;
    this.showProperties = false;
    this.propertyChanges = {};
    this.mode = 'compose';
    this.cleanupPicking();
    this.setupComposeTracking();
    this.updatePanel();
    this.updateOverlay();

    // Focus the textarea
    const textarea = this.panelEl?.querySelector('textarea');
    if (textarea) textarea.focus();
  }

  // Global keyboard shortcuts. Escape unwinds one layer at a time
  // (compose → picking → closed; list/locked → closed); Cmd/Ctrl+Enter from
  // inside the panel submits the annotation. Inert while the tool is closed
  // and during IME composition (CJK Esc/Enter belong to the candidate window).
  private globalKeyDownHandler = (e: KeyboardEvent): void => {
    if (e.isComposing) return;

    if (e.key === 'Escape') {
      if (this.mode === 'picking' || this.mode === 'list' || this.mode === 'locked') {
        this.closeTool();
      } else if (this.mode === 'compose') {
        // Back to picking, but keep the draft so re-selecting an element
        // restores the text instead of losing it.
        const draft = this.message;
        this.startPicking();
        this.message = draft;
      }
      return;
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && this.mode === 'compose') {
      // Only honor Cmd/Ctrl+Enter from inside our own panel — the host
      // page's binding (if any) keeps working while the panel is open.
      if (!this.panelEl || !e.composedPath().includes(this.panelEl)) return;
      if (this.message.trim() && !this.isSubmitting) {
        e.preventDefault();
        this.submitAnnotation();
      }
    }
  };

  private refreshHover = (): void => {
    if (!this.pointerRef) return;
    if (this.rafId !== undefined) window.cancelAnimationFrame(this.rafId);
    this.rafId = window.requestAnimationFrame(() => {
      if (this.pointerRef) {
        this.hoveredTarget = this.getTargetAtPoint(this.pointerRef.clientX, this.pointerRef.clientY);
        this.updateOverlay();
      }
    });
  };

  // Keep the selected element's frame in sync with scroll/resize while composing
  private refreshSelected = (): void => {
    if (this.rafId !== undefined) window.cancelAnimationFrame(this.rafId);
    this.rafId = window.requestAnimationFrame(() => this.updateOverlay());
  };

  private setupComposeTracking(): void {
    window.addEventListener('scroll', this.refreshSelected, true);
    window.addEventListener('resize', this.refreshSelected);
  }

  private cleanupComposeTracking(): void {
    window.removeEventListener('scroll', this.refreshSelected, true);
    window.removeEventListener('resize', this.refreshSelected);
  }

  // ---- Selection level navigation (expand to parent / shrink to child) ----

  private canExpandSelection(): boolean {
    const parent = this.selectedElement?.parentElement;
    return !!parent &&
      parent !== document.body &&
      parent !== document.documentElement &&
      !parent.closest(ELEMENT_TAG);
  }

  private canShrinkSelection(): boolean {
    if (this.selectionPath.length > 0) return true;
    const child = this.selectedElement?.firstElementChild;
    return child instanceof HTMLElement && !child.closest(ELEMENT_TAG);
  }

  private expandSelection(): void {
    const element = this.selectedElement;
    if (!element || !this.canExpandSelection()) return;
    this.selectionPath.push(element);
    this.applySelectedElement(element.parentElement!);
  }

  private shrinkSelection(): void {
    // Prefer retracing the path we expanded through; otherwise dive into the first child
    const fromPath = this.selectionPath.pop();
    if (fromPath?.isConnected) {
      this.applySelectedElement(fromPath);
      return;
    }
    const child = this.selectedElement?.firstElementChild;
    if (child instanceof HTMLElement && !child.closest(ELEMENT_TAG)) {
      this.applySelectedElement(child);
    }
  }

  private applySelectedElement(element: HTMLElement): void {
    const priorQuote = this.selectedTarget?.quote;
    const priorQuoteRect = this.selectedTarget?.rect;
    this.selectedElement = element;
    this.selectedTarget = priorQuote && priorQuoteRect
      ? { ...describeElement(element), quote: priorQuote, rect: priorQuoteRect }
      : describeElement(element);
    // Property changes referred to the previous element's computed values
    this.propertyChanges = {};
    this.updatePanel();
    this.updateOverlay();
  }

  // ---- Panel dodge (slide to the other side when covering the selection) ----

  // 'dock' = return to the docked side (no offset); 'away' = slide to the
  // opposite side to stop covering the selected element.
  private setDodgeSide(mode: 'dock' | 'away'): void {
    if (mode === 'dock') {
      if (this.dodgeX === 0) return;
      this.dodgeX = 0;
      this.style.setProperty(`${CSS_VAR_PREFIX}-dodge-x`, '0px');
      return;
    }
    if (this.dodgeX > 0) return; // already dodged

    const anchor = this.panelEl && this.panelEl.style.display !== 'none' ? this.panelEl : this.launcherEl;
    if (!anchor) return;
    const margin = 20;
    const rect = anchor.getBoundingClientRect();
    const target = this.dockSide === 'right'
      ? Math.round(rect.left - margin)                       // slide left
      : Math.round(window.innerWidth - rect.right - margin); // slide right
    if (target <= margin) return; // no room on the opposite side
    this.dodgeX = target;
    this.style.setProperty(`${CSS_VAR_PREFIX}-dodge-x`, `${target}px`);
  }

  // Compose mode: if the selected element sits under the panel, slide the
  // panel to the opposite side. Triggered by element position, not pointer.
  private updateComposeDodge(elementRect: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  }): void {
    if (!this.panelEl || window.innerWidth <= 640) return;
    const panelRect = this.panelEl.getBoundingClientRect();
    const overlaps =
      elementRect.right > panelRect.left &&
      elementRect.left < panelRect.right &&
      elementRect.bottom > panelRect.top &&
      elementRect.top < panelRect.bottom;
    if (!overlaps) {
      this.setDodgeSide('dock');
      return;
    }
    const elementCenter = (elementRect.left + elementRect.right) / 2;
    const elementOnDockSide = this.dockSide === 'right'
      ? elementCenter > window.innerWidth / 2
      : elementCenter < window.innerWidth / 2;
    this.setDodgeSide(elementOnDockSide ? 'away' : 'dock');
  }

  // ---- Data operations ----

  private reportError(error: unknown, context: PatchMarkErrorContext): void {
    const err = error instanceof Error ? error : new Error(String(error));
    if (this.onError) {
      try {
        this.onError(err, context);
      } catch {
        // A broken consumer error handler must not break the tool.
      }
    } else {
      console.warn(`[patch-mark] ${context.operation} failed:`, err);
    }
  }

  /**
   * Reports a store failure and, when the backend rejected the token (401),
   * drops into locked mode. Returns true for auth failures so the caller can
   * skip its generic error handling.
   */
  private handleStoreError(
    error: unknown,
    context: PatchMarkErrorContext,
    tokenAtStart: string | null = getAuthToken(),
    authAttemptAtStart = this.authAttempt,
  ): boolean {
    this.reportError(error, context);
    if (!isAuthError(error)) return false;

    // Ignore an old 401 when the user has already supplied a newer token or
    // when a new auth check superseded this request. Otherwise a slow failure
    // can re-lock a valid, freshly authenticated session.
    if (authAttemptAtStart !== this.authAttempt || tokenAtStart !== getAuthToken()) return true;

    clearAuthToken();
    this.authAttempt += 1;
    this.authState = 'unauthenticated';
    this.validatedAuthToken = null;
    this.enterLockedMode(this.labels.lockedError ?? '令牌无效或已过期，请重新获取。');
    return true;
  }

  private async loadAnnotations(): Promise<void> {
    const tokenAtStart = getAuthToken();
    const authAttemptAtStart = this.authAttempt;
    const pagePath = this.currentPagePath();
    this.cancelListRequest();
    const generation = ++this.listGeneration;
    const controller = new AbortController();
    this.listAbortController = controller;
    const isCurrentRequest = (): boolean =>
      generation === this.listGeneration &&
      this.listAbortController === controller &&
      this.mode === 'list' &&
      this.currentPagePath() === pagePath;

    if (this.annotationsPagePath !== pagePath) {
      this.annotations = [];
      this.annotationsPagePath = null;
    }
    this.isLoading = true;
    this.status = null;
    this.statusType = null;
    this.updatePanel();

    try {
      // Stores are public extension points. Validate their output at the UI
      // boundary as well as in the built-in adapters, so a malformed custom
      // store response can never become executable DOM below.
      const annotations = parseAnnotations(await this.store.list(pagePath, { signal: controller.signal }));
      if (!isCurrentRequest()) return;
      this.annotations = annotations;
      this.annotationsPagePath = pagePath;
    } catch (error) {
      if (!isCurrentRequest() || isAbortError(error)) return;
      if (!this.handleStoreError(error, { operation: 'list' }, tokenAtStart, authAttemptAtStart)) {
        this.status = error instanceof Error ? error.message : this.labels.loading;
        this.statusType = 'error';
      }
    } finally {
      if (!isCurrentRequest()) return;
      this.isLoading = false;
      this.listAbortController = null;
      this.updatePanel();
    }
  }

  private getChanges(): PropertyChange[] {
    return Object.entries(this.propertyChanges).map(
      ([property, { from, to }]) => ({ property, from, to }),
    );
  }

  private hasSameChanges(changes: PropertyChange[]): boolean {
    const current = this.getChanges();
    return current.length === changes.length && current.every((change) =>
      changes.some((submitted) =>
        submitted.property === change.property &&
        submitted.from === change.from &&
        submitted.to === change.to,
      ),
    );
  }

  private async submitAnnotation(): Promise<void> {
    const submittedTarget = this.selectedTarget;
    const submittedMessage = this.message.trim();
    const submittedChanges = this.getChanges();
    const pagePath = this.currentPagePath();
    if (!submittedTarget || !submittedMessage || this.isSubmitting || !this.ensureAuthorizedSession()) return;
    if (this.selectedPagePath !== null && this.selectedPagePath !== pagePath) {
      this.status = 'The page changed. Select the element again before submitting feedback.';
      this.statusType = 'error';
      this.updatePanel();
      return;
    }

    const tokenAtStart = getAuthToken();
    const authAttemptAtStart = this.authAttempt;
    this.submitAbortController?.abort();
    const generation = ++this.submitGeneration;
    const controller = new AbortController();
    this.submitAbortController = controller;
    const isCurrentRequest = (): boolean =>
      generation === this.submitGeneration &&
      this.submitAbortController === controller &&
      this.currentPagePath() === pagePath;

    this.isSubmitting = true;
    this.status = null;
    this.statusType = null;
    this.updatePanel();

    try {
      const input = parseCreateAnnotation({
        pagePath,
        pageTitle: document.title,
        message: submittedMessage,
        element: submittedTarget,
        changes: submittedChanges,
      });
      const annotation = parseAnnotation(await this.store.create(input, { signal: controller.signal }));
      if (!isCurrentRequest()) return;
      if (this.annotationsPagePath === null || this.annotationsPagePath === pagePath) {
        this.annotations = [annotation, ...this.annotations];
        this.annotationsPagePath = pagePath;
      }
      // Keep the capture loop moving: after a successful save, return to
      // picking so the next element can be annotated immediately. The list
      // remains available as an explicit tab instead of interrupting a batch.
      // If the user already changed context while a slow store was saving,
      // leave that newer mode/draft alone when the old request completes.
      if (
        this.mode === 'compose' &&
        this.selectedTarget === submittedTarget &&
        this.message.trim() === submittedMessage &&
        this.hasSameChanges(submittedChanges)
      ) {
        this.startPicking();
      }
    } catch (error) {
      if (!isCurrentRequest() || isAbortError(error)) return;
      if (!this.handleStoreError(error, { operation: 'create' }, tokenAtStart, authAttemptAtStart)) {
        this.status = error instanceof Error ? error.message : 'Failed to submit.';
        this.statusType = 'error';
      }
    } finally {
      if (!isCurrentRequest()) return;
      this.isSubmitting = false;
      this.submitAbortController = null;
      this.updatePanel();
    }
  }

  private locateAnnotation(annotation: Annotation): void {
    let element: Element | null = null;
    try {
      element = document.querySelector(annotation.element.selector);
    } catch {
      element = null;
    }

    if (!(element instanceof HTMLElement)) {
      this.status = this.labels.notFound;
      this.statusType = 'error';
      this.updatePanel();
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.clearTimeout(this.locateTimeout);
    this.locateTimeout = window.setTimeout(() => {
      if (!element?.isConnected) return;
      this.locatedTarget = {
        ...describeElement(element),
        viewportRect: element.getBoundingClientRect(),
        hoverInfo: computeHoverInfo(element),
      };
      this.updateOverlay();
      this.locateTimeout = window.setTimeout(() => {
        this.locatedTarget = null;
        this.updateOverlay();
      }, 1800);
    }, 350);
  }

  private async resolveAnnotation(id: string): Promise<void> {
    const storeAtStart = this.store;
    const update = storeAtStart.update;
    if (!update || !this.ensureAuthorizedSession()) return;
    const tokenAtStart = getAuthToken();
    const authAttemptAtStart = this.authAttempt;
    const pagePath = this.currentPagePath();
    this.resolveRequests.get(id)?.controller.abort();
    const request = { generation: ++this.resolveGeneration, controller: new AbortController() };
    this.resolveRequests.set(id, request);
    const isCurrentRequest = (): boolean =>
      this.resolveRequests.get(id) === request &&
      this.store === storeAtStart &&
      this.mode === 'list' &&
      this.currentPagePath() === pagePath &&
      this.annotationsPagePath === pagePath;
    // Keep the operation idempotent from the user's perspective while the
    // backend request is in flight; the item re-enables in finally below.
    this.updatePanel();
    try {
      const updated = parseAnnotation(await update.call(
        storeAtStart,
        id,
        { status: 'resolved' },
        { pagePath, signal: request.controller.signal },
      ));
      if (!isCurrentRequest()) return;
      this.annotations = this.annotations.map((a) => (a.id === id ? updated : a));
    } catch (error) {
      if (!isCurrentRequest() || isAbortError(error)) return;
      if (!this.handleStoreError(error, { operation: 'resolve', annotationId: id }, tokenAtStart, authAttemptAtStart)) {
        this.status = error instanceof Error ? error.message : 'Failed to resolve.';
        this.statusType = 'error';
      }
    } finally {
      if (this.resolveRequests.get(id) === request) {
        this.resolveRequests.delete(id);
        if (
          this.mode === 'list' &&
          this.store === storeAtStart &&
          this.currentPagePath() === pagePath &&
          this.annotationsPagePath === pagePath
        ) {
          this.updatePanel();
        }
      }
    }
  }

  /** Validate a token entered in the lock panel by loading the list. */
  private async unlock(token: string): Promise<void> {
    setAuthToken(token);
    this.authState = 'unauthenticated';
    this.validatedAuthToken = null;
    // A wrong token comes back as a 401, and handleStoreError clears it before
    // returning to the lock panel.
    void this.validateAccess(getAuthToken()!);
  }

  // ---- Drag-and-drop reordering ----

  private handleDragHandleDown(e: MouseEvent): void {
    if (!this.store.reorder || this.reorderAbortController) return;
    const target = e.target as HTMLElement;
    const handle = target.closest('[data-drag-handle]');
    if (!handle) return;
    const article = handle.closest(`.${CLASS_PREFIX}-item`);
    if (article instanceof HTMLElement) {
      article.draggable = true;
    }
  }

  private resetDraggable(): void {
    if (!this.panelEl) return;
    this.panelEl.querySelectorAll(`.${CLASS_PREFIX}-item[draggable="true"]`).forEach((el) => {
      (el as HTMLElement).draggable = false;
    });
  }

  private handleDragStart(e: DragEvent): void {
    if (!this.store.reorder || this.reorderAbortController) return;
    const article = (e.target as HTMLElement).closest(`.${CLASS_PREFIX}-item`);
    if (!article) return;
    const id = article.getAttribute('data-annotation-id');
    if (!id) return;
    this.dragSrcId = id;
    article.classList.add('is-dragging');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', id);
    }
  }

  private handleDragOver(e: DragEvent): void {
    if (!this.dragSrcId) return;
    const article = (e.target as HTMLElement).closest(`.${CLASS_PREFIX}-item`);
    if (!article) return;
    const id = article.getAttribute('data-annotation-id');
    if (!id || id === this.dragSrcId) return;

    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }

    const rect = article.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const pos: 'before' | 'after' = e.clientY < midpoint ? 'before' : 'after';

    this.clearDragIndicators();
    this.dragOverId = id;
    this.dragOverPos = pos;
    article.classList.add(pos === 'before' ? 'is-drop-before' : 'is-drop-after');
  }

  private clearDragIndicators(): void {
    if (!this.panelEl) return;
    this.panelEl.querySelectorAll('.is-drop-before, .is-drop-after').forEach((el) => {
      el.classList.remove('is-drop-before', 'is-drop-after');
    });
    this.dragOverId = null;
  }

  private async handleDrop(e: DragEvent): Promise<void> {
    e.preventDefault();
    const storeAtStart = this.store;
    const reorder = storeAtStart.reorder;
    if (!reorder || this.reorderAbortController) {
      this.handleDragEnd();
      return;
    }
    if (!this.ensureAuthorizedSession()) {
      this.handleDragEnd();
      return;
    }
    if (!this.dragSrcId || !this.dragOverId) {
      this.handleDragEnd();
      return;
    }

    const srcId = this.dragSrcId;
    const targetId = this.dragOverId;
    const pos = this.dragOverPos;

    const pagePath = this.currentPagePath();
    if (this.annotationsPagePath !== pagePath) {
      this.handleDragEnd();
      return;
    }

    const annotations = [...this.annotations];
    const srcIdx = annotations.findIndex((a) => a.id === srcId);
    if (srcIdx === -1) {
      this.handleDragEnd();
      return;
    }

    const [moved] = annotations.splice(srcIdx, 1);
    let targetIdx = annotations.findIndex((a) => a.id === targetId);
    if (targetIdx === -1) {
      this.handleDragEnd();
      return;
    }

    if (pos === 'after') targetIdx++;
    annotations.splice(targetIdx, 0, moved);

    const previousAnnotations = this.annotations;
    this.annotations = annotations;
    const generation = ++this.reorderGeneration;
    const controller = new AbortController();
    this.reorderAbortController = controller;
    const isCurrentRequest = (): boolean =>
      generation === this.reorderGeneration &&
      this.reorderAbortController === controller &&
      this.store === storeAtStart &&
      this.mode === 'list' &&
      this.currentPagePath() === pagePath &&
      this.annotationsPagePath === pagePath;

    // Optimistic order is only exposed while its matching backend request is
    // current. A failed request restores the exact prior page-local order.
    this.handleDragEnd();
    this.updatePanel();
    const tokenAtStart = getAuthToken();
    const authAttemptAtStart = this.authAttempt;
    try {
      await reorder.call(storeAtStart, annotations.map((a) => a.id), {
        pagePath,
        signal: controller.signal,
      });
    } catch (error) {
      if (!isCurrentRequest() || isAbortError(error)) return;
      // Do not show an order the backend rejected. This is especially
      // important with page-scoped backends, where a stale response must not
      // silently reorder another page's rows.
      this.annotations = previousAnnotations;
      if (!this.handleStoreError(error, { operation: 'reorder' }, tokenAtStart, authAttemptAtStart)) {
        this.status = error instanceof Error ? error.message : 'Failed to reorder annotations.';
        this.statusType = 'error';
        this.updatePanel();
      }
    } finally {
      if (this.reorderAbortController === controller) {
        this.reorderAbortController = null;
        if (
          this.mode === 'list' &&
          this.currentPagePath() === pagePath &&
          this.annotationsPagePath === pagePath
        ) {
          this.updatePanel();
        }
      }
    }
  }

  private handleDragEnd(): void {
    if (this.panelEl) {
      this.panelEl.querySelectorAll('.is-dragging').forEach((el) => {
        el.classList.remove('is-dragging');
      });
      this.clearDragIndicators();
      this.resetDraggable();
    }
    this.dragSrcId = null;
    this.dragOverId = null;
  }

  private async copyAsPrompt(annotationId?: string): Promise<void> {
    let text: string;
    if (annotationId) {
      const annotation = this.annotations.find((a) => a.id === annotationId);
      if (!annotation) return;
      text = formatAnnotationAsPrompt(annotation);
    } else if (this.selectedTarget) {
      // Compose mode: build from current selection + message
      text = formatAnnotationAsPrompt({
        id: 'preview',
        pagePath: this.currentPagePath(),
        pageTitle: document.title,
        message: this.message.trim() || '(no message)',
        element: this.selectedTarget,
        createdAt: new Date().toISOString(),
        status: 'open',
        changes: this.getChanges(),
      });
    } else {
      text = formatAnnotationsAsPrompt(this.annotations, this.currentPagePath());
    }

    await this.writeClipboard(text);
  }

  private async writeClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.status = this.labels.copied;
      this.statusType = 'success';
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        this.status = this.labels.copied;
        this.statusType = 'success';
      } catch {
        this.status = 'Copy failed';
        this.statusType = 'error';
      }
      document.body.removeChild(textarea);
    }
    this.updatePanel();
    if (this.statusType === 'success') {
      window.setTimeout(() => {
        if (this.status === this.labels.copied) {
          this.status = null;
          this.statusType = null;
          this.updatePanel();
        }
      }, 1500);
    }
  }

  // Copy all open annotations as a self-contained handoff prompt: working
  // instructions plus the batch data, ready to paste to any agent as-is.
  private async copyHandoff(): Promise<void> {
    const pageUrl = `${window.location.origin}${this.currentPagePath()}`;
    await this.writeClipboard(formatHandoffPrompt(this.annotations, pageUrl, this.store.source));
  }

  // ---- Launcher: drag, collapse-to-edge, hover-peek ----

  private setupLauncherInteraction(): void {
    if (!this.launcherEl) return;
    this.launcherEl.addEventListener('pointerdown', (e) => this.onLauncherPointerDown(e));
    this.launcherEl.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(`.${CLASS_PREFIX}-collapse-btn`)) {
        e.stopPropagation();
        this.collapseLauncher();
        return;
      }
      if (this.suppressNextClick) {
        this.suppressNextClick = false;
        return;
      }
      if (this.launcherCollapsed) {
        this.expandLauncher();
        return;
      }
      if (this.mode !== 'closed') this.closeTool();
      else this.openTool();
    });
  }

  private onLauncherPointerDown(e: PointerEvent): void {
    if (this.launcherCollapsed || e.button !== 0 || !this.launcherEl) return;
    const rect = this.launcherEl.getBoundingClientRect();
    this.dragState = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      originX: rect.left,
      originY: rect.top,
    };
    document.addEventListener('pointermove', this.boundLauncherMove);
    document.addEventListener('pointerup', this.boundLauncherUp);
    document.addEventListener('pointercancel', this.boundLauncherUp);
  }

  private boundLauncherMove = (e: PointerEvent): void => {
    if (!this.dragState || !this.launcherEl) return;
    const dx = e.clientX - this.dragState.startX;
    const dy = e.clientY - this.dragState.startY;
    if (!this.dragState.moved && Math.hypot(dx, dy) < 4) return;
    if (!this.dragState.moved) {
      this.dragState.moved = true;
      this.launcherFloating = true;
      this.launcherEl.classList.add('is-floating', 'is-dragging');
    }
    // Clamp so the launcher can't be dragged fully off-screen and lost.
    const maxX = window.innerWidth - this.launcherEl.offsetWidth;
    const maxY = window.innerHeight - this.launcherEl.offsetHeight;
    const x = Math.max(0, Math.min(this.dragState.originX + dx, maxX));
    const y = Math.max(0, Math.min(this.dragState.originY + dy, maxY));
    this.launcherPos = { x, y };
    this.launcherEl.style.left = `${x}px`;
    this.launcherEl.style.top = `${y}px`;
    this.launcherEl.style.right = '';
  };

  private boundLauncherUp = (e: PointerEvent): void => {
    document.removeEventListener('pointermove', this.boundLauncherMove);
    document.removeEventListener('pointerup', this.boundLauncherUp);
    document.removeEventListener('pointercancel', this.boundLauncherUp);
    if (!this.dragState) return;
    const wasDrag = this.dragState.moved;
    this.launcherEl?.classList.remove('is-dragging');
    this.dragState = null;
    if (wasDrag) {
      this.suppressNextClick = true;
      // Snap to nearest edge if close, else stay floating.
      if (this.launcherPos && this.launcherEl && this.snapToEdge(e.clientX)) {
        this.collapseLauncher();
      } else {
        this.persistLauncherState();
      }
    }
  };

  private snapToEdge(pointerX: number): boolean {
    // The launcher itself is deliberately clamped fully on-screen, so its
    // centre can never get within the old 12px threshold. The release pointer
    // is the user's actual intent and can reach either viewport edge.
    return shouldSnapToEdge(pointerX, window.innerWidth);
  }

  private collapseLauncher(): void {
    if (this.launcherCollapsed) return;
    if (this.mode === 'picking') this.closeTool();
    else if (this.mode === 'compose') this.cleanupComposeTracking();
    this.launcherCollapsed = true;
    this.updatePanel();
    this.updateOverlay();
    this.persistLauncherState();
  }

  private expandLauncher(): void {
    if (!this.launcherCollapsed || !this.launcherEl) return;
    this.launcherCollapsed = false;
    // Restore position: floating coords, or clear inline styles for dock.
    if (this.launcherFloating && this.launcherPos) {
      this.launcherEl.style.left = `${this.launcherPos.x}px`;
      this.launcherEl.style.top = `${this.launcherPos.y}px`;
      this.launcherEl.style.right = '';
    } else {
      this.launcherEl.style.left = '';
      this.launcherEl.style.top = '';
      this.launcherEl.style.right = '';
    }
    this.updatePanel();
    this.updateOverlay();
    if (this.mode === 'compose') this.setupComposeTracking();
    this.persistLauncherState();
  }

  private persistLauncherState(): void {
    try {
      localStorage.setItem(
        'patch-mark:launcher',
        JSON.stringify({
          collapsed: this.launcherCollapsed,
          floating: this.launcherFloating,
          pos: this.launcherPos,
        }),
      );
    } catch { /* private mode / disabled storage */ }
  }

  private restoreLauncherState(): void {
    if (!this.launcherEl) return;
    try {
      const raw = localStorage.getItem('patch-mark:launcher');
      if (!raw) return;
      const state = JSON.parse(raw);
      if (state.floating && state.pos) {
        // Clamp into the current viewport — a saved pos can land off-screen
        // after switching to a smaller window/display.
        const x = Math.max(0, Math.min(state.pos.x, window.innerWidth - 60));
        const y = Math.max(0, Math.min(state.pos.y, window.innerHeight - 60));
        this.launcherFloating = true;
        this.launcherPos = { x, y };
        this.launcherEl.classList.add('is-floating');
        this.launcherEl.style.left = `${x}px`;
        this.launcherEl.style.top = `${y}px`;
      }
      if (state.collapsed) this.collapseLauncher();
    } catch { /* ignore malformed */ }
  }

  // ---- Event delegation ----

  private handlePanelClick(e: MouseEvent): void {
    const button = (e.target as HTMLElement).closest('[data-action]');
    if (!button) return;
    const action = button.getAttribute('data-action');
    const id = button.getAttribute('data-id');

    switch (action) {
      case 'pick':
        this.startPicking();
        break;
      case 'list':
        this.openList();
        break;
      case 'close':
        this.closeTool();
        break;
      case 'send':
        this.submitAnnotation();
        break;
      case 'reselect':
        this.startPicking();
        break;
      case 'locate':
        if (id) {
          const annotation = this.annotations.find((a) => a.id === id);
          if (annotation) this.locateAnnotation(annotation);
        }
        break;
      case 'copy':
        this.copyAsPrompt(id || undefined);
        break;
      case 'copy-handoff':
        this.copyHandoff();
        break;
      case 'resolve':
        if (id) this.resolveAnnotation(id);
        break;
      case 'unlock': {
        const input = this.panelEl?.querySelector(`.${CLASS_PREFIX}-locked-input`);
        const token = input instanceof HTMLInputElement ? input.value.trim() : '';
        if (token) this.unlock(token);
        break;
      }
      case 'toggle-properties':
        this.showProperties = !this.showProperties;
        this.updatePanel();
        break;
      case 'expand-selection':
        this.expandSelection();
        break;
      case 'shrink-selection':
        this.shrinkSelection();
        break;
    }
  }

  private handlePanelKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Enter') return;
    const target = e.target as HTMLElement;
    if (target instanceof HTMLInputElement && target.classList.contains(`${CLASS_PREFIX}-locked-input`)) {
      const token = target.value.trim();
      if (token) this.unlock(token);
    }
  }

  private handlePanelInput(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.tagName === 'TEXTAREA') {
      this.message = (target as HTMLTextAreaElement).value;
      // Toggle the Send button's disabled state without a full re-render,
      // which would rebuild the textarea and drop the caret/focus.
      const sendBtn = this.panelEl?.querySelector<HTMLButtonElement>(
        `button[data-action="send"]`,
      );
      if (sendBtn) sendBtn.disabled = !this.message.trim() || this.isSubmitting;
    } else if (target.tagName === 'INPUT' && target.hasAttribute('data-property')) {
      const prop = target.getAttribute('data-property')!;
      const from = target.getAttribute('data-original')!;
      const to = (target as HTMLInputElement).value.trim();
      if (to && to !== from) {
        this.propertyChanges[prop] = { from, to };
      } else {
        delete this.propertyChanges[prop];
      }
      // Update row highlight without full re-render (keeps input focus)
      const row = target.closest(`.${CLASS_PREFIX}-prop-row`);
      if (row) row.classList.toggle('is-changed', !!this.propertyChanges[prop]);
      this.updatePropToggleBadge();
    }
  }

  private updatePropToggleBadge(): void {
    const toggle = this.panelEl?.querySelector(`.${CLASS_PREFIX}-prop-toggle`);
    if (!toggle) return;
    const count = Object.keys(this.propertyChanges).length;
    const badge = count > 0 ? `<span class="${CLASS_PREFIX}-prop-count">${count}</span>` : '';
    const check = this.showProperties ? ' \u2713' : '';
    toggle.innerHTML = `${escapeHtml(this.labels.properties)}${check}${badge}`;
  }

  // ---- Rendering ----

  private clearOverlay(): void {
    if (!this.overlayEl) return;
    this.overlayEl.style.display = 'none';
    this.overlayEl.replaceChildren();
  }

  private createOverlayHighlight(rect: ViewportRect, selected: boolean): HTMLElement {
    const highlight = document.createElement('div');
    highlight.className = `${CLASS_PREFIX}-highlight${selected ? ' is-selected' : ''}`;
    highlight.style.top = `${rect.top}px`;
    highlight.style.left = `${rect.left}px`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    return highlight;
  }

  private createOverlayLabel(
    target: ElementTarget & { hoverInfo?: HoverInfo },
    includeDetails: boolean,
  ): HTMLElement {
    const label = document.createElement('div');
    label.className = `${CLASS_PREFIX}-element-label`;
    const headline = document.createElement('div');
    headline.className = `${CLASS_PREFIX}-label-row`;
    const name = document.createElement('strong');
    name.textContent = target.name;
    const dimensions = document.createElement('span');
    dimensions.textContent = `${Math.round(target.rect.width)} × ${Math.round(target.rect.height)}`;
    headline.append(name, dimensions);
    label.append(headline);

    if (includeDetails && target.hoverInfo) {
      const addRow = (key: string, value: string): void => {
        const row = document.createElement('div');
        row.className = `${CLASS_PREFIX}-label-row`;
        const keyEl = document.createElement('span');
        keyEl.className = `${CLASS_PREFIX}-label-key`;
        keyEl.textContent = key;
        const valueEl = document.createElement('span');
        valueEl.textContent = value;
        row.append(keyEl, valueEl);
        label.append(row);
      };
      addRow(this.labels.colorLabel ?? '颜色', target.hoverInfo.color);
      addRow(this.labels.fontLabel ?? '字体', `${target.hoverInfo.fontSize} ${target.hoverInfo.fontFamily}`);
    }
    return label;
  }

  /** Appends and measures a label before choosing a collision-aware position. */
  private positionOverlayLabel(label: HTMLElement, rect: ViewportRect, avoidPointer: boolean): boolean {
    if (!this.overlayEl) return false;
    label.style.visibility = 'hidden';
    label.style.left = '0';
    label.style.top = '0';
    this.overlayEl.append(label);
    const measured = label.getBoundingClientRect();
    const placement = chooseOverlayLabelPlacement(
      rect,
      measured.width,
      measured.height,
      window.innerWidth,
      window.innerHeight,
      avoidPointer ? this.pointerRef : null,
    );
    label.style.left = `${placement.left}px`;
    label.style.top = `${placement.top}px`;
    label.style.visibility = '';
    return placement.safe;
  }

  private renderOverlayFrame(
    rect: ViewportRect,
    target: ElementTarget & { hoverInfo?: HoverInfo },
    options: { selected: boolean; includeHoverDetails: boolean; avoidPointer: boolean },
  ): void {
    if (!this.overlayEl) return;
    this.overlayEl.style.display = '';
    this.overlayEl.replaceChildren(this.createOverlayHighlight(rect, options.selected));

    let label = this.createOverlayLabel(target, options.includeHoverDetails);
    const safe = this.positionOverlayLabel(label, rect, options.avoidPointer);
    // Details are useful, but not at the cost of covering the target/mouse.
    // In cramped viewports leave a compact name + size marker only.
    if (!safe && options.includeHoverDetails) {
      label.remove();
      label = this.createOverlayLabel(target, false);
      this.positionOverlayLabel(label, rect, options.avoidPointer);
    }
  }

  private updateOverlay(): void {
    if (!this.overlayEl) return;

    if (this.launcherCollapsed) {
      this.clearOverlay();
      return;
    }

    // While composing, keep a persistent frame on the selected element
    if (this.mode === 'compose') {
      this.renderSelectedOverlay();
      return;
    }

    const target = this.mode === 'picking' ? this.hoveredTarget : this.locatedTarget;

    if (!target) {
      this.clearOverlay();
      return;
    }

    const { viewportRect: rect } = target;
    this.renderOverlayFrame(rect, target, {
      selected: false,
      includeHoverDetails: !!target.hoverInfo,
      avoidPointer: this.mode === 'picking',
    });
  }

  private renderSelectedOverlay(): void {
    if (!this.overlayEl) return;

    const element = this.selectedElement;
    if (!element || !element.isConnected || !this.selectedTarget) {
      this.clearOverlay();
      return;
    }

    const liveRange = this.selectedRange;
    const rangeStillConnected = liveRange?.commonAncestorContainer.isConnected;
    const rect = rangeStillConnected
      ? liveRange.getBoundingClientRect()
      : this.selectedTarget.quote
        ? {
            // Fallback for a DOM replacement that detached the live Range.
            // The persisted selection is document-relative, so scrolling still
            // keeps its last-known geometry in the correct viewport position.
            top: this.selectedTarget.rect.top - window.scrollY,
            left: this.selectedTarget.rect.left - window.scrollX,
            width: this.selectedTarget.rect.width,
            height: this.selectedTarget.rect.height,
            right: this.selectedTarget.rect.left - window.scrollX + this.selectedTarget.rect.width,
            bottom: this.selectedTarget.rect.top - window.scrollY + this.selectedTarget.rect.height,
          }
        : element.getBoundingClientRect();
    this.updateComposeDodge(rect);
    this.renderOverlayFrame(rect, this.selectedTarget, {
      selected: true,
      includeHoverDetails: false,
      avoidPointer: false,
    });
  }

  private updatePanel(): void {
    if (!this.panelEl || !this.launcherEl) return;

    // Collapsed (peeked to edge): hide panel, render launcher as a slim tab.
    if (this.launcherCollapsed) {
      this.panelEl.style.display = 'none';
      this.panelEl.innerHTML = '';
      this.launcherEl.classList.add('is-collapsed');
      // Peek toward the edge the launcher was actually dragged to, not the
      // configured dock side — avoids the tab jumping sides on expand.
      const side = this.launcherFloating && this.launcherPos
        ? (this.launcherPos.x + this.launcherEl.offsetWidth / 2 < window.innerWidth / 2 ? 'left' : 'right')
        : this.dockSide;
      this.launcherEl.style.left = side === 'left' ? '0.5rem' : '';
      this.launcherEl.style.right = side === 'right' ? '0.5rem' : '';
      this.launcherEl.style.top = `${Math.round(window.innerHeight / 2 - 32)}px`;
      this.launcherEl.innerHTML = `${ICONS.annotate}<span>${escapeHtml(this.labels.picker)}</span>`;
      return;
    }
    this.launcherEl.classList.remove('is-collapsed');

    const isOpen = this.mode !== 'closed';

    // Update launcher
    this.launcherEl.classList.toggle('is-active', isOpen);
    const collapseBtn = `<span class="${CLASS_PREFIX}-collapse-btn" role="button" tabindex="0" data-action="collapse" aria-label="${escapeHtml(this.labels.collapse ?? '收起')}">${ICONS.chevronLeft}</span>`;
    this.launcherEl.innerHTML = isOpen
      ? `${ICONS.x}<span>${escapeHtml(this.labels.close)}</span>${collapseBtn}`
      : `${ICONS.annotate}<span>${escapeHtml(this.labels.picker)}</span>${collapseBtn}`;

    if (!isOpen) {
      this.panelEl.style.display = 'none';
      this.panelEl.innerHTML = '';
      return;
    }

    this.panelEl.style.display = '';
    const isPickingOrCompose = this.mode === 'picking' || this.mode === 'compose';
    const isList = this.mode === 'list';

    // Locked mode deliberately has no picker/list tabs. The transition guard
    // below would reject them anyway, but not rendering inactive controls
    // makes the access boundary unambiguous to keyboard, assistive-tech, and
    // visual users alike.
    const header = this.mode === 'locked' ? '' : `
      <div class="${CLASS_PREFIX}-panel-header">
        <div class="${CLASS_PREFIX}-panel-tabs">
          <button type="button" class="${isPickingOrCompose ? 'is-active' : ''}" data-action="pick" role="tab" aria-selected="${isPickingOrCompose}">
            ${ICONS.crosshair}
            ${escapeHtml(this.labels.picker)}
          </button>
          <button type="button" class="${isList ? 'is-active' : ''}" data-action="list" role="tab" aria-selected="${isList}">
            ${ICONS.list}
            ${escapeHtml(this.labels.list)}
          </button>
        </div>
        <button type="button" class="${CLASS_PREFIX}-close" data-action="close" aria-label="${escapeHtml(this.labels.close)}">
          ${ICONS.x}
        </button>
      </div>`;
    this.panelEl.innerHTML = `${header}${this.renderPanelContent()}`;

    // Annotation records can originate from a remote or custom store. Their
    // values are mounted with DOM APIs below rather than interpolated into an
    // HTML string, which closes the stored-XSS sink even if an integration
    // accidentally weakens its own validation later.
    if (this.mode === 'list') this.mountListItems();
  }

  private renderPanelContent(): string {
    switch (this.mode) {
      case 'picking':
        return this.renderPickerNote();
      case 'compose':
        return this.renderCompose();
      case 'list':
        return this.renderList();
      case 'locked':
        return this.renderLocked();
      default:
        return '';
    }
  }

  private renderPickerNote(): string {
    return `
      <div class="${CLASS_PREFIX}-picker-note">
        ${ICONS.crosshair}
        <p>${escapeHtml(this.labels.picker)}</p>
        <span>${escapeHtml(this.labels.pickerHint)}</span>
      </div>
    `;
  }

  private renderLocked(): string {
    const statusHtml = this.status
      ? `<p class="${CLASS_PREFIX}-status is-error">${escapeHtml(this.status)}</p>`
      : '';
    return `
      <div class="${CLASS_PREFIX}-locked">
        ${ICONS.lock}
        <p>${escapeHtml(this.labels.lockedTitle ?? '需要访问令牌')}</p>
        <span>${escapeHtml(this.labels.lockedHint ?? '此页面的批注功能受保护，请输入分享链接中的访问令牌。')}</span>
        <input
          type="text"
          class="${CLASS_PREFIX}-locked-input"
          placeholder="${escapeHtml(this.labels.lockedPlaceholder ?? '粘贴令牌…')}"
          aria-label="${escapeHtml(this.labels.lockedPlaceholder ?? '粘贴令牌…')}"
          spellcheck="false"
          autocomplete="off"
        />
        ${statusHtml}
        <button type="button" class="${CLASS_PREFIX}-send" data-action="unlock">
          ${escapeHtml(this.labels.lockedSubmit ?? '解锁')}
          ${ICONS.send}
        </button>
      </div>
    `;
  }

  private renderCompose(): string {
    if (!this.selectedTarget) return '';
    const statusHtml = this.status
      ? `<p class="${CLASS_PREFIX}-status ${this.statusType === 'success' ? 'is-success' : 'is-error'}">${escapeHtml(this.status)}</p>`
      : '';

    const changesCount = Object.keys(this.propertyChanges).length;
    const toggleLabel = this.showProperties
      ? `${this.labels.properties} ✓`
      : this.labels.properties;
    const propBadge = changesCount > 0
      ? `<span class="${CLASS_PREFIX}-prop-count">${changesCount}</span>`
      : '';

    return `
      <div class="${CLASS_PREFIX}-compose">
        <div class="${CLASS_PREFIX}-target">
          <span>${escapeHtml(this.labels.targetLabel)}</span>
          <strong>${escapeHtml(this.selectedTarget.name)}</strong>
          <span class="${CLASS_PREFIX}-select-nav">
            <button type="button" class="${CLASS_PREFIX}-nav-btn" data-action="expand-selection" title="${escapeHtml(this.labels.expandLabel ?? '扩展到父级')}" aria-label="${escapeHtml(this.labels.expandLabel ?? '扩展到父级')}" ${this.canExpandSelection() ? '' : 'disabled'}>
              ${ICONS.chevronUp}
            </button>
            <button type="button" class="${CLASS_PREFIX}-nav-btn" data-action="shrink-selection" title="${escapeHtml(this.labels.shrinkLabel ?? '收缩到子级')}" aria-label="${escapeHtml(this.labels.shrinkLabel ?? '收缩到子级')}" ${this.canShrinkSelection() ? '' : 'disabled'}>
              ${ICONS.chevronDown}
            </button>
          </span>
          <button type="button" class="${CLASS_PREFIX}-prop-toggle ${this.showProperties ? 'is-active' : ''}" data-action="toggle-properties">
            ${escapeHtml(toggleLabel)}${propBadge}
          </button>
        </div>
        ${this.showProperties ? this.renderPropertyPanel() : ''}
        <textarea maxlength="${MAX_MESSAGE_LENGTH}" placeholder="${escapeHtml(this.labels.placeholder)}" aria-label="${escapeHtml(this.labels.placeholder)}">${escapeHtml(this.message)}</textarea>
        ${statusHtml}
        <div class="${CLASS_PREFIX}-compose-actions">
          <button type="button" class="${CLASS_PREFIX}-copy-btn" data-action="copy">
            ${ICONS.copy}
            ${escapeHtml(this.labels.copyAsPrompt)}
          </button>
          <span style="display:flex;gap:0.5rem;align-items:center">
            <button type="button" class="${CLASS_PREFIX}-back" data-action="reselect">${escapeHtml(this.labels.reselect)}</button>
            <button type="button" class="${CLASS_PREFIX}-send" data-action="send" title="⌘/Ctrl+Enter" ${!this.message.trim() || this.isSubmitting ? 'disabled' : ''}>
              ${this.isSubmitting ? escapeHtml(this.labels.sending) : escapeHtml(this.labels.send)}
              ${ICONS.send}
            </button>
          </span>
        </div>
      </div>
    `;
  }

  private renderPropertyPanel(): string {
    if (!this.selectedElement) return '';

    const style = window.getComputedStyle(this.selectedElement);
    const rows = INSPECTABLE_PROPERTIES.map((prop) => {
      const current = getComputedProperty(style, prop).trim();
      const change = this.propertyChanges[prop];
      const inputValue = change ? change.to : '';
      const changedClass = change ? 'is-changed' : '';
      return `
        <div class="${CLASS_PREFIX}-prop-row ${changedClass}">
          <span class="${CLASS_PREFIX}-prop-name">${escapeHtml(prop)}</span>
          <span class="${CLASS_PREFIX}-prop-current">${escapeHtml(current)}</span>
          <input
            type="text"
            class="${CLASS_PREFIX}-prop-input"
            data-property="${escapeHtml(prop)}"
            data-original="${escapeHtml(current)}"
            value="${escapeHtml(inputValue)}"
            placeholder="${change ? escapeHtml(change.to) : '→'}"
            spellcheck="false"
          />
        </div>`;
    }).join('');

    return `
      <div class="${CLASS_PREFIX}-prop-panel">
        <p class="${CLASS_PREFIX}-prop-hint">${escapeHtml(this.labels.propertiesHint)}</p>
        ${rows}
      </div>
    `;
  }

  private renderList(): string {
    const statusHtml = this.status && (this.statusType === 'success' || this.annotations.length > 0)
      ? `<p class="${CLASS_PREFIX}-status ${this.statusType === 'success' ? 'is-success' : 'is-error'}">${escapeHtml(this.status)}</p>`
      : '';

    const openCount = this.annotations.filter((a) => a.status !== 'resolved').length;
    const handoffHtml = !this.isLoading && openCount > 0
      ? `<div class="${CLASS_PREFIX}-handoff-bar">
          <button type="button" class="${CLASS_PREFIX}-handoff" data-action="copy-handoff">
            ${ICONS.send}<span>${escapeHtml(this.labels.copyHandoff ?? 'Copy handoff prompt')} · ${openCount}</span>
          </button>
        </div>`
      : '';

    return `
      <div class="${CLASS_PREFIX}-list">
        ${statusHtml}
        <div data-pm-list-content></div>
      </div>
      ${handoffHtml}
    `;
  }

  /** Mounts store-owned values with textContent/setAttribute, never HTML. */
  private mountListItems(): void {
    const content = this.panelEl?.querySelector<HTMLElement>('[data-pm-list-content]');
    if (!content) return;

    const fragment = document.createDocumentFragment();
    if (this.isLoading) {
      fragment.append(this.createListMessage(this.labels.loading, `${CLASS_PREFIX}-empty`));
    } else if (this.status && this.statusType === 'error' && this.annotations.length === 0) {
      fragment.append(this.createListMessage(this.status, `${CLASS_PREFIX}-status is-error`));
    } else if (this.annotations.length === 0) {
      fragment.append(this.createListMessage(this.labels.empty, `${CLASS_PREFIX}-empty`));
    } else {
      for (const annotation of this.annotations) {
        fragment.append(this.createAnnotationItem(annotation));
      }
    }
    content.replaceChildren(fragment);
  }

  private createListMessage(text: string, className: string): HTMLParagraphElement {
    const message = document.createElement('p');
    message.className = className;
    message.textContent = text;
    return message;
  }

  /** Inline SVG is a package-owned constant; no store or page value reaches this sink. */
  private appendIcon(parent: HTMLElement, icon: keyof typeof ICONS): void {
    const template = document.createElement('template');
    template.innerHTML = ICONS[icon];
    parent.append(template.content.cloneNode(true));
  }

  private createActionButton(
    action: 'copy' | 'locate' | 'resolve',
    id: string,
    icon: keyof typeof ICONS,
    label?: string,
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.action = action;
    button.dataset.id = id;
    if (action === 'resolve') button.className = 'is-resolve';
    if (action === 'resolve') button.disabled = this.resolveRequests.has(id);
    this.appendIcon(button, icon);
    if (label) button.append(document.createTextNode(label));
    return button;
  }

  private createAnnotationItem(annotation: Annotation): HTMLElement {
    const isResolved = annotation.status === 'resolved';
    const article = document.createElement('article');
    article.className = `${CLASS_PREFIX}-item${isResolved ? ' is-resolved' : ''}`;
    article.dataset.annotationId = annotation.id;

    const header = document.createElement('div');
    header.className = `${CLASS_PREFIX}-item-header`;
    const title = document.createElement('div');
    title.className = `${CLASS_PREFIX}-item-title`;
    const name = document.createElement('strong');
    name.textContent = annotation.element.name;
    if (this.store.reorder) {
      const dragHandle = document.createElement('button');
      dragHandle.type = 'button';
      dragHandle.className = `${CLASS_PREFIX}-drag-handle`;
      dragHandle.dataset.dragHandle = '';
      dragHandle.setAttribute('aria-label', this.labels.dragLabel ?? '拖动排序');
      dragHandle.disabled = this.reorderAbortController !== null;
      this.appendIcon(dragHandle, 'grip');
      title.append(dragHandle);
    }
    title.append(name);

    const actions = document.createElement('div');
    actions.className = `${CLASS_PREFIX}-item-actions`;
    actions.append(
      this.createActionButton('copy', annotation.id, 'copy'),
      this.createActionButton('locate', annotation.id, 'crosshair', this.labels.locate),
    );
    if (!isResolved && this.store.update) {
      actions.append(this.createActionButton('resolve', annotation.id, 'check', this.labels.resolve));
    }
    header.append(title, actions);
    article.append(header);

    const selector = document.createElement('code');
    selector.title = annotation.element.selector;
    selector.textContent = annotation.element.selector;
    article.append(selector);

    const message = document.createElement('p');
    message.textContent = annotation.message;
    article.append(message);

    if (annotation.changes && annotation.changes.length > 0) {
      const changes = document.createElement('div');
      changes.className = `${CLASS_PREFIX}-item-changes`;
      for (const change of annotation.changes) {
        const item = document.createElement('span');
        item.className = `${CLASS_PREFIX}-change`;
        item.append(document.createTextNode(`${change.property}: ${change.from} → `));
        const value = document.createElement('strong');
        value.textContent = change.to;
        item.append(value);
        changes.append(item);
      }
      article.append(changes);
    }

    if (annotation.element.text) {
      const context = document.createElement('span');
      context.className = `${CLASS_PREFIX}-item-context`;
      context.textContent = `${this.labels.contentPrefix}${annotation.element.text}`;
      article.append(context);
    }

    if (isResolved) {
      const badge = document.createElement('span');
      badge.className = `${CLASS_PREFIX}-item-status`;
      this.appendIcon(badge, 'check');
      badge.append(document.createTextNode(this.labels.resolved));
      article.append(badge);
    }

    const time = document.createElement('time');
    time.dateTime = annotation.createdAt;
    time.textContent = formatTime(annotation.createdAt);
    article.append(time);
    return article;
  }
}

// Auth failures are matched by name (not instanceof) so they survive
// duplicated module copies in mixed ESM/CDN setups.
function isAuthError(error: unknown): boolean {
  return error instanceof Error && error.name === 'PatchMarkAuthError';
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!);
}
