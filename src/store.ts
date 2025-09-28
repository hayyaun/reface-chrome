import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { chromeStorage } from "./chrome";
import type { URLConfig } from "./types";

type Store = {
  urls: { [url: string]: URLConfig };
  updateURL: (url: string, config: URLConfig) => void;
};

export const useStore = create(
  persist<Store>(
    (set) => ({
      urls: {},
      updateURL: (url, config) => {
        set((state) => ({ urls: { ...state.urls, [url]: config } }));
      },
      // TODO addURLFix
      // TODO removeURLFix
      // TODO ...
    }),
    {
      name: "better-ext",
      storage: createJSONStorage(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import.meta.env.DEV ? (localStorage as any) : chromeStorage,
      ), // must return sync or async-compatible object
    },
  ),
);
