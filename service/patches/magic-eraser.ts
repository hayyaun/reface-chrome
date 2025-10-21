import type { Message } from "@/shared/types";
import { getElementByXPath, getElementXPath } from "../utils/dom";

// Selection Mode

let lastHovered: HTMLElement | null = null;

function onClick(ev: MouseEvent) {
  onBlur(ev as PointerEvent);
  const el = ev.target as HTMLElement;
  el.style.display = "none";
  chrome.runtime.sendMessage<Message>({
    to: "background",
    action: "magic_eraser_on_select",
    data: {
      hostname: window.location.hostname,
      selector: getElementXPath(el),
    },
  });
}

function onHover(ev: PointerEvent) {
  ev.stopPropagation();
  ev.stopImmediatePropagation();
  const el = ev.target as HTMLElement;
  el.style.opacity = "0.5";
  el.style.outline = "2px solid #f00";
  lastHovered = el;
}

function onBlur(ev: PointerEvent) {
  ev.stopPropagation();
  ev.stopImmediatePropagation();
  const el = ev.target as HTMLElement;
  el.style.opacity = "";
  el.style.outline = "";
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    stopSelectionMode();
    if (lastHovered) {
      lastHovered.style.opacity = "";
      lastHovered.style.outline = "";
    }
  }
}

function beginSelectionMode() {
  document.body.style.cursor = "grab";
  document.body.addEventListener("keydown", onKeyDown);
  document.querySelectorAll("*").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    el.addEventListener("pointerover", onHover, true);
    el.addEventListener("pointerout", onBlur, true);
    el.addEventListener("click", onClick, true);
  });
}

function stopSelectionMode() {
  document.body.style.cursor = "";
  document.body.removeEventListener("keydown", onKeyDown);
  document.querySelectorAll("*").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    el.removeEventListener("pointerover", onHover, true);
    el.removeEventListener("pointerout", onBlur, true);
    el.removeEventListener("click", onClick, true);
  });
}

chrome.runtime.onMessage.addListener(async (msg: Message) => {
  if (msg.to !== "content") return;
  if (msg.action === "magic_eraser_selection_mode") {
    if (msg.data) beginSelectionMode();
    else stopSelectionMode();
  }
});

// Persist Mode

const config = window.__rc_config["magic-eraser"];

function applyPersisted() {
  const storage = config["storage"] as { [hostname: string]: string[] };
  for (const hostname in storage) {
    if (hostname !== window.location.hostname) continue;
    for (const selector of storage[hostname]) {
      const el = getElementByXPath(selector);
      if (!el || !(el instanceof HTMLElement)) continue;
      el.style.display = "none";
    }
    break;
  }
}

if (config["persist"]) {
  applyPersisted();
  setTimeout(applyPersisted, 1500); // double-check
}
