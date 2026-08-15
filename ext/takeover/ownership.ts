import { includesOrigin } from "@/settings/origin";
import type { Settings } from "@/settings/settings";

import { findRoute, parseRoutePath } from "@foundry-ridefined/skin";

/**
 * Scaffolding switch.
 *
 * The real route list is not decided yet, so while this is true we take over
 * every page on an allowed origin and show the work-in-progress page on anything
 * we have no route for. Production always leaves unknown Foundry routes
 * untouched. It never widens which origins we run on.
 */
const TAKE_OVER_EVERY_PAGE = import.meta.env.DEV;

/**
 * Whether this document is ours to replace.
 *
 * The content script is registered for every https page, so this is the only
 * gate that decides whether any of it actually runs. Three things must all
 * hold: the skin is on, the user listed this origin, and we own the route.
 *
 */
export function shouldRunSkin(settings: Settings, href: string): boolean {
  if (!settings.enabled) return false;

  let url: URL;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return false;
  }

  if (!includesOrigin(settings.origins, url.origin)) return false;
  if (TAKE_OVER_EVERY_PAGE) return true;

  return (
    findRoute(url.pathname + url.search) !== undefined ||
    parseRoutePath(href) !== undefined
  );
}
