export type ElementTarget = {
  tagName: string;
  name: string;
  selector: string;
  text: string;
  rect: { top: number; left: number; width: number; height: number };
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

export type ToolMode = 'closed' | 'picking' | 'compose' | 'list';

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

export interface AnnotationStore {
  list(pagePath: string): Promise<Annotation[]>;
  create(input: CreateAnnotationInput): Promise<Annotation>;
  update?(id: string, patch: Partial<Annotation>): Promise<Annotation>;
  delete?(id: string): Promise<void>;
  reorder?(ids: string[]): Promise<void>;
}

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
  copied: string;
  resolve: string;
  resolved: string;
  properties: string;
  propertiesHint: string;
  colorLabel?: string;
  fontLabel?: string;
  dragLabel?: string;
};

export type AnnotationTheme = {
  accent?: string;
  accentDark?: string;
  accentSoft?: string;
};
