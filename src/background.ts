import { useStore, type Store } from "./store";

let state: Store = useStore.getInitialState();

// Badge

function resetBadgeState() {
  chrome.action.setBadgeBackgroundColor({ color: "#000000" });
  chrome.action.setBadgeTextColor({ color: "#ffffff" });
}

function setBadgeStateActive() {
  chrome.action.setBadgeBackgroundColor({ color: "#000000" });
  chrome.action.setBadgeTextColor({ color: "#5eff99" });
}

function updateBadge(count: number, tabId?: number) {
  resetBadgeState();
  chrome.action.setBadgeText({ text: count.toString(), tabId });
}

function clearBadge(tabId?: number) {
  chrome.action.setBadgeText({ text: "", tabId });
}

function updateBadgeForTab(tab: chrome.tabs.Tab) {
  if (!state.showBadge) return clearBadge(tab.id);
  if (!tab.url) return;
  const hostname = new URL(tab.url).hostname;
  const patchKeys = state.urls[hostname]?.enabled ?? [];
  // update badge
  if (!patchKeys.length) return;
  updateBadge(patchKeys.length, tab.id);
}

// Storage

// Load storage on startup
chrome.storage.local.get("main", (data) => {
  if (!data.main) return;
  state = JSON.parse(data.main).state;
});

// Listen for storage changes from popup or elsewhere
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.main) {
    state = JSON.parse(changes.main.newValue).state;
    // update badge for active tab
    if (!state.showBadge) return clearBadge();
    else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length || !tabs[0]) return;
        updateBadgeForTab(tabs[0]);
      });
    }
  }
});

// Tabs

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  updateBadgeForTab(tab);
  if (changeInfo.status !== "complete" || !tab.url) return;
  const urls = state.urls;
  if (!urls) return;
  const hostname = new URL(tab.url).hostname;
  for (const url of Object.keys(urls)) {
    if (!url || hostname !== url || !urls[url]) continue;
    const patchKeys = urls[url].enabled;
    console.debug("Patch for " + hostname, patchKeys);
    // apply patches
    for (const patchKey of patchKeys) {
      if (patchKey.includes("-css")) {
        chrome.scripting.insertCSS({
          target: { tabId },
          files: [`patches/${patchKey.replace("-css", ".css")}`],
          origin: "USER",
        });
      } else {
        chrome.scripting.executeScript({
          target: { tabId },
          files: [`patches/${patchKey}.js`],
        });
      }
    }
  }
  setBadgeStateActive();
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  // activeInfo.tabId and activeInfo.windowId
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    updateBadgeForTab(tab);
  });
});

// Runtime

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "updateBadge") {
    updateBadge(msg.count);
  }
});
