import { getElementByXPath, getElementXPath } from "@/service/utils";
import api from "@/shared/api";
import type { MagicEraserDBItem } from "@/shared/types";

// Selection Mode

let lastHovered: HTMLElement | null = null;

function onClick(ev: MouseEvent) {
  onBlur(ev as PointerEvent);
  const el = ev.target as HTMLElement;
  el.style.display = "none";
  api.runtime.sendMessage({
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

api.runtime.onMessage.addListener(async (msg) => {
  if (msg.to !== "content") return;
  if (msg.action === "magic_eraser_selection_mode") {
    if (msg.data) beginSelectionMode();
    else stopSelectionMode();
  }
});

// Persist Mode

async function apply() {
  const item = await api.runtime.sendMessage<MagicEraserDBItem>({
    to: "background",
    action: "magic_eraser_get_item",
    data: window.location.hostname,
  });
  if (!item) return;
  for (const selector of item.selectors) {
    const el = getElementByXPath(selector);
    if (!el || !(el instanceof HTMLElement)) continue;
    el.style.display = "none";
  }
}

apply();
setTimeout(apply, 1500); // double-check
