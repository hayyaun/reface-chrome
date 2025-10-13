import { OpenAI } from "openai";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

const model: ChatCompletionCreateParamsBase["model"] = "gpt-4o-mini";
const openai = new OpenAI({ apiKey: "" }); // FIXME

// Example function (replace with your own)
function getWeather(location: string) {
  // In a real app, this could call an external API or database
  return {
    location,
    temperature: "72°F",
    condition: "Sunny",
    humidity: "45%",
  };
}

async function main() {
  // Define the tools (functions) available to the model
  const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "getWeather",
        description: "Get the current weather for a location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g., San Francisco, CA",
            },
          },
          required: ["location"],
        },
      },
    },
  ];

  // Initial messages
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What's the weather like in New York?" }, // Replace with your query
  ];

  // First API request
  const response = await openai.chat.completions.create({
    model,
    messages,
    tools,
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;

  // If no tool call, just output the response
  if (!responseMessage.tool_calls) {
    console.log(responseMessage.content);
    return;
  }

  // Handle tool calls (could be multiple, but handling one for simplicity)
  const toolCall = responseMessage.tool_calls[0];

  let toolResult;

  if (toolCall.type === "function") {
    const toolName = toolCall.function.name;
    const toolArgs = JSON.parse(toolCall.function.arguments);
    if (toolName === "getWeather") {
      toolResult = getWeather(toolArgs.location);
    } else {
      throw new Error(`Unknown tool: ${toolName}`);
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
    model,
    messages,
  });

  console.log(secondResponse.choices[0].message.content);
}

main().catch(console.error);
