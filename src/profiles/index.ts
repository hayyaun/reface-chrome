import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  RiBookOpenFill,
  RiEraserLine,
  RiExternalLinkFill,
  RiFocusLine,
  RiGithubLine,
  RiRobot2Fill,
  RiSpeedUpFill,
} from "react-icons/ri";
import type { ModalProps } from "../../shared/types";
import SamanthaIcon from "../components/SamanthaIcon";
import MagicEraser from "./MagicEraser";
import Samantha from "./Samantha";

interface Profile {
  /** Logo file location */
  logo?: IconType | string;

  /** Popup menu profile page modal
   * @see config for retrieving params and variables
   */
  modal?: {
    icon: IconType;
    title: string;
    Component: (props: ModalProps) => ReactNode;
  };
}

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
