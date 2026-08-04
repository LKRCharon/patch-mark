import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { parseCreateAnnotation, PatchMarkValidationError, type Annotation, type CreateAnnotationInput } from 'patch-mark';
import { mutateAnnotations, readAnnotations } from '../../../lib/annotations-store';
import { checkAuth } from '../../../lib/auth';

function invalidRequest(error: unknown): NextResponse {
  const message = error instanceof PatchMarkValidationError ? error.message : 'Invalid JSON request body';
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const denied = await checkAuth(request);
  if (denied) return denied;
  try {
    const page = request.nextUrl.searchParams.get('page');
    const annotations = await readAnnotations();
    return NextResponse.json({
      annotations: page ? annotations.filter((annotation) => annotation.pagePath === page) : annotations,
    });
  } catch {
    return NextResponse.json({ error: 'Could not read annotations' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await checkAuth(request);
  if (denied) return denied;

  let input: CreateAnnotationInput;
  try {
    input = parseCreateAnnotation(await request.json());
  } catch (error) {
    return invalidRequest(error);
  }

  // Never spread a network payload onto a persisted record. Identity and
  // lifecycle fields are server-owned and intentionally absent from input.
  const annotation: Annotation = {
    id: randomUUID(),
    pagePath: input.pagePath,
    pageTitle: input.pageTitle,
    message: input.message,
    element: input.element,
    changes: input.changes,
    createdAt: new Date().toISOString(),
    status: 'open',
  };

  try {
    const created = await mutateAnnotations((annotations) => {
      annotations.unshift(annotation);
      return { annotations: annotations.slice(0, 1000), result: annotation };
    });
    return NextResponse.json({ annotation: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not save annotation' }, { status: 503 });
  }
}
