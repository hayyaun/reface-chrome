import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { STORE_KEY, useStore } from "../store.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root-options")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.env.PROD) {
  chrome.storage.onChanged.addListener(async (changes, area) => {
    if (area === "local" && changes[STORE_KEY]) {
      await useStore.persist.rehydrate();
      console.debug("rehydrate options");
    }
  });
}

if (import.meta.env.DEV) {
  window.addEventListener("storage", async (ev) => {
    if (ev.key === STORE_KEY) {
      await useStore.persist.rehydrate();
      console.debug("rehydrate options");
    }
  });
}
