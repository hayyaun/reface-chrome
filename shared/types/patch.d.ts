import type { BaseMessage, PatchConfigData } from "../types";

export {};

export interface MagicEraserConfigData extends PatchConfigData {
  persist: boolean;
  storage: { [hostname: string]: string[] };
}

export interface MagicEraserOnSelect {
  hostname: string;
  selector: string;
}

export type PatchMessage =
  | BaseMessage<"content", "magic_eraser_selection_mode", boolean>
  | BaseMessage<"background", "magic_eraser_on_select", MagicEraserOnSelect>;
