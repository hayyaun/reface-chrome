import type { IconType } from "react-icons";
import {
  RiPaletteLine,
  RiProhibitedLine,
  RiPuzzleLine,
  RiShiningLine,
  RiToolsLine,
} from "react-icons/ri";

export const categories = {
  all: "all",
  ads: "ads",
  theme: "theme",
  fix: "fix",
  feature: "feature",
  mix: "mix",
} satisfies { [key: string]: string };

export const icons = {
  [categories.ads]: RiProhibitedLine,
  [categories.theme]: RiPaletteLine,
  [categories.fix]: RiToolsLine,
  [categories.feature]: RiPuzzleLine,
  [categories.mix]: RiShiningLine,
} satisfies { [key: string]: IconType };
