/** Marks the document as taken over, for our own stylesheets to hook onto. */
const TAKEOVER_ATTRIBUTE = "data-foundry-ridefined";

/** An element's inline `display` before we overrode it. */
interface InlineDisplay {
  value: string;
  priority: string;
}

/**
 * Hides Foundry's UI without destroying it, and returns a release function.
 *
 * Hiding rather than removing is deliberate: Foundry's React tree, timers and
 * subscriptions keep running, so switching the skin off hands back a live page
 * instead of a broken one. Nothing in Foundry's stylesheets is touched.
 *
 * Only direct children of `<body>` are hidden, and each element's original
 * inline `display` is recorded so it can be restored exactly. On release an
 * element is skipped if its `display` is no longer ours, meaning Foundry itself
 * changed it in the meantime.
 *
 */
export function suppressHostPage(shadowHost: HTMLElement): () => void {
  document.documentElement.setAttribute(TAKEOVER_ATTRIBUTE, "on");

  const hiddenElements = new Map<HTMLElement, InlineDisplay>();
  const previouslyFocused =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : undefined;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const hideElement = (element: HTMLElement) => {
    if (element === shadowHost || hiddenElements.has(element)) return;
    hiddenElements.set(element, {
      value: element.style.getPropertyValue("display"),
      priority: element.style.getPropertyPriority("display"),
    });
    element.style.setProperty("display", "none", "important");
  };

  for (const child of document.body.children) {
    if (child instanceof HTMLElement) hideElement(child);
  }

  // Foundry keeps rendering while suppressed, so anything it appends later has
  // to be hidden too.
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLElement) hideElement(node);
      }
    }
  });
  observer.observe(document.body, { childList: true });

  let released = false;
  return () => {
    if (released) return;
    released = true;
    observer.disconnect();
    document.documentElement.removeAttribute(TAKEOVER_ATTRIBUTE);

    for (const [element, original] of hiddenElements) {
      const isStillOurs =
        element.style.getPropertyValue("display") === "none" &&
        element.style.getPropertyPriority("display") === "important";
      if (!isStillOurs) continue;

      if (original.value) {
        element.style.setProperty("display", original.value, original.priority);
      } else {
        element.style.removeProperty("display");
      }
    }

    window.scrollTo(scrollX, scrollY);
    if (previouslyFocused?.isConnected) {
      previouslyFocused.focus({ preventScroll: true });
    }
  };
}
