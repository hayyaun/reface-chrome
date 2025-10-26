import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { BaseMessageCallback } from ".";

type Entity = "background" | "content" | "popup" | "options";

interface BaseMessage<TO extends Entity, ACT extends string, T> {
  to: TO;
  action: ACT;
  data: T;
}

type BaseMessageCallback<TO extends Entity, ACT extends string, T, R> = (msg: BaseMessage<TO, ACT, T>, sender: browser.runtime.MessageSender) => Promise<R | null>;

export type MessageCallback =
  | BaseMessageCallback<"background", "updateBadge", number, void>
  | BaseMessageCallback<"background", "samantha_ask", ChatCompletionMessageParam[], void>
  | BaseMessageCallback<"popup", "samantha_thinking", SamanthaThinkingMessageData, void>
  | BaseMessageCallback<"content", "magic_eraser_selection_mode", boolean, string | undefined>
  | BaseMessageCallback<"background", "magic_eraser_on_select", MagicEraserOnSelectMessageData, string>
  | BaseMessageCallback<"background", "magic_eraser_get_item", string, MagicEraserDBItem | undefined>
  | BaseMessageCallback<"background", "whiteboard_set_item", WhiteboardDBItem, string | undefined>
  | BaseMessageCallback<"background", "whiteboard_get_item", string, WhiteboardDBItem | undefined>;

export type Message = Parameters<MessageCallback>[0];

type ExtractCallback<T extends Message> = Extract<MessageCallback, BaseMessageCallback<T["to"], T["action"], T["data"], unknown>>;

// Patches

export type SamanthaThinkingMessageData = {
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

export interface WhiteboardDBItem {
  url: string; // primary-key
  data: string; // base-64
}
