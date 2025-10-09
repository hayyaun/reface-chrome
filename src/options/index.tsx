import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { watchStorage } from "../utils/storage.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root-options")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

watchStorage("options");
