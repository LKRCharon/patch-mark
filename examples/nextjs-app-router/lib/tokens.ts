import { randomUUID } from 'crypto';
import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';

const tokensPath = path.join(process.cwd(), '.data', 'tokens.json');

async function readTokens(): Promise<string[]> {
  try {
    const raw = await readFile(tokensPath, 'utf8');
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

async function saveTokens(tokens: string[]): Promise<void> {
  await mkdir(path.dirname(tokensPath), { recursive: true });
  const tmp = `${tokensPath}.tmp`;
  await writeFile(tmp, JSON.stringify(tokens, null, 2));
  await rename(tmp, tokensPath);
}

export async function createToken(): Promise<string> {
  const tokens = await readTokens();
  const token = randomUUID();
  await saveTokens([...tokens, token]);
  return token;
}

export async function isValidToken(token: string): Promise<boolean> {
  const tokens = await readTokens();
  return tokens.includes(token);
}

// On the first authenticated request there is no tokens file yet: mint the
// initial token and log it, so the operator can grab it from the server
// logs and send out the first sharing link.
export async function ensureInitialToken(): Promise<void> {
  const tokens = await readTokens();
  if (tokens.length > 0) return;
  const token = await createToken();
  console.log(`[patch-mark example] initial access token: ${token}`);
  console.log('[patch-mark example] share pages as: https://your-host/page?pm_token=<token>');
}
