import fixes from "./fixes";
import { useStore } from "./store";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  const urls = useStore.getState().urls;
  if (!urls) return;
  for (const url of Object.keys(urls)) {
    const hostname = new URL(tab.url).hostname;
    console.debug({ hostname, url, urls });
    if (!url || !hostname.includes(url) || !urls[url]) continue;
    const fixKeys = urls[url].enabled;
    console.debug("fix for " + hostname, { fixKeys });
    for (const fixKey of fixKeys) {
      const fix = fixes[fixKey];
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: fix.func,
      });
    }
  }
});

useStore.subscribe(() => {
  console.debug("reloading");
  chrome.tabs.reload();
});
