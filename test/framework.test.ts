import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectFramework } from '../src/framework.js';

// Build a fake DOM element carrying a React fiber chain, as React dev does.
function withFiber(fiber: object): HTMLElement {
  return { __reactFiber$abc123: fiber } as unknown as HTMLElement;
}

test('react: host fiber walks up to the enclosing component with source', () => {
  const fiber = {
    type: 'button',
    _debugSource: { fileName: '/Users/dev/proj/src/components/Button.tsx', lineNumber: 42 },
    return: {
      type: function SubmitButton() {},
      return: { type: 'div', return: null },
    },
  };
  const info = detectFramework(withFiber(fiber));
  assert.equal(info.component, 'SubmitButton');
  assert.equal(info.source, 'src/components/Button.tsx:42');
});

test('react: skips Fragment (symbol type) when looking for a name', () => {
  const fiber = {
    type: 'span',
    return: {
      type: Symbol('react.fragment'),
      return: { type: function Card() {}, return: null },
    },
  };
  const info = detectFramework(withFiber(fiber));
  assert.equal(info.component, 'Card');
});

test('react: forwardRef object type resolves via render.name', () => {
  const fiber = {
    type: 'input',
    return: {
      type: { render: function FancyInput() {} },
      return: null,
    },
  };
  const info = detectFramework(withFiber(fiber));
  assert.equal(info.component, 'FancyInput');
});

test('react: memo object type resolves via type.name', () => {
  const fiber = {
    type: 'div',
    return: {
      type: { type: function MemoCard() {} },
      return: null,
    },
  };
  const info = detectFramework(withFiber(fiber));
  assert.equal(info.component, 'MemoCard');
});

test('react: no fiber key falls through to empty info', () => {
  const info = detectFramework({} as HTMLElement);
  assert.deepEqual(info, {});
});

test('react: production fiber without names or debugSource yields empty info', () => {
  const fiber = { type: 'div', return: { type: 'div', return: null } };
  const info = detectFramework(withFiber(fiber));
  assert.deepEqual(info, {});
});

test('react: bails out past the depth cap', () => {
  let chain: Record<string, unknown> = { type: function DeepComponent() {}, return: null };
  for (let i = 0; i < 40; i++) {
    chain = { type: 'div', return: chain };
  }
  const info = detectFramework(withFiber(chain));
  assert.equal(info.component, undefined);
});

test('react: windows paths normalize to project-relative', () => {
  const fiber = {
    type: function App() {},
    _debugSource: { fileName: 'C:\\dev\\proj\\src\\App.tsx', lineNumber: 7 },
    return: null,
  };
  const info = detectFramework(withFiber(fiber));
  assert.equal(info.source, 'src/App.tsx:7');
});

test('react: paths without /src/ keep the last two segments', () => {
  const fiber = {
    type: function Widget() {},
    _debugSource: { fileName: '/proj/packages/ui/components/Widget.tsx', lineNumber: 3 },
    return: null,
  };
  const info = detectFramework(withFiber(fiber));
  assert.equal(info.source, 'components/Widget.tsx:3');
});

test('vue: reads SFC __name and __file', () => {
  const el = {
    __vueParentComponent: {
      type: { __name: 'HelloWorld', __file: 'src/components/HelloWorld.vue' },
    },
  } as unknown as HTMLElement;
  const info = detectFramework(el);
  assert.equal(info.component, 'HelloWorld');
  assert.equal(info.source, 'src/components/HelloWorld.vue');
});

test('vue: options API name without a file', () => {
  const el = {
    __vueParentComponent: { type: { name: 'AppHeader' }, parent: null },
  } as unknown as HTMLElement;
  const info = detectFramework(el);
  assert.equal(info.component, 'AppHeader');
  assert.equal(info.source, undefined);
});

test('vue: walks up to the parent when the instance has no name', () => {
  const el = {
    __vueParentComponent: {
      type: {},
      parent: { type: { __name: 'ParentView', __file: 'src/views/ParentView.vue' } },
    },
  } as unknown as HTMLElement;
  const info = detectFramework(el);
  assert.equal(info.component, 'ParentView');
  assert.equal(info.source, 'src/views/ParentView.vue');
});
