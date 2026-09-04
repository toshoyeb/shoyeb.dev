// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://shoyeb.dev",

  build: {
    // one stylesheet rather than many small <link>s — fewer round trips on mobile
    inlineStylesheets: "auto",
  },

  integrations: [
    sitemap({
      // form outcomes, not pages anyone should land on from a search result
      filter: (page) => !/\/(thanks|contact-error)\/$/.test(page),
    }),
  ],
});