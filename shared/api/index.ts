import type { ExtractReturnType, Message } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const _api = typeof chrome !== "undefined" ? chrome : browser;

/**
 * Tiny polyfill implementaion to reduce bundle size (only needed functionalities included)
 * @summary please avoid adding excessive methods
 */
const api = {
  ..._api,
  runtime: {
    ..._api.runtime,
    sendMessage<T extends Message>(msg: T) {
      return (
        typeof browser !== "undefined"
          ? browser.runtime.sendMessage(msg)
          : new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve))
      ) as ExtractReturnType<T>;
    },
    onMessage: {
      ..._api.runtime.onMessage,
      addListener(cb: <T extends Message>(msg: T) => ExtractReturnType<T>) {
        return typeof browser !== "undefined"
          ? browser.runtime.onMessage.addListener(cb)
          : chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
              const result = cb(msg);
              result.then((value) => {
                if (value !== null) sendResponse(value);
              });
              return true; // keep channel open for async
            });
      },
      removeListener(cb: <T extends Message>(msg: T) => ExtractReturnType<T>) {
        return typeof browser !== "undefined"
          ? browser.runtime.onMessage.removeListener(cb)
          : chrome.runtime.onMessage.removeListener((msg, _sender, sendResponse) => {
              const result = cb(msg);
              result.then((value) => {
                if (value !== null) sendResponse(value);
              });
              return true; // keep channel open for async
            });
      },
    },
  },
  storage: {
    ..._api.storage,
    local: {
      ..._api.storage.local,
      get:
        typeof browser !== "undefined"
          ? browser.storage.local.get
          : (keys: Parameters<typeof browser.storage.local.get>[0]) =>
              new Promise<Awaited<ReturnType<typeof browser.storage.local.get>>>((resolve) =>
                chrome.storage.local.get(keys as any, resolve),
              ),
    },
    sync: {
      ..._api.storage.sync,
      get:
        typeof browser !== "undefined"
          ? browser.storage.sync.get
          : (keys: Parameters<typeof browser.storage.sync.get>[0]) =>
              new Promise<Awaited<ReturnType<typeof browser.storage.sync.get>>>((resolve) =>
                chrome.storage.local.get(keys as any, resolve),
              ),
    },
  },
  tabs: {
    ..._api.tabs,
    get:
      typeof browser !== "undefined"
        ? browser.tabs.get
        : (tabId: number) =>
            new Promise<browser.tabs.Tab>((resolve) => chrome.tabs.get(tabId, resolve)),
  },
  scripting: {
    ..._api.scripting,
    executeScript(injection: chrome.scripting.ScriptInjection<any[], any>) {
      return typeof browser !== "undefined"
        ? browser.scripting.executeScript(injection) // FIXME return keyword is not supported on firefox?
        : chrome.scripting.executeScript(injection);
    },
  },
};

export default api;

export type Tab = browser.tabs.Tab;
