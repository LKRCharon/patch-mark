import type { Annotation } from './types.js';

/**
 * Format a single annotation as structured Markdown optimized for AI coding agents.
 * The agent receives everything it needs to locate and fix the element:
 * tag name, CSS selector, human-readable name, visible text, position, and the user's feedback.
 */
/** Shared field lines used by both the single-annotation and handoff formats. */
function formatAnnotationFields(annotation: Annotation): string[] {
  const el = annotation.element;
  const lines: string[] = [
    `- **Element:** \`<${el.tagName}>\``,
    `- **Selector:** \`${el.selector}\``,
    `- **Name:** ${el.name}`,
  ];

  if (el.text) {
    lines.push(`- **Text:** "${el.text}"`);
  }

  lines.push(
    `- **Position:** top=${el.rect.top}, left=${el.rect.left}, ${el.rect.width}x${el.rect.height}`,
    `- **Page:** ${annotation.pagePath}`,
  );

  if (annotation.pageTitle) {
    lines.push(`- **Page Title:** ${annotation.pageTitle}`);
  }

  lines.push(`- **Feedback:** ${annotation.message}`);

  if (annotation.changes && annotation.changes.length > 0) {
    lines.push('', '- **Property Changes:**');
    for (const change of annotation.changes) {
      lines.push(`  - \`${change.property}\`: ${change.from} → ${change.to}`);
    }
  }

  return lines;
}

export function formatAnnotationAsPrompt(annotation: Annotation): string {
  const lines: string[] = ['## UI Feedback', '', ...formatAnnotationFields(annotation)];

  if (annotation.status) {
    lines.push(`- **Status:** ${annotation.status}`);
  }

  return lines.join('\n');
}

/**
 * Format multiple annotations as a single Markdown report for an AI coding agent.
 */
export function formatAnnotationsAsPrompt(annotations: Annotation[], pagePath?: string): string {
  if (annotations.length === 0) {
    return '## UI Feedback\n\nNo feedback items.';
  }

  const header = [
    '## UI Feedback Report',
    '',
    `- **Page:** ${pagePath || annotations[0].pagePath}`,
    `- **Total Items:** ${annotations.length}`,
    '- **Captured:** ' + new Date().toISOString(),
    '',
    '---',
  ];

  const items = annotations.map((annotation, index) => {
    return `### Feedback #${index + 1}\n\n${formatAnnotationAsPrompt(annotation)}`;
  });

  return [...header, items.join('\n\n---\n\n')].join('\n');
}

/**
 * Format open annotations as a self-contained handoff prompt: working
 * instructions followed by the structured batch data. Unlike
 * formatAnnotationsAsPrompt (raw report data), this is meant to be pasted
 * to any agent as-is — no prepending required. Resolved items are excluded.
 */
export function formatHandoffPrompt(
  annotations: Annotation[],
  pageUrl: string,
  source?: { type: 'rest'; endpoint: string },
): string {
  const open = annotations.filter((a) => a.status !== 'resolved');
  if (open.length === 0) {
    return '## UI Feedback\n\nNo open feedback items.';
  }

  const pagePath = open[0].pagePath;

  // Self-serve mode: the agent owns the lifecycle — read open items through
  // the REST API, fix each, PATCH it resolved. Next pass only sees new open
  // items, so nothing gets re-processed.
  if (source?.type === 'rest') {
    const header = [
      `You are maintaining UI feedback annotations managed by patch-mark on ${pageUrl}.`,
      '',
      '## Source of truth',
      'Annotations live behind a REST API. Read the open items, fix each, then mark it resolved yourself — you own the lifecycle so nothing gets re-processed on the next pass.',
      '',
      `- GET    ${source.endpoint}?page=${encodeURIComponent(pagePath)}   → { annotations }  (process only status:"open")`,
      `- PATCH  ${source.endpoint}/{id}             → close an item with { "status": "resolved" }`,
      '',
      '## Lifecycle rules',
      '- Only touch items with status "open". Already-resolved items are done — skip them.',
      '- For each open item: locate the element in the codebase (grep the Selector\'s distinctive class/id, or the visible Text; the Page field maps to the route), apply the Feedback ("Property Changes" are exact `property: from → to`), then PATCH that item resolved.',
      '- Don\'t pause for confirmation between items — fix and move on.',
      '- When every open item is resolved, reply with a numbered summary: what changed per item and which files you touched.',
      '',
      `## Open items (${open.length})`,
      '',
    ];
    const items = open.map(
      (a, i) =>
        `### ${i + 1}. \`<${a.element.tagName}>\` — ${a.element.name}\n\n- **ID:** \`${a.id}\`\n${formatAnnotationFields(a).join('\n')}`,
    );
    return [...header, items.join('\n\n---\n\n')].join('\n');
  }

  // Paste-off mode (localStorage / no REST source): data + instructions,
  // resolving stays manual since the agent can't reach the store.
  const header = [
    'You are fixing a batch of UI feedback captured with patch-mark.',
    '',
    `- **Page:** ${pageUrl}`,
    `- **Open Items:** ${open.length}`,
    '',
    'How to work the batch:',
    '1. Locate each element in the codebase: grep for a distinctive class or id from the Selector, or for the visible Text. The Page field maps to the route/component.',
    '2. Apply the Feedback. "Property Changes" lines are exact instructions (`property: from → to`); otherwise follow the Feedback text and match the project\'s existing styling conventions.',
    '3. Don\'t pause for confirmation between items — make the edit and move on.',
    '',
    'When finished, reply with a numbered summary: what changed per item and which files you touched. The user will verify in the browser and mark items resolved.',
    '',
    '---',
  ];
  const items = open.map(
    (a, i) =>
      `### ${i + 1}. \`<${a.element.tagName}>\` — ${a.element.name}\n\n${formatAnnotationFields(a).join('\n')}`,
  );
  return [...header, items.join('\n\n---\n\n')].join('\n');
}
