# Annotation model

Every annotation captures exactly what an agent needs to locate and fix an element:

```typescript
type Annotation = {
  id: string;
  pagePath: string;          // e.g. "/dashboard"
  pageTitle?: string;
  message: string;            // the human's feedback
  element: {
    tagName: string;          // "button"
    name: string;             // "#submit-btn" or "button.submit-btn"
    selector: string;         // "div.header > button.submit-btn"
    text: string;             // visible text, truncated to 240 chars
    rect: {
      top: number;            // absolute document position
      left: number;
      width: number;
      height: number;
    };
  };
  createdAt: string;          // ISO timestamp
  status?: 'open' | 'resolved';
};
```

## Compatibility

The model only ever grows by adding optional fields. Annotations written by older versions (e.g. without `status`) are treated as `open` everywhere — safe to upgrade without migrating data.

## CreateAnnotationInput

What the client sends on creation (the server assigns `id`, `createdAt`, `status`):

```typescript
type CreateAnnotationInput = {
  pagePath: string;
  pageTitle?: string;
  message: string;
  element: ElementTarget;
  changes?: PropertyChange[];
};
```
