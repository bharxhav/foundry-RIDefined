import { browser } from "wxt/browser";

/**
 * The parts of a message sender we authenticate against.
 *
 * Declared structurally rather than imported from the browser types so this
 * module stays independent of how each surface types its listener.
 */
export interface SenderIdentity {
  id?: string;
  url?: string;
}

/**
 * Whether a message came from this extension at all.
 *
 * Content scripts share a message channel with the page's own world in some
 * browsers, so even inbound notifications are checked.
 */
export function isOwnExtension(sender: SenderIdentity): boolean {
  return sender.id === browser.runtime.id;
}

/**
 * Whether a sender is the settings page.
 *
 * The background worker acts on `save-settings`, so being inside the extension
 * is not enough — the sender must be a page we shipped. Matching is on exact
 * resolved URL, never a prefix, so a crafted path cannot pass.
 *
 * Callers pass already-resolved URLs: deciding trust and knowing how to resolve
 * extension paths are separate jobs.
 */
export function isTrustedExtensionPage(
  sender: SenderIdentity,
  settingsUrl: string,
): boolean {
  return isOwnExtension(sender) && sender.url === settingsUrl;
}
