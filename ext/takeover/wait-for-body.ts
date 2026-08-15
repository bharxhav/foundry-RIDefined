import type { ContentScriptContext } from "wxt/utils/content-script-context";

/**
 * Resolves once `document.body` exists.
 *
 * The content script runs at `document_start`, which is early enough that the
 * body may be missing, and the shadow host is anchored to it.
 *
 * Also resolves when the script is invalidated, so a torn-down page cannot leave
 * the caller awaiting forever. Callers re-check their own liveness afterwards,
 * exactly as they do after every other await.
 */
export function waitForBody(ctx: ContentScriptContext): Promise<void> {
  if (document.body) return Promise.resolve();

  return new Promise((resolve) => {
    const stop = () => {
      observer.disconnect();
      resolve();
    };

    const observer = new MutationObserver(() => {
      if (document.body) stop();
    });

    observer.observe(document.documentElement, { childList: true });
    ctx.onInvalidated(stop);
  });
}
