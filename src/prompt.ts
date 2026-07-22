import type { Annotation } from './types.js';

/**
 * Format a single annotation as structured Markdown optimized for AI coding agents.
 * The agent receives everything it needs to locate and fix the element:
 * tag name, CSS selector, human-readable name, visible text, position, and the user's feedback.
 */
export function formatAnnotationAsPrompt(annotation: Annotation): string {
  const el = annotation.element;
  const lines: string[] = [
    '## UI Feedback',
    '',
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

  return [...header, ...items.join('\n\n---\n\n')].join('\n');
}
