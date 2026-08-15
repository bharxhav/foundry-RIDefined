import { browser } from "wxt/browser";

import { clearOperationExecutor } from "@/content/operations/executor";
import { isAppMounted, mountApp, unmountApp } from "@/content/takeover/mount";
import { ownsDocument } from "@/content/takeover/ownership";
import { isSettingsChangedMessage } from "@/settings/messages";
import { isOwnExtension } from "@/settings/sender";
import type { Settings } from "@/settings/settings";
import { getSettings } from "@/settings/storage";

export default defineContentScript({
  // Every https page, then gated at runtime against the user's origin
  // allowlist.
  matches: ["https://*/*"],
  runAt: "document_start",
  // WXT fetches the extracted stylesheet and installs it in the shadow root,
  // rather than injecting it into Foundry's page.
  cssInjectionMode: "ui",

  async main(ctx) {
    let generation = 0;
    let settings: Settings | undefined;

    const shouldOwn = () =>
      settings !== undefined && ownsDocument(settings, window.location.href);

    /**
     * Brings the page in line with settings and route ownership.
     *
     * Every await is a chance for settings to change or Foundry to navigate, so
     * each step re-checks that this is still the newest call.
     */
    async function reconcile() {
      const run = ++generation;
      const isStale = () => run !== generation || ctx.isInvalid;

      settings = await getSettings();
      if (isStale()) return;

      if (!shouldOwn()) {
        unmountApp();
        return;
      }

      await mountApp(ctx, shouldOwn);
      if (isStale() || !shouldOwn()) unmountApp();
    }

    // Foundry navigates without reloading, so the content script is not re-run
    // when the user leaves or enters one of our routes. Re-evaluate ownership on
    // every history change, and act only when it actually flips, so navigation
    // within our own routes is left to React.
    function syncOwnership() {
      if (shouldOwn() === isAppMounted()) return;
      void reconcile();
    }

    ctx.addEventListener(window, "wxt:locationchange", syncOwnership);
    ctx.addEventListener(window, "popstate", syncOwnership);

    const onMessage = (message: unknown, sender: { id?: string }) => {
      if (!isOwnExtension(sender) || !isSettingsChangedMessage(message)) return;
      void reconcile();
    };
    browser.runtime.onMessage.addListener(onMessage);

    ctx.onInvalidated(() => {
      generation += 1;
      browser.runtime.onMessage.removeListener(onMessage);
      clearOperationExecutor();
      unmountApp();
    });

    await reconcile();
  },
});
