import { NextRequest, NextResponse } from 'next/server';
import { annotationLimits } from 'patch-mark';
import { mutateAnnotations } from '../../../../lib/annotations-store';
import { checkAuth } from '../../../../lib/auth';

function parseReorderBody(value: unknown): { page: string; ids: string[] } {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Invalid reorder request');
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some((key) => key !== 'page' && key !== 'ids')) throw new Error('Invalid reorder request');
  if (typeof input.page !== 'string' || input.page.trim().length === 0 || input.page.length > annotationLimits.pagePath) {
    throw new Error('Invalid reorder page');
  }
  if (!Array.isArray(input.ids) || input.ids.length > 1000) throw new Error('Invalid reorder ids');
  const ids = input.ids.map((id) => {
    if (typeof id !== 'string' || id.trim().length === 0 || id.length > annotationLimits.id) {
      throw new Error('Invalid reorder ids');
    }
    return id;
  });
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate reorder ids');
  return { page: input.page, ids };
}

export async function POST(request: NextRequest) {
  const denied = await checkAuth(request);
  if (denied) return denied;

  let body: { page: string; ids: string[] };
  try {
    body = parseReorderBody(await request.json());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid reorder request' }, { status: 400 });
  }

  try {
    const valid = await mutateAnnotations((annotations) => {
      const pageItems = annotations.filter((annotation) => annotation.pagePath === body.page);
      const currentIds = new Set(pageItems.map((annotation) => annotation.id));
      if (currentIds.size !== body.ids.length || body.ids.some((id) => !currentIds.has(id))) {
        return { result: false };
      }
      const byId = new Map(pageItems.map((annotation) => [annotation.id, annotation]));
      let index = 0;
      const next = annotations.map((annotation) =>
        annotation.pagePath === body.page ? byId.get(body.ids[index++])! : annotation,
      );
      return { annotations: next, result: true };
    });
    return valid
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json({ error: 'The submitted order does not match this page' }, { status: 409 });
  } catch {
    return NextResponse.json({ error: 'Could not reorder annotations' }, { status: 503 });
  }
}
