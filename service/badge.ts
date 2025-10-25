import type { Tab } from "@/shared/api";
import api from "@/shared/api";

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
