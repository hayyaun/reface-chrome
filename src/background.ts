import patches from "./config/patches";
import { STORE_KEY, useStore, type Store } from "./store";
import { match } from "./utils/match";
import { extractDefaultConfigData } from "./utils/patch";

// State

/** App store shared between popup, options, and background */
let state: Store = useStore.getInitialState();
/** Map of applied patches per tabId */
const applied: { [id: number]: string[] } = {};

// Patch

function findApplicablePatches(tab: chrome.tabs.Tab) {
  if (!tab.url) return [];
  const hostname = new URL(tab.url).hostname;
  const applicable: string[] = [];
  // match global
  for (const key of state.global) {
    const patch = patches[key];
    if (!patch) continue;
    const valid = patch.hostnames.some((rule) => match(hostname, rule));
    if (!valid) continue;
    const excluded = state.hostnames[hostname]?.excluded.includes(key);
    if (excluded) continue;
    applicable.push(key);
  }
  // match local
  for (const hn in state.hostnames) {
    if (!hn || hostname !== hn) continue;
    const patchKeys = state.hostnames[hn]!.enabled;
    if (!patchKeys.length) continue;
    const valid = patchKeys.filter((key) => {
      const patch = patches[key];
      if (!patch) return false; // not found
      return !state.global.includes(key); // not local
    });
    applicable.push(...valid);
  }
  return [...new Set(applicable)]; // unique
}

function applyPatch(patchKey: string, tabId: number, pathname: string) {
  if (applied[tabId]?.includes(patchKey)) return;
  if (!applied[tabId]) applied[tabId] = [];
  applied[tabId].push(patchKey);
  const patch = patches[patchKey];
  // Config
  if (patches[patchKey].config) {
    // extract defaults
    let data = extractDefaultConfigData(patchKey);
    // override
    if (state.config[patchKey]) {
      data = state.config[patchKey];
    }
    chrome.scripting.executeScript({
      target: { tabId },
      func: ({ patchKey, data }) => {
        window.__rc_config = window.__rc_config || {};
        window.__rc_config[patchKey] = data;
      },
      args: [{ patchKey, data }],
    });
  }
  // JS
  if (!patch.noJS) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: [`patches/${patchKey}.js`],
    });
  }
  // CSS
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

function updateBadgeForTab(tab: chrome.tabs.Tab, count: number) {
  if (!state.showBadge) return clearBadge(tab.id);
  if (!count) return;
  updateBadge(count, tab.id);
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
chrome.storage.local.get(STORE_KEY, async (data) => {
  if (!data[STORE_KEY]) return;
  await useStore.persist.rehydrate();
  state = useStore.getState();
});

// Listen for storage changes from popup or elsewhere
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === "local" && changes[STORE_KEY]) {
    await useStore.persist.rehydrate();
    state = useStore.getState();
    console.debug("rehydrate background");
    // update badge for active tab
    if (!state.showBadge) return clearBadge();
    else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length || !tabs[0]) return;
        const applicable = findApplicablePatches(tabs[0]);
        updateBadgeForTab(tabs[0], applicable.length);
      });
    }
  }
});

// Tabs

chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId !== 0) return;
  if (!state.hostnames) return;
  const tabId = details.tabId;
  const tab = await chrome.tabs.get(tabId);
  console.debug("update", tabId, tab, details);
  if (!tab.url) return;
  const toApply = findApplicablePatches(tab);
  if (!toApply.length) return;
  const pathname = new URL(tab.url).pathname;
  console.debug("apply", tabId, toApply);
  for (const patchKey of toApply) {
    applyPatch(patchKey, tabId, pathname);
  }
  // on finish
  afterFadeIn(tabId);
  setBadgeStateActive();
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0) return;
  console.debug("loading", details.tabId); // load or reload
  clearPatches(details.tabId);
  const tab = await chrome.tabs.get(details.tabId);
  const applicable = findApplicablePatches(tab);
  // only apply fade-in when there's a thing to apply
  if (!applicable.length) return;
  updateBadgeForTab(tab, applicable.length);
  beforeFadeIn(details.tabId);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.debug("remove", tabId, removeInfo);
  clearPatches(tabId);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // activeInfo.tabId and activeInfo.windowId
  const tab = await chrome.tabs.get(activeInfo.tabId);
  const applicable = findApplicablePatches(tab);
  updateBadgeForTab(tab, applicable.length);
});

// Runtime

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "updateBadge") {
    updateBadge(msg.count);
  }
});
