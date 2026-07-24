# Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `store` | `AnnotationStore` | `createLocalStorageStore()` | Where annotations are persisted/sent |
| `onError` | `(error, context) => void \| null` | `null` (falls back to `console.warn`) | Error reporter for failed store operations — detects incomplete backends early |
| `labels` | `AnnotationLabels` | `defaultLabels` (Chinese) | UI text overrides |
| `themeName` | `string` | `'blue'` | Preset theme name (attribute: `theme`) |
| `theme` | `AnnotationTheme` | `{}` | Fine-grained accent overrides, applied on top of the preset |
| `visible` | `boolean` | `false` | Whether the launcher is shown on the page (attribute: `visible`) |
| `requireAuth` | `boolean` | `false` | Lock the tool behind an access token (attribute: `require-auth`) |
| `position` | `string` | `'right-center'` | Dock position of the launcher/panel: right-center / right-top / right-bottom / left-center / left-top / left-bottom (attribute: `position`) |

## onError

Failed store operations (list / create / resolve / reorder) report through `onError` with a `PatchMarkErrorContext`:

```ts
type PatchMarkErrorContext = {
  operation: 'list' | 'create' | 'resolve' | 'reorder';
  annotationId?: string;
};
```

When unset, failures fall back to a `console.warn`. When a backend rejects a request with `401` (access control), the component throws `PatchMarkAuthError` and shows the lock panel automatically — `onError` still fires for it, so you can route it to monitoring.

## Programmatic API

```ts
import {
  createLocalStorageStore,
  createFetchStore,
  createLocalAnnotation,
  setAuthToken, getAuthToken, clearAuthToken,
  formatAnnotationAsPrompt, formatAnnotationsAsPrompt,
  defaultLabels,
  PatchMarkAuthError,
  VERSION,
} from 'patch-mark';
```
