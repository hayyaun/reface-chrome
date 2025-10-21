import patches from "./patches";
import type { PatchConfigData } from "./types";

export function extractDefaultConfigData<T extends PatchConfigData>(patchKey: string) {
  const config = patches[patchKey].config || {};
  return Object.keys(config).reduce((acc, key) => {
    acc[key] = config[key].defaultValue as T;
    return acc;
  }, {} as PatchConfigData) as T;
}

export function match(str: string, rule: string) {
  const escapeRegex = (str: string) =>
    // eslint-disable-next-line no-useless-escape
    str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
}

export const promisify =
  <TArgs extends unknown[], TResult>(
    fn: (...args: [...TArgs, (result: TResult) => void]) => void,
  ) =>
  (...args: TArgs) =>
    new Promise<TResult>((resolve) => fn(...args, (result) => resolve(result)));
