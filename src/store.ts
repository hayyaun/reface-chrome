import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { URLConfig } from "./types";

const chromeStorage = {
  getItem: (key: string) =>
    new Promise<string | null>((resolve) =>
      chrome.storage.local.get([key], (result) => resolve(result[key] ?? null))
    ),
  setItem: (key: string, value: string) =>
    new Promise<void>((resolve) =>
      chrome.storage.local.set({ [key]: value }, () => resolve())
    ),
  removeItem: (key: string) =>
    new Promise<void>((resolve) =>
      chrome.storage.local.remove([key], () => resolve())
    ),
};

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
    }),
    {
      name: "better-ext",
      storage: createJSONStorage(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import.meta.env.DEV ? (localStorage as any) : chromeStorage
      ), // must return sync or async-compatible object
    }
  )
);
