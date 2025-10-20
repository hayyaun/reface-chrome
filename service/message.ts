import { useService } from "@/shared/store";
import db from "@/shared/store/db";
import type { Message, OpenaiThinkingMessageData } from "@/shared/types";
import { extractDefaultConfigData } from "@/shared/utils";
import browser from "webextension-polyfill";
import { updateBadge } from "./badge";
import { ask } from "./openai/openai";
import { isMessage } from "../shared/guard";

export function addMessageListener() {
  browser.runtime.onMessage.addListener(async (msg: unknown) => {
    if (!isMessage(msg)) return;
    switch (msg.to) {
      // forwarded
      case "content": {
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (!tabs.length) return;
        browser.tabs.sendMessage(tabs[0].id!, msg);
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
            await db.openai.add({ role: "assistant", content: answer });
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
  browser.runtime.sendMessage<Message>({
    from: "background",
    to: "popup",
    action: "openai_thinking",
    data: message,
  });
}
