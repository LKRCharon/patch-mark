# Labels

Override any or all UI text. The defaults are Chinese; English-speaking integrators typically override the whole set.

```ts
tool.labels = {
  picker: 'Annotate',
  pickerHint: 'Hover to inspect, click to select',
  compose: 'Feedback',
  targetLabel: 'Target element',
  placeholder: 'Write feedback…',
  send: 'Send',
  sending: 'Sending…',
  reselect: 'Reselect',
  list: 'Notes',
  locate: 'Locate',
  close: 'Close',
  empty: 'No annotations on this page yet.',
  loading: 'Loading…',
  notFound: 'Element not found. The page may have changed.',
  contentPrefix: 'Content:',
  copyAsPrompt: 'Copy as prompt',
  copyHandoff: 'Copy handoff prompt',
  copied: 'Copied',
  resolve: 'Resolve',
  resolved: 'Resolved',
  resolveAll: 'Complete all',
  resolvingAll: 'Completing…',
  resolvedAll: 'All annotations completed',
  resolveAllPartial: 'Some annotations could not be completed',
  properties: 'Props',
  propertiesHint: 'Edit values to give the agent exact instructions',
  colorLabel: 'Color',
  fontLabel: 'Font',
  dragLabel: 'Drag to reorder',
  expandLabel: 'Expand to parent',
  shrinkLabel: 'Shrink to child',
  lockedTitle: 'Access token required',
  lockedHint: 'Annotations on this page are protected. Enter the token from your sharing link.',
  lockedPlaceholder: 'Paste token…',
  lockedSubmit: 'Unlock',
  lockedError: 'Token invalid or expired.',
};
```

Only the keys you set are overridden; the rest keep their defaults. The locked fields only matter when [`requireAuth`](/api/properties) is on.
