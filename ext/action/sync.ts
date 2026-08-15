import { browser } from "wxt/browser";

/**
 * Makes the on/off state visible on the toolbar.
 *
 * The toolbar icon is the only always-visible surface we have, so it is the
 * authoritative indicator of whether the skin is running.
 */
export async function syncAction(enabled: boolean): Promise<void> {
  const suffix = enabled ? "on" : "off";
  await browser.action.setIcon({
    path: {
      16: `/icon-${suffix}-16.png`,
      32: `/icon-${suffix}-32.png`,
      48: `/icon-${suffix}-48.png`,
      128: `/icon-${suffix}-128.png`,
    },
  });
  await browser.action.setTitle({
    title: `Foundry RIdefined: ${enabled ? "On" : "Off"}`,
  });
}
