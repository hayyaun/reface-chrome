import { setBadgeStateActive, updateBadgeForTab } from "./service/badge";
import { afterFadeIn, beforeFadeIn } from "./service/effects";
import {
  applyPatch,
  clearPatches,
  findApplicablePatches,
} from "./service/patch";
import { state } from "./service/state";

// Tabs

chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId !== 0) return;
  if (!state.store.hostnames) return;
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
