/**
 * patch-mark MCP server: lets AI coding agents read and resolve UI feedback
 * annotations directly — no prompt copy-pasting. Speaks MCP over stdio
 * (newline-delimited JSON-RPC), zero runtime dependencies.
 *
 *   npx patch-mark-mcp --endpoint http://localhost:3000/api/annotations
 *
 * Tools:
 *   list_open_annotations { page? } → GET    {endpoint}?page=...
 *   resolve_annotation      { id }  → PATCH  {endpoint}/{id} { status: "resolved" }
 */
import { VERSION } from './identity.js';
import type { Annotation } from './types.js';

const PROTOCOL_VERSION = '2025-03-26';

export type McpConfig = {
  endpoint: string;
  token?: string;
};

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

type JsonRpcResponse = {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
};

type ToolResult = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: true;
};

const TOOLS = [
  {
    name: 'list_open_annotations',
    description:
      'List open UI feedback annotations captured with patch-mark. Each item includes its id, element selector, framework component/source location (dev builds), position, and the feedback message. Fix every item in the codebase, then call resolve_annotation with each id. Resolved items never appear here again.',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'string',
          description: 'Page path to filter by (e.g. "/dashboard"). Omit to list annotations for all pages.',
        },
      },
    },
  },
  {
    name: 'resolve_annotation',
    description:
      'Mark a patch-mark annotation as resolved. Call this only after actually fixing the item in the codebase, with an id returned by list_open_annotations.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Annotation id from list_open_annotations.' },
      },
      required: ['id'],
    },
  },
];

function toolText(payload: unknown): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] };
}

function toolError(message: string): ToolResult {
  return { content: [{ type: 'text', text: message }], isError: true };
}

/** Handle one JSON-RPC message; returns the response, or null for notifications. */
export async function handleMessage(
  msg: JsonRpcRequest,
  config: McpConfig,
): Promise<JsonRpcResponse | null> {
  const id = msg.id ?? null;
  const isNotification = msg.id === undefined || msg.id === null;

  const respond = (result: unknown): JsonRpcResponse | null =>
    isNotification ? null : { jsonrpc: '2.0', id, result };
  const fail = (code: number, message: string): JsonRpcResponse | null =>
    isNotification ? null : { jsonrpc: '2.0', id, error: { code, message } };

  switch (msg.method) {
    case 'initialize':
      return respond({
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: 'patch-mark', version: VERSION },
      });

    case 'notifications/initialized':
    case 'notifications/cancelled':
      return null;

    case 'ping':
      return respond({});

    case 'tools/list':
      return respond({ tools: TOOLS });

    case 'tools/call': {
      const name = msg.params?.name as string | undefined;
      const args = (msg.params?.arguments ?? {}) as Record<string, unknown>;
      try {
        if (name === 'list_open_annotations') {
          return respond(await listOpenAnnotations(config, args));
        }
        if (name === 'resolve_annotation') {
          return respond(await resolveAnnotation(config, args));
        }
        return fail(-32602, `Unknown tool: ${String(name)}`);
      } catch (error) {
        return respond(toolError(error instanceof Error ? error.message : String(error)));
      }
    }

    default:
      if (msg.method?.startsWith('notifications/')) return null;
      return fail(-32601, `Method not found: ${String(msg.method)}`);
  }
}

function authHeaders(config: McpConfig): Record<string, string> {
  // Matches the fetch store's convention: Bearer token in the authorization
  // header (see stores/fetch.ts withAuth).
  return config.token ? { authorization: `Bearer ${config.token}` } : {};
}

async function listOpenAnnotations(
  config: McpConfig,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  const page = typeof args.page === 'string' && args.page ? args.page : undefined;
  const url = page ? `${config.endpoint}?page=${encodeURIComponent(page)}` : config.endpoint;
  const response = await fetch(url, { headers: authHeaders(config) });
  if (!response.ok) throw new Error(`GET ${url} failed (${response.status})`);
  const data = (await response.json()) as { annotations?: Annotation[] };
  const open = (data.annotations ?? []).filter((a) => a.status !== 'resolved');
  return toolText({ open: open.length, annotations: open });
}

async function resolveAnnotation(
  config: McpConfig,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  const id = typeof args.id === 'string' ? args.id.trim() : '';
  if (!id) return toolError('Missing required argument: id');
  const url = `${config.endpoint}/${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', ...authHeaders(config) },
    body: JSON.stringify({ status: 'resolved' }),
  });
  if (!response.ok) throw new Error(`PATCH ${url} failed (${response.status})`);
  return toolText({ resolved: id });
}

/** Parse --endpoint/--token from argv, falling back to environment variables. */
export function parseArgs(
  argv: string[],
  env: Record<string, string | undefined>,
): McpConfig {
  let endpoint = env.PATCH_MARK_ENDPOINT;
  let token = env.PATCH_MARK_TOKEN;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--endpoint') endpoint = argv[++i];
    else if (arg.startsWith('--endpoint=')) endpoint = arg.slice('--endpoint='.length);
    else if (arg === '--token') token = argv[++i];
    else if (arg.startsWith('--token=')) token = arg.slice('--token='.length);
  }
  if (!endpoint) {
    throw new Error(
      'Missing endpoint. Pass --endpoint <url> or set PATCH_MARK_ENDPOINT.\n' +
        'Example: npx patch-mark-mcp --endpoint http://localhost:3000/api/annotations',
    );
  }
  // Fail fast on a malformed URL (e.g. `--endpoint --token x` swallowing the
  // next flag) instead of erroring on every tool call at runtime.
  try {
    new URL(endpoint);
  } catch {
    throw new Error(`Invalid endpoint URL: ${endpoint}`);
  }
  // A trailing slash would produce "//{id}" on the PATCH path.
  return { endpoint: endpoint.replace(/\/+$/, ''), token };
}

/**
 * stdio loop: newline-delimited JSON-RPC messages. stdout carries protocol
 * messages only — diagnostics go to stderr.
 */
export function startStdioServer(config: McpConfig): void {
  let buffer = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk: string) => {
    buffer += chunk;
    for (;;) {
      const newline = buffer.indexOf('\n');
      if (newline < 0) break;
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      void (async () => {
        let response: JsonRpcResponse | null;
        try {
          response = await handleMessage(JSON.parse(line) as JsonRpcRequest, config);
        } catch {
          response = { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } };
        }
        if (response) process.stdout.write(JSON.stringify(response) + '\n');
      })();
    }
  });
}
