import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { PatchMessage } from "./patch";

export {};

export type ConfigValue = string | number | boolean | object;

export interface Option {
  name: string;
  value: string;
}

interface PatchConfigItem<T> {
  name: string;
  details: string;
  defaultValue: T;
  /** dropdown menu options */
  options?: Option[];
  /** not shown in ui - used as state */
  hidden?: boolean;
}

export type PatchConfig<T extends ConfigValue> = Record<
  string, // patchKey
  PatchConfigItem<T>
>;

export type PatchConfigData = Record<string, ConfigValue>;

export interface ModalProps {
  close: () => void;
}

export interface HostnameConfig {
  enabled: string[];
  excluded: string[];
}

export interface Author {
  name: string;
  github: string;
  donation?: string;
  email?: string;
}

/**
 * Represents a patch or patch that can be applied to a web page or system.
 */
export interface Patch {
  /** Name of the author or inspired by */
  author?: Author;

  /** A short, descriptive name for the patch */
  name: string;

  /** Detailed description of what the patch does */
  details: string;

  /** Keywords for categorizing or searching for this patch */
  keywords: string[];

  /** List of hostname-rules where this patch is applicable
   * @summary Wildcard supported
   */
  hostnames: string[];

  /** Ignore script execution */
  noJS?: boolean;

  /** Map path-rules to css files name postfix - wildcard supported */
  css?: { [path: string]: string };

  /** Patch can be applied globally */
  global?: boolean;

  /** Default color for add-on logo */
  color?: string;

  /** Default bgcolor for add-on logo */
  bgcolor?: string;

  /** Config value globally set by user
   * @summary You can access it from `window.__rc_config["patch-name"]["config-key"]`
   */
  config?: PatchConfig;
}

type Entity = "background" | "content" | "popup" | "options";

export interface BaseMessage<TO extends Entity, ACT extends string, T> {
  to: TO;
  action: ACT;
  data: T;
}

export type OpenaiThinkingMessageData = {
  iter: number;
  content: string;
} | null;

export type Message =
  | BaseMessage<"background", "updateBadge", number>
  | BaseMessage<"background", "openai_ask", ChatCompletionMessageParam[]>
  | BaseMessage<"popup", "openai_thinking", OpenaiThinkingMessageData>
  | PatchMessage;
