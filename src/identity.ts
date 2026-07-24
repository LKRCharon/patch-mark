/**
 * Single source of truth for all user-visible naming identifiers.
 * To rename the package, change the values here + package.json + README, then rebuild.
 */
export const PACKAGE_NAME = 'patch-mark';
export const ELEMENT_TAG = 'patch-mark';
export const CLASS_PREFIX = 'pm';
export const CSS_VAR_PREFIX = '--pm';
export const GLOBAL_STYLE_ATTR = 'data-pm-global';
export const UI_ATTR = 'data-pm-ui';
export const PICKER_ACTIVE_CLASS = 'pm-picker-active';
export const STORAGE_KEY_DEFAULT = 'patch-mark:annotations';
export const VISIBLE_ATTR = 'visible';
export const THEME_ATTR = 'theme';
export const REQUIRE_AUTH_ATTR = 'require-auth';
/** Dock position of the launcher/panel: right-center (default) | right-top | right-bottom | left-center | left-top | left-bottom. */
export const POSITION_ATTR = 'position';
/** URL parameter carrying an access token (sharing links), captured on load. */
export const TOKEN_PARAM = 'pm_token';
export const STORAGE_KEY_TOKEN = 'patch-mark:token';
/** Preset themes selectable via the theme attribute (CSS-driven, see styles.ts). */
export const THEME_NAMES = ['blue', 'violet', 'emerald', 'orange', 'rose'] as const;

// Injected by esbuild at build time (--define); falls back to 'dev' when
// the source is consumed without the define (e.g. direct ts-node import).
declare const __PM_VERSION__: string;
export const VERSION = typeof __PM_VERSION__ !== 'undefined' ? __PM_VERSION__ : 'dev';
