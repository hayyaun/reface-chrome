import patches from "./config/patches";
import { useStore, type Store } from "./store";
import { match } from "./utils/match";

let state: Store = useStore.getInitialState();

// Patch

function findApplicablePatches(tab: chrome.tabs.Tab) {
  if (!tab.url) return [];
  const hostname = new URL(tab.url).hostname;
  const toApply: string[] = [];
  // match globals
  for (const patchKey of state.global) {
    const patch = patches[patchKey];
    if (!patch) continue;
    let skip = true;
    for (const rule of patch.hostnames) {
      if (!match(hostname, rule)) continue;
      skip = false;
      break;
    }
    if (skip) continue;
    toApply.push(patchKey);
  }
  // match local
  for (const key in state.hostnames) {
    if (!key || hostname !== key) continue;
    const patchKeys = state.hostnames[key].enabled;
    if (!patchKeys.length) continue;
    const freshPatchKeys = patchKeys.filter(
      (patchKey) => !state.global.includes(patchKey),
    );
    toApply.push(...freshPatchKeys);
  }
  return toApply;
}

const applied: { [id: number]: string[] } = {};

function applyPatch(patchKey: string, tabId: number, pathname: string) {
  if (applied[tabId]?.includes(patchKey)) return;
  if (!applied[tabId]) applied[tabId] = [];
  applied[tabId].push(patchKey);
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

function clearPatches(tabId: number) {
  if (applied[tabId]) delete applied[tabId];
}

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
  const toApply = findApplicablePatches(tab);
  if (!toApply.length) return;
  updateBadge(toApply.length, tab.id);
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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.debug("update", tabId, tab, changeInfo);
  if (!tab.url) return;
  if (!state.hostnames) return;
  // process tab
  const toApply = findApplicablePatches(tab);
  if (!toApply.length) return; // only apply fade-in when there's a thing to apply
  if (changeInfo.status === "loading") {
    updateBadgeForTab(tab);
    beforeFadeIn(tabId);
  }
  if (changeInfo.status !== "complete") return;
  const pathname = new URL(tab.url).pathname;
  console.debug("apply", tabId, toApply);
  for (const patchKey of toApply) {
    applyPatch(patchKey, tabId, pathname);
  }
  // on finish
  afterFadeIn(tabId);
  setBadgeStateActive();
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.debug("remove", tabId, removeInfo);
  clearPatches(tabId);
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;
  console.debug("loading", details.tabId); // load or reload
  clearPatches(details.tabId);
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
