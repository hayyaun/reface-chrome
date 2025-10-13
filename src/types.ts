import type { ReactNode } from "react";
import type { IconType } from "react-icons";

export type ConfigValue = string | number | boolean | undefined;

export interface PatchConfig {
  [key: string]: {
    name: string;
    details: string;
    defaultValue: ConfigValue;
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

  /** Default color for add-on */
  color?: string;

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

export interface Message {
  data: unknown;
  from: "background" | "content" | "popup" | "options";
  to: Message["from"];
  type: "data" | "updateBadge";
}
