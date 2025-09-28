export interface URLConfig {
  enabled: string[];
}

export interface Fix {
  // repo: string;
  func: () => void;
  name: string;
  details: string;
  keywords: string[];
  urls: string[];
}
