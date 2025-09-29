import fixes from "./fixes";
import { useStore, type Store } from "./store";

let state: Store = useStore.getInitialState();

// Load storage on startup
chrome.storage.local.get("main", (data) => {
  console.debug({ data });
  if (!data.main) return;
  state = JSON.parse(data.main).state;
});

// Listen for storage changes from popup or elsewhere
chrome.storage.onChanged.addListener((changes, area) => {
  console.debug({ changes });
  if (area === "local" && changes.main) {
    state = JSON.parse(changes.main.newValue).state;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  const urls = state.urls;
  if (!urls) return;
  for (const url of Object.keys(urls)) {
    const hostname = new URL(tab.url).hostname;
    console.debug({ hostname, url, urls });
    if (!url || !hostname.includes(url) || !urls[url]) continue;
    const fixKeys = urls[url].enabled;
    console.debug("fix for " + hostname, fixKeys);
    for (const fixKey of fixKeys) {
      const fix = fixes[fixKey];
      chrome.scripting.executeScript({
        target: { tabId },
        func: fix.func,
      });
    }
  }
});

chrome.tabs.reload();
