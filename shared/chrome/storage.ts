import browser from "webextension-polyfill";

export const chromeLocalStorage = {
  getItem: (key: string) =>
    new Promise<string | null>((resolve) =>
      browser.storage.local
        .get([key])
        .then((result) => resolve((result[key] as never) ?? null)),
    ),
  setItem: (key: string, value: string) =>
    new Promise<void>((resolve) =>
      browser.storage.local.set({ [key]: value }).then(() => resolve()),
    ),
  removeItem: (key: string) =>
    new Promise<void>((resolve) =>
      browser.storage.local.remove([key]).then(() => resolve()),
    ),
};

export const chromeSyncStorage = {
  getItem: (key: string) =>
    new Promise<string | null>((resolve) =>
      browser.storage.sync
        .get([key])
        .then((result) => resolve((result[key] as never) ?? null)),
    ),
  setItem: (key: string, value: string) =>
    new Promise<void>((resolve) =>
      browser.storage.sync.set({ [key]: value }).then(() => resolve()),
    ),
  removeItem: (key: string) =>
    new Promise<void>((resolve) =>
      browser.storage.sync.remove([key]).then(() => resolve()),
    ),
};
