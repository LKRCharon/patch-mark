import { PatchMark } from './PatchMark.js';
import { ELEMENT_TAG } from './identity.js';

// Register the custom element (guard against duplicate registration)
if (typeof customElements !== 'undefined' && !customElements.get(ELEMENT_TAG)) {
  customElements.define(ELEMENT_TAG, PatchMark);
}

// Re-export everything for programmatic usage
export { PatchMark } from './PatchMark.js';
export { createLocalStorageStore } from './stores/localStorage.js';
export { createFetchStore, createLocalAnnotation } from './stores/fetch.js';
export type { FetchStoreOptions } from './stores/fetch.js';
export { formatAnnotationAsPrompt, formatAnnotationsAsPrompt } from './prompt.js';
export { defaultLabels } from './labels.js';
export { shadowStyles, globalStyles } from './styles.js';
export { VERSION, THEME_NAMES } from './identity.js';

export type {
  Annotation,
  AnnotationStore,
  AnnotationLabels,
  AnnotationTheme,
  AnnotationStatus,
  CreateAnnotationInput,
  ElementTarget,
  HoverInfo,
  PickerTarget,
  PropertyChange,
  ThemeName,
  ToolMode,
} from './types.js';

// For React/JSX users: add this to your env.d.ts to get TypeScript support:
//   declare global {
//     namespace JSX {
//       interface IntrinsicElements {
//         'patch-mark': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
//       }
//     }
//   }
// See README for Vue/Svelte integration instructions.
