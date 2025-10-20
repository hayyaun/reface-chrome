/// <reference types="node" />

import type { PatchConfigData } from "./types";

export {};
declare global {
  interface Window {
    __rc_config: {
      [patchKey: string]: PatchConfigData;
    };
  }
}
