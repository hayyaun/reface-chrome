import terser from "@rollup/plugin-terser";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

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
  plugins: [],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    copyPublicDir: false,
    minify: false,
    rollupOptions: {
      input: {
        background: "src/background.ts",
        ...patchFiles,
      },
      output: {
        entryFileNames: "[name].js",
        format: "es",
      },
      plugins: [
        terser({
          maxWorkers: 0,
          mangle: {
            eval: false,
            module: true,
            toplevel: true,
            nth_identifier: {
              get: () => `rc_${crypto.randomUUID().replaceAll("-", "_")}`,
            },
          },
        }),
      ],
    },
  },
});
