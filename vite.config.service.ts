import terser from "@rollup/plugin-terser";
import fs from "fs";
import path from "path";
import { defineConfig, Plugin } from "vite";

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

function dynamicCSSCopyPipelinePlugin(
  replacements: [string, string][],
): Plugin {
  return {
    name: "dynamic-css-pipeline",
    buildStart() {
      const cssDir = path.resolve(__dirname, patchesDir);
      const files = fs.readdirSync(cssDir).filter((f) => f.endsWith(".css"));

      files.forEach((file) => {
        let content = fs.readFileSync(path.join(cssDir, file), "utf-8");

        // Apply replacements in order
        for (const [search, replace] of replacements) {
          content = content.replaceAll(search, replace);
        }

        this.emitFile({
          type: "asset",
          fileName: `patches/${file}`,
          source: content,
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [
    dynamicCSSCopyPipelinePlugin([
      ["!important;", ";"],
      [";", "!important;"],
    ]),
  ],
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
