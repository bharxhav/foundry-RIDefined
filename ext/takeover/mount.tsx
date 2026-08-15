import {
  createFoundryOperationContext,
  OperationExecutor,
} from "@foundry-ridefined/foundry-client";
import { Skin } from "@foundry-ridefined/skin";
import { createRoot, type Root } from "react-dom/client";
import type { ContentScriptContext } from "wxt/utils/content-script-context";
import {
  createShadowRootUi,
  type ShadowRootContentScriptUi,
} from "wxt/utils/content-script-ui/shadow-root";

import "@foundry-ridefined/skin/styles";
import "@/styles.css";

import { suppressHostPage } from "./host-suppression";
import { waitForBody } from "./wait-for-body";

interface Mounted {
  root: Root;
  releaseHost: () => void;
  executor: OperationExecutor;
}

let ui: ShadowRootContentScriptUi<Mounted> | undefined;

/**
 * Incremented on every mount attempt and on unmount, so an in-flight mount can
 * tell it has been superseded. Mounting spans several awaits, during which
 * Foundry may navigate or settings may change.
 */
let mountToken = 0;

export function isSkinMounted(): boolean {
  return ui?.mounted !== undefined;
}

/**
 * @param stillWanted Re-asked after every await. Injected rather than imported
 *   so this file owns the mount lifecycle and nothing else.
 */
export async function mountSkin(
  ctx: ContentScriptContext,
  stillWanted: () => boolean,
): Promise<void> {
  if (isSkinMounted()) return;
  const token = ++mountToken;
  const isCurrent = () =>
    token === mountToken && !ctx.isInvalid && stillWanted();

  if (!isCurrent()) return;
  await waitForBody(ctx);
  if (!isCurrent()) return;

  const nextUi = await createShadowRootUi<Mounted>(ctx, {
    name: "foundry-ridefined-ui",
    position: "modal",
    anchor: "body",
    append: "last",
    zIndex: 2147483647,
    onMount(container, _shadow, shadowHost) {
      // Portals need a container inside the shadow root, or Blueprint's overlays
      // would escape into Foundry's DOM and lose our styles.
      const appContainer = document.createElement("div");
      const portalContainer = document.createElement("div");
      portalContainer.className = "ridefined-portal";
      container.append(appContainer, portalContainer);

      // Built here because this is where the document being taken over is known.
      // Its lifetime is the mount's, so unmounting drops every cached result and
      // aborts in-flight work without anyone having to remember to clear it.
      const executor = new OperationExecutor(
        createFoundryOperationContext(document),
      );

      const releaseHost = suppressHostPage(shadowHost);
      const root = createRoot(appContainer);
      root.render(
        <Skin portalContainer={portalContainer} executor={executor} />,
      );
      return { root, releaseHost, executor };
    },
    onRemove(mounted) {
      mounted?.root.unmount();
      mounted?.releaseHost();
      mounted?.executor.clear();
    },
  });

  // createShadowRootUi awaits, so re-check before publishing it.
  if (!isCurrent()) {
    nextUi.remove();
    return;
  }

  ui = nextUi;
  nextUi.mount();
  if (!isCurrent()) unmountSkin();
}

export function unmountSkin(): void {
  mountToken += 1;
  const mountedUi = ui;
  ui = undefined;
  mountedUi?.remove();
}
