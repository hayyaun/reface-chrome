export const chromeStorage = {
  getItem: (key: string) =>
    new Promise<string | null>((resolve) =>
      chrome.storage.local.get([key], (result) => resolve(result[key] ?? null)),
    ),
  setItem: (key: string, value: string) =>
    new Promise<void>((resolve) =>
      chrome.storage.local.set({ [key]: value }, () => resolve()),
    ),
  removeItem: (key: string) =>
    new Promise<void>((resolve) =>
      chrome.storage.local.remove([key], () => resolve()),
    ),
};
