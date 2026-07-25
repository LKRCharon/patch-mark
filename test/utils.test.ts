import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toElementTarget, formatTime } from '../src/utils.js';
import type { PickerTarget } from '../src/types.js';

test('toElementTarget strips picker extras, keeps the five ElementTarget fields', () => {
  const target: PickerTarget = {
    tagName: 'div',
    name: '.card',
    selector: 'div.card',
    text: 'Hello',
    rect: { top: 1, left: 2, width: 3, height: 4 },
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
  });
  assert.equal('viewportRect' in el, false);
  assert.equal('hoverInfo' in el, false);
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
