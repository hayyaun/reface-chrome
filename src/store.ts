import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chromeStorage } from "./chrome/storage";
import { reloadActiveTab } from "./chrome/utils";
import type { URLConfig } from "./types";

export type Store = {
  urls: { [url: string]: URLConfig };
  addURLFix: (hostname: string, fixKey: string) => void;
  removeURLFix: (hostname: string, fixKey: string) => void;
};

export const useStore = create(
  persist(
    immer<Store>((set) => ({
      urls: {},
      addURLFix: (hostname, fixKey) => {
        set((state) => {
          const url = state.urls[hostname];
          if (!url) state.urls[hostname] = { enabled: [] };
          if (state.urls[hostname].enabled.includes(fixKey)) return;
          state.urls[hostname].enabled.push(fixKey);
        });
        setTimeout(reloadActiveTab, 1000);
      },
      removeURLFix: (hostname, fixKey) => {
        set((state) => {
          const url = state.urls[hostname];
          if (!url) state.urls[hostname] = { enabled: [] };
          const index = state.urls[hostname].enabled.indexOf(fixKey);
          if (index !== -1) state.urls[hostname].enabled.splice(index, 1);
        });
        setTimeout(reloadActiveTab, 1000);
      },
    })),
    {
      name: "main",
      storage: createJSONStorage(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import.meta.env.DEV ? (localStorage as any) : chromeStorage,
      ), // must return sync or async-compatible object
    },
  ),
);
