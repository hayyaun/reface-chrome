import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import compileTime from "vite-plugin-compile-time";

export default defineConfig({
  plugins: [compileTime(), react(), tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: "popup.html",
        options: "options.html",
      },
    },
  },
});
