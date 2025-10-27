import api from "@/shared/api";
import { getActiveTab } from "@/shared/api/utils";
import db from "@/shared/store/db";
import { updateBadge } from "./badge";
import { applyPatch } from "./patch";
import { ask } from "./samantha";

export function addMessageListener() {
  /**
   * @notice null means irrelevant
   *  */

  // Apply patch
  api.runtime.onMessage.addListener<"apply_patch">(async (msg) => {
    if (msg.to !== "background" || msg.action !== "apply_patch") return null;
    const { patchKey } = msg.data;
    const activeTab = await getActiveTab();
    if (activeTab) applyPatch(patchKey, activeTab);
  });

  // Badge updates
  api.runtime.onMessage.addListener<"update_badge">(async (msg) => {
    if (msg.to !== "background" || msg.action !== "update_badge") return null;
    updateBadge(msg.data);
  });

  // Samantha assistant
  api.runtime.onMessage.addListener<"samantha_ask">(async (msg) => {
    if (msg.to !== "background" || msg.action !== "samantha_ask") return null;
    const answer = await ask(msg.data);
    return await db.samantha.add({ role: "assistant", content: answer });
  });

  // Magic eraser - select
  api.runtime.onMessage.addListener<"magic_eraser_on_select">(async (msg) => {
    if (msg.to !== "background" || msg.action !== "magic_eraser_on_select") return null;
    const { hostname, selector } = msg.data;
    const item = await db.magic_eraser.get(hostname);
    return await db.magic_eraser.put({
      hostname,
      scrollBody: item?.scrollBody ?? false,
      selectors: [...(item?.selectors ?? []), selector],
      watch: item?.watch ?? false,
    });
  });

  // Magic eraser - get item
  api.runtime.onMessage.addListener<"magic_eraser_get_item">(async (msg) => {
    if (msg.to !== "background" || msg.action !== "magic_eraser_get_item") return null;
    return await db.magic_eraser.get(msg.data);
  });

  // Whiteboard - set item
  api.runtime.onMessage.addListener<"whiteboard_set_item">(async (msg) => {
    if (msg.to !== "background" || msg.action !== "whiteboard_set_item") return null;
    return await db.whiteboard.put(msg.data);
  });

  // Whiteboard - get item
  api.runtime.onMessage.addListener<"whiteboard_get_item">(async (msg) => {
    if (msg.to !== "background" || msg.action !== "whiteboard_get_item") return null;
    return await db.whiteboard.get(msg.data);
  });
}
