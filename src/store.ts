import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chromeStorage } from "./chrome/storage";
import { devUrls } from "./config/dev";
import type { URLConfig } from "./types";

export type Store = {
  urls: { [url: string]: URLConfig };
  addPatch: (hostname: string, patchKey: string) => void;
  removePatch: (hostname: string, patchKey: string) => void;
};

export const useStore = create(
  persist(
    immer<Store>((set) => ({
      urls: import.meta.env.DEV ? devUrls : {},
      addPatch: (hostname, patchKey) => {
        set((state) => {
          const url = state.urls[hostname];
          if (!url) state.urls[hostname] = { enabled: [] };
          if (state.urls[hostname].enabled.includes(patchKey)) return;
          state.urls[hostname].enabled.push(patchKey);
        });
      },
      removePatch: (hostname, patchKey) => {
        set((state) => {
          const url = state.urls[hostname];
          if (!url) state.urls[hostname] = { enabled: [] };
          const index = state.urls[hostname].enabled.indexOf(patchKey);
          if (index !== -1) state.urls[hostname].enabled.splice(index, 1);
        });
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
