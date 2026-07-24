import { NextRequest, NextResponse } from 'next/server';
import { ensureInitialToken, isValidToken } from './tokens';

/**
 * Bearer-token guard for the annotation routes. Returns null when the
 * request may proceed, or a 401 response to return immediately.
 *
 * Backend switch: without ANNOTATION_AUTH=1 every request passes through,
 * matching the component's default (requireAuth off) for small sites.
 */
export async function checkAuth(request: NextRequest): Promise<NextResponse | null> {
  if (!process.env.ANNOTATION_AUTH) return null;
  await ensureInitialToken();
  const header = request.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : null;
  if (token && (await isValidToken(token))) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
