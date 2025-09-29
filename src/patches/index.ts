import type { Patch } from "../types";
import { readTime } from "./read-time";
import { wikipediaCool } from "./wikipedia-cool";

export const patchKeys = {
  wikipediaCool: "wikipedia-cool",
  readTime: "read-time",
};

const patches: { [key: string]: Patch } = {
  [patchKeys.wikipediaCool]: wikipediaCool,
  [patchKeys.readTime]: readTime,
};

export default patches;
