import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { handleMessage, parseArgs, type McpConfig } from '../src/mcp.js';
import type { Annotation } from '../src/types.js';

const CONFIG: McpConfig = { endpoint: 'http://localhost:3000/api/annotations', token: 'tok-1' };

function makeAnnotation(overrides: Partial<Annotation> = {}): Annotation {
  return {
    id: 'ann-1',
    pagePath: '/dashboard',
    message: 'Make this button bigger',
    createdAt: '2026-07-23T10:00:00.000Z',
    status: 'open',
    element: {
      tagName: 'button',
      name: '#save',
      selector: '#save',
      text: 'Save',
      rect: { top: 1, left: 2, width: 3, height: 4 },
    },
    ...overrides,
  };
}

type FetchCall = { url: string; init?: RequestInit };

/** Swap global fetch for a stub; returns the recorded calls. Restores after the test. */
function stubFetch(t: TestContext, responder: (call: FetchCall) => Response): FetchCall[] {
  const original = globalThis.fetch;
  const calls: FetchCall[] = [];
  globalThis.fetch = (async (url: unknown, init?: RequestInit) => {
    const call = { url: String(url), init };
    calls.push(call);
    return responder(call);
  }) as typeof fetch;
  t.after(() => {
    globalThis.fetch = original;
  });
  return calls;
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// --- handshake & discovery ---

test('initialize replies with protocol version and server info', async () => {
  const res = await handleMessage(
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26' } },
    CONFIG,
  );
  assert.ok(res?.result);
  const result = res!.result as { protocolVersion: string; serverInfo: { name: string } };
  assert.equal(result.protocolVersion, '2025-03-26');
  assert.equal(result.serverInfo.name, 'patch-mark');
});

test('notifications get no response', async () => {
  const res = await handleMessage({ jsonrpc: '2.0', method: 'notifications/initialized' }, CONFIG);
  assert.equal(res, null);
});

test('tools/list exposes the two annotation tools', async () => {
  const res = await handleMessage({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, CONFIG);
  const { tools } = res!.result as { tools: Array<{ name: string }> };
  assert.deepEqual(
    tools.map((t) => t.name),
    ['list_open_annotations', 'resolve_annotation'],
  );
});

test('unknown method yields -32601; unknown tool yields -32602', async () => {
  const res = await handleMessage({ jsonrpc: '2.0', id: 3, method: 'resources/list' }, CONFIG);
  assert.equal(res!.error?.code, -32601);

  const toolRes = await handleMessage(
    { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'nope', arguments: {} } },
    CONFIG,
  );
  assert.equal(toolRes!.error?.code, -32602);
});

// --- list_open_annotations ---

test('list_open_annotations GETs the endpoint, filters resolved, sends the token', async (t) => {
  const calls = stubFetch(t, () =>
    jsonResponse({
      annotations: [makeAnnotation(), makeAnnotation({ id: 'ann-2', status: 'resolved' })],
    }),
  );
  const res = await handleMessage(
    {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: { name: 'list_open_annotations', arguments: { page: '/dash board' } },
    },
    CONFIG,
  );
  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    'http://localhost:3000/api/annotations?page=%2Fdash%20board',
  );
  assert.equal((calls[0].init?.headers as Record<string, string>).authorization, 'Bearer tok-1');

  const result = res!.result as { content: Array<{ text: string }>; isError?: boolean };
  assert.ok(!result.isError);
  const payload = JSON.parse(result.content[0].text) as { open: number; annotations: Annotation[] };
  assert.equal(payload.open, 1);
  assert.equal(payload.annotations[0].id, 'ann-1');
});

test('list_open_annotations without page hits the bare endpoint', async (t) => {
  const calls = stubFetch(t, () => jsonResponse({ annotations: [] }));
  await handleMessage(
    { jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'list_open_annotations', arguments: {} } },
    CONFIG,
  );
  assert.equal(calls[0].url, 'http://localhost:3000/api/annotations');
});

test('list_open_annotations surfaces HTTP errors as tool errors', async (t) => {
  stubFetch(t, () => jsonResponse({}, 500));
  const res = await handleMessage(
    { jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'list_open_annotations', arguments: {} } },
    CONFIG,
  );
  const result = res!.result as { content: Array<{ text: string }>; isError?: boolean };
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /500/);
});

// --- resolve_annotation ---

test('resolve_annotation PATCHes {endpoint}/{id} with status resolved', async (t) => {
  const calls = stubFetch(t, () => jsonResponse({}));
  const res = await handleMessage(
    { jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'resolve_annotation', arguments: { id: 'ann-1' } } },
    CONFIG,
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'http://localhost:3000/api/annotations/ann-1');
  assert.equal(calls[0].init?.method, 'PATCH');
  assert.equal(calls[0].init?.body, JSON.stringify({ status: 'resolved' }));
  assert.equal(
    (calls[0].init?.headers as Record<string, string>)['content-type'],
    'application/json',
  );
  const result = res!.result as { isError?: boolean };
  assert.ok(!result.isError);
});

test('resolve_annotation rejects a missing id without calling fetch', async (t) => {
  const calls = stubFetch(t, () => jsonResponse({}));
  const res = await handleMessage(
    { jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'resolve_annotation', arguments: {} } },
    CONFIG,
  );
  assert.equal(calls.length, 0);
  const result = res!.result as { isError?: boolean };
  assert.equal(result.isError, true);
});

// --- parseArgs ---

test('parseArgs reads --endpoint (both forms), env fallback, trims trailing slashes', () => {
  assert.deepEqual(parseArgs(['--endpoint', 'http://x/api/'], {}), {
    endpoint: 'http://x/api',
    token: undefined,
  });
  assert.deepEqual(parseArgs(['--endpoint=http://x/api', '--token=t1'], {}), {
    endpoint: 'http://x/api',
    token: 't1',
  });
  assert.deepEqual(
    parseArgs([], { PATCH_MARK_ENDPOINT: 'http://env/api', PATCH_MARK_TOKEN: 'env-tok' }),
    { endpoint: 'http://env/api', token: 'env-tok' },
  );
  // argv wins over env
  assert.deepEqual(
    parseArgs(['--endpoint', 'http://argv/api'], { PATCH_MARK_ENDPOINT: 'http://env/api' }),
    { endpoint: 'http://argv/api', token: undefined },
  );
});

test('parseArgs throws without an endpoint', () => {
  assert.throws(() => parseArgs([], {}), /Missing endpoint/);
});
