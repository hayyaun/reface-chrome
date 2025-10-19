import patches from "./patches";
import type { PatchConfigData } from "./types";

export const extractDefaultConfigData = (patchKey: string) => {
  const config = patches[patchKey].config || {};
  return Object.keys(config).reduce((acc, key) => {
    acc[key] = config[key].defaultValue;
    return acc;
  }, {} as PatchConfigData);
};

export function match(str: string, rule: string) {
  const escapeRegex = (str: string) =>
    // eslint-disable-next-line no-useless-escape
    str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(
    "^" + rule.split("*").map(escapeRegex).join(".*") + "$",
  ).test(str);
}
