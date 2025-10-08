import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chromeStorage } from "./chrome/storage";
import { devItems } from "./config/dev";
import type { HostnameConfig, PatchConfigData } from "./types";

export type Store = {
  // patches
  global: string[];
  addGlobal: (patchKey: string, hostname?: string) => void;
  removeGlobal: (patchKey: string, hostname?: string) => void;
  hostnames: { [hostname: string]: HostnameConfig | undefined };
  _initHostname: (hostname: string) => void;
  _deleteHostname: (hostname: string) => void;
  addPatch: (hostname: string, patchKey: string) => void;
  removePatch: (hostname: string, patchKey: string) => void;
  excludePatch: (hostname: string, patchKey: string) => void;
  includePatch: (hostname: string, patchKey: string) => void;
  config: { [patchKey: string]: PatchConfigData | undefined };
  updateConfig: (patchKey: string, data: PatchConfigData) => void;
  resetConfig: (patchKey: string) => void;
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
};

export const useStore = create(
  persist(
    immer<Store>((set) => ({
      global: [],
      addGlobal: (key, hostname) => {
        set((state) => {
          if (state.global.includes(key)) return;
          state.global.push(key);
        });
        // if current tab specified - include again
        if (hostname) useStore.getState().includePatch(hostname, key);
      },
      removeGlobal: (key, hostname) => {
        set((state) => {
          state.global = state.global.filter((k) => k !== key);
        });
        // if current tab specified - remove patch
        if (hostname) useStore.getState().removePatch(hostname, key);
      },
      hostnames: import.meta.env.DEV ? devItems : {},
      _initHostname: (hostname) => {
        set((state) => {
          if (state.hostnames[hostname]) return;
          state.hostnames[hostname] = { enabled: [], excluded: [] };
        });
      },
      _deleteHostname: (hostname) => {
        // Keeps the storage clean
        set((state) => {
          if (!state.hostnames[hostname]) {
            return delete state.hostnames[hostname];
          }
          if (state.hostnames[hostname].enabled.length) return;
          if (state.hostnames[hostname].excluded.length) return;
          delete state.hostnames[hostname];
        });
      },
      addPatch: (hostname, key) => {
        useStore.getState()._initHostname(hostname);
        set((state) => {
          if (state.hostnames[hostname]!.enabled.includes(key)) return;
          state.hostnames[hostname]!.enabled.push(key);
        });
      },
      removePatch: (hostname, key) => {
        useStore.getState()._initHostname(hostname);
        set((state) => {
          const index = state.hostnames[hostname]!.enabled.indexOf(key);
          if (index !== -1) state.hostnames[hostname]!.enabled.splice(index, 1);
        });
        useStore.getState()._deleteHostname(hostname);
      },
      excludePatch: (hostname, key) => {
        useStore.getState()._initHostname(hostname);
        set((state) => {
          if (state.hostnames[hostname]!.excluded.includes(key)) return;
          state.hostnames[hostname]!.excluded.push(key);
        });
        useStore.getState().removePatch(hostname, key);
      },
      includePatch: (hostname, key) => {
        useStore.getState()._initHostname(hostname);
        set((state) => {
          const index = state.hostnames[hostname]!.excluded.indexOf(key);
          if (index !== -1)
            state.hostnames[hostname]!.excluded.splice(index, 1);
        });
        useStore.getState().addPatch(hostname, key);
      },
      config: {},
      updateConfig: (patchKey, data) => {
        set((state) => {
          state.config[patchKey] = data;
        });
      },
      resetConfig: (patchKey) => {
        set((state) => {
          if (state.config[patchKey]) delete state.config[patchKey];
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
    })),
    {
      name: "main",
      storage: createJSONStorage(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import.meta.env.DEV ? (localStorage as any) : chromeStorage,
      ), // must return sync or async-compatible object
      version: 1,
      // migrate(persistedState, version) {},
    },
  ),
);

export const STORE_KEY = useStore.persist.getOptions().name!;
