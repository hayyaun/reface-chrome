import { runtime } from "@/shared/api";
import db from "@/shared/store/db";
import type { Message, OpenaiThinkingMessageData } from "@/shared/types";
import { updateBadge } from "./badge";
import { ask } from "./openai/openai";

export function addMessageListener() {
  runtime.onMessage.addListener(async (msg: Message) => {
    if (msg.to !== "background") return;
    switch (msg.action) {
      case "updateBadge": {
        updateBadge(msg.data);
        break;
      }
      // patches ---
      case "openai_ask": {
        const answer = await ask(msg.data);
        // Respond back to popup
        await db.openai.add({ role: "assistant", content: answer });
        break;
      }
      case "magic_eraser_on_select": {
        const { hostname, selector } = msg.data;
        const item = await db.magic_eraser.get(hostname);
        await db.magic_eraser.put({
          hostname,
          scrollBody: item?.scrollBody ?? false,
          selectors: [...(item?.selectors ?? []), selector],
          watch: item?.watch ?? false,
        });
        break;
      }
      case "magic_eraser_get_item": {
        return await db.magic_eraser.get(msg.data);
      }
    }
  });
}

export function updateAiThinking(message: OpenaiThinkingMessageData) {
  runtime.sendMessage({
    to: "popup",
    action: "openai_thinking",
    data: message,
  });
}
