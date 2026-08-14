import { defineConfig } from "wxt";

export default defineConfig({
  manifestVersion: 3,
  webExt: {
    chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
  },
  manifest: ({ browser }) => ({
    name: "Foundry RIdefined",
    description: "A browser extension for Palantir Foundry.",
    permissions: ["storage", "scripting", "contextMenus"],
    host_permissions: ["https://*.palantirfoundry.com/*"],
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
