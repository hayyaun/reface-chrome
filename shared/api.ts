import type { Message } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const api = (typeof chrome !== "undefined" ? chrome : browser) as typeof chrome;

const runtime = {
  sendMessage<R>(msg: Message): Promise<R | undefined> {
    return typeof browser !== "undefined"
      ? browser.runtime.sendMessage(msg)
      : new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve));
  },
  onMessage: {
    addListener: (cb: (msg: Message, sender: browser.runtime.MessageSender) => Promise<any>) =>
      typeof browser !== "undefined"
        ? browser.runtime.onMessage.addListener(cb)
        : chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
            const result = cb(msg, sender);
            if (result instanceof Promise) {
              result.then(sendResponse);
              return true; // keep channel open for async
            } else {
              sendResponse(result);
            }
          }),

    removeListener: (cb: (msg: Message, sender: browser.runtime.MessageSender) => Promise<any>) =>
      typeof browser !== "undefined"
        ? browser.runtime.onMessage.removeListener(cb)
        : chrome.runtime.onMessage.removeListener((msg, sender, sendResponse) => {
            const result = cb(msg, sender);
            if (result instanceof Promise) {
              result.then(sendResponse);
              return true; // keep channel open for async
            } else {
              sendResponse(result);
            }
          }),
  },
};

export default api;
export { runtime };
