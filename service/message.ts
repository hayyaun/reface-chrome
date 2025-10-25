import api from "@/shared/api";
import db from "@/shared/store/db";
import type { Message } from "@/shared/types";
import { updateBadge } from "./badge";
import { ask } from "./samantha";

// TODO remove any

export function addMessageListener() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api.runtime.onMessage.addListener(async (msg: Message): Promise<any> => {
    if (msg.to !== "background") return;
    switch (msg.action) {
      case "updateBadge": {
        return updateBadge(msg.data);
      }
      // patches ---
      case "samantha_ask": {
        const answer = await ask(msg.data);
        return await db.samantha.add({ role: "assistant", content: answer });
      }
      case "magic_eraser_on_select": {
        const { hostname, selector } = msg.data;
        const item = await db.magic_eraser.get(hostname);
        return await db.magic_eraser.put({
          hostname,
          scrollBody: item?.scrollBody ?? false,
          selectors: [...(item?.selectors ?? []), selector],
          watch: item?.watch ?? false,
        });
      }
      case "magic_eraser_get_item": {
        return await db.magic_eraser.get(msg.data);
      }
      case "whiteboard_set_item": {
        return await db.whiteboard.put(msg.data);
      }
      case "whiteboard_get_item": {
        return await db.whiteboard.get(msg.data);
      }
    }
  });
}
