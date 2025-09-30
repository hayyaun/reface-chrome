import { useStore, type Store } from "./store";

// TODO add cache map to skip injected tabs already

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

function updateBadge(count: number) {
  chrome.action.setBadgeBackgroundColor({ color: "#000000" });
  chrome.action.setBadgeTextColor({ color: "#ffffff" });
  chrome.action.setBadgeText({ text: count.toString() });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  const urls = state.urls;
  if (!urls) return;
  for (const url of Object.keys(urls)) {
    const hostname = new URL(tab.url).hostname;
    console.debug({ hostname, url, urls });
    if (!url || !hostname.includes(url) || !urls[url]) continue;
    const patchKeys = urls[url].enabled;
    console.debug("Patch for " + hostname, patchKeys);
    // update badge
    if (tab.active && !!patchKeys.length) {
      chrome.windows.get(tab.windowId, (win) => {
        if (win.focused) updateBadge(patchKeys.length);
      });
    }
    // apply patches
    for (const patchKey of patchKeys) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: [`patches/${patchKey}.js`],
      });
    }
  }
});

// events
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "updateBadge") {
    updateBadge(msg.count);
  }
});
