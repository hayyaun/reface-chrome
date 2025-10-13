import { useUI } from "../store";

export function useUIActions(patchKey: string) {
  const setConfigModal = useUI((s) => s.setConfigModal);
  const setProfileModal = useUI((s) => s.setProfileModal);

  const openConfig = () => setConfigModal(patchKey);
  const closeConfig = () => setConfigModal(null);

  const openProfile = () => setProfileModal(patchKey);
  const closeProfile = () => setProfileModal(null);

  return { openConfig, closeConfig, openProfile, closeProfile };
}
