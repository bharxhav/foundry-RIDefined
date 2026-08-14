import { defineConfig } from "wxt";

export default defineConfig({
  manifestVersion: 3,
  manifest: ({ browser }) => ({
    name: "Foundry RIdefined",
    description: "A browser extension for Palantir Foundry.",
    permissions: ["storage"],
    ...(browser === "firefox" && {
      browser_specific_settings: {
        gecko: {
          id: "k@bk.bio",
        },
      },
    }),
  }),
});
