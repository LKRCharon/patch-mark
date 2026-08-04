import { createElement, forwardRef, useEffect, useRef } from 'react';
import type { ForwardedRef, MutableRefObject } from 'react';
import type { AnnotationLabels, AnnotationStore, AnnotationTheme, PatchMarkErrorContext } from './types.js';
import type { PatchMark as PatchMarkElement } from './PatchMark.js';

export interface PatchMarkProps {
  /** Where annotations are persisted/sent. Defaults to a fresh localStorage store. */
  store?: AnnotationStore;
  /** UI text overrides, merged over the package defaults on every update. */
  labels?: Partial<AnnotationLabels>;
  /** Fine-grained accent overrides, reset when omitted. */
  theme?: AnnotationTheme;
  /** Preset theme name, reset to blue when omitted. */
  themeName?: string;
  /** Stable annotation page key; defaults to pathname + query + hash. */
  pageKey?: string | null;
  /** Whether the launcher is shown. Defaults to true in the React wrapper. */
  visible?: boolean;
  /** Called when a store operation fails. */
  onError?: (error: Error, context: PatchMarkErrorContext) => void;
  /**
   * Require a store with validateAccess() and a server-side authorization
   * check. This is not a substitute for backend authorization.
   */
  requireAuth?: boolean;
  /** Dock position: right-center, right-top, right-bottom, left-center, left-top, or left-bottom. */
  position?: string;
}

function assignRef(
  target: ForwardedRef<PatchMarkElement>,
  value: PatchMarkElement | null,
): void {
  if (typeof target === 'function') target(value);
  else if (target) (target as MutableRefObject<PatchMarkElement | null>).current = value;
}

/**
 * Declarative React wrapper around <patch-mark>.
 *
 * The forwarded ref is populated only after the custom element has loaded and
 * upgraded, so imperative calls such as ref.current?.open() never race the
 * client-side dynamic import. Every prop assignment is complete: removing a
 * prop restores the documented default instead of retaining stale UI state.
 */
export const PatchMark = forwardRef<PatchMarkElement, PatchMarkProps>(function PatchMark(
  { store, labels, theme, themeName, pageKey, visible = true, onError, requireAuth = false, position },
  forwardedRef,
) {
  const ref = useRef<PatchMarkElement | null>(null);
  // Keep one default store for this mounted wrapper. Re-rendering because a
  // different prop changed must not discard a memory-fallback session or
  // spuriously reset the element's data boundary.
  const defaultStoreRef = useRef<AnnotationStore | null>(null);
  const forwardedRefRef = useRef(forwardedRef);
  forwardedRefRef.current = forwardedRef;

  useEffect(() => {
    let cancelled = false;
    void import('patch-mark')
      .then(async (module) => {
        await customElements.whenDefined('patch-mark');
        if (cancelled || !ref.current) return;
        const el = ref.current;
        defaultStoreRef.current ??= module.createLocalStorageStore();
        el.store = store ?? defaultStoreRef.current;
        el.labels = { ...module.defaultLabels, ...labels };
        el.theme = theme ?? {};
        el.themeName = themeName ?? 'blue';
        el.pageKey = pageKey ?? null;
        el.visible = visible;
        el.onError = onError ?? null;
        el.requireAuth = requireAuth;
        el.position = position ?? 'right-center';
        assignRef(forwardedRefRef.current, el);
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error('[patch-mark] failed to load the custom element:', error);
      });
    return () => {
      cancelled = true;
    };
  }, [store, labels, theme, themeName, pageKey, visible, onError, requireAuth, position]);

  useEffect(() => () => assignRef(forwardedRefRef.current, null), []);

  return createElement('patch-mark', { ref });
});

// JSX type support for using the raw <patch-mark> element directly:
//
//   import 'patch-mark/react';
//   <patch-mark visible theme="emerald" />
//
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'patch-mark': import('react').DetailedHTMLProps<import('react').HTMLAttributes<HTMLElement>, HTMLElement> & {
        /** Show the launcher (off by default on the raw element). */
        visible?: boolean | '';
        /** Preset theme name, or a custom preset defined via host CSS. */
        theme?: string;
        /** One-off accent color override. */
        accent?: string;
      };
    }
  }
}
