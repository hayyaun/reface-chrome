import type { PatchConfigData } from "@/shared/types";

export {};

declare global {
  interface Window {
    __rc_config: {
      [patchKey: string]: PatchConfigData;
    };
  }
}
