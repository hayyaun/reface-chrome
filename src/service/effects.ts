import { state } from "./state";

export function beforeFadeIn(tabId: number) {
  if (state.prefs.fadeIn) {
    chrome.scripting.insertCSS({
      target: { tabId },
      css: `body { opacity: 0; transition: opacity 0.5s ease; }`,
    });
  }
}

export function afterFadeIn(tabId: number) {
  if (state.prefs.fadeIn) {
    chrome.scripting.insertCSS({
      target: { tabId },
      css: `body { opacity: 1 !important; transition: opacity 0.5s ease; }`,
    });
  }
}
