import fixes from "./fixes";
import { useStore } from "./store";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  const urls = useStore.getState().urls;
  if (!urls) return;
  for (const url of Object.keys(urls)) {
    const hostname = new URL(tab.url).hostname;
    if (!url || hostname.includes(url) || !urls[url]) continue;
    const fixKeys = urls[url].enabled;
    console.debug("fix for " + hostname, { fixKeys });
    for (const fixKey of fixKeys) {
      const fix = fixes[fixKey];
      if (!fix.urls.includes(url)) continue;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: fix.func,
      });
    }
  }
});

// useStore.subscribe(() => {
//   chrome.tabs.reload();
// });
