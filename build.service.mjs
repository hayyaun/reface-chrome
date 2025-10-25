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
  .readdirSync(patchesDir, { withFileTypes: true })
  .reduce((acc, dirent) => {
    if (dirent.isFile() && (dirent.name.endsWith(".ts") || dirent.name.endsWith('.tsx'))) {
      // Direct file: foo-bar.tsx
      const name = path.parse(dirent.name).name;
      acc[`patches/${name}`] = path.join(patchesDir, dirent.name);
    } else if (dirent.isDirectory()) {
      // Check for index.tsx or index.ts in subdirectory
      const subDir = path.join(patchesDir, dirent.name);
      const indexFile = ['index.tsx', 'index.ts'].find(f =>
        fs.existsSync(path.join(subDir, f))
      );
      if (indexFile) {
        acc[`patches/${dirent.name}`] = path.join(subDir, indexFile);
      }
    }
    return acc;
  }, {});

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
          extensions: [".ts", '.tsx', ".js"],
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
                tsx: true,
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
          module: false,
          compress: false,
          mangle: {
            toplevel: true,
          },
        }),
      ],
    });

    const output = await bundle.write({
      file: `dist/${key}.js`,
      format: "iife",
      inlineDynamicImports: true,
      compact: false
    });

    console.log(`${output.output[0].fileName}`)
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
