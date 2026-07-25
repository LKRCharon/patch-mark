import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatAnnotationAsPrompt,
  formatAnnotationsAsPrompt,
  formatHandoffPrompt,
} from '../src/prompt.js';
import type { Annotation } from '../src/types.js';

const PAGE_URL = 'http://localhost:5173/dashboard';
const REST_SOURCE = { type: 'rest', endpoint: '/api/annotations' } as const;

function makeAnnotation(overrides: Partial<Annotation> = {}): Annotation {
  return {
    id: 'ann-1',
    pagePath: '/dashboard',
    pageTitle: 'Dashboard',
    message: 'Make this button bigger',
    createdAt: '2026-07-23T10:00:00.000Z',
    status: 'open',
    element: {
      tagName: 'button',
      name: '#save',
      selector: '#save',
      text: 'Save changes',
      rect: { top: 120, left: 40, width: 96, height: 32 },
    },
    ...overrides,
  };
}

function singleCharLines(text: string): string[] {
  return text.split('\n').filter((line) => line.length === 1);
}

// --- formatAnnotationAsPrompt ---

test('single: renders all fields', () => {
  const out = formatAnnotationAsPrompt(makeAnnotation());
  assert.ok(out.startsWith('## UI Feedback'));
  assert.ok(out.includes('- **Element:** `<button>`'));
  assert.ok(out.includes('- **Selector:** `#save`'));
  assert.ok(out.includes('- **Name:** #save'));
  assert.ok(out.includes('- **Text:** "Save changes"'));
  assert.ok(out.includes('- **Position:** top=120, left=40, 96x32'));
  assert.ok(out.includes('- **Page:** /dashboard'));
  assert.ok(out.includes('- **Page Title:** Dashboard'));
  assert.ok(out.includes('- **Feedback:** Make this button bigger'));
  assert.ok(out.includes('- **Status:** open'));
});

test('single: omits optional lines when empty', () => {
  const base = makeAnnotation();
  const out = formatAnnotationAsPrompt(
    makeAnnotation({
      pageTitle: undefined,
      status: undefined,
      element: { ...base.element, text: '' },
    }),
  );
  assert.ok(!out.includes('**Text:**'));
  assert.ok(!out.includes('**Page Title:**'));
  assert.ok(!out.includes('**Status:**'));
});

test('single: renders property changes', () => {
  const out = formatAnnotationAsPrompt(
    makeAnnotation({ changes: [{ property: 'color', from: 'red', to: 'blue' }] }),
  );
  assert.ok(out.includes('- **Property Changes:**'));
  assert.ok(out.includes('- `color`: red → blue'));
});

test('single: renders framework component and source when present', () => {
  const base = makeAnnotation();
  const out = formatAnnotationAsPrompt(
    makeAnnotation({
      element: { ...base.element, component: 'SubmitButton', source: 'src/Button.tsx:42' },
    }),
  );
  assert.ok(out.includes('- **Component:** `<SubmitButton>`'));
  assert.ok(out.includes('- **Source:** src/Button.tsx:42'));
});

test('single: no component/source lines when absent', () => {
  const out = formatAnnotationAsPrompt(makeAnnotation());
  assert.ok(!out.includes('**Component:**'));
  assert.ok(!out.includes('**Source:**'));
});

test('single: renders the quote for text-selection annotations', () => {
  const base = makeAnnotation();
  const out = formatAnnotationAsPrompt(
    makeAnnotation({ element: { ...base.element, quote: 'Submit Application' } }),
  );
  assert.ok(out.includes('- **Quote:** "Submit Application"'));
  // Text (whole element) and Quote (user's selection) are separate lines.
  assert.ok(out.includes('- **Text:** "Save changes"'));
});

test('single: no quote line for plain element annotations', () => {
  const out = formatAnnotationAsPrompt(makeAnnotation());
  assert.ok(!out.includes('**Quote:**'));
});

// --- formatAnnotationsAsPrompt ---

test('batch: empty list', () => {
  assert.equal(formatAnnotationsAsPrompt([]), '## UI Feedback\n\nNo feedback items.');
});

