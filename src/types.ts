export interface URLConfig {
  fixes: Fix[];
}

export interface Fix {
  repo: string;
  name: string;
  details: string;
  keywords: string[];
  urls: string[];
}
