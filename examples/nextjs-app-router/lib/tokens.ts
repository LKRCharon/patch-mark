import { randomUUID } from 'crypto';
import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';

const tokensPath = path.join(process.cwd(), '.data', 'tokens.json');
let tokenQueue: Promise<void> = Promise.resolve();

class TokenStoreFileError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'TokenStoreFileError';
  }
}

async function readTokens(): Promise<string[]> {
  try {
    const raw = await readFile(tokensPath, 'utf8');
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value) || value.some((token) => typeof token !== 'string' || token.length === 0 || token.length > 256)) {
      throw new TokenStoreFileError('Token store is malformed.');
    }
    return value;
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error
      ? (error as { code?: unknown }).code
      : undefined;
    if (code === 'ENOENT') return [];
    if (error instanceof TokenStoreFileError) throw error;
    throw new TokenStoreFileError('Could not read token store.', { cause: error });
  }
}

async function saveTokens(tokens: string[]): Promise<void> {
  await mkdir(path.dirname(tokensPath), { recursive: true });
  const tmp = `${tokensPath}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(tokens, null, 2), { mode: 0o600 });
  await rename(tmp, tokensPath);
}

async function mutateTokens<T>(mutate: (tokens: string[]) => { tokens?: string[]; result: T }): Promise<T> {
  const operation = tokenQueue.then(async () => {
    const tokens = await readTokens();
    const outcome = mutate([...tokens]);
    if (outcome.tokens) await saveTokens(outcome.tokens);
    return outcome.result;
  });
  tokenQueue = operation.then(() => undefined, () => undefined);
  return operation;
}

export async function createToken(): Promise<string> {
  return mutateTokens((tokens) => {
    const token = randomUUID();
    return { tokens: [...tokens, token], result: token };
  });
}

export async function isValidToken(token: string): Promise<boolean> {
  const tokens = await readTokens();
  return tokens.includes(token);
}

// On the first authenticated request there is no tokens file yet: mint the
// initial token and log it, so the operator can grab it from the server
// logs and send out the first sharing link.
export async function ensureInitialToken(): Promise<void> {
  const initialToken = await mutateTokens((tokens) => {
    if (tokens.length > 0) return { result: null };
    const token = randomUUID();
    return { tokens: [token], result: token };
  });
  if (!initialToken) return;
  console.log(`[patch-mark example] initial access token: ${initialToken}`);
  console.log('[patch-mark example] share pages as: https://your-host/page?pm_token=<token>');
}
