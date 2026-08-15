import { defineConfig } from "wxt";

export default defineConfig({
  manifestVersion: 3,
  modules: ["@wxt-dev/module-react"],
  webExt: {
    disabled: true,
  },
  // Bind IPv4 explicitly: the default binds [::1] only, which Chrome's service
  // worker cannot reach when it resolves localhost to 127.0.0.1.
  dev: {
    server: {
      host: "127.0.0.1",
      port: 39217,
      origin: "http://127.0.0.1:39217",
    },
  },
  manifest: ({ browser }) => ({
    name: "Foundry RIdefined",
    description: "A browser extension for Palantir Foundry.",
    permissions: ["storage", "contextMenus"],
    options_ui: {
      page: "settings.html",
      open_in_tab: true,
    },
    action: {
      default_title: "Foundry RIdefined: On",
      default_icon: {
        16: "/icon-on-16.png",
        32: "/icon-on-32.png",
        48: "/icon-on-48.png",
        128: "/icon-on-128.png",
      },
    },
    ...(browser === "firefox" && {
      browser_specific_settings: {
        gecko: {
          id: "k@bk.bio",
        },
      },
    }),
  }),
});
