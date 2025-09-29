import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        background: "src/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
        format: "es",
      },
    },
  },
});
