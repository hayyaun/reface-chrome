import { OpenAI } from "openai";
import {
  executeScriptOnCurrentTab,
  getCurrentTabHTML,
  tools,
} from "./openai-tools";

const config: Omit<
  OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  "messages"
> = {
  model: "gpt-4o-mini",
  temperature: 0.1,
};

export async function ask(message: string, apiKey?: string): Promise<string> {
  if (!apiKey) return "Please add an API key in config";
  const openai = new OpenAI({ apiKey });
  if (!openai) return "Wrong API key provided, please change in config";

  // Initial messages
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "Try answering questions related to the defined tools, nothing more.",
    },
    { role: "user", content: message },
  ];

  // First API request
  const response = await openai.chat.completions.create({
    ...config,
    messages,
    tools,
    tool_choice: "required", // TODO can be enhanced
  });

  const responseMessage = response.choices[0].message;

  // If no tool call, just output the response
  if (!responseMessage.tool_calls) {
    return responseMessage.content || "Nothing to do!";
  }

  // Handle tool calls (could be multiple, but handling one for simplicity)
  const toolCall = responseMessage.tool_calls[0];

  let toolResult;

  if (toolCall.type === "function") {
    const toolName = toolCall.function.name;
    const toolArgs = JSON.parse(toolCall.function.arguments);
    if (toolName === "getCurrentTabHTML") {
      toolResult = await getCurrentTabHTML();
    } else if (toolName === "executeScriptOnCurrentTab") {
      toolResult = await executeScriptOnCurrentTab(toolArgs);
    } else {
      toolResult = "Functionality not defined!";
    }
  }

  // Append the model's response and the tool result to messages
  messages.push(responseMessage);
  messages.push({
    role: "tool",
    tool_call_id: toolCall.id,
    content: JSON.stringify(toolResult),
  });

  // Second API request with updated messages
  const secondResponse = await openai.chat.completions.create({
    ...config,
    messages,
  });

  return secondResponse.choices[0].message.content || "Nothing to say!";
}
