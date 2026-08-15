import { storage } from "@wxt-dev/storage";

import { DEFAULT_SETTINGS, normalizeSettings, type Settings } from "./settings";

/**
 * Typed as `unknown` deliberately. Nothing guarantees what is actually in sync
 * storage, so every read goes through normalization rather than trusting a
 * declared type.
 */
const item = storage.defineItem<unknown>("sync:settings", {
  fallback: { ...DEFAULT_SETTINGS },
});

export async function getSettings(): Promise<Settings> {
  return normalizeSettings(await item.getValue());
}

export async function setSettings(value: unknown): Promise<Settings> {
  const settings = normalizeSettings(value);
  await item.setValue(settings);
  return settings;
}

export function watchSettings(callback: (value: Settings) => void): () => void {
  return item.watch((value) => callback(normalizeSettings(value)));
}
