/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import { getRawHTML } from "./html";
import { getReadableContent } from "./readable-content";
import { searchDOM } from "./search-dom";

export async function proceedToolCall(
  toolCall: ChatCompletionMessageToolCall,
  tab: chrome.tabs.Tab,
) {
  let toolResult;
  try {
    if (toolCall.type === "function") {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);
      if (toolName === "getRawHTML") {
        toolResult = await getRawHTML(tab);
      } else if (toolName === "searchDOM") {
        toolResult = await searchDOM(tab, toolArgs);
      } else if (toolName === "getReadableContent") {
        toolResult = await getReadableContent(tab);
      } else if (toolName.includes("chrome_tabs_")) {
        const method: keyof typeof chrome.tabs = toolName.replace(
          "chrome_tabs_",
          "",
        ) as any;
        const func = chrome.tabs[method] as any;
        const args = Object.keys(toolArgs || {}).map((k) => toolArgs[k]);
        toolResult = await func(...args);
      } else if (toolName.includes("chrome_bookmarks_")) {
        const method: keyof typeof chrome.bookmarks = toolName.replace(
          "chrome_bookmarks_",
          "",
        ) as any;
        const func = chrome.bookmarks[method] as any;
        const args = Object.keys(toolArgs || {}).map((k) => toolArgs[k]);
        toolResult = await func(...args);
      } else {
        throw "Functionality not defined!";
      }
    }
  } catch (err) {
    toolResult = err;
  }
  return toolResult;
}
