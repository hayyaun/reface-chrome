import patches from "../config/patches";
import { useUI } from "../store";

export function useUIActions(patchKey: string) {
  const setConfigModal = useUI((s) => s.setConfigModal);
  const setProfileModal = useUI((s) => s.setProfileModal);

  const hasConfig = !!patches[patchKey].config;
  const hasProfile = !!patches[patchKey].profile;

  const openConfig = () => hasConfig && setConfigModal(patchKey);
  const closeConfig = () => setConfigModal(null);

  const openProfile = () => hasProfile && setProfileModal(patchKey);
  const closeProfile = () => setProfileModal(null);

  return { openConfig, closeConfig, openProfile, closeProfile };
}
