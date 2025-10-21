import type { BaseMessage, PatchConfigData } from "../types";

export {};

export type OpenaiThinkingMessageData = {
  iter: number;
  content: string;
} | null;

export interface MagicEraserConfigData extends PatchConfigData {
  persist: boolean;
  storage: { [hostname: string]: string[] };
}

export interface MagicEraserOnSelectMessageData {
  hostname: string;
  selector: string;
}

export type PatchMessage =
  | BaseMessage<"popup", "openai_thinking", OpenaiThinkingMessageData>
  | BaseMessage<"content", "magic_eraser_selection_mode", boolean>
  | BaseMessage<"background", "magic_eraser_on_select", MagicEraserOnSelectMessageData>;
