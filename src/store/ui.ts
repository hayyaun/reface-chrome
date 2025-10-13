import { create } from "zustand";

interface UI {
  configModal: string | null; // patchKey
  setConfigModal: (patchKey: string | null) => void;
  profileModal: string | null; // patchKey
  setProfileModal: (patchKey: string | null) => void;
}

export const useUI = create<UI>((set) => ({
  configModal: null,
  setConfigModal: (configModal) => set({ configModal }),
  profileModal: null,
  setProfileModal: (profileModal) => set({ profileModal }),
}));
