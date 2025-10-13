import {
  RiBookOpenFill,
  RiExternalLinkFill,
  RiFocusLine,
  RiGithubLine,
  RiMessageFill,
  RiRobot2Fill,
  RiSpeedUpFill,
} from "react-icons/ri";
import Samantha from "../profiles/Samantha";
import type { HostnameConfig, Patch } from "../types";
import authors from "./authors";
import { categories } from "./mapping";

const patches: { [key: string]: Patch } = {
  // General
  samantha: {
    name: "Ask Samantha",
    details: "Your all-in-one ai assistant!",
    keywords: [categories.mix, "ai"],
    hostnames: ["*"],
    global: true,
    noJS: true,
    logo: RiRobot2Fill,
    profile: {
      icon: RiMessageFill,
      title: "Chat",
      Component: Samantha,
    },
    config: {
      apiKey: {
        name: "API Key",
        defaultValue: "",
        details: "Your OpenAI api key",
      },
      thinkingDepth: {
        name: "Thinking depth",
        defaultValue: 5,
        details:
          "The amount of time and effort to put on deep searching and thinking through the document. (Maximum depth: 15)",
      },
      temperature: {
        name: "Temperature",
        defaultValue: 1.0,
        details: "Randomness of the ai model. (Between: 0-2)",
      },
      model: {
        name: "Model",
        defaultValue: "gpt-5-mini",
        details: "The ai model to use",
        options: [
          "gpt-5",
          "gpt-5-mini",
          "gpt-4o",
          "gpt-4o-mini",
          "gpt-4",
          "gpt-3.5-turbo",
        ],
      },
    },
  },
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
    author: authors[1],
    name: "Github Stats",
    details: "Display github statistics for each repo link",
    keywords: [categories.feature],
    hostnames: ["*"],
    css: { "/*": "main" },
    global: true,
    logo: RiGithubLine,
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
  [...new Set(Object.values(patches).flatMap((patch) => patch.hostnames))].map(
    (hn) => [hn || "*", { enabled: [], excluded: [] }],
  ),
) as { [hostname: string]: HostnameConfig };
