/// <reference types="node" />
/// <reference types="chrome" />
/// <reference types="firefox-webext-browser" />

import type { PatchConfigData } from "./main";

export {};

declare global {
  interface Window {
    __rc_config: {
      [patchKey: string]: PatchConfigData;
    };
  }
}

export type * from "./main";
export type * from "./patch";
