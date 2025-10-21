/// <reference types="node" />
/// <reference types="chrome"/>

import type { PatchConfigData } from "./main";

export {};

declare global {
  interface Window {
    __rc_config: Readonly<{
      [patchKey: string]: PatchConfigData;
    }>;
  }
}

export * from "./main";
export * from "./patch";
