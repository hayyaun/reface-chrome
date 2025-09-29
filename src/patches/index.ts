import type { Patch } from "../types";
import { wikipediaCool } from "./wikipedia-cool";

export const patchKeys = {
  wikipediaCool: "wikipedia-cool",
};

const patches: { [key: string]: Patch } = {
  [patchKeys.wikipediaCool]: wikipediaCool,
};

export default patches;
