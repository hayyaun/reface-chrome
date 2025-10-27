import authors from "./authors";
import { PRIMARY_COLOR_DARK } from "./constants";
import { categories } from "./mapping";
import type { HostnameConfig, Patch } from "./types";

const patches: { [key: string]: Patch } = {
  // General
  samantha: {
    name: "Ask Samantha",
    details: "Your all-in-one ai assistant!",
    keywords: [categories.mix, "ai"],
    hostnames: ["*"],
    global: true,
    noJS: true,
    color: "yellow",
    bgcolor: PRIMARY_COLOR_DARK,
    config: {
      model: {
        name: "Model",
        defaultValue: "gpt-5",
        details: "The ai model to use",
        options: [
          { name: "GPT 5", value: "gpt-5" },
          { name: "GPT 5 mini", value: "gpt-5-mini" },
          { name: "GPT 4", value: "gpt-4o" },
          { name: "GPT 4o mini", value: "gpt-4o-mini" },
          { name: "GPT 4", value: "gpt-4" },
          { name: "GPT 3.5 turbo", value: "gpt-3.5-turbo" },
        ],
      },
      apiKey: {
        name: "API Key",
        defaultValue: "",
        details: "Your OpenAI api key",
      },
      temperature: {
        name: "Temperature",
        defaultValue: 1.0,
        details: "Randomness of the ai model. (Between: 0-2)",
      },
    },
  },
  "github-stats": {
    author: authors[1],
    name: "Github Stats",
    details: "Display github statistics for each repo link",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
    global: true,
    color: "#80b7ff",
    config: {
      token: {
        name: "Github Access Token",
        details: "Access token ensures that you won't hit rate-limit.",
        defaultValue: "",
      },
      stars: {
        name: "Stars Count",
        details: "Display the number of stars for the link to the repo",
        defaultValue: true,
      },
      forks: {
        name: "Forks Count",
        details: "Display the number of forks for the link to the repo",
        defaultValue: false,
      },
      watchers: {
        name: "Watchers Count",
        details: "Display the number of watchers for the link to the repo",
        defaultValue: false,
      },
      threshold: {
        name: "Threshold",
        details: "Highlight stats if stars are more than a certain number",
        defaultValue: 1_000,
      },
    },
  },
  whiteboard: {
    author: authors[0],
    name: "Whiteboard",
    details: "Creates a scrollable canvas to draw on, on any page",
    keywords: [categories.feature, "draw", "whiteboard"],
    hostnames: ["*"],
    global: true,
    color: "#80ff95",
    css: { "/*": "main" },
    config: {
      persist: {
        name: "Auto Save",
        details: "Persistent over reloads",
        defaultValue: true,
      },
      scale: {
        name: "Resolution",
        details: "Higher resolution leads to better quality but more lags on older systems",
        defaultValue: 0.5,
        options: [
          { name: "Lowest", value: 0.25 },
          { name: "Low", value: 0.5 },
          { name: "Medium", value: 1 },
          { name: "High", value: 2 },
          { name: "Highest", value: 3 },
        ],
      },
      mode: {
        name: "Mode",
        details: "Initial mode when page loads",
        defaultValue: "draw",
        options: [
          { name: "Normal", value: "work" },
          { name: "Draw", value: "draw" },
          { name: "Type", value: "type" },
        ],
      },
      "font-family": {
        name: "Font Family",
        details: "Default font fammily for typing mode",
        defaultValue: "Roboto, sans-serif",
        options: [
          { name: "Roboto", value: "Roboto, sans-serif" },
          { name: "Arial", value: "Arial, sans-serif" },
          { name: "Helvetica", value: "Helvetica, sans-serif" },
          { name: "Times New Roman", value: "'Times New Roman', serif" },
          { name: "Georgia", value: "Georgia, serif" },
          { name: "Courier New", value: "'Courier New', monospace" },
          { name: "Verdana", value: "Verdana, sans-serif" },
          { name: "Tahoma", value: "Tahoma, sans-serif" },
          { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
          { name: "Impact", value: "Impact, sans-serif" },
        ],
      },
      "font-size": {
        name: "Font Size",
        details: "Default font size for type mode",
        defaultValue: 48,
        hidden: true,
      },
      thickness: {
        name: "Thickness",
        details: "Default thickness for draw/erase mode",
        defaultValue: 6,
        hidden: true,
      },
    },
  },
  "magic-eraser": {
    name: "Magic Eraser",
    details: "Remove elements you hate from a website",
    keywords: [categories.feature, "eraser"],
    hostnames: ["*"],
    global: false,
    color: "#ff8095",
  },
  "read-time": {
    name: "Reading Time",
    details: "Adds minutes read time to Articles",
    keywords: [categories.feature, "time", "read", "wikipedia"],
    hostnames: ["*wikipedia.org"],
    global: true,
    color: "#82d7ff",
  },
  "show-fps": {
    name: "Show FPS",
    details: "Indicate fps for all websites",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
    global: true,
    color: "#ff9675",
  },
  "link-preview": {
    name: "Link Preview",
    details: "Previews links before opening them",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
    global: true,
    color: "#b999ff",
  },
  // Wikipedia.org
  "wikipedia-focus": {
    name: "Wikipedia Focus",
    details: "Removes irrelavant notices and popups from Wikipedia",
    keywords: [categories.ads, "wikipedia", "focus"],
    hostnames: ["*wikipedia.org"],
    color: "#ffdb70",
    config: {
      "remove-donation": {
        name: "Remove donation",
        details: "Hides all donation popups and buttons",
        defaultValue: true,
      },
    },
  },
  "wikipedia-borderless": {
    name: "Wikipedia Borderless",
    details: "Remove annoying borders from figures and tables",
    keywords: [categories.theme],
    hostnames: ["*wikipedia.org"],
    color: "#b5ff70",
  },
  // ArXiv.org
  "arxiv-lovely": {
    author: authors[0],
    name: "ArXiv Lovely Theme",
    details: "Lovely theme for ArXiv homepage",
    keywords: [categories.theme],
    hostnames: ["arxiv.org", "www.arxiv.org"],
    css: { "/": "home", "/search/*": "search" },
    noJS: true,
    color: "#ff87a5",
  },
};

export default patches;

export const hostnames = Object.fromEntries(
  [...new Set(Object.values(patches).flatMap((patch) => patch.hostnames))].map((hn) => [
    hn || "*",
    { enabled: [], excluded: [] },
  ]),
) as { [hostname: string]: HostnameConfig };
