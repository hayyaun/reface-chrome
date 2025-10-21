/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { OpenAI } from "openai";
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import { updateAiThinking } from "../message";
import { state } from "../state";
import { proceedToolCall } from "./toolcall";
import { tools } from "./tools";

let openai: OpenAI | null = null;

const systemContent = [
  "Notice: keep answers short! keep answers short! don't ask too many questions!",
  "Try answering questions based on defined tools.",
  "Don't answer questions out of provided tools scope.",
  "Use getReadableContent as much as possible to answer in the first place",
  "Call searchDOM function multiple time to search deeply and recursively through context.",
  "Notice: Can't modify the root bookmark folders.",
  "If there's more than 128 tool-calls in a single message, split and send the extra in the next message.",
].join("\n");

export async function ask(_messages: ChatCompletionMessageParam[]): Promise<string> {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) return "No active tab found!";

    const config = state.service.config["openai"];
    let apiKey = config?.["apiKey"] as string;

    // let the service-worker load and rehydrate once
    if (!apiKey) await new Promise((res) => setTimeout(res, 500));
    apiKey = config?.["apiKey"] as string;

    if (!apiKey) return "Please add an API key in config";
    if (!openai) openai = new OpenAI({ apiKey });

    const chatConfig: Omit<ChatCompletionCreateParamsNonStreaming, "messages"> = {
      model: (config?.["model"] as string) ?? "gpt-5-mini",
      temperature: (config?.["temperature"] as number) ?? 1.0,
    };

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemContent },
      ..._messages,
    ];

    const thinking = { iter: -1 };

    while (true) {
      thinking.iter++;

      const response = await openai.chat.completions.create({
        ...chatConfig,
        messages,
        tools: tools,
        tool_choice: "auto",
      });

      console.debug(
        "Response",
        messages.length,
        { messages, response },
        JSON.stringify(messages).length,
      );

      const responseMessage = response.choices[0].message;

      // Append assistant message before toolcall responses
      messages.push(responseMessage);

      // If no tool call, exit loop
      if (!responseMessage.tool_calls) break;

      // Keep user in notice before final answer is ready
      const thinking_tools = _.uniq(
        responseMessage.tool_calls.map((tc) => (tc.type === "function" ? tc.function.name : tc.id)),
      ).join(", ");

      updateAiThinking({
        iter: thinking.iter,
        content: "Using existing tools: " + thinking_tools,
      });

      // Handle tool calls
      const toolCalls = responseMessage.tool_calls;
      for (const toolCall of toolCalls) {
        const toolResult = await proceedToolCall(toolCall, tab);
        // Append the model's response and the tool result to messages
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult || "Received nothing"),
        });
      }
    }

    updateAiThinking({
      iter: 0,
      content: "Deep thinking...",
    });

    // Final API request with updated messages
    const response = await openai.chat.completions.create({
      ...chatConfig,
      messages,
    });

    updateAiThinking(null);
    return response.choices[0].message.content || "Done!";
  } catch (err: any) {
    console.debug("ERROR:OPENAI_ASK", err);

    updateAiThinking(null);
    return "Something went wrong!\n" + (err?.error?.message || err?.message || err || "");
  }
}
