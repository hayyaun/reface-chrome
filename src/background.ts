import patches from "./config/patches";
import { useStore, type Store } from "./store";
import { match } from "./utils/match";

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
    console.log("rehydrate background");
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

function applyPatch(patchKey: string, tabId: number, pathname: string) {
  const patch = patches[patchKey];
  if (!patch.noJS) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: [`patches/${patchKey}.js`],
    });
  }
  if (patch.css) {
    for (const pathRule in patch.css) {
      if (!match(pathname, pathRule)) continue;
      chrome.scripting.insertCSS({
        target: { tabId },
        files: [`patches/${patchKey}-${patch.css[pathRule]}.css`],
      });
    }
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab.url) return;
  if (!state.hostnames) return;
  const hostname = new URL(tab.url).hostname;
  const pathname = new URL(tab.url).pathname;
  // on start
  updateBadgeForTab(tab);
  // apply globals
  for (const patchKey in state.global) {
    const patch = patches[patchKey];
    if (!patch) continue;
    let skip = true;
    for (const rule of patch.hostnames) {
      if (match(hostname, rule)) {
        skip = false;
        break;
      }
    }
    if (skip) continue;
    applyPatch(patchKey, tabId, pathname);
  }
  // match hostname
  for (const key in state.hostnames) {
    if (!key || hostname !== key) continue;
    const patchKeys = state.hostnames[key].enabled;
    if (patchKeys.length) beforeFadeIn(tabId);
    if (changeInfo.status !== "complete") continue;
    console.debug(hostname, patchKeys);
    for (const patchKey of patchKeys) {
      if (state.global.includes(patchKey)) continue; // already applied
      applyPatch(patchKey, tabId, pathname);
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
