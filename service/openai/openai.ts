/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAI } from "openai";
import {
  AI_THINKING_DEPTH_DEFAULT,
  AI_THINKING_DEPTH_MAX,
} from "../../src/config/constants";
import type { Message } from "../../src/types";
import { state } from "../state";
import { proceedToolCall } from "./toolcall";
import { tools } from "./tools";

let openai: OpenAI | null = null;

const systemContent = [
  "Try answering questions or manipulating web pages based on defined tools.",
  "Don't answer questions about anything else than provided page.",
  "Use getReadableContent as much as possible to answer in the first place",
  "Call searchDOM function multiple time to search deeply and recursively through context.",
  "Notice: Can't modify the root bookmark folders.",
].join("\n");

export async function ask(
  _messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): Promise<string> {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) return "No active tab found!";

    const config = state.service.config["samantha"];
    let apiKey = config?.["apiKey"] as string;

    // let the service-worker load and rehydrate once
    if (!apiKey) await new Promise((res) => setTimeout(res, 500));
    apiKey = config?.["apiKey"] as string;

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
      AI_THINKING_DEPTH_MAX,
      (config?.["thinkginDepth"] as number) ?? AI_THINKING_DEPTH_DEFAULT,
    );

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemContent },
      ..._messages,
    ];

    for (let i = 0; i < thinkingDepth; i++) {
      const response = await openai.chat.completions.create({
        ...chatConfig,
        messages,
        tools,
        tool_choice: i > 0 ? "auto" : "required",
      });

      console.debug(
        "Response",
        messages.length,
        { messages, response },
        JSON.stringify(messages).length,
      );

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

      // Append assistant message before toolcall responses
      messages.push(responseMessage);

      // Handle tool calls
      const toolCalls = responseMessage.tool_calls;
      for (const toolCall of toolCalls) {
        const toolResult = proceedToolCall(toolCall, tab);
        // Append the model's response and the tool result to messages
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult || "Received nothing"),
        });
      }
    }

    // Final API request with updated messages
    const response = await openai.chat.completions.create({
      ...chatConfig,
      messages,
    });

    return response.choices[0].message.content || "Nothing to say!";
  } catch (err: any) {
    console.debug("ERR:OPENAI_ASK", { err });
    return (
      "Something went wrong!\n" +
      (err?.error?.message ?? err?.message ?? err ?? "")
    );
  }
}
