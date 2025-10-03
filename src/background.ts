import patches from "./config/patches";
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
  const patchKeys = state.hostnames[hostname]?.enabled ?? [];
  // update badge
  if (!patchKeys.length) return;
  updateBadge(patchKeys.length, tab.id);
}

// Fade-in

function beforeFadeIn(tabId: number) {
  if (state.fadeIn) {
    chrome.scripting.insertCSS({
      target: { tabId },
      css: `body { opacity: 0; transition: opacity 0.5s ease; }`,
    });
  }
}

function afterFadeIn(tabId: number) {
  if (state.fadeIn) {
    chrome.scripting.insertCSS({
      target: { tabId },
      css: `body { opacity: 1 !important; transition: opacity 0.5s ease; }`,
    });
  }
}

// Storage

// Load storage on startup
chrome.storage.local.get("main", async (data) => {
  if (!data.main) return;
  await useStore.persist.rehydrate();
  state = useStore.getState();
});

// Listen for storage changes from popup or elsewhere
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === "local" && changes.main) {
    await useStore.persist.rehydrate();
    state = useStore.getState();
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
  if (!tab.url) return;
  if (!state.hostnames) return;
  const hostname = new URL(tab.url).hostname;
  const pathname = new URL(tab.url).pathname;
  // on start
  updateBadgeForTab(tab);
  // match hostname
  for (const key in state.hostnames) {
    if (!key || hostname !== key) continue;
    const patchKeys = state.hostnames[key].enabled;
    if (patchKeys.length) beforeFadeIn(tabId);
    if (changeInfo.status !== "complete") continue;
    console.debug(hostname, patchKeys);
    // apply patches
    for (const patchKey of patchKeys) {
      const patch = patches[patchKey];
      if (!patch.noJS) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: [`patches/${patchKey}.js`],
        });
      }
      if (patch.css) {
        for (const path in patch.css) {
          const exact = !path.endsWith("*");
          if (exact && path !== pathname) continue;
          const actualPath = path.replaceAll("*", "");
          if (!pathname.startsWith(actualPath)) continue;
          chrome.scripting.insertCSS({
            target: { tabId },
            files: [`patches/${patchKey}-${patch.css[path]}.css`],
            origin: "USER",
          });
        }
      }
      if (patchKeys.length) afterFadeIn(tabId);
    }
  }
  // on finish
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
