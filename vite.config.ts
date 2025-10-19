import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: "popup.html",
        options: "options.html",
      },
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-icons",
            "react-icons/ri",
            "openai",
            "dexie",
            "dexie-react-hooks",
            "react-markdown",
          ], // large deps
        },
      },
    },
  },
});
