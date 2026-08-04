import { NextRequest, NextResponse } from 'next/server';
import { parseResolvePatch, PatchMarkValidationError, type Annotation } from 'patch-mark';
import { mutateAnnotations } from '../../../../lib/annotations-store';
import { checkAuth } from '../../../../lib/auth';

// Next 15+ passes params as a Promise; the await is a harmless no-op on 14.
type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const denied = await checkAuth(request);
  if (denied) return denied;

  let patch: { status: 'resolved' };
  try {
    patch = parseResolvePatch(await request.json());
  } catch (error) {
    const message = error instanceof PatchMarkValidationError ? error.message : 'Invalid JSON request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { id } = await params;
  try {
    const updated = await mutateAnnotations<Annotation | null>((annotations) => {
      const index = annotations.findIndex((annotation) => annotation.id === id);
      if (index === -1) return { result: null };
      // v1 has a narrow, domain-specific public mutation: resolving an item.
      // The request cannot rewrite message, target, timestamps, identity, or
      // status values other than the one accepted above.
      const annotation: Annotation = { ...annotations[index], status: patch.status };
      annotations[index] = annotation;
      return { annotations, result: annotation };
    });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ annotation: updated });
  } catch {
    return NextResponse.json({ error: 'Could not update annotation' }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const denied = await checkAuth(request);
  if (denied) return denied;
  const { id } = await params;

  try {
    const deleted = await mutateAnnotations<boolean>((annotations) => {
      const next = annotations.filter((annotation) => annotation.id !== id);
      return next.length === annotations.length
        ? { result: false }
        : { annotations: next, result: true };
    });
    return deleted
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Could not delete annotation' }, { status: 503 });
  }
}
