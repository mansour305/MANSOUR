import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "ظ…ظˆط§ط¹ظٹط¯ظƒ",
        short_name: "ظ…ظˆط§ط¹ظٹط¯ظƒ",
        description: "طھط·ط¨ظٹظ‚ ظˆظٹط¨ ط¹ط±ط¨ظٹ ظ„ط¥ط¯ط§ط±ط© ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ظˆط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط© ظˆظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©",
        lang: "ar",
        dir: "rtl",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#FAF7F2",
        theme_color: "#C9A063",
        categories: ["productivity", "lifestyle"],
        prefer_related_applications: false,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "/index.html",
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@api-client": path.resolve(__dirname, "src/lib/api-client"),
    },
  },
});

