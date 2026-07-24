import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '../../../../lib/tokens';

// Admin endpoint: mint a new access token for another annotator. Guarded by
// the ADMIN_TOKEN env var (independent of ANNOTATION_AUTH, so operators can
// pre-seed tokens before turning auth on). Revocation is manual: remove the
// token from .data/tokens.json.
export async function POST(request: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json(
      { error: 'ADMIN_TOKEN is not configured on the server' },
      { status: 503 },
    );
  }
  if (request.headers.get('x-admin-token') !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = await createToken();
  return NextResponse.json({ token }, { status: 201 });
}
