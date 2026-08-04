import type { Annotation, CreateAnnotationInput, ElementTarget, PropertyChange } from './types.js';

/**
 * Runtime validation for the trust boundary between a browser, a store, and
 * an agent. TypeScript types disappear over HTTP and localStorage, so every
 * value crossing that boundary must be checked before the UI renders it.
 */
export class PatchMarkValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PatchMarkValidationError';
  }
}

export const annotationLimits = {
  id: 128,
  pagePath: 2048,
  pageTitle: 512,
  message: 4000,
  tagName: 64,
  name: 512,
  selector: 4096,
  text: 1000,
  quote: 1000,
  component: 512,
  source: 1024,
  property: 128,
  propertyValue: 2000,
  changes: 32,
  collection: 1000,
} as const;

type UnknownRecord = Record<string, unknown>;

function fail(path: string, message: string): never {
  throw new PatchMarkValidationError(`${path}: ${message}`);
}

function record(value: unknown, path: string): UnknownRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(path, 'must be an object');
  }
  return value as UnknownRecord;
}

function onlyKeys(value: UnknownRecord, allowed: readonly string[], path: string): void {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) fail(path, `unknown field "${key}"`);
  }
}

function string(
  value: unknown,
  path: string,
  maxLength: number,
  options: { optional?: boolean; allowEmpty?: boolean } = {},
): string | undefined {
  if (value === undefined && options.optional) return undefined;
  if (typeof value !== 'string') fail(path, 'must be a string');
  if (!options.allowEmpty && value.trim().length === 0) fail(path, 'must not be empty');
  if (value.length > maxLength) fail(path, `must be at most ${maxLength} characters`);
  return value;
}

function finiteNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) fail(path, 'must be a finite number');
  // Coordinates can be negative, but a value this large cannot describe a
  // browser viewport and commonly signals an accidental or malicious payload.
  if (Math.abs(value) > 10_000_000) fail(path, 'is outside the supported range');
  return value;
}

function element(value: unknown, path: string): ElementTarget {
  const input = record(value, path);
  onlyKeys(input, ['tagName', 'name', 'selector', 'text', 'rect', 'component', 'source', 'quote'], path);
  const rect = record(input.rect, `${path}.rect`);
  onlyKeys(rect, ['top', 'left', 'width', 'height'], `${path}.rect`);

  const width = finiteNumber(rect.width, `${path}.rect.width`);
  const height = finiteNumber(rect.height, `${path}.rect.height`);
  if (width < 0 || height < 0) fail(`${path}.rect`, 'width and height must not be negative');

  const target: ElementTarget = {
    tagName: string(input.tagName, `${path}.tagName`, annotationLimits.tagName)!,
    name: string(input.name, `${path}.name`, annotationLimits.name)!,
    selector: string(input.selector, `${path}.selector`, annotationLimits.selector)!,
    text: string(input.text, `${path}.text`, annotationLimits.text, { allowEmpty: true })!,
    rect: {
      top: finiteNumber(rect.top, `${path}.rect.top`),
      left: finiteNumber(rect.left, `${path}.rect.left`),
      width,
      height,
    },
  };

  const component = string(input.component, `${path}.component`, annotationLimits.component, { optional: true });
  const source = string(input.source, `${path}.source`, annotationLimits.source, { optional: true });
  const quote = string(input.quote, `${path}.quote`, annotationLimits.quote, { optional: true });
  if (component !== undefined) target.component = component;
  if (source !== undefined) target.source = source;
  if (quote !== undefined) target.quote = quote;
  return target;
}

function changes(value: unknown, path: string, optional = true): PropertyChange[] | undefined {
  if (value === undefined && optional) return undefined;
  if (!Array.isArray(value)) fail(path, 'must be an array');
  if (value.length > annotationLimits.changes) fail(path, `must contain at most ${annotationLimits.changes} entries`);
  return value.map((entry, index) => {
    const input = record(entry, `${path}[${index}]`);
    onlyKeys(input, ['property', 'from', 'to'], `${path}[${index}]`);
    return {
      property: string(input.property, `${path}[${index}].property`, annotationLimits.property)!,
      from: string(input.from, `${path}[${index}].from`, annotationLimits.propertyValue, { allowEmpty: true })!,
      to: string(input.to, `${path}[${index}].to`, annotationLimits.propertyValue, { allowEmpty: true })!,
    };
  });
}

