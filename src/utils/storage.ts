import { PREFS_KEY, usePrefs } from "../prefs.ts";
import { STORE_KEY, useStore } from "../store.ts";

export function watchStorage(scope: string) {
  if (import.meta.env.PROD) {
    chrome.storage.onChanged.addListener(async (changes, area) => {
      if (area === "local" && changes[STORE_KEY]) {
        await useStore.persist.rehydrate();
        console.debug(`rehydrate ${scope}`);
      } else if (area === "sync" && changes[PREFS_KEY]) {
        await usePrefs.persist.rehydrate();
        console.debug(`rehydrate ${scope} prefs`);
      }
    });
  } else if (import.meta.env.DEV) {
    window.addEventListener("storage", async (ev) => {
      if (ev.key === STORE_KEY) {
        await useStore.persist.rehydrate();
        console.debug(`rehydrate ${scope}`);
      } else if (ev.key === PREFS_KEY) {
        await usePrefs.persist.rehydrate();
        console.debug(`rehydrate ${scope} prefs`);
      }
    });
  }
}
