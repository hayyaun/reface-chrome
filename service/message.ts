import type { Message } from "../src/types";
import { updateBadge } from "./badge";

chrome.runtime.onMessage.addListener((msg: Message) => {
  switch (msg.to) {
    case "popup": // forward
      chrome.runtime.sendMessage(msg);
      break;
    case "content": // forward
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, msg);
      });
      break;
    case "background": // action
      if (msg.type === "updateBadge") updateBadge(msg.data as number);
      break;
  }
});
