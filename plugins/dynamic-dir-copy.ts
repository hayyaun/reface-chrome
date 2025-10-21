import fs from "fs";
import path from "path";
import { Plugin } from "vite";

export function dynamicDirCopyPlugin(
  dir: string,
  dist: string,
  exts: string[],
  replacements?: [string, string][],
): Plugin {
  return {
    name: "dynamic-dur-copy",
    buildStart() {
      const cssDir = path.resolve(process.cwd(), dir);
      const files = fs.readdirSync(cssDir).filter((f) => exts.some((ext) => f.endsWith(ext)));
      files.forEach((file) => {
        let content = fs.readFileSync(path.join(cssDir, file), "utf-8");
        // Apply replacements in order
        if (replacements) {
          for (const [search, replace] of replacements) {
            content = content.replaceAll(search, replace);
          }
        }
        this.emitFile({
          type: "asset",
          fileName: `${dist}/${file}`,
          source: content,
        });
      });
    },
  };
}
