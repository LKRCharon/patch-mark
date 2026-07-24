import { NextRequest, NextResponse } from 'next/server';
import type { Annotation } from 'patch-mark';
import { readAnnotations, saveAnnotations } from '../../../../lib/annotations-store';
import { checkAuth } from '../../../../lib/auth';

// Next 15+ passes params as a Promise; the await is a harmless no-op on 14.
type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const denied = await checkAuth(request);
  if (denied) return denied;
  const { id } = await params;
  const patch = (await request.json()) as Partial<Annotation>;
  const annotations = await readAnnotations();
  const idx = annotations.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // id from the URL wins — a patch must never reassign identity.
  annotations[idx] = { ...annotations[idx], ...patch, id };
  await saveAnnotations(annotations);
  return NextResponse.json({ annotation: annotations[idx] });
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const denied = await checkAuth(_request);
  if (denied) return denied;
  const { id } = await params;
  const annotations = await readAnnotations();
  const next = annotations.filter((a) => a.id !== id);
  if (next.length === annotations.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await saveAnnotations(next);
  return new NextResponse(null, { status: 204 });
}
