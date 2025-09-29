import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

// grab all .ts files in src/patches
const patchesDir = "src/patches";
const patchFiles = fs
  .readdirSync(patchesDir)
  .filter((f) => f.endsWith(".ts"))
  .reduce(
    (acc, f) => {
      const name = path.parse(f).name;
      acc[`patches/${name}`] = path.join(patchesDir, f);
      return acc;
    },
    {} as Record<string, string>,
  );

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: "popup.html",
        options: "options.html",
        background: "src/background.ts",
        ...patchFiles,
      },
      output: {
        entryFileNames: "[name].js",
        format: "es",
      },
    },
  },
});
