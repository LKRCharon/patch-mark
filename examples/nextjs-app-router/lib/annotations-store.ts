import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';
import type { Annotation } from 'patch-mark';

const storePath = path.join(process.cwd(), '.data', 'annotations.json');

export async function readAnnotations(): Promise<Annotation[]> {
  try {
    const raw = await readFile(storePath, 'utf8');
    return JSON.parse(raw) as Annotation[];
  } catch {
    // A missing or unreadable file simply means "no annotations yet".
    return [];
  }
}

export async function saveAnnotations(annotations: Annotation[]): Promise<void> {
  await mkdir(path.dirname(storePath), { recursive: true });
  // Atomic write via tmp file + rename, so a crash never leaves torn JSON.
  const tmp = `${storePath}.tmp`;
  await writeFile(tmp, JSON.stringify(annotations, null, 2));
  await rename(tmp, storePath);
}
