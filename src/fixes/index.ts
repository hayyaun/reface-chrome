import type { Fix } from "../types";
import { wikipediaCool } from "./wikipedia-cool";

const fixes: { [key: string]: Fix } = {
  "wikipedia-cool": wikipediaCool,
};

export default fixes;
