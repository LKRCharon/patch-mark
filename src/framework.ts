/**
 * Best-effort framework component detection — dev builds only.
 *
 * React attaches a fiber to every DOM node it renders (`__reactFiber$*`).
 * Walking the `.return` chain finds the enclosing component, and dev builds
 * ≤ React 18 carry `_debugSource` (file/line injected by the JSX dev
 * transform — removed in React 19, where only component names survive).
 * Vue 3 attaches `__vueParentComponent`; SFCs expose `__name`/`__file` in
 * dev. Everything here is opportunistic: production/minified builds yield {}.
 */

export type FrameworkInfo = {
  /** Nearest meaningful component name, e.g. "SubmitButton". */
  component?: string;
  /** Project-relative source location, e.g. "src/Button.tsx:42". */
  source?: string;
};

type ReactFiber = {
  type: unknown;
  return: ReactFiber | null;
  _debugSource?: { fileName?: string; lineNumber?: number } | null;
};

type VueInstance = {
  type?: { name?: string; __name?: string; __file?: string };
  parent?: VueInstance | null;
};

const FIBER_KEY_PREFIX = '__reactFiber$';
/** Guard against pathological fiber/instance chains. */
const MAX_DEPTH = 30;

export function detectFramework(element: HTMLElement): FrameworkInfo {
  return detectReact(element) ?? detectVue(element) ?? {};
}

function detectReact(element: HTMLElement): FrameworkInfo | undefined {
  const key = Object.keys(element).find((k) => k.startsWith(FIBER_KEY_PREFIX));
  if (!key) return undefined;

  let fiber: ReactFiber | undefined = (element as unknown as Record<string, ReactFiber>)[key];
  let component: string | undefined;
  let source: string | undefined;
  let depth = 0;

  while (fiber && depth < MAX_DEPTH && !(component && source)) {
    if (!source && fiber._debugSource?.fileName) {
      source = formatSource(fiber._debugSource.fileName, fiber._debugSource.lineNumber);
    }
    if (!component) {
      component = componentName(fiber.type);
    }
    fiber = fiber.return ?? undefined;
    depth++;
  }

  if (fiber === undefined && depth === 0) return undefined;
  return component || source ? { component, source } : {};
}

/**
 * Extract a component name from a fiber's `type`. Host elements ('div') and
 * symbol types (Fragment/Suspense) have no useful name; ForwardRef/Memo wrap
 * the real component in an object.
 */
function componentName(type: unknown): string | undefined {
  if (typeof type === 'function') {
    const fn = type as { displayName?: string; name?: string };
    return fn.displayName || fn.name || undefined;
  }
  if (typeof type === 'object' && type !== null) {
    const wrapped = type as {
      displayName?: string;
      render?: { name?: string };
      type?: { displayName?: string; name?: string };
    };
    return (
      wrapped.displayName ||
      wrapped.render?.name ||
      wrapped.type?.displayName ||
      wrapped.type?.name ||
      undefined
    );
  }
  return undefined;
}

function detectVue(element: HTMLElement): FrameworkInfo | undefined {
  let instance: VueInstance | undefined = (element as { __vueParentComponent?: VueInstance })
    .__vueParentComponent;
  let depth = 0;

  while (instance && depth < MAX_DEPTH) {
    const type = instance.type;
    const component = type?.name || type?.__name;
    if (component || type?.__file) {
      return {
        component,
        source: type?.__file ? formatSource(type.__file) : undefined,
      };
    }
    instance = instance.parent ?? undefined;
    depth++;
  }
  return undefined;
}

/**
 * Trim an absolute bundler path to a project-relative one: prefer everything
 * from `src/` onward, fall back to the last two path segments.
 */
function formatSource(fileName: string, lineNumber?: number): string {
  let path = fileName.replace(/\\/g, '/');
  if (!path.startsWith('src/')) {
    const srcIndex = path.indexOf('/src/');
    if (srcIndex >= 0) {
      path = path.slice(srcIndex + 1);
    } else {
      const segments = path.split('/').filter(Boolean);
      if (segments.length > 2) path = segments.slice(-2).join('/');
    }
  }
  return lineNumber ? `${path}:${lineNumber}` : path;
}
