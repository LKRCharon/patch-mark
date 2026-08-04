export type ElementTarget = {
  tagName: string;
  name: string;
  selector: string;
  text: string;
  rect: { top: number; left: number; width: number; height: number };
  /** Nearest framework component name (React/Vue dev builds only). */
  component?: string;
  /** Project-relative source location, e.g. "src/Button.tsx:42" (dev builds only). */
  source?: string;
  /** Exact text the user selected within the element (text-selection annotations). */
  quote?: string;
};

export type HoverInfo = {
  color: string;
  fontSize: string;
  fontFamily: string;
};

export type PickerTarget = ElementTarget & {
  viewportRect: DOMRect;
  hoverInfo?: HoverInfo;
};

export type ToolMode = 'closed' | 'picking' | 'compose' | 'list' | 'locked';

export type AnnotationStatus = 'open' | 'resolved';

export type PropertyChange = {
  property: string;
  from: string;
  to: string;
};

export type Annotation = {
  id: string;
  pagePath: string;
  pageTitle?: string;
  message: string;
  element: ElementTarget;
  createdAt: string;
  status?: AnnotationStatus;
  changes?: PropertyChange[];
};

export type CreateAnnotationInput = {
  pagePath: string;
  pageTitle?: string;
  message: string;
  element: ElementTarget;
  changes?: PropertyChange[];
};

/**
 * Built-in lifecycle mutations are intentionally narrow. A caller that needs
 * arbitrary record editing should expose a domain-specific command instead of
 * accepting an unbounded Partial<Annotation> from the browser or an agent.
 */
export type ResolveAnnotationPatch = { status: 'resolved' };

/** Optional cancellation propagated through asynchronous store operations. */
export type StoreRequestOptions = {
  signal?: AbortSignal;
  /** Scope a mutation that operates on an ordered page-local collection. */
  pagePath?: string;
};

export interface AnnotationStore {
  list(pagePath: string, options?: StoreRequestOptions): Promise<Annotation[]>;
  create(input: CreateAnnotationInput, options?: StoreRequestOptions): Promise<Annotation>;
  update?(id: string, patch: ResolveAnnotationPatch, options?: StoreRequestOptions): Promise<Annotation>;
  delete?(id: string, options?: StoreRequestOptions): Promise<void>;
  reorder?(ids: string[], options?: StoreRequestOptions): Promise<void>;
  /**
   * Required when the component's require-auth mode is enabled. It must make
   * a server-authorized request and reject with PatchMarkAuthError on a 401.
   */
  validateAccess?(options?: StoreRequestOptions): Promise<void>;
  /** If set, the handoff prompt instructs the agent to read/resolve
   *  annotations through this source itself (self-serve loop). */
  readonly source?: { readonly type: 'rest'; readonly endpoint: string };
  /** Whether the store can currently survive a page reload. */
  readonly persistence?: 'durable' | 'memory';
}

/** Context passed to the onError callback when a store operation fails. */
export type PatchMarkErrorContext = {
  operation: 'list' | 'create' | 'resolve' | 'reorder';
  annotationId?: string;
};

export type AnnotationLabels = {
  picker: string;
  pickerHint: string;
  compose: string;
  targetLabel: string;
  placeholder: string;
  send: string;
  sending: string;
  reselect: string;
  list: string;
  locate: string;
  close: string;
  empty: string;
  loading: string;
  notFound: string;
  contentPrefix: string;
  copyAsPrompt: string;
  copyHandoff?: string;
  copied: string;
  collapse?: string;
  resolve: string;
  resolved: string;
  properties: string;
  propertiesHint: string;
  colorLabel?: string;
  fontLabel?: string;
  dragLabel?: string;
  expandLabel?: string;
  shrinkLabel?: string;
  lockedTitle?: string;
  lockedHint?: string;
  lockedPlaceholder?: string;
  lockedSubmit?: string;
  lockedError?: string;
};

export type AnnotationTheme = {
  accent?: string;
  accentDark?: string;
  accentSoft?: string;
};

/** Built-in preset themes (see the theme attribute / themeName property). */
export type ThemeName = 'blue' | 'violet' | 'emerald' | 'orange' | 'rose';
