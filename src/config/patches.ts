import type { HostnameConfig, Patch } from "../types";
import { categories } from "./mapping";

const patches: { [key: string]: Patch } = {
  // Wikipedia.org
  "wikipedia-focus": {
    name: "Wikipedia Focus",
    details: "Removes irrelavant notices and popups from Wikipedia",
    keywords: [categories.ads, "wikipedia", "focus"],
    hostnames: ["*wikipedia.org"],
    logo: "images/wikipedia-focus.svg",
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
    name: "ArXiv Lovely Theme",
    details: "Lovely theme for ArXiv homepage",
    keywords: [categories.theme],
    hostnames: ["arxiv.org", "www.arxiv.org"],
    css: { "/": "home", "/search/*": "search" },
    noJS: true,
    color: "#ff87a5",
  },
  // General
  "read-time": {
    name: "Reading Time",
    details: "Adds minutes read time to Articles",
    keywords: [categories.feature, "time", "read", "wikipedia"],
    hostnames: ["*wikipedia.org"],
    global: true,
    logo: "images/read-time.svg",
  },
  "show-fps": {
    name: "Show FPS",
    details: "Indicate fps for all websites",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
    global: true,
    logo: "images/show-fps.svg",
  },
  "link-preview": {
    name: "Link Preview",
    details: "Previews links before opening them",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
    global: true,
    logo: "images/link-preview.svg",
  },
};

export default patches;

export const hostnames = Object.fromEntries(
  [...new Set(Object.values(patches).flatMap((patch) => patch.hostnames))].map(
    (hn) => [hn || "*", { enabled: [], excluded: [] }],
  ),
) as { [hostname: string]: HostnameConfig };
