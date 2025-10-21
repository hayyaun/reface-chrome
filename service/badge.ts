import api from "@/shared/api";
import { findApplicablePatches } from "./patch";
import { state } from "./state";

export function resetBadgeState() {
  api.action.setBadgeBackgroundColor({ color: "#000000" });
  api.action.setBadgeTextColor({ color: "#ffffff" });
}

export function setBadgeStateActive() {
  api.action.setBadgeBackgroundColor({ color: "#000000" });
  api.action.setBadgeTextColor({ color: "#5eff99" });
}

export function updateBadge(count: number, tabId?: number) {
  resetBadgeState();
  if (tabId && tabId < 0) return;
  api.action.setBadgeText({ text: count.toString(), tabId });
}

export function clearBadge(tabId?: number) {
  api.action.setBadgeText({ text: "", tabId });
}

export function updateBadgeForTab(tab: browser.tabs.Tab, count: number) {
  if (!state.prefs.showBadge) return clearBadge(tab.id);
  if (!count) return;
  updateBadge(count, tab.id);
}

export function updateBadgeForActiveTab() {
  if (!state.prefs.showBadge) return clearBadge();
  api.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (!tabs.length || !tabs[0]) return;
    const applicable = findApplicablePatches(tabs[0]);
    updateBadgeForTab(tabs[0], applicable.length);
  });
}
