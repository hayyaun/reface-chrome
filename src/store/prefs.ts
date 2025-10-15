import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chromeSyncStorage } from "../chrome/storage";

export const PREFS_KEY = "prefs";

interface Prefs {
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
  sync: boolean;
  setSync: (v: boolean) => void;
}

export const usePrefs = create(
  persist(
    immer<Prefs>((set) => ({
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
      sync: true,
      setSync: (sync) => set({ sync }),
    })),
    {
      name: PREFS_KEY,
      storage: createJSONStorage(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import.meta.env.DEV ? (localStorage as any) : chromeSyncStorage,
      ), // must return sync or async-compatible object
      version: 1,
      // migrate(persistedState, version) {},
    },
  ),
);
