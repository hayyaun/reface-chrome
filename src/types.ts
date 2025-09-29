export interface URLConfig {
  enabled: string[];
}

/**
 * Represents a fix or patch that can be applied to a web page or system.
 */
export interface Fix {
  /**
   * The main function that applies the fix.
   *
   * ⚠️ Must be self-contained since injected.
   */
  func: () => void;

  /** A short, descriptive name for the fix */
  name: string;

  /** Detailed description of what the fix does */
  details: string;

  /** Keywords for categorizing or searching for this fix */
  keywords: string[];

  /** List of URLs where this fix is applicable */
  urls: string[];
}
