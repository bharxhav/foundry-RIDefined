import * as v from "valibot";

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

const StoredSettingsSchema = v.object({
  enabled: v.optional(v.boolean(), DEFAULT_SETTINGS.enabled),
  origins: v.optional(v.unknown()),
});

/**
 * Coerce anything into usable settings.
 *
 * Reads must never fail: storage can hold values written by an older version,
 * synced from another machine, or edited by hand. Anything unusable falls back
 * to the defaults instead of throwing.
 */
export function normalizeSettings(value: unknown): Settings {
  const result = v.safeParse(StoredSettingsSchema, value);
  if (!result.success) return { ...DEFAULT_SETTINGS, origins: [] };

  return {
    enabled: result.output.enabled,
    origins: parseOrigins(result.output.origins),
  };
}
