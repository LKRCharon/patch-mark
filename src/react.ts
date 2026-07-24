import { createElement, forwardRef, useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import type { AnnotationLabels, AnnotationStore, AnnotationTheme, PatchMarkErrorContext } from './types.js';
import type { PatchMark as PatchMarkElement } from './PatchMark.js';

export interface PatchMarkProps {
  /** Where annotations are persisted/sent. Defaults to the localStorage store. */
  store?: AnnotationStore;
  /** UI text overrides, merged over the default labels. */
  labels?: Partial<AnnotationLabels>;
  /** Fine-grained accent overrides, applied on top of the active preset. */
  theme?: AnnotationTheme;
  /** Preset theme name ('blue' | 'violet' | 'emerald' | 'orange' | 'rose', or a custom CSS preset). */
  themeName?: string;
  /**
   * Whether the launcher is shown on the page. Defaults to true: rendering
   * the component is the opt-in, so gate it with your own environment check:
   *
   *   {process.env.NODE_ENV !== 'production' && <PatchMark ... />}
   */
  visible?: boolean;
  /**
   * Called when a store operation fails (replaces the default console.warn).
   * Wire it to your monitoring to catch an incomplete backend early.
   */
  onError?: (error: Error, context: PatchMarkErrorContext) => void;
  /**
   * Lock the tool behind an access token (?pm_token= sharing links, or the
   * built-in lock panel). Off by default.
   */
  requireAuth?: boolean;
}

/**
 * React wrapper around the <patch-mark> custom element.
 *
 * - SSR-safe: the element module is dynamically imported client-side only.
 * - Props are (re)applied whenever they change, once the element is loaded.
 * - The forwarded ref points at the underlying element, so `open()`,
 *   `close()`, `store`, etc. stay reachable.
 */
export const PatchMark = forwardRef<PatchMarkElement, PatchMarkProps>(function PatchMark(
  { store, labels, theme, themeName, visible = true, onError, requireAuth = false },
  forwardedRef,
) {
  const ref = useRef<PatchMarkElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Dynamic import: the module extends HTMLElement and must run client-side only.
    void import('patch-mark').then(() => {
      if (cancelled || !ref.current) return;
      const el = ref.current;
      if (store) el.store = store;
      if (labels) el.labels = { ...el.labels, ...labels };
      if (theme) el.theme = theme;
      if (themeName) el.themeName = themeName;
      el.visible = visible;
      el.onError = onError ?? null;
      el.requireAuth = requireAuth;
    });
    return () => {
      cancelled = true;
    };
  }, [store, labels, theme, themeName, visible, onError, requireAuth]);

  return createElement('patch-mark', {
    ref: (el: PatchMarkElement | null) => {
      ref.current = el;
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) (forwardedRef as MutableRefObject<PatchMarkElement | null>).current = el;
    },
  });
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
