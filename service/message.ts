import type { Message } from "../src/types";
import { updateBadge } from "./badge";
import { ask } from "./openai";
import { state } from "./state";

export function addMessageListener() {
  chrome.runtime.onMessage.addListener(async (msg: Message) => {
    switch (msg.to) {
      // forwarded
      case "popup": {
        chrome.runtime.sendMessage(msg);
        break;
      }
      // forwarded
      case "content": {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id!, msg);
        });
        break;
      }
      // take actions
      case "background": {
        switch (msg.action) {
          case "updateBadge": {
            updateBadge(msg.data as number);
            break;
          }
          case "openai_ask": {
            const apiKey = state.service.config["samantha"]?.["apiKey"] as
              | string
              | undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const answer = await ask(msg.data as any, apiKey);
            // Respond back to popup
            chrome.runtime.sendMessage<Message>({
              from: "background",
              to: "popup",
              action: "openai_answer",
              data: answer,
            });
          }
        }
        break;
      }
    }
  });
}
