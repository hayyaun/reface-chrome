import api from "@/shared/api";
import { PREFS_KEY, STORE_KEY, usePrefs, useService } from "@/shared/store";
import { updateBadgeForActiveTab } from "./badge";

// State

export const state = {
  service: useService.getInitialState(),
  prefs: usePrefs.getInitialState(),
};

// Storage

// on load
if (typeof browser !== "undefined") {
  browser.storage.local.get(STORE_KEY).then(async (data) => {
    if (!data[STORE_KEY]) return;
    await useService.persist.rehydrate();
    state.service = useService.getState();
  });
  browser.storage.local.get(PREFS_KEY).then(async (data) => {
    if (!data[PREFS_KEY]) return;
    await usePrefs.persist.rehydrate();
    state.prefs = usePrefs.getState();
  });
} else {
  chrome.storage.local.get(STORE_KEY, async (data) => {
    if (!data[STORE_KEY]) return;
    await useService.persist.rehydrate();
    state.service = useService.getState();
  });
  chrome.storage.local.get(PREFS_KEY, async (data) => {
    if (!data[PREFS_KEY]) return;
    await usePrefs.persist.rehydrate();
    state.prefs = usePrefs.getState();
  });
}

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
