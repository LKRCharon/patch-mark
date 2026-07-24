'use client';

import { useMemo } from 'react';
import { PatchMark } from 'patch-mark/react';
import { createFetchStore } from 'patch-mark';

/**
 * Drop-in annotation tool wired to the example API routes.
 *
 * Gate it by environment where you render it, e.g. in app/layout.tsx:
 *
 *   {process.env.NODE_ENV !== 'production' && <PatchMarkClient />}
 */
export default function PatchMarkClient() {
  const store = useMemo(() => createFetchStore({ endpoint: '/api/annotations' }), []);
  return <PatchMark store={store} />;
}
