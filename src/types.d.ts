import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import type { ModalProps } from "@/shared/types";

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
