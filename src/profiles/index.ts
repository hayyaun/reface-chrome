import { lazy } from "react";
import {
  RiBookOpenFill,
  RiEraserLine,
  RiExternalLinkFill,
  RiFocusLine,
  RiGithubLine,
  RiRobot2Fill,
  RiSpeedUpFill,
} from "react-icons/ri";
import type { Profile } from "../types";

// lazy components

const Samantha = lazy(() => import("./Samantha"));
const SamanthaIcon = lazy(() => import("../components/SamanthaIcon"));
const MagicEraser = lazy(() => import("./MagicEraser"));

const profiles: { [k: string]: Profile } = {
  // General
  samantha: {
    modal: {
      Component: Samantha,
      icon: SamanthaIcon,
      title: "Chat",
    },
    logo: RiRobot2Fill,
  },
  "magic-eraser": {
    logo: RiEraserLine,
    modal: {
      Component: MagicEraser,
      icon: RiFocusLine,
      title: "Magic Eraser",
    },
  },
  "read-time": {
    logo: RiBookOpenFill,
  },
  "show-fps": {
    logo: RiSpeedUpFill,
  },
  "link-preview": {
    logo: RiExternalLinkFill,
  },
  "github-stats": {
    logo: RiGithubLine,
  },
  // Wikipedia.org
  "wikipedia-focus": {
    logo: RiFocusLine,
  },
};

export default profiles;
