import PQueue from "p-queue";
import { browser } from "wxt/browser";

import { applySettings } from "@/settings/background/apply";
import {
  SETTINGS_MENU_ITEM_ID,
  createSettingsMenu,
} from "@/settings/background/menu";
import {
  isSaveSettingsMessage,
  type SaveSettingsResponse,
} from "@/settings/messages";
import { isTrustedExtensionPage } from "@/settings/sender";
import { getSettings } from "@/settings/storage";

/** Only our own settings page may change settings. */
const SETTINGS_URL = browser.runtime.getURL("/settings.html");

const settingsQueue = new PQueue({ concurrency: 1 });

export default defineBackground(() => {
  // Installation, browser startup, and an on-demand worker wake all converge
  // here: create browser-owned UI, then reflect stored settings in every surface.
  const initialize = () =>
    settingsQueue.add(async () => {
      const settings = await getSettings();
      await createSettingsMenu();
      await applySettings(settings);
    });

  browser.runtime.onInstalled.addListener(() => void initialize());
  browser.runtime.onStartup.addListener(() => void initialize());

  // Left click is the toggle. Read-then-write inside the queue so two fast
  // clicks cannot both read the same value and cancel each other out.
  browser.action.onClicked.addListener(() => {
    void settingsQueue.add(async () => {
      const current = await getSettings();
      return applySettings({ ...current, enabled: !current.enabled });
    });
  });

  // The browser owns the tab: it opens the manifest's options page and, where it
  // supports doing so, focuses an already-open one instead of duplicating it.
  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId !== SETTINGS_MENU_ITEM_ID) return;
    void browser.runtime.openOptionsPage();
  });

  browser.runtime.onMessage.addListener((message, sender) => {
    if (
      !isTrustedExtensionPage(sender, SETTINGS_URL) ||
      !isSaveSettingsMessage(message)
    ) {
      return;
    }
    // Returning the promise keeps the message channel open until the settings
    // page receives either the applied settings or an error it can display.
    return (async (): Promise<SaveSettingsResponse> => {
      try {
        return {
          success: true,
          settings: await settingsQueue.add(() =>
            applySettings(message.settings),
          ),
        };
      } catch (cause) {
        return {
          success: false,
          error: cause instanceof Error ? cause.message : String(cause),
        };
      }
    })();
  });

  // The worker also starts on demand, without onInstalled or onStartup firing.
  void initialize();
});
