import { PatchMark } from './PatchMark.js';
import { ELEMENT_TAG } from './identity.js';

// Register the custom element (guard against duplicate registration)
if (typeof customElements !== 'undefined' && !customElements.get(ELEMENT_TAG)) {
  customElements.define(ELEMENT_TAG, PatchMark);
}

// Re-export everything for programmatic usage
export { PatchMark } from './PatchMark.js';
export { createLocalStorageStore } from './stores/localStorage.js';
export { createFetchStore, createLocalAnnotation, PatchMarkAuthError } from './stores/fetch.js';
export type { FetchStoreOptions } from './stores/fetch.js';
export { getAuthToken, setAuthToken, clearAuthToken } from './auth.js';
export { formatAnnotationAsPrompt, formatAnnotationsAsPrompt, formatHandoffPrompt } from './prompt.js';
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
  PatchMarkErrorContext,
  PickerTarget,
  PropertyChange,
  ThemeName,
  ToolMode,
} from './types.js';

// For React users: `patch-mark/react` ships a <PatchMark> wrapper component
// (SSR-safe dynamic import, visible=true by default) plus JSX type support
// for the raw <patch-mark> element. See README for Vue/Svelte integration.
