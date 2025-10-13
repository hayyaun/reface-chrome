import type OpenAI from "openai";

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getCurrentTabHTML",
      description:
        "Get the current tab html content, could be used to summerize or look for specific elements.",
    },
  },
  {
    type: "function",
    function: {
      name: "executeScriptOnCurrentTab",
      description:
        "Execute script of your own based on what user asked for on the current tab. (use getCurrentTabHTML function if you are looking for elements)",
      parameters: {
        type: "object",
        properties: {
          script: {
            type: "string",
            description:
              "The script which is going to be hydrated through eval() function on the current tab and executed.",
          },
        },
        required: ["script"],
      },
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

export async function executeScriptOnCurrentTab({
  script,
}: {
  script: string;
}): Promise<string> {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab) return "No active tab found!";

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: (script) => eval(script),
    args: [script],
  });

  const result = results[0].result;
  return result ?? "Execution succefully but without any results";
}
