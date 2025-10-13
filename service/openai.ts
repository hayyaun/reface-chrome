import { OpenAI } from "openai";
import type { Message } from "../src/types";
import { getRawHTML, searchDOM, tools } from "./openai-tools";
import { state } from "./state";

// const MAX_TOKEN = 128_000;
const THINKING_DEPTH = 5;
const MAX_THINKING_DEPTH = 15;

let openai: OpenAI | null = null;

export async function ask(
  _messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): Promise<string> {
  try {
    const config = state.service.config["samantha"];
    const apiKey = config?.["apiKey"] as string;

    if (!apiKey) return "Please add an API key in config";
    if (!openai) openai = new OpenAI({ apiKey });

    const chatConfig: Omit<
      OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
      "messages"
    > = {
      model: (config?.["model"] as string) ?? "gpt-5-mini",
      temperature: (config?.["temperature"] as number) ?? 1.0,
    };

    const thinkingDepth = Math.min(
      MAX_THINKING_DEPTH,
      (config?.["thinkginDepth"] as number) ?? THINKING_DEPTH,
    );

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: [
          "Try answering questions or manipulating web pages based on defined tools.",
          "Don't answer questions about anything else than provided page.",
          "Call searchDOM function multiple time to search deeply and recursively through context.",
          `At lease call functions ${thinkingDepth - 1} times to give them better answer instead of repeatedly asking them if they need more information.`,
        ].join("\n"),
      },
      ..._messages,
    ];

    for (let i = 0; i < thinkingDepth; i++) {
      const response = await openai.chat.completions.create({
        ...chatConfig,
        messages,
        tools,
        tool_choice: "auto",
      });

      const responseMessage = response.choices[0].message;

      // If no tool call, just output the response
      if (!responseMessage.tool_calls) {
        return responseMessage.content || "Nothing to do!";
      }

      // Keep user in notice before final answer is ready

      chrome.runtime.sendMessage<Message>({
        from: "background",
        to: "popup",
        action: "openai_thinking",
        data: {
          iter: i,
          content: responseMessage.content || "Deep thinking...",
        },
      });

      // Handle tool calls (could be multiple, but handling one for simplicity)
      const toolCall = responseMessage.tool_calls[0];

      let toolResult;

      if (toolCall.type === "function") {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);
        if (toolName === "getRawHTML") {
          toolResult = await getRawHTML();
        } else if (toolName === "searchDOM") {
          toolResult = await searchDOM(toolArgs);
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
    }

    // Final API request with updated messages
    const secondResponse = await openai.chat.completions.create({
      ...chatConfig,
      messages,
    });

    return secondResponse.choices[0].message.content || "Nothing to say!";
  } catch (err) {
    console.debug({ err });
    return "Something went wrong!\n" + err;
  }
}
