export interface URLConfig {
  enabled: string[];
}

/**
 * Represents a patch or patch that can be applied to a web page or system.
 */
export interface Patch {
  /**
   * The main function that applies the patch.
   *
   * ⚠️ Must be self-contained since injected.
   */
  // func: () => void;

  /** A short, descriptive name for the patch */
  name: string;

  /** Detailed description of what the patch does */
  details: string;

  /** Keywords for categorizing or searching for this patch */
  keywords: string[];

  /** List of URLs where this patch is applicable */
  urls: string[];
}
