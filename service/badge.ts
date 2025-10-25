import type { Tab } from "@/shared/api";
import api from "@/shared/api";
import { getActiveTab } from "@/shared/api/utils";
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

export function updateBadgeForTab(tab: Tab, count: number) {
  if (!count) return;
  updateBadge(count, tab.id);
}

export async function updateBadgeForActiveTab() {
  if (!state.prefs.showBadge) return clearBadge();
  const activeTab = await getActiveTab();
  if (!activeTab) return;
  const applicable = findApplicablePatches(activeTab);
  updateBadgeForTab(activeTab, applicable.length);
}