/** Reject unknown fields and return a safe, plain CreateAnnotationInput. */
export function parseCreateAnnotation(value: unknown): CreateAnnotationInput {
  const input = record(value, 'annotation');
  onlyKeys(input, ['pagePath', 'pageTitle', 'message', 'element', 'changes'], 'annotation');
  const parsed: CreateAnnotationInput = {
    pagePath: string(input.pagePath, 'annotation.pagePath', annotationLimits.pagePath)!,
    message: string(input.message, 'annotation.message', annotationLimits.message)!,
    element: element(input.element, 'annotation.element'),
  };
  const pageTitle = string(input.pageTitle, 'annotation.pageTitle', annotationLimits.pageTitle, { optional: true, allowEmpty: true });
  const propertyChanges = changes(input.changes, 'annotation.changes');
  if (pageTitle !== undefined) parsed.pageTitle = pageTitle;
  if (propertyChanges !== undefined) parsed.changes = propertyChanges;
  return parsed;
}

/** Validate values returned by a store before they reach the renderer. */
export function parseAnnotation(value: unknown): Annotation {
  const input = record(value, 'annotation');
  onlyKeys(input, ['id', 'pagePath', 'pageTitle', 'message', 'element', 'createdAt', 'status', 'changes'], 'annotation');
  const createdAt = string(input.createdAt, 'annotation.createdAt', 64)!;
  if (!Number.isFinite(Date.parse(createdAt))) fail('annotation.createdAt', 'must be an ISO date string');
  const status = input.status === undefined ? undefined : string(input.status, 'annotation.status', 32)!;
  if (status !== undefined && status !== 'open' && status !== 'resolved') {
    fail('annotation.status', 'must be "open" or "resolved"');
  }

  const parsed: Annotation = {
    id: string(input.id, 'annotation.id', annotationLimits.id)!,
    pagePath: string(input.pagePath, 'annotation.pagePath', annotationLimits.pagePath)!,
    message: string(input.message, 'annotation.message', annotationLimits.message)!,
    element: element(input.element, 'annotation.element'),
    createdAt,
  };
  const pageTitle = string(input.pageTitle, 'annotation.pageTitle', annotationLimits.pageTitle, { optional: true, allowEmpty: true });
  const propertyChanges = changes(input.changes, 'annotation.changes');
  if (pageTitle !== undefined) parsed.pageTitle = pageTitle;
  if (status !== undefined) parsed.status = status;
  if (propertyChanges !== undefined) parsed.changes = propertyChanges;
  return parsed;
}

export function parseAnnotations(value: unknown): Annotation[] {
  if (!Array.isArray(value)) fail('annotations', 'must be an array');
  if (value.length > annotationLimits.collection) {
    fail('annotations', `must contain at most ${annotationLimits.collection} entries`);
  }
  return value.map((annotation) => parseAnnotation(annotation));
}

export function parseAnnotationResponse(value: unknown): Annotation {
  const response = record(value, 'response');
  onlyKeys(response, ['annotation'], 'response');
  return parseAnnotation(response.annotation);
}

export function parseAnnotationsResponse(value: unknown): Annotation[] {
  const response = record(value, 'response');
  onlyKeys(response, ['annotations'], 'response');
  return parseAnnotations(response.annotations);
}

/** The only built-in lifecycle mutation the browser component performs. */
export function parseResolvePatch(value: unknown): { status: 'resolved' } {
  const patch = record(value, 'patch');
  onlyKeys(patch, ['status'], 'patch');
  if (patch.status !== 'resolved') fail('patch.status', 'must be "resolved"');
  return { status: 'resolved' };
}
