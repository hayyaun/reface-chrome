import type { StateStorage } from "zustand/middleware";
import api from "../api";

// DO NOT IM

export const chromeLocalStorage: StateStorage = {
  getItem: (key: string) => api.storage.local.get([key]).then((result) => result[key]),
  setItem: (key: string, value: string) =>
    typeof browser !== "undefined"
      ? browser.storage.local.set({ [key]: value })
      : new Promise<void>((resolve) => chrome.storage.local.set({ [key]: value }, resolve)),
  removeItem: (key: string) =>
    typeof browser !== "undefined"
      ? browser.storage.local.remove([key])
      : new Promise<void>((resolve) => chrome.storage.local.remove([key], resolve)),
};

export const chromeSyncStorage: StateStorage = {
  getItem: (key: string) => api.storage.sync.get([key]).then((result) => result[key]),
  setItem: (key: string, value: string) =>
    typeof browser !== "undefined"
      ? browser.storage.sync.set({ [key]: value })
      : new Promise<void>((resolve) => chrome.storage.sync.set({ [key]: value }, resolve)),
  removeItem: (key: string) =>
    typeof browser !== "undefined"
      ? browser.storage.sync.remove([key])
      : new Promise<void>((resolve) => chrome.storage.sync.remove([key], resolve)),
};
