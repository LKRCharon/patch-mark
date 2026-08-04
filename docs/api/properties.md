# Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `store` | `AnnotationStore` | `createLocalStorageStore()` | Where annotations are persisted/sent |
| `onError` | `(error, context) => void \| null` | `null` (falls back to `console.warn`) | Error reporter for failed store operations — detects incomplete backends early |
| `labels` | `Partial<AnnotationLabels>` | `defaultLabels` (Chinese) | UI text overrides; reassigning updates the current UI and fills omitted keys from defaults |
| `pageKey` | `string \| null` | pathname + query + hash | Stable page identity. Back/forward and hash navigation reload automatically; set it from a pushState router on route changes |
| `themeName` | `string` | `'blue'` | Preset theme name (attribute: `theme`) |
| `theme` | `AnnotationTheme` | `{}` | Fine-grained accent overrides, applied on top of the preset |
| `visible` | `boolean` | `false` | Whether the launcher is shown on the page (attribute: `visible`) |
| `requireAuth` | `boolean` | `false` | Require a server-validated token session (attribute: `require-auth`) |
| `position` | `string` | `'right-center'` | Dock position of the launcher/panel: right-center / right-top / right-bottom / left-center / left-top / left-bottom (attribute: `position`) |

## onError

Failed store operations (list / create / resolve / reorder) report through `onError` with a `PatchMarkErrorContext`:

```ts
type PatchMarkErrorContext = {
  operation: 'list' | 'create' | 'resolve' | 'reorder';
  annotationId?: string;
};
```

When unset, failures fall back to a `console.warn`. When a backend rejects a request with `401`, PatchMark clears the token and shows the lock panel automatically — `onError` still fires for it. With `requireAuth`, the store must implement `validateAccess()`; see [access control](/guide/access-control).

## Programmatic API

```ts
import {
  createLocalStorageStore,
  createFetchStore,
  createLocalAnnotation,
  setAuthToken, getAuthToken, clearAuthToken,
  formatAnnotationAsPrompt, formatAnnotationsAsPrompt,
  defaultLabels,
  PatchMarkAuthError, PatchMarkPersistenceError,
  VERSION,
} from 'patch-mark';
```
