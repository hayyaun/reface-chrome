import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

export type ConfigValue = string | number | boolean | object;

export interface Option {
  name: string;
  value: string;
}

export interface PatchConfig {
  [key: string]: {
    name: string;
    details: string;
    defaultValue: ConfigValue;
    options?: Option[];
  };
}

export interface PatchConfigData {
  [key: string]: ConfigValue;
}

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

  /** Logo file location */
  logo?: IconType | string;

  /** Default color for add-on logo */
  color?: string;

  /** Default bgcolor for add-on logo */
  bgcolor?: string;

  /** Config value globally set by user
   * @summary You can access it from `window.__rc_config["patch-name"]["config-key"]`
   */
  config?: PatchConfig;

  /** Popup menu profile page
   * @see config for retrieving params and variables
   */
  profile?: {
    icon: IconType;
    title: string;
    Component: (props: ModalProps) => ReactNode;
  };
}

type Entity = "background" | "content" | "popup" | "options";

interface BaseMessage<TO extends Entity, T> {
  from: Entity;
  to: TO;
  data: T;
}

export type OpenaiThinkingMessageData = {
  iter: number;
  content: string;
} | null;

export type Message =
  | (BaseMessage<"background", number> & {
      action: "updateBadge";
    })
  | (BaseMessage<"background", ChatCompletionMessageParam[]> & {
      action: "openai_ask";
    })
  | (BaseMessage<"popup", OpenaiThinkingMessageData> & {
      action: "openai_thinking";
    })
  | (BaseMessage<"content", boolean> & {
      action: "magic_eraser_selection_mode";
    })
  | (BaseMessage<"background", { hostname: string; selector: string }> & {
      action: "magic_eraser_on_select";
    });
