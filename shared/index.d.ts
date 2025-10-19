/// <reference types="node" />
/// <reference types="chrome"/>

import type { PatchConfigData } from "./types";

export {};
declare global {
  interface Window {
    __rc_config: {
      [patchKey: string]: PatchConfigData;
    };
  }
}
