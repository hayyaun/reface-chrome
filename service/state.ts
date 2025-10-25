import api from "@/shared/api";
import { getActiveTab } from "@/shared/api/utils";
import { PREFS_KEY, STORE_KEY, usePrefs, useService } from "@/shared/store";
import { clearBadge, updateBadgeForTab } from "./badge";
import { findApplicablePatches } from "./patch";

// State

export const state = {
  service: useService.getInitialState(),
  prefs: usePrefs.getInitialState(),
};

async function updateBadgeForActiveTab() {
  if (!state.prefs.showBadge) return clearBadge();
  const activeTab = await getActiveTab();
  if (!activeTab) return;
  const applicable = findApplicablePatches(activeTab);
  updateBadgeForTab(activeTab, applicable.length);
}

// Storage

// on load
api.storage.local.get(STORE_KEY).then(async (data) => {
  if (!data[STORE_KEY]) return;
  await useService.persist.rehydrate();
  state.service = useService.getState();
});
api.storage.sync.get(PREFS_KEY).then(async (data) => {
  if (!data[PREFS_KEY]) return;
  await usePrefs.persist.rehydrate();
  state.prefs = usePrefs.getState();
});

// on update
api.storage.onChanged.addListener(async (changes, area) => {
  if (area === "local" && changes[STORE_KEY]) {
    await useService.persist.rehydrate();
    state.service = useService.getState();
    console.debug("rehydrate background");
    updateBadgeForActiveTab();
  } else if (area === "sync" && changes[PREFS_KEY]) {
    await usePrefs.persist.rehydrate();
    state.prefs = usePrefs.getState();
    console.debug("rehydrate background prefs");
    updateBadgeForActiveTab();
  }
});
