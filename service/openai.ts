import { OpenAI } from "openai";
import { getCurrentTabHTML, tools } from "./openai-tools";

const MAX_TOKEN = 128_000;

const config: Omit<
  OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  "messages"
> = {
  model: "gpt-4o-mini",
  temperature: 0.1,
};

let openai: OpenAI | null = null;

export async function ask(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  apiKey?: string,
): Promise<string> {
  try {
    if (!apiKey) return "Please add an API key in config";

    if (!openai) openai = new OpenAI({ apiKey });

    // TODO health check

    // First API request
    const response = await openai.chat.completions.create({
      ...config,
      messages,
      tools,
      tool_choice: "auto", // TODO can be enhanced
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
      // const toolArgs = JSON.parse(toolCall.function.arguments);
      if (toolName === "getCurrentTabHTML") {
        toolResult = await getCurrentTabHTML();
      } else {
        toolResult = "Functionality not defined!";
      }
    }

    // Append the model's response and the tool result to messages
    messages.push(responseMessage);
    if (toolResult) {
      for (let i = 0; i < (toolResult!.length % MAX_TOKEN) + 1; i++) {
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolResult.slice(
            i * MAX_TOKEN,
            Math.min((i + 1) * MAX_TOKEN, toolResult.length),
          ),
        });
      }
    }

    // Second API request with updated messages
    const secondResponse = await openai.chat.completions.create({
      ...config,
      messages,
    });

    return secondResponse.choices[0].message.content || "Nothing to say!";
  } catch (err) {
    console.debug(err);
    return "Something went wrong!";
  }
}
