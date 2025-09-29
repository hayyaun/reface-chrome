import type { Patch } from "../types";

const patches: { [key: string]: Patch } = {
  "wikipedia-cool": {
    name: "Cool Wikipedia",
    details: "Removes irrelavant notices and popups from Wikipedia",
    keywords: ["wikipedia", "cool"],
    urls: ["wikipedia.org"],
  },
  "read-time": {
    name: "Read Time",
    details: "Adds minutes read time to Articles",
    keywords: ["time", "read", "wikipedia"],
    urls: ["wikipedia.org"],
  },
};

export default patches;
