import {
  RiBookOpenFill,
  RiExternalLinkFill,
  RiFocusLine,
  RiGithubLine,
  RiSpeedUpFill,
} from "react-icons/ri";
import type { HostnameConfig, Patch } from "../types";
import { categories } from "./mapping";

const patches: { [key: string]: Patch } = {
  // Wikipedia.org
  "wikipedia-focus": {
    name: "Wikipedia Focus",
    details: "Removes irrelavant notices and popups from Wikipedia",
    keywords: [categories.ads, "wikipedia", "focus"],
    hostnames: ["*wikipedia.org"],
    logo: RiFocusLine,
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
    logo: RiBookOpenFill,
    color: "#82d7ff",
  },
  "show-fps": {
    name: "Show FPS",
    details: "Indicate fps for all websites",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
    global: true,
    logo: RiSpeedUpFill,
    color: "#ff9675",
  },
  "link-preview": {
    name: "Link Preview",
    details: "Previews links before opening them",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
    global: true,
    logo: RiExternalLinkFill,
    color: "#b999ff",
  },
  "github-stats": {
    name: "Github Stats",
    details: "Display github statistics for each repo link",
    keywords: [categories.feature],
    hostnames: ["*"],
    global: true,
    logo: RiGithubLine,
    color: "#b3c9e6",
    config: {
      token: {
        name: "Github Access Token",
        details: "Access token ensures that you won't hit rate-limit.",
        defaultValue: "",
      },
      stars: {
        name: "Show Stars",
        details: "Display the number of stars for the link to the repo",
        defaultValue: true,
      },
      forks: {
        name: "Show Forks",
        details: "Display the number of forks for the link to the repo",
        defaultValue: false,
      },
    },
  },
};

export default patches;

export const hostnames = Object.fromEntries(
  [...new Set(Object.values(patches).flatMap((patch) => patch.hostnames))].map(
    (hn) => [hn || "*", { enabled: [], excluded: [] }],
  ),
) as { [hostname: string]: HostnameConfig };
