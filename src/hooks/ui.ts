import patches from "@/shared/patches";
import { useUI } from "@/shared/store";
import type React from "react";
import profiles from "../profiles";

export function useUIActions(patchKey: string) {
  const setConfigModal = useUI((s) => s.setConfigModal);
  const setProfileModal = useUI((s) => s.setProfileModal);

  const hasConfig = !!patches[patchKey]?.config;
  const hasModal = !!profiles[patchKey]?.modal;

  const openConfig = (ev?: React.MouseEvent) => {
    ev?.stopPropagation();
    if (hasConfig) setConfigModal(patchKey);
  };
  const closeConfig = () => setConfigModal(null);

  const openProfile = (ev?: React.MouseEvent) => {
    ev?.stopPropagation();
    if (hasModal) setProfileModal(patchKey);
  };
  const closeProfile = () => setProfileModal(null);

  return { openConfig, closeConfig, openProfile, closeProfile };
}
