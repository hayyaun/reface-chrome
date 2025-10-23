import type { BaseMessage } from "../types";

export {};

export type OpenaiThinkingMessageData = {
  iter: number;
  content: string;
} | null;

export interface MagicEraserOnSelectMessageData {
  hostname: string;
  selector: string;
}

export interface MagicEraserDBItem {
  hostname: string; // primary-key
  scrollBody: boolean;
  selectors: string[];
  watch: boolean;
}

export type PatchMessage =
  | BaseMessage<"popup", "openai_thinking", OpenaiThinkingMessageData>
  | BaseMessage<"content", "magic_eraser_selection_mode", boolean>
  | BaseMessage<"background", "magic_eraser_on_select", MagicEraserOnSelectMessageData>
  | BaseMessage<"background", "magic_eraser_get_item", string>;
