import type { HostnameConfig, Patch } from "../types";
import { categories } from "./mapping";

const patches: { [key: string]: Patch } = {
  // Wikipedia.org
  "wikipedia-focus": {
    name: "Wikipedia Focus",
    details: "Removes irrelavant notices and popups from Wikipedia",
    keywords: [categories.ads, "wikipedia", "focus"],
    hostnames: ["*wikipedia.org"],
  },
  "wikipedia-borderless": {
    name: "Wikipedia Borderless",
    details: "Remove annoying borders from figures and tables",
    keywords: [categories.theme],
    hostnames: ["*wikipedia.org"],
  },
  // ArXiv.org
  "arxiv-lovely": {
    name: "ArXiv Lovely Theme",
    details: "Lovely theme for ArXiv homepage",
    keywords: [categories.theme],
    hostnames: ["arxiv.org"],
    css: { "/": "home" },
    noJS: true,
  },
  // General
  "read-time": {
    name: "Reading Time",
    details: "Adds minutes read time to Articles",
    keywords: [categories.feature, "time", "read", "wikipedia"],
    hostnames: ["*wikipedia.org"], // TODO add more support
  },
  "show-fps": {
    name: "Show FPS",
    details: "Indicate fps for all websites",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
  },
  "link-preview": {
    name: "Link Preview",
    details: "Previews links before opening them",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
  },
};

export default patches;

export const hostnames = Object.fromEntries(
  [...new Set(Object.values(patches).flatMap((patch) => patch.hostnames))].map(
    (hn) => [hn || "*", { enabled: [] }],
  ),
) as { [hostname: string]: HostnameConfig };
