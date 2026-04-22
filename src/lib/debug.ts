/**
 * Lightweight debug logger gated on `NEXT_PUBLIC_API_DEBUG=true` or
 * `NEXT_PUBLIC_DEBUG=true` (defaults on in development builds). Prefixes every
 * message with `[api:<scope>]` so they're easy to filter in DevTools.
 *
 * We intentionally keep this as a no-op shim so production bundles don't
 * accumulate `console.log` calls, while developers still get a clear view of
 * what the backend actually returned when diagnosing "empty list" bugs.
 */

function debugEnabled(): boolean {
  if (typeof process === 'undefined') return false;
  const env = process.env;
  if (env?.NEXT_PUBLIC_API_DEBUG === 'true') return true;
  if (env?.NEXT_PUBLIC_DEBUG === 'true') return true;
  // Default ON in development so console inspection "just works".
  return env?.NODE_ENV !== 'production';
}

export function apiDebug(scope: string, ...args: unknown[]): void {
  if (!debugEnabled()) return;
  // eslint-disable-next-line no-console
  console.debug(`[api:${scope}]`, ...args);
}

export function apiWarn(scope: string, ...args: unknown[]): void {
  if (typeof console === 'undefined') return;
  // eslint-disable-next-line no-console
  console.warn(`[api:${scope}]`, ...args);
}
