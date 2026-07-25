import type { ElementTarget, PickerTarget } from './types.js';
import { detectFramework } from './framework.js';

export function describeElement(element: HTMLElement): ElementTarget {
  const rect = element.getBoundingClientRect();
  const tagName = element.tagName.toLowerCase();
  const name = getElementName(element, tagName);
  return {
    tagName,
    name,
    selector: buildSelector(element),
    text: (element.innerText || element.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 240),
    rect: {
      top: Math.round(rect.top + window.scrollY),
      left: Math.round(rect.left + window.scrollX),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
    // React/Vue dev builds only; {} in production.
    ...detectFramework(element),
  };
}

export function toElementTarget(target: PickerTarget): ElementTarget {
  // Strip picker-only extras, keep everything else (including the 0.8.0
  // component/source fields — an explicit field list here silently dropped
  // them once already).
  const { viewportRect: _viewportRect, hoverInfo: _hoverInfo, ...elementTarget } = target;
  return elementTarget;
}

function getElementName(element: HTMLElement, tagName: string): string {
  if (element.id) return `#${element.id}`;
  const label = element.getAttribute('aria-label');
  if (label) return `${tagName}[aria-label="${label.slice(0, 36)}"]`;
  const testId = element.getAttribute('data-testid');
  if (testId) return `[data-testid="${testId}"]`;
  const anchor = element.parentElement?.closest<HTMLElement>('[id]');
  if (anchor?.id) return `#${anchor.id} · ${tagName}`;
  const classes = Array.from(element.classList).filter(isStableClass).slice(0, 2);
  return classes.length ? `${tagName}.${classes.join('.')}` : tagName;
}

function buildSelector(element: HTMLElement): string {
  if (element.id) return `#${CSS.escape(element.id)}`;

  const segments: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== document.body && segments.length < 5) {
    if (current.id) {
      segments.unshift(`#${CSS.escape(current.id)}`);
      break;
    }
    const tagName = current.tagName.toLowerCase();
    const testId = current.getAttribute('data-testid');
    if (testId) {
      segments.unshift(`[data-testid="${CSS.escape(testId)}"]`);
      break;
    }
    const stableClasses = Array.from(current.classList).filter(isStableClass).slice(0, 2);
    const sameTagSiblings = Array.from(current.parentElement?.children ?? []).filter(
      (sibling) => sibling.tagName === current?.tagName,
    );
    const nth = sameTagSiblings.length > 1 ? `:nth-of-type(${sameTagSiblings.indexOf(current) + 1})` : '';
    segments.unshift(`${tagName}${stableClasses.map((cls) => `.${CSS.escape(cls)}`).join('')}${nth}`);
    current = current.parentElement;
  }
  return segments.join(' > ');
}

function isStableClass(className: string): boolean {
  return className.length < 48 && !/^(css-|[a-z]+-[A-Za-z0-9]{6,}|[a-zA-Z0-9_-]*\d{4,})/.test(className);
}

export function formatTime(value: string, locale = 'zh-CN'): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat(locale, {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
