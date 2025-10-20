import browser from "webextension-polyfill";
import { findApplicablePatches } from "./patch";
import { state } from "./state";

export function resetBadgeState() {
  browser.action.setBadgeBackgroundColor({ color: "#000000" });
  browser.action.setBadgeTextColor({ color: "#ffffff" });
}

export function setBadgeStateActive() {
  browser.action.setBadgeBackgroundColor({ color: "#000000" });
  browser.action.setBadgeTextColor({ color: "#5eff99" });
}

export function updateBadge(count: number, tabId?: number) {
  resetBadgeState();
  if (tabId && tabId < 0) return;
  browser.action.setBadgeText({ text: count.toString(), tabId });
}

export function clearBadge(tabId?: number) {
  browser.action.setBadgeText({ text: "", tabId });
}

export function updateBadgeForTab(tab: browser.Tabs.Tab, count: number) {
  if (!state.prefs.showBadge) return clearBadge(tab.id);
  if (!count) return;
  updateBadge(count, tab.id);
}

export async function updateBadgeForActiveTab() {
  if (!state.prefs.showBadge) return clearBadge();
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tabs.length || !tabs[0]) return;
  const applicable = findApplicablePatches(tabs[0]);
  updateBadgeForTab(tabs[0], applicable.length);
}
