import { PREFS_KEY, STORE_KEY, usePrefs, useStore } from "../src/store";
import { updateBadgeForActiveTab } from "./badge";

// State

export const state = {
  store: useStore.getInitialState(),
  prefs: usePrefs.getInitialState(),
};

// Storage

// on load
chrome.storage.local.get(STORE_KEY, async (data) => {
  if (!data[STORE_KEY]) return;
  await useStore.persist.rehydrate();
  state.store = useStore.getState();
});
chrome.storage.local.get(PREFS_KEY, async (data) => {
  if (!data[PREFS_KEY]) return;
  await usePrefs.persist.rehydrate();
  state.prefs = usePrefs.getState();
});

// on update
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === "local" && changes[STORE_KEY]) {
    await useStore.persist.rehydrate();
    state.store = useStore.getState();
    console.debug("rehydrate background");
    updateBadgeForActiveTab();
  }
  if (area === "sync" && changes[PREFS_KEY]) {
    await usePrefs.persist.rehydrate();
    state.prefs = usePrefs.getState();
    console.debug("rehydrate background prefs");
    updateBadgeForActiveTab();
  }
});
