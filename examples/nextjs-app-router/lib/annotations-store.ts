import { randomUUID } from 'crypto';
import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';
import { parseAnnotations, type Annotation } from 'patch-mark';

const storePath = path.join(process.cwd(), '.data', 'annotations.json');

export class AnnotationStoreFileError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'AnnotationStoreFileError';
  }
}

type Mutation<T> = { annotations?: Annotation[]; result: T };

// This serializes mutations in one Node process. It does not turn a JSON file
// into a multi-process/serverless database; the README now calls that out.
let mutationQueue: Promise<void> = Promise.resolve();

export async function readAnnotations(): Promise<Annotation[]> {
  try {
    const raw = await readFile(storePath, 'utf8');
    return parseAnnotations(JSON.parse(raw));
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error
      ? (error as { code?: unknown }).code
      : undefined;
    if (code === 'ENOENT') return [];
    throw new AnnotationStoreFileError('Could not read the annotation store.', { cause: error });
  }
}

export async function saveAnnotations(annotations: Annotation[]): Promise<void> {
  const safe = parseAnnotations(annotations).slice(0, 1000);
  await mkdir(path.dirname(storePath), { recursive: true });
  // Unique temp names prevent two writes in a process from racing on one
  // shared .tmp filename. rename keeps readers from observing torn JSON.
  const tmp = `${storePath}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(safe, null, 2), { mode: 0o600 });
  await rename(tmp, storePath);
}

export async function mutateAnnotations<T>(
  mutate: (annotations: Annotation[]) => Mutation<T> | Promise<Mutation<T>>,
): Promise<T> {
  const operation = mutationQueue.then(async () => {
    const annotations = await readAnnotations();
    const outcome = await mutate([...annotations]);
    if (outcome.annotations) await saveAnnotations(outcome.annotations);
    return outcome.result;
  });
  // Do not permanently poison the queue after a failed request.
  mutationQueue = operation.then(() => undefined, () => undefined);
  return operation;
}
