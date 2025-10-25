import api from "@/shared/api";
import { PREFS_KEY, STORE_KEY, usePrefs, useService } from "@/shared/store";
import { updateBadgeForActiveTab } from "./badge";
import { state } from "./state";

export function watchStorage() {
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
}
