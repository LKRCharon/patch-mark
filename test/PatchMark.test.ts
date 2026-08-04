import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { PatchMark } from '../src/PatchMark.js';
import { defaultLabels } from '../src/labels.js';
import type { Annotation, ElementTarget, PropertyChange, ToolMode } from '../src/types.js';

type PatchMarkInternals = {
  mode: ToolMode;
  message: string;
  selectedTarget: ElementTarget | null;
  selectedElement: HTMLElement | null;
  propertyChanges: Record<string, { from: string; to: string }>;
  annotations: Annotation[];
  submitAnnotation(): Promise<void>;
};

function installPickingDom(t: TestContext): void {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const classList = { add() {}, remove() {} };

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: { pathname: '/preview' },
      addEventListener() {},
      removeEventListener() {},
      cancelAnimationFrame() {},
    },
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      title: 'Preview',
      documentElement: { classList },
      addEventListener() {},
      removeEventListener() {},
      querySelectorAll() { return []; },
    },
  });

  t.after(() => {
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor);
    else Reflect.deleteProperty(globalThis, 'window');
    if (documentDescriptor) Object.defineProperty(globalThis, 'document', documentDescriptor);
    else Reflect.deleteProperty(globalThis, 'document');
  });
}

test('successful submit returns to picking for another annotation', async (t) => {
  installPickingDom(t);

  const target: ElementTarget = {
    tagName: 'button',
    name: '.save',
    selector: 'button.save',
    text: 'Save',
    rect: { top: 10, left: 20, width: 80, height: 32 },
  };
  const created: Annotation = {
    id: 'annotation-1',
    pagePath: '/preview',
    pageTitle: 'Preview',
    message: 'Increase the spacing',
    element: target,
    createdAt: '2026-08-03T00:00:00.000Z',
    status: 'open',
  };

  const tool = new PatchMark();
  tool.store = {
    async list() { return []; },
    async create() { return created; },
  };
  const state = tool as unknown as PatchMarkInternals;
  state.mode = 'compose';
  state.message = created.message;
  state.selectedTarget = target;
  state.selectedElement = {} as HTMLElement;

  await state.submitAnnotation();

  assert.equal(state.mode, 'picking');
  assert.equal(state.message, '');
  assert.equal(state.selectedTarget, null);
  assert.equal(state.selectedElement, null);
  assert.deepEqual(state.annotations, [created]);
});

test('a slow submit does not overwrite a newer annotation draft', async (t) => {
  installPickingDom(t);

  const firstTarget: ElementTarget = {
    tagName: 'button',
    name: '.first',
    selector: 'button.first',
    text: 'First',
    rect: { top: 10, left: 20, width: 80, height: 32 },
  };
  const secondTarget: ElementTarget = {
    tagName: 'button',
    name: '.second',
    selector: 'button.second',
    text: 'Second',
    rect: { top: 50, left: 20, width: 80, height: 32 },
  };
  const created: Annotation = {
    id: 'annotation-1',
    pagePath: '/preview',
    pageTitle: 'Preview',
    message: 'First draft',
    element: firstTarget,
    createdAt: '2026-08-03T00:00:00.000Z',
    status: 'open',
  };
  let finishCreate!: (annotation: Annotation) => void;
  const pendingCreate = new Promise<Annotation>((resolve) => {
    finishCreate = resolve;
  });

  const tool = new PatchMark();
  tool.store = {
    async list() { return []; },
    async create() { return pendingCreate; },
  };
  const state = tool as unknown as PatchMarkInternals;
  state.mode = 'compose';
  state.message = created.message;
  state.selectedTarget = firstTarget;
  state.selectedElement = {} as HTMLElement;

  const submit = state.submitAnnotation();
  state.mode = 'compose';
  state.message = 'Second draft';
  state.selectedTarget = secondTarget;
  state.selectedElement = {} as HTMLElement;
  finishCreate(created);
  await submit;

  assert.equal(state.mode, 'compose');
  assert.equal(state.message, 'Second draft');
  assert.equal(state.selectedTarget, secondTarget);
  assert.deepEqual(state.annotations, [created]);
});

test('a slow submit does not discard newer property changes', async (t) => {
  installPickingDom(t);

  const target: ElementTarget = {
    tagName: 'button',
    name: '.save',
    selector: 'button.save',
    text: 'Save',
    rect: { top: 10, left: 20, width: 80, height: 32 },
  };
  const submittedChanges: PropertyChange[] = [
    { property: 'font-size', from: '12px', to: '14px' },
  ];
  const created: Annotation = {
    id: 'annotation-1',
    pagePath: '/preview',
    pageTitle: 'Preview',
    message: 'Increase the type size',
    element: target,
    changes: submittedChanges,
    createdAt: '2026-08-03T00:00:00.000Z',
    status: 'open',
  };
  let finishCreate!: (annotation: Annotation) => void;
  const pendingCreate = new Promise<Annotation>((resolve) => {
    finishCreate = resolve;
  });

  const tool = new PatchMark();
  tool.store = {
    async list() { return []; },
    async create() { return pendingCreate; },
  };
  const state = tool as unknown as PatchMarkInternals;
  state.mode = 'compose';
  state.message = created.message;
  state.selectedTarget = target;
  state.selectedElement = {} as HTMLElement;
  state.propertyChanges = {
    'font-size': { from: '12px', to: '14px' },
  };

  const submit = state.submitAnnotation();
  state.propertyChanges['font-size'] = { from: '12px', to: '16px' };
  finishCreate(created);
  await submit;

  assert.equal(state.mode, 'compose');
  assert.equal(state.message, created.message);
  assert.equal(state.selectedTarget, target);
  assert.deepEqual(state.propertyChanges, {
    'font-size': { from: '12px', to: '16px' },
  });
  assert.deepEqual(state.annotations, [created]);
});

test('page identity keeps query/hash and reactive labels reset missing fields to defaults', (t) => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: { pathname: '/preview', search: '?ticket=42', hash: '#copy' },
    },
  });
  t.after(() => {
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor);
    else Reflect.deleteProperty(globalThis, 'window');
  });

  const tool = new PatchMark();
  const state = tool as unknown as { currentPagePath(): string };
  assert.equal(state.currentPagePath(), '/preview?ticket=42#copy');

  tool.pageKey = ' /reviews/42 ';
  assert.equal(state.currentPagePath(), '/reviews/42');
  tool.pageKey = null;
  assert.equal(state.currentPagePath(), '/preview?ticket=42#copy');

  tool.labels = { picker: 'Choose target' };
  assert.equal(tool.labels.picker, 'Choose target');
  assert.equal(tool.labels.list, defaultLabels.list);
});
