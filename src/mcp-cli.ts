/**
 * Executable entry for the patch-mark MCP server (built to dist/mcp.js, run
 * via `npx patch-mark-mcp`). Kept separate from mcp.ts so the protocol logic
 * stays importable without side effects.
 */
import { parseArgs, startStdioServer } from './mcp.js';

try {
  startStdioServer(parseArgs(process.argv.slice(2), process.env));
} catch (error) {
  console.error(`patch-mark-mcp: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
