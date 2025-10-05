import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chromeStorage } from "./chrome/storage";
import { devItems } from "./config/dev";
import type { HostnameConfig } from "./types";

export type Store = {
  hostnames: { [hostname: string]: HostnameConfig };
  addPatch: (hostname: string, patchKey: string) => void;
  removePatch: (hostname: string, patchKey: string) => void;
  // options
  fadeIn: boolean;
  setFadeIn: (v: boolean) => void;
  showBadge: boolean;
  setShowBadge: (v: boolean) => void;
  autoReload: boolean;
  setAutoReload: (v: boolean) => void;
  recommend: boolean;
  setRecommend: (v: boolean) => void;
  ads: boolean;
  setAds: (v: boolean) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  global: string[];
  addGlobal: (key: string) => void;
  removeGlobal: (key: string) => void;
};

export const useStore = create(
  persist(
    immer<Store>((set) => ({
      hostnames: import.meta.env.DEV ? devItems : {},
      addPatch: (hostname, patchKey) => {
        set((state) => {
          const config = state.hostnames[hostname];
          if (!config) state.hostnames[hostname] = { enabled: [] };
          if (state.hostnames[hostname].enabled.includes(patchKey)) return;
          state.hostnames[hostname].enabled.push(patchKey);
        });
      },
      removePatch: (hostname, patchKey) => {
        set((state) => {
          const config = state.hostnames[hostname];
          if (!config) state.hostnames[hostname] = { enabled: [] };
          const index = state.hostnames[hostname].enabled.indexOf(patchKey);
          if (index !== -1) state.hostnames[hostname].enabled.splice(index, 1);
        });
      },
      // options
      fadeIn: true,
      setFadeIn: (fadeIn) => set({ fadeIn }),
      showBadge: true,
      setShowBadge: (showBadge) => set({ showBadge }),
      autoReload: true,
      setAutoReload: (autoReload) => set({ autoReload }),
      recommend: false,
      setRecommend: (recommend) => set({ recommend }),
      ads: false,
      setAds: (ads) => set({ ads }),
      dark: false,
      setDark: (dark) => set({ dark }),
      global: [],
      addGlobal: (key) => {
        set((state) => {
          if (state.global.includes(key)) return;
          state.global.push(key);
        });
      },
      removeGlobal: (key) => {
        set((state) => {
          state.global = state.global.filter((k) => k !== key);
        });
      },
    })),
    {
      name: "main",
      storage: createJSONStorage(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import.meta.env.DEV ? (localStorage as any) : chromeStorage,
      ), // must return sync or async-compatible object
      version: 1,
      // TODO migrate(persistedState, version) {},
    },
  ),
);
