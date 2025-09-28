import type { Fix } from "../types";
import { wikipediaCool } from "./wikipedia-cool";

export const fixKeys = {
  wikipediaCool: "wikipedia-cool",
};

const fixes: { [key: string]: Fix } = {
  [fixKeys.wikipediaCool]: wikipediaCool,
};

export default fixes;
