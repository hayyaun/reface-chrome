import fs from "fs";
import path from "path";
import { Plugin } from "vite";

export function dynamicCSSCopyPlugin(
  replacements: [string, string][],
  dir: string,
): Plugin {
  return {
    name: "dynamic-css-copy",
    buildStart() {
      const cssDir = path.resolve(process.cwd(), `src/${dir}`);
      const files = fs.readdirSync(cssDir).filter((f) => f.endsWith(".css"));
      files.forEach((file) => {
        let content = fs.readFileSync(path.join(cssDir, file), "utf-8");
        // Apply replacements in order
        for (const [search, replace] of replacements) {
          content = content.replaceAll(search, replace);
        }
        this.emitFile({
          type: "asset",
          fileName: `${dir}/${file}`,
          source: content,
        });
      });
    },
  };
}
