/// <reference types="node" />
/// <reference types="chrome"/>

import type { PatchConfigData } from "./main";

export {};

declare global {
  interface Window {
    __rc_config: {
      [patchKey: string]: PatchConfigData;
    };
  }
}

export * from "./patch";
export * from "./main";
