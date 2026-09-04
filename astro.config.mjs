// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://shoyeb.dev",
  build: {
    // one stylesheet rather than many small <link>s — fewer round trips on mobile
    inlineStylesheets: "auto",
  },
});
