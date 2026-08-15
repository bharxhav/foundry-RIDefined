import type { Settings } from "@/settings/settings";
import { setSettings } from "@/settings/storage";
import { syncAction } from "@/action/sync";

import { broadcastSettingsChanged } from "./broadcast";

/**
 * Writes settings, then brings the toolbar icon and every open tab in line.
 *
 * The write is the only step that rejects, and it rejects before anything else
 * has happened, so there is nothing to undo. Content scripts are registered
 * statically and decide for themselves whether to run, which is what removed the
 * step that used to fail here and the rollback that went with it.
 */
export async function applySettings(value: unknown): Promise<Settings> {
  const next = await setSettings(value);
  await syncAction(next.enabled);
  await broadcastSettingsChanged();
  return next;
}
