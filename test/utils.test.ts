import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toElementTarget, formatTime, shouldSnapToEdge } from '../src/utils.js';
import type { PickerTarget } from '../src/types.js';

test('toElementTarget strips picker extras, keeps ElementTarget fields incl. component/source', () => {
  const target: PickerTarget = {
    tagName: 'div',
    name: '.card',
    selector: 'div.card',
    text: 'Hello',
    rect: { top: 1, left: 2, width: 3, height: 4 },
    component: 'Card',
    source: 'src/Card.tsx:12',
    quote: 'Hello',
    viewportRect: {} as DOMRect,
    hoverInfo: { color: 'red', fontSize: '16px', fontFamily: 'Inter' },
  };
  const el = toElementTarget(target);
  assert.deepEqual(el, {
    tagName: 'div',
    name: '.card',
    selector: 'div.card',
    text: 'Hello',
    rect: { top: 1, left: 2, width: 3, height: 4 },
    component: 'Card',
    source: 'src/Card.tsx:12',
    quote: 'Hello',
  });
  assert.equal('viewportRect' in el, false);
  assert.equal('hoverInfo' in el, false);
});

test('toElementTarget works without optional framework fields', () => {
  const target: PickerTarget = {
    tagName: 'div',
    name: '.card',
    selector: 'div.card',
    text: 'Hello',
    rect: { top: 1, left: 2, width: 3, height: 4 },
    viewportRect: {} as DOMRect,
  };
  const el = toElementTarget(target);
  assert.deepEqual(el, {
    tagName: 'div',
    name: '.card',
    selector: 'div.card',
    text: 'Hello',
    rect: { top: 1, left: 2, width: 3, height: 4 },
  });
});

test('formatTime renders month/day/hour/minute', () => {
  const out = formatTime('2026-07-23T10:30:00');
  assert.match(out, /7/);
  assert.match(out, /23/);
  assert.match(out, /10/);
  assert.match(out, /30/);
});

test('formatTime respects the locale argument', () => {
  const zh = formatTime('2026-07-23T10:30:00', 'zh-CN');
  const en = formatTime('2026-07-23T10:30:00', 'en-US');
  assert.notEqual(zh, en);
});

test('shouldSnapToEdge: default right-center dock does not snap (centre ~24px from edge)', () => {
  // 1440 viewport, 48px launcher docked right: centre = 1440 - 24 = 1416.
  // margin 12 → threshold 1428. 1416 < 1428, so no snap. The old 60px
  // margin (threshold 1380) collapsed the default dock on any tiny drag.
  assert.equal(shouldSnapToEdge(1416, 1440), false);
  assert.equal(shouldSnapToEdge(658 - 24, 658), false);
});

test('shouldSnapToEdge: pushed past the edge snaps', () => {
  // Centre 6px from the right edge — launcher more than half off-screen.
  assert.equal(shouldSnapToEdge(1440 - 6, 1440), true);
});

test('shouldSnapToEdge: left edge snaps', () => {
  assert.equal(shouldSnapToEdge(4, 1440), true);
});

test('shouldSnapToEdge: centre of viewport does not snap', () => {
  assert.equal(shouldSnapToEdge(720, 1440), false);
});
