import { isPlainObject } from "../plain-object";

import { parseOrigins, type ValidOrigin } from "./origin";

export interface Settings {
  enabled: boolean;
  /** Exact Foundry origins we are allowed to run on. */
  origins: ValidOrigin[];
}

/**
 * A fresh install is inert.
 */
export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  origins: [],
};

/**
 * Coerce anything into usable settings.
 *
 * Reads must never fail: storage can hold values written by an older version,
 * synced from another machine, or edited by hand. Anything unusable falls back
 * to the defaults instead of throwing.
 */
export function normalizeSettings(value: unknown): Settings {
  if (!isPlainObject(value)) return { ...DEFAULT_SETTINGS, origins: [] };

  return {
    enabled:
      typeof value.enabled === "boolean"
        ? value.enabled
        : DEFAULT_SETTINGS.enabled,
    origins: parseOrigins(value.origins),
  };
}