test('batch: header, numbering, separator', () => {
  const out = formatAnnotationsAsPrompt([makeAnnotation(), makeAnnotation({ id: 'ann-2' })]);
  assert.ok(out.includes('## UI Feedback Report'));
  assert.ok(out.includes('- **Page:** /dashboard'));
  assert.ok(out.includes('- **Total Items:** 2'));
  assert.ok(out.includes('### Feedback #1'));
  assert.ok(out.includes('### Feedback #2'));
  assert.ok(out.includes('\n\n---\n\n'));
});

test('batch: pagePath argument wins over annotation pagePath', () => {
  const out = formatAnnotationsAsPrompt([makeAnnotation()], '/override');
  assert.ok(out.includes('- **Page:** /override'));
});

test('regression 0.7.1: joined items are not spread into per-character lines', () => {
  const out = formatAnnotationsAsPrompt([makeAnnotation(), makeAnnotation({ id: 'ann-2' })]);
  // A spread string ('...items.join()') explodes every item into one character per line.
  assert.ok(out.includes('### Feedback #1\n\n## UI Feedback'));
  assert.deepEqual(singleCharLines(out), []);
});

// --- formatHandoffPrompt ---

test('handoff: all resolved → empty notice', () => {
  const out = formatHandoffPrompt([makeAnnotation({ status: 'resolved' })], PAGE_URL, REST_SOURCE);
  assert.equal(out, '## UI Feedback\n\nNo open feedback items.');
});

test('handoff: resolved items are excluded', () => {
  const out = formatHandoffPrompt(
    [
      makeAnnotation({ message: 'still open' }),
      makeAnnotation({ id: 'ann-2', status: 'resolved', message: 'already done' }),
    ],
    PAGE_URL,
    REST_SOURCE,
  );
  assert.ok(out.includes('## Open items (1)'));
  assert.ok(out.includes('still open'));
  assert.ok(!out.includes('already done'));
});

test('handoff self-serve: REST contract, ids, lifecycle', () => {
  const out = formatHandoffPrompt([makeAnnotation()], PAGE_URL, REST_SOURCE);
  assert.ok(
    out.includes(`You are maintaining UI feedback annotations managed by patch-mark on ${PAGE_URL}.`),
  );
  assert.ok(out.includes('## Source of truth'));
  assert.ok(out.includes('- GET    /api/annotations?page=%2Fdashboard'));
  assert.ok(out.includes('- PATCH  /api/annotations/{id}'));
  assert.ok(out.includes('## Lifecycle rules'));
  assert.ok(out.includes('## Open items (1)'));
  assert.ok(out.includes('- **ID:** `ann-1`'));
  assert.ok(out.includes('### 1. `<button>` — #save'));
});

test('handoff self-serve: pagePath is URI-encoded in the GET line', () => {
  const out = formatHandoffPrompt([makeAnnotation({ pagePath: '/dash board?x=1' })], PAGE_URL, REST_SOURCE);
  assert.ok(out.includes(`page=${encodeURIComponent('/dash board?x=1')}`));
  assert.ok(!out.includes('page=/dash board?x=1'));
});

test('handoff paste-off: instructions, no ids, no PATCH', () => {
  const out = formatHandoffPrompt([makeAnnotation()], PAGE_URL);
  assert.ok(out.includes('You are fixing a batch of UI feedback captured with patch-mark.'));
  assert.ok(out.includes(`- **Page:** ${PAGE_URL}`));
  assert.ok(out.includes('- **Open Items:** 1'));
  assert.ok(out.includes('### 1. `<button>` — #save'));
  assert.ok(!out.includes('PATCH'));
  assert.ok(!out.includes('- **ID:**'));
  assert.ok(!out.includes('## Source of truth'));
});

test('regression 0.7.1: handoff items are not spread into per-character lines', () => {
  const rest = formatHandoffPrompt([makeAnnotation(), makeAnnotation({ id: 'ann-2' })], PAGE_URL, REST_SOURCE);
  assert.ok(rest.includes('### 1. `<button>` — #save'));
  assert.ok(rest.includes('### 2. `<button>` — #save'));
  assert.deepEqual(singleCharLines(rest), []);

  const paste = formatHandoffPrompt([makeAnnotation(), makeAnnotation({ id: 'ann-2' })], PAGE_URL);
  assert.deepEqual(singleCharLines(paste), []);
});
