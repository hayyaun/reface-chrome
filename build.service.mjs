import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import swc from "@rollup/plugin-swc";
import terser from "@rollup/plugin-terser";
import fs from "fs";
import path, { dirname } from "path";
import { rollup } from "rollup";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const patchesDir = "service/patches";
const patchFiles = fs
  .readdirSync(patchesDir)
  .filter((f) => f.endsWith(".ts") || f.endsWith('.tsx'))
  .reduce(
    (acc, f) => {
      const name = path.parse(f).name;
      acc[`patches/${name}`] = path.join(patchesDir, f);
      return acc;
    },
    {},
  );

const allScriptFiles = {
  background: "service/index.ts",
  ...patchFiles,
};

async function buildServiceFiles() {
  // Build background and scripts
  for (const [key, input] of Object.entries(allScriptFiles)) {
    const bundle = await rollup({
      input,
      treeshake: { moduleSideEffects: true },
      plugins: [
        // dynamicDirCopyPlugin("service/patches", "patches", [".css"]),
        alias({
          entries: [{ find: "@", replacement: path.resolve(__dirname) }],
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
          'import.meta.env.DEV': JSON.stringify(false),
          'import.meta.env.PROD': JSON.stringify(true),
          'import.meta.DEV': JSON.stringify(false),
          'import.meta.PROD': JSON.stringify(true),
          preventAssignment: true,
        }),
        resolve({
          extensions: [".ts", ".js"],
          browser: true,
          preferBuiltins: false,
        }),
        commonjs({
          include: /node_modules/,
          requireReturnsDefault: "auto",
          // esmExternals: true,
          transformMixedEsModules: true,
        }),
        swc({
          swc: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,  // Enable JSX
              },
              target: "es2020",
              transform: {
                react: {
                  pragma: "h",
                  pragmaFrag: "Fragment",
                  runtime: "automatic",
                  importSource: "preact"
                }
              },
            }
          },
        }),
        terser({
          mangle: {
            toplevel: true,
            nth_identifier: {
              get: (n) => `rc_${crypto.randomUUID().split("-")[0]}_${n}`,
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
    });

    await bundle.write({
      file: `dist/${key}.js`,
      format: "iife",
      inlineDynamicImports: true,
      compact: false
    });
  }

  // Copy CSS files
  const patchesDistDir = path.join('dist', 'patches');
  if (!fs.existsSync(patchesDistDir)) {
    fs.mkdirSync(patchesDistDir, { recursive: true });
  }

  const cssFiles = fs.readdirSync(patchesDir).filter(f => f.endsWith('.css'));
  for (const cssFile of cssFiles) {
    fs.copyFileSync(
      path.join(patchesDir, cssFile),
      path.join(patchesDistDir, cssFile)
    );
  }
}

buildServiceFiles();
