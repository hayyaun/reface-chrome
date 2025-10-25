import "@/shared/api";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../assets/index.css";
import { watchStorage } from "../utils/storage";
import App from "./App.tsx";

createRoot(document.getElementById("root-options")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

watchStorage("options");
