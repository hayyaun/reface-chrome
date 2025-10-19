import db from "../shared/db";
import { useService } from "../src/store";
import type { Message, OpenaiThinkingMessageData } from "../src/types";
import { extractDefaultConfigData } from "../src/utils/patch";
import { updateBadge } from "./badge";
import { ask } from "./openai/openai";

export function addMessageListener() {
  chrome.runtime.onMessage.addListener(async (msg: Message) => {
    switch (msg.to) {
      // forwarded
      case "content": {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!tabs.length) return;
          chrome.tabs.sendMessage(tabs[0].id!, msg);
        });
        break;
      }
      // take actions
      case "background": {
        switch (msg.action) {
          case "updateBadge": {
            updateBadge(msg.data);
            break;
          }
          case "openai_ask": {
            const answer = await ask(msg.data);
            // Respond back to popup
            db.openai.add({ role: "assistant", content: answer });
            break;
          }
          case "magic_eraser_on_select": {
            const PATCH_KEY = "magic-eraser";
            const { hostname, selector } = msg.data;
            const config = useService.getState().config[PATCH_KEY];
            const newConfig = {
              ...(config ?? extractDefaultConfigData(PATCH_KEY)),
            };
            if (typeof newConfig["storage"] !== "object") {
              newConfig["storage"] = {};
            }
            const storage = newConfig["storage"] as {
              [hostname: string]: string[];
            };
            if (!storage[hostname]) storage[hostname] = [];
            storage[hostname].push(selector);
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
  chrome.runtime.sendMessage<Message>({
    from: "background",
    to: "popup",
    action: "openai_thinking",
    data: message,
  });
}
