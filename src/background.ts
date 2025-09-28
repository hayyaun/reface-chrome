import fixes from "./fixes";
import { useStore } from "./store";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const urls = useStore.getState().urls;
    if (!urls) return;
    for (const url of Object.keys(urls)) {
      if (!url || !tab.url?.includes(url) || !urls[url]) continue;
      const fixKeys = urls[url].enabled;
      for (const fixKey of fixKeys) {
        const fix = fixes[fixKey];
        if (!fix.urls.includes(url)) continue;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: fix.func,
        });
      }
    }
  }
});
