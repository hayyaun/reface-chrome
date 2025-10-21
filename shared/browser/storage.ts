import api from "@/shared/api";
import type { StateStorage } from "zustand/middleware";

export const chromeLocalStorage: StateStorage = {
  getItem: (key: string) =>
    typeof api === typeof browser
      ? browser.storage.local.get([key]).then((result) => result[key])
      : new Promise<string | null>((resolve) =>
          chrome.storage.local.get([key], (result) => resolve(result[key])),
        ),
  setItem: (key: string, value: string) =>
    typeof api === typeof browser
      ? browser.storage.local.set({ [key]: value })
      : new Promise<void>((resolve) => chrome.storage.local.set({ [key]: value }, resolve)),
  removeItem: (key: string) =>
    typeof api === typeof browser
      ? browser.storage.local.remove([key])
      : new Promise<void>((resolve) => chrome.storage.local.remove([key], resolve)),
};

export const chromeSyncStorage: StateStorage = {
  getItem: (key: string) =>
    typeof api === typeof browser
      ? browser.storage.sync.get([key]).then((result) => result[key])
      : new Promise<string | null>((resolve) =>
          chrome.storage.sync.get([key]).then((result) => resolve(result[key])),
        ),
  setItem: (key: string, value: string) =>
    typeof api === typeof browser
      ? api.storage.sync.set({ [key]: value })
      : new Promise<void>((resolve) => api.storage.sync.set({ [key]: value }, resolve)),
  removeItem: (key: string) =>
    typeof api === typeof browser
      ? api.storage.sync.remove([key])
      : new Promise<void>((resolve) => api.storage.sync.remove([key], resolve)),
};
