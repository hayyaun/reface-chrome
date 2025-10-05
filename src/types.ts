export interface HostnameConfig {
  enabled: string[];
}

/**
 * Represents a patch or patch that can be applied to a web page or system.
 */
export interface Patch {
  /** A short, descriptive name for the patch */
  name: string;

  /** Detailed description of what the patch does */
  details: string;

  /** Keywords for categorizing or searching for this patch */
  keywords: string[];

  /** List of hostname-rules where this patch is applicable
   *
   * Wildcard supported
   * @example *wikipedia.org
   * google.*
   */
  hostnames: string[];

  /** Ignore script execution */
  noJS?: boolean;

  /** Map path-rules to css files name postfix - wildcard supported */
  css?: { [path: string]: string };

  /** Patch can be applied globally */
  global?: boolean;
}
