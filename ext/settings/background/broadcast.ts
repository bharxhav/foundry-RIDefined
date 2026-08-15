import { browser } from "wxt/browser";

import { SETTINGS_CHANGED } from "@/settings/messages";

/**
 * Tells already-injected content scripts that settings moved.
 *
 * Changing the registration only affects future injections, so live tabs would
 * otherwise keep running with the previous settings until reloaded.
 *
 * Failures are expected and ignored: most tabs have no content script listening.
 */
export async function broadcastSettingsChanged(): Promise<void> {
  const tabs = await browser.tabs.query({});
  await Promise.allSettled(
    tabs.flatMap(({ id }) =>
      id === undefined ? [] : [browser.tabs.sendMessage(id, SETTINGS_CHANGED)],
    ),
  );
}
