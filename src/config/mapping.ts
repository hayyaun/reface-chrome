import type { IconType } from "react-icons";
import {
  RiPaletteLine,
  RiProhibitedLine,
  RiPuzzleLine,
  RiShiningLine,
  RiToolsLine,
} from "react-icons/ri";

export const categories: { [key: string]: string } = {
  all: "all",
  ads: "ads",
  theme: "theme",
  fix: "fix",
  feature: "feature",
  mix: "mix",
};

export const icons: { [key: string]: IconType } = {
  [categories.ads]: RiProhibitedLine,
  [categories.theme]: RiPaletteLine,
  [categories.fix]: RiToolsLine,
  [categories.feature]: RiPuzzleLine,
  [categories.mix]: RiShiningLine,
};
