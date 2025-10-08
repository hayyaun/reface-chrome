import patches from "../config/patches";
import type { PatchConfigData } from "../types";

export const extractDefaultConfigData = (patchKey: string) =>
  Object.keys(patches[patchKey].config!).reduce((acc, key) => {
    acc[key] = patches[patchKey].config![key].defaultValue;
    return acc;
  }, {} as PatchConfigData);
