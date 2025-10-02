import type { Patch } from "../types";
import { categories } from "./mapping";

const patches: { [key: string]: Patch } = {
  // General
  "read-time": {
    name: "Reading Time",
    details: "Adds minutes read time to Articles",
    keywords: [categories.feature, "time", "read", "wikipedia"],
    urls: ["wikipedia.org"],
  },
  // Wikipedia.org
  "wikipedia-focus": {
    name: "Wikipedia Focus",
    details: "Removes irrelavant notices and popups from Wikipedia",
    keywords: [categories.ads, "wikipedia", "cool"],
    urls: ["wikipedia.org"],
  },
  "wikipedia-borderless": {
    name: "Wikipedia Borderless",
    details: "Remove annoying borders from figures and tables",
    keywords: [categories.theme],
    urls: ["wikipedia.org"],
  },
};

export default patches;
