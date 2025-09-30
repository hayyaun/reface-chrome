import type { Patch } from "../types";
import { categories } from "./mapping";

const patches: { [key: string]: Patch } = {
  "wikipedia-cool": {
    name: "Cool Wikipedia",
    details: "Removes irrelavant notices and popups from Wikipedia",
    keywords: [categories.ads, "wikipedia", "cool"],
    urls: ["wikipedia.org"],
  },
  "read-time": {
    name: "Read Time",
    details: "Adds minutes read time to Articles",
    keywords: [categories.feature, "time", "read", "wikipedia"],
    urls: ["wikipedia.org"],
  },
};

export default patches;
