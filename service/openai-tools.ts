import type OpenAI from "openai";

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getCurrentTabHTML",
      description:
        "Get the current tab html content, could be used to summerize or look for specific elements or anything else.",
    },
  },
];

export async function getCurrentTabHTML(): Promise<string> {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab) return "No active tab found!";

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => document.body.innerHTML,
  });

  const result = results[0].result;
  return result ?? "No content"; // html content
}
