import api from "@/shared/api";

export const chromeLocalStorage = {
  getItem: (key: string) =>
    new Promise<string | null>((resolve) =>
      api.storage.local.get([key]).then((result) => resolve(result[key] ?? null)),
    ),
  setItem: (key: string, value: string) =>
    new Promise<void>((resolve) => api.storage.local.set({ [key]: value }).then(resolve)),
  removeItem: (key: string) =>
    new Promise<void>((resolve) => api.storage.local.remove([key]).then(resolve)),
};

export const chromeSyncStorage = {
  getItem: (key: string) =>
    new Promise<string | null>((resolve) =>
      api.storage.sync.get([key]).then((result) => resolve(result[key] ?? null)),
    ),
  setItem: (key: string, value: string) =>
    new Promise<void>((resolve) => api.storage.sync.set({ [key]: value }).then(resolve)),
  removeItem: (key: string) =>
    new Promise<void>((resolve) => api.storage.sync.remove([key]).then(resolve)),
};
