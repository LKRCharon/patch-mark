import type { Annotation, AnnotationLabels, AnnotationStore, AnnotationTheme, ElementTarget, HoverInfo, PickerTarget, PropertyChange, ThemeName, ToolMode } from './types.js';
import { describeElement, toElementTarget, formatTime } from './utils.js';
import { createLocalStorageStore } from './stores/localStorage.js';
import { defaultLabels } from './labels.js';
import { formatAnnotationAsPrompt, formatAnnotationsAsPrompt } from './prompt.js';
import { shadowStyles, globalStyles } from './styles.js';
import { CLASS_PREFIX, CSS_VAR_PREFIX, ELEMENT_TAG, GLOBAL_STYLE_ATTR, PICKER_ACTIVE_CLASS, THEME_ATTR, UI_ATTR, VISIBLE_ATTR } from './identity.js';

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

let globalStyleInjected = false;

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
  store: AnnotationStore = createLocalStorageStore();
  labels: AnnotationLabels = { ...defaultLabels };

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
  private message = '';
  private annotations: Annotation[] = [];
  private isLoading = false;
  private isSubmitting = false;
  private status: string | null = null;
  private statusType: 'error' | 'success' | null = null;
  private locatedTarget: PickerTarget | null = null;
  private selectedElement: HTMLElement | null = null;
  private selectionPath: HTMLElement[] = [];
  private dodgeX = 0;
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
  private boundKeyDown: ((e: KeyboardEvent) => void) | null = null;
  private pointerRef: { clientX: number; clientY: number } | null = null;
  private locateTimeout: number | undefined;
  private rafId: number | undefined;

  static get observedAttributes(): string[] {
    return ['accent', VISIBLE_ATTR];
  }

  attributeChangedCallback(name: string, _old: string, value: string): void {
    if (name === 'accent' && this.shadow) {
      this.style.setProperty(`${CSS_VAR_PREFIX}-accent`, value);
    }
    if (name === VISIBLE_ATTR) {
      this.updateVisibility();
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
    this.launcherEl.innerHTML = `${ICONS.annotate}<span>${this.labels.picker}</span>`;
    this.launcherEl.addEventListener('click', () => {
      if (this.mode !== 'closed') this.closeTool();
      else this.startPicking();
    });
    this.shadow.appendChild(this.launcherEl);

    // Delegate panel clicks
    this.panelEl.addEventListener('click', (e) => this.handlePanelClick(e));
    this.panelEl.addEventListener('input', (e) => this.handlePanelInput(e));

    // Drag-and-drop for list reordering
    this.panelEl.addEventListener('mousedown', (e) => this.handleDragHandleDown(e));
    this.panelEl.addEventListener('mouseup', () => this.resetDraggable());
    this.panelEl.addEventListener('dragstart', (e) => this.handleDragStart(e));
    this.panelEl.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.panelEl.addEventListener('drop', (e) => this.handleDrop(e));
    this.panelEl.addEventListener('dragend', () => this.handleDragEnd());

    // Apply theme overrides
    this.applyTheme();

    this.updateVisibility();
    this.updatePanel();
  }

  disconnectedCallback(): void {
    this.cleanupPicking();
    this.cleanupComposeTracking();
    this.removeKeyDownListener();
    window.clearTimeout(this.locateTimeout);
    if (this.rafId !== undefined) window.cancelAnimationFrame(this.rafId);
  }

  // ---- Public API ----

  open(): void {
    this.startPicking();
  }

  close(): void {
    this.closeTool();
  }

  // ---- Mode transitions ----

  private closeTool(): void {
    this.mode = 'closed';
    this.hoveredTarget = null;
    this.selectedTarget = null;
    this.selectedElement = null;
    this.pointerRef = null;
    this.message = '';
    this.status = null;
    this.statusType = null;
    this.showProperties = false;
    this.propertyChanges = {};
    this.cleanupPicking();
    this.cleanupComposeTracking();
    this.setDodgeSide('right');
    this.updateOverlay();
    this.updatePanel();
  }

  private startPicking(): void {
    this.mode = 'picking';
    this.hoveredTarget = null;
    this.selectedTarget = null;
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
    this.mode = 'list';
    this.cleanupComposeTracking();
    this.updateOverlay();
    this.updatePanel();
    await this.loadAnnotations();
  }

  // ---- Picking mode ----

  private setupPicking(): void {
    this.boundMove = (e: MouseEvent) => this.handleMove(e);
    this.boundClick = (e: MouseEvent) => this.handleClick(e);
    this.boundKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);

    document.addEventListener('mousemove', this.boundMove, true);
    document.addEventListener('click', this.boundClick, true);
    document.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('scroll', this.refreshHover, true);
    window.addEventListener('resize', this.refreshHover);

    document.documentElement.classList.add(PICKER_ACTIVE_CLASS);
  }

  private cleanupPicking(): void {
    document.documentElement.classList.remove(PICKER_ACTIVE_CLASS);
    this.panelEl?.classList.remove('is-ghost');

    if (this.boundMove) document.removeEventListener('mousemove', this.boundMove, true);
    if (this.boundClick) document.removeEventListener('click', this.boundClick, true);
    if (this.boundKeyDown) document.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('scroll', this.refreshHover, true);
    window.removeEventListener('resize', this.refreshHover);

    this.boundMove = null;
    this.boundClick = null;
    this.boundKeyDown = null;

    if (this.rafId !== undefined) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  private getTargetAtPoint(clientX: number, clientY: number): PickerTarget | null {
    const element = document.elementFromPoint(clientX, clientY);
    if (!(element instanceof HTMLElement)) return null;
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

    this.selectedTarget = toElementTarget(target);
    const element = document.elementFromPoint(e.clientX, e.clientY);
    this.selectedElement = element instanceof HTMLElement ? element : null;
    this.selectionPath = [];
    this.hoveredTarget = null;
    this.showProperties = false;
    this.propertyChanges = {};
    this.mode = 'compose';
    this.cleanupPicking();
    this.setupComposeTracking();
    this.updateOverlay();
    this.updatePanel();

    // Focus the textarea
    const textarea = this.panelEl?.querySelector('textarea');
    if (textarea) textarea.focus();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.closeTool();
  }

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
    return !!parent && parent !== document.documentElement && !parent.closest(ELEMENT_TAG);
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
    this.selectedElement = element;
    this.selectedTarget = describeElement(element);
    // Property changes referred to the previous element's computed values
    this.propertyChanges = {};
    this.updateOverlay();
    this.updatePanel();
  }

  // ---- Panel dodge (slide to the other side when covering the selection) ----

  private setDodgeSide(side: 'left' | 'right'): void {
    if (side === 'left' && this.dodgeX > 0) return;
    if (side === 'right' && this.dodgeX === 0) return;

    if (side === 'right') {
      this.dodgeX = 0;
      this.style.setProperty(`${CSS_VAR_PREFIX}-dodge-x`, '0px');
      return;
    }

    const anchor = this.panelEl && this.panelEl.style.display !== 'none' ? this.panelEl : this.launcherEl;
    if (!anchor) return;
    const margin = 20;
    const target = Math.round(anchor.getBoundingClientRect().left - margin);
    if (target <= margin) return; // no room on the left side
    this.dodgeX = target;
    this.style.setProperty(`${CSS_VAR_PREFIX}-dodge-x`, `${target}px`);
  }

  // Compose mode: if the selected element sits under the panel, slide the
  // panel to the opposite side. Triggered by element position, not pointer.
  private updateComposeDodge(elementRect: DOMRect): void {
    if (!this.panelEl || window.innerWidth <= 640) return;
    const panelRect = this.panelEl.getBoundingClientRect();
    const overlaps =
      elementRect.right > panelRect.left &&
      elementRect.left < panelRect.right &&
      elementRect.bottom > panelRect.top &&
      elementRect.top < panelRect.bottom;
    if (!overlaps) return;
    const elementCenter = (elementRect.left + elementRect.right) / 2;
    this.setDodgeSide(elementCenter > window.innerWidth / 2 ? 'left' : 'right');
  }

  private removeKeyDownListener(): void {
    if (this.boundKeyDown) {
      document.removeEventListener('keydown', this.boundKeyDown);
      this.boundKeyDown = null;
    }
  }

  // ---- Data operations ----

  private async loadAnnotations(): Promise<void> {
    this.isLoading = true;
    this.status = null;
    this.statusType = null;
    this.updatePanel();

    try {
      const pagePath = window.location.pathname;
      this.annotations = await this.store.list(pagePath);
    } catch (error) {
      this.status = error instanceof Error ? error.message : this.labels.loading;
      this.statusType = 'error';
    } finally {
      this.isLoading = false;
      this.updatePanel();
    }
  }

  private getChanges(): PropertyChange[] {
    return Object.entries(this.propertyChanges).map(
      ([property, { from, to }]) => ({ property, from, to }),
    );
  }

  private async submitAnnotation(): Promise<void> {
    if (!this.selectedTarget || !this.message.trim() || this.isSubmitting) return;

    this.isSubmitting = true;
    this.status = null;
    this.statusType = null;
    this.updatePanel();

    try {
      const annotation = await this.store.create({
        pagePath: window.location.pathname,
        pageTitle: document.title,
        message: this.message.trim(),
        element: this.selectedTarget,
        changes: this.getChanges(),
      });
      this.annotations = [annotation, ...this.annotations];
      this.message = '';
      this.selectedTarget = null;
      this.selectedElement = null;
      this.mode = 'list';
      this.cleanupComposeTracking();
      this.updateOverlay();
    } catch (error) {
      this.status = error instanceof Error ? error.message : 'Failed to submit.';
      this.statusType = 'error';
    } finally {
      this.isSubmitting = false;
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
    if (!this.store.update) return;
    try {
      const updated = await this.store.update(id, { status: 'resolved' });
      this.annotations = this.annotations.map((a) => (a.id === id ? updated : a));
      this.updatePanel();
    } catch {
      // silent
    }
  }

  // ---- Drag-and-drop reordering ----

  private handleDragHandleDown(e: MouseEvent): void {
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
    if (!this.dragSrcId || !this.dragOverId) {
      this.handleDragEnd();
      return;
    }

    const srcId = this.dragSrcId;
    const targetId = this.dragOverId;
    const pos = this.dragOverPos;

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

    this.annotations = annotations;

    if (this.store.reorder) {
      try {
        await this.store.reorder(annotations.map((a) => a.id));
      } catch {
        // silent — in-memory order is already updated
      }
    }

    this.handleDragEnd();
    this.updatePanel();
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
        pagePath: window.location.pathname,
        pageTitle: document.title,
        message: this.message.trim() || '(no message)',
        element: this.selectedTarget,
        createdAt: new Date().toISOString(),
        status: 'open',
        changes: this.getChanges(),
      });
    } else {
      text = formatAnnotationsAsPrompt(this.annotations, window.location.pathname);
    }

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
      case 'resolve':
        if (id) this.resolveAnnotation(id);
        break;
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

  private handlePanelInput(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.tagName === 'TEXTAREA') {
      this.message = (target as HTMLTextAreaElement).value;
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

  private updateOverlay(): void {
    if (!this.overlayEl) return;

    // While composing, keep a persistent frame on the selected element
    if (this.mode === 'compose') {
      this.renderSelectedOverlay();
      return;
    }

    const target = this.mode === 'picking' ? this.hoveredTarget : this.locatedTarget;

    if (!target) {
      this.overlayEl.style.display = 'none';
      this.overlayEl.innerHTML = '';
      return;
    }

    const { viewportRect: rect } = target;
    const tooltipOffset = target.hoverInfo ? 72 : 34;
    const tooltipTop = rect.top > tooltipOffset + 10 ? rect.top - tooltipOffset : rect.bottom + 8;
    const tooltipLeft = Math.min(Math.max(rect.left, 8), window.innerWidth - 240);

    this.overlayEl.style.display = '';
    this.overlayEl.innerHTML = `
      <div class="${CLASS_PREFIX}-highlight" style="top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px"></div>
      <div class="${CLASS_PREFIX}-element-label" style="top:${tooltipTop}px;left:${tooltipLeft}px">
        <div class="${CLASS_PREFIX}-label-row">
          <strong>${escapeHtml(target.name)}</strong>
          <span>${Math.round(rect.width)} × ${Math.round(rect.height)}</span>
        </div>
        ${target.hoverInfo ? `
        <div class="${CLASS_PREFIX}-label-row">
          <span class="${CLASS_PREFIX}-label-key">${escapeHtml(this.labels.colorLabel ?? '颜色')}</span>
          <span>${escapeHtml(target.hoverInfo.color)}</span>
        </div>
        <div class="${CLASS_PREFIX}-label-row">
          <span class="${CLASS_PREFIX}-label-key">${escapeHtml(this.labels.fontLabel ?? '字体')}</span>
          <span>${escapeHtml(target.hoverInfo.fontSize)} ${escapeHtml(target.hoverInfo.fontFamily)}</span>
        </div>
        ` : ''}
      </div>
    `;
  }

  private renderSelectedOverlay(): void {
    if (!this.overlayEl) return;

    const element = this.selectedElement;
    if (!element || !element.isConnected || !this.selectedTarget) {
      this.overlayEl.style.display = 'none';
      this.overlayEl.innerHTML = '';
      return;
    }

    const rect = element.getBoundingClientRect();
    this.updateComposeDodge(rect);
    const labelTop = rect.top > 34 + 10 ? rect.top - 34 : rect.bottom + 8;
    const labelLeft = Math.min(Math.max(rect.left, 8), window.innerWidth - 240);

    this.overlayEl.style.display = '';
    this.overlayEl.innerHTML = `
      <div class="${CLASS_PREFIX}-highlight is-selected" style="top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px"></div>
      <div class="${CLASS_PREFIX}-element-label" style="top:${labelTop}px;left:${labelLeft}px">
        <div class="${CLASS_PREFIX}-label-row">
          <strong>${escapeHtml(this.selectedTarget.name)}</strong>
          <span>${Math.round(rect.width)} × ${Math.round(rect.height)}</span>
        </div>
      </div>
    `;
  }

  private updatePanel(): void {
    if (!this.panelEl || !this.launcherEl) return;

    const isOpen = this.mode !== 'closed';

    // Update launcher
    this.launcherEl.classList.toggle('is-active', isOpen);
    this.launcherEl.innerHTML = isOpen
      ? `${ICONS.x}<span>${this.labels.close}</span>`
      : `${ICONS.annotate}<span>${this.labels.picker}</span>`;

    if (!isOpen) {
      this.panelEl.style.display = 'none';
      this.panelEl.innerHTML = '';
      return;
    }

    this.panelEl.style.display = '';
    const isPickingOrCompose = this.mode === 'picking' || this.mode === 'compose';
    const isList = this.mode === 'list';

    this.panelEl.innerHTML = `
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
      </div>
      ${this.renderPanelContent()}
    `;
  }

  private renderPanelContent(): string {
    switch (this.mode) {
      case 'picking':
        return this.renderPickerNote();
      case 'compose':
        return this.renderCompose();
      case 'list':
        return this.renderList();
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
            <button type="button" class="${CLASS_PREFIX}-send" data-action="send" ${!this.message.trim() || this.isSubmitting ? 'disabled' : ''}>
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
    let content = '';

    if (this.isLoading) {
      content = `<p class="${CLASS_PREFIX}-empty">${escapeHtml(this.labels.loading)}</p>`;
    } else if (this.status && this.statusType === 'error' && this.annotations.length === 0) {
      content = `<p class="${CLASS_PREFIX}-status is-error">${escapeHtml(this.status)}</p>`;
    } else if (this.annotations.length === 0) {
      content = `<p class="${CLASS_PREFIX}-empty">${escapeHtml(this.labels.empty)}</p>`;
    } else {
      content = this.annotations.map((annotation) => this.renderItem(annotation)).join('');
    }

    const statusHtml = this.status && this.statusType === 'success'
      ? `<p class="${CLASS_PREFIX}-status is-success">${escapeHtml(this.status)}</p>`
      : '';

    return `
      <div class="${CLASS_PREFIX}-list">
        ${statusHtml}
        ${content}
      </div>
    `;
  }

  private renderItem(annotation: Annotation): string {
    const isResolved = annotation.status === 'resolved';
    const contextHtml = annotation.element.text
      ? `<span class="${CLASS_PREFIX}-item-context">${escapeHtml(this.labels.contentPrefix)}${escapeHtml(annotation.element.text)}</span>`
      : '';
    const changesHtml = annotation.changes && annotation.changes.length > 0
      ? `<div class="${CLASS_PREFIX}-item-changes">${annotation.changes.map(c => `<span class="${CLASS_PREFIX}-change">${escapeHtml(c.property)}: ${escapeHtml(c.from)} → <strong>${escapeHtml(c.to)}</strong></span>`).join('')}</div>`
      : '';
    const statusBadge = isResolved
      ? `<span class="${CLASS_PREFIX}-item-status">${ICONS.check}${escapeHtml(this.labels.resolved)}</span>`
      : '';
    const resolveBtn = !isResolved && this.store.update
      ? `<button type="button" class="is-resolve" data-action="resolve" data-id="${annotation.id}">${ICONS.check}${escapeHtml(this.labels.resolve)}</button>`
      : '';

    return `
      <article class="${CLASS_PREFIX}-item ${isResolved ? 'is-resolved' : ''}" data-annotation-id="${annotation.id}">
        <div class="${CLASS_PREFIX}-item-header">
          <div class="${CLASS_PREFIX}-item-title">
            <button type="button" class="${CLASS_PREFIX}-drag-handle" data-drag-handle aria-label="${escapeHtml(this.labels.dragLabel ?? '拖动排序')}">
              ${ICONS.grip}
            </button>
            <strong>${escapeHtml(annotation.element.name)}</strong>
          </div>
          <div class="${CLASS_PREFIX}-item-actions">
            <button type="button" data-action="copy" data-id="${annotation.id}">${ICONS.copy}</button>
            <button type="button" data-action="locate" data-id="${annotation.id}">${ICONS.crosshair}${escapeHtml(this.labels.locate)}</button>
            ${resolveBtn}
          </div>
        </div>
        <code title="${escapeHtml(annotation.element.selector)}">${escapeHtml(annotation.element.selector)}</code>
        <p>${escapeHtml(annotation.message)}</p>
        ${changesHtml}
        ${contextHtml}
        ${statusBadge}
        <time datetime="${annotation.createdAt}">${formatTime(annotation.createdAt)}</time>
      </article>
    `;
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
