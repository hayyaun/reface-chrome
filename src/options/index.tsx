import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { useStore } from "../store.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root-options")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.env.PROD) {
  chrome.storage.onChanged.addListener(async (changes, area) => {
    if (area === "local" && changes.main) {
      await useStore.persist.rehydrate();
      console.log("rehydrate options");
    }
  });
}
