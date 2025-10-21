import api from "@/shared/api";
import { useService } from "@/shared/store";
import db from "@/shared/store/db";
import type { Message, OpenaiThinkingMessageData } from "@/shared/types";
import type { MagicEraserConfigData } from "@/shared/types/patch";
import { extractDefaultConfigData } from "@/shared/utils";
import { produce } from "immer";
import { updateBadge } from "./badge";
import { ask } from "./openai/openai";

export function addMessageListener() {
  api.runtime.onMessage.addListener(async (msg: Message) => {
    switch (msg.to) {
      case "content": {
        api.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          if (!tabs.length) return;
          api.tabs.sendMessage(tabs[0].id!, msg);
        });
        break;
      }
      case "background": {
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
            const PATCH_KEY = "magic-eraser";
            const { hostname, selector } = msg.data;
            const config = useService.getState().config[PATCH_KEY] as MagicEraserConfigData;
            const newConfig = produce(config ?? extractDefaultConfigData(PATCH_KEY), (draft) => {
              if (!draft.storage) draft.storage = {};
              const storage = draft.storage;
              if (!storage[hostname]) storage[hostname] = [];
              storage[hostname].push(selector);
            });
            useService.getState().updateConfig(PATCH_KEY, newConfig);
            break;
          }
        }
        break;
      }
    }
  });
}

export function updateAiThinking(message: OpenaiThinkingMessageData) {
  api.runtime.sendMessage({
    to: "popup",
    action: "openai_thinking",
    data: message,
  } as Message);
}
