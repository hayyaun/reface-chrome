/* eslint-disable @typescript-eslint/no-explicit-any */
import api, { type Tab } from "@/shared/api";
import type { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import { getRawHTML } from "./html";
import { getReadableContent } from "./readable-content";
import { searchDOM } from "./search-dom";

export async function proceedToolCall(
  toolCall: ChatCompletionMessageToolCall,
  tab: Tab,
): Promise<object | string> {
  try {
    if (toolCall.type === "function") {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);
      if (toolName === "getRawHTML") {
        return await getRawHTML(tab);
      }
      if (toolName === "searchDOM") {
        return await searchDOM(tab, toolArgs);
      }
      if (toolName === "getReadableContent") {
        return await getReadableContent(tab);
      }
      if (toolName.includes("chrome_tabs_")) {
        const method: keyof typeof api.tabs = toolName.replace("chrome_tabs_", "") as any;
        const func = api.tabs[method] as any;
        const args = Object.keys(toolArgs || {}).map((k) => toolArgs[k]);
        return await func(...args);
      }
      if (toolName.includes("chrome_bookmarks_")) {
        const method: keyof typeof api.bookmarks = toolName.replace("chrome_bookmarks_", "") as any;
        const func = api.bookmarks[method] as any;
        const args = Object.keys(toolArgs || {}).map((k) => toolArgs[k]);
        return await func(...args);
      }
    }

    throw "Tool not defined!";
  } catch (err) {
    console.debug("ERROR:TOO_CALL", { err, toolCall });
    return err as string;
  }
}
