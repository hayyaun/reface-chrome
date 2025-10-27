import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { ConfigValue } from "./main";

type Entity = "background" | "content" | "popup" | "options";

type BaseMessage<TO extends Entity, ACT extends string, T, R> = {
  msg: { to: TO; action: ACT; data: T };
  res: Promise<R | null>; // null means irrelevant - drop
};

export type Message =
  | BaseMessage<"background", "apply_patch", { patchKey: string }, undefined>
  | BaseMessage<"background", "update_config", { patchKey: string; configKey: string; value: ConfigValue }, undefined>
  | BaseMessage<"background", "update_badge", number, undefined>
  | BaseMessage<"background", "samantha_ask", ChatCompletionMessageParam[], undefined>
  | BaseMessage<"popup", "samantha_thinking", SamanthaThinkingMessageData, undefined>
  | BaseMessage<"content", "magic_eraser_selection_mode", boolean, undefined>
  | BaseMessage<"background", "magic_eraser_on_select", { hostname: string; selector: string }, string>
  | BaseMessage<"background", "magic_eraser_get_item", string, MagicEraserDBItem | undefined>
  | BaseMessage<"background", "whiteboard_set_item", WhiteboardDBItem, string>
  | BaseMessage<"background", "whiteboard_get_item", string, WhiteboardDBItem | undefined>;

type MessageBy<M extends Message["msg"]> = Extract<Message, { msg: M }>;
type MessageByAction<A extends Message["msg"]["action"]> = Extract<Message, { msg: { action: A } }>;

// Patches

export type SamanthaThinkingMessageData = {
  iter: number;
  content: string;
} | null;

export interface MagicEraserDBItem {
  hostname: string; // primary-key
  scrollBody: boolean;
  selectors: string[];
  watch: boolean;
}

export interface WhiteboardDBItem {
  url: string; // primary-key
  data: string; // base-64
  scale: number;
}
