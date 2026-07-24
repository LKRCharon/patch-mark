import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import type { Annotation, CreateAnnotationInput } from 'patch-mark';
import { readAnnotations, saveAnnotations } from '../../../lib/annotations-store';
import { checkAuth } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  const denied = await checkAuth(request);
  if (denied) return denied;
  const page = request.nextUrl.searchParams.get('page');
  const annotations = await readAnnotations();
  return NextResponse.json({
    annotations: page ? annotations.filter((a) => a.pagePath === page) : annotations,
  });
}

export async function POST(request: NextRequest) {
  const denied = await checkAuth(request);
  if (denied) return denied;
  const input = (await request.json()) as CreateAnnotationInput;
  // Server responsibility: the client sends CreateAnnotationInput only —
  // id, createdAt, and the initial status are assigned here.
  const annotation: Annotation = {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
    status: 'open',
  };
  const annotations = await readAnnotations();
  annotations.unshift(annotation);
  await saveAnnotations(annotations.slice(0, 1000));
  return NextResponse.json({ annotation }, { status: 201 });
}
