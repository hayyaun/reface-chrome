export const chromeLocalStorage = {
  getItem: (key: string) =>
    new Promise<string | null>((resolve) => chrome.storage.local.get([key], (result) => resolve(result[key] ?? null))),
  setItem: (key: string, value: string) =>
    new Promise<void>((resolve) => chrome.storage.local.set({ [key]: value }, () => resolve())),
  removeItem: (key: string) => new Promise<void>((resolve) => chrome.storage.local.remove([key], () => resolve())),
};

export const chromeSyncStorage = {
  getItem: (key: string) =>
    new Promise<string | null>((resolve) => chrome.storage.sync.get([key], (result) => resolve(result[key] ?? null))),
  setItem: (key: string, value: string) =>
    new Promise<void>((resolve) => chrome.storage.sync.set({ [key]: value }, () => resolve())),
  removeItem: (key: string) => new Promise<void>((resolve) => chrome.storage.sync.remove([key], () => resolve())),
};
