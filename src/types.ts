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

  /** List of hostnames where this patch is applicable */
  hostnames: string[];

  /**
   * List of pathnames where this patch is applicable
   *
   * use * for wildcard except the path would be treated as exact */
  paths?: string[];

  /** css mode */
  css?: "only" | "add";
}
