import { NextRequest, NextResponse } from 'next/server';
import { readAnnotations, saveAnnotations } from '../../../../lib/annotations-store';
import { checkAuth } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  const denied = await checkAuth(request);
  if (denied) return denied;
  const { ids } = (await request.json()) as { ids: string[] };
  const annotations = await readAnnotations();
  const rank = new Map(ids.map((id, index) => [id, index]));
  // Items not mentioned in ids keep their relative order at the end.
  annotations.sort(
    (a, b) => (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER),
  );
  await saveAnnotations(annotations);
  return new NextResponse(null, { status: 204 });
}
