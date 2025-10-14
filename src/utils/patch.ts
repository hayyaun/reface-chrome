import { patches } from "../config/compileTime";
import type { PatchConfigData } from "../types";

export const extractDefaultConfigData = (patchKey: string) => {
  const config = patches[patchKey].config || {};
  return Object.keys(config).reduce((acc, key) => {
    acc[key] = config[key].defaultValue;
    return acc;
  }, {} as PatchConfigData);
};
