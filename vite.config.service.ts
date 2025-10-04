import terser from "@rollup/plugin-terser";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import { dynamicCSSCopyPlugin } from "./plugins/css";

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
  plugins: [dynamicCSSCopyPlugin([], "patches")],
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
          mangle: {
            toplevel: true,
            nth_identifier: {
              get: (n: number) =>
                `rc_${crypto.randomUUID().split("-")[0]}_${n}`,
            },
          },
        }),
        terser({
          module: false,
          compress: false,
          mangle: {
            toplevel: false,
          },
        }),
      ],
    },
  },
});
