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

function updateBadgeForActiveTab(tab: chrome.tabs.Tab) {
  if (!tab.url || !state.showBadge || !tab.active) return;
  const hostname = new URL(tab.url).hostname;
  const patchKeys = state.urls[hostname]?.enabled ?? [];
  // update badge
  if (!patchKeys.length) return;
  chrome.windows.get(tab.windowId, (win) => {
    if (win.focused) updateBadge(patchKeys.length);
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  const urls = state.urls;
  if (!urls) return;
  for (const url of Object.keys(urls)) {
    const hostname = new URL(tab.url).hostname;
    console.debug({ hostname, url, urls });
    if (!url || hostname !== url || !urls[url]) continue;
    const patchKeys = urls[url].enabled;
    console.debug("Patch for " + hostname, patchKeys);
    updateBadgeForActiveTab(tab);
    // apply patches
    for (const patchKey of patchKeys) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: [`patches/${patchKey}.js`],
      });
    }
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  // activeInfo.tabId and activeInfo.windowId
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log("Switched to tab:", tab.url);
    updateBadgeForActiveTab(tab);
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "updateBadge") {
    updateBadge(msg.count);
  }
});
