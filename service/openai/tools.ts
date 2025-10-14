import type OpenAI from "openai";

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getReadableContent",
      description:
        "Extract the main readable content from the page, similar to reader mode. Filters out navigation, ads, sidebars, and other non-content elements. Returns clean text with headings and paragraphs.",
    },
  },
  {
    type: "function",
    function: {
      name: "getRawHTML",
      description: "Gets raw html of the page.",
    },
  },
  {
    type: "function",
    function: {
      name: "searchDOM",
      description:
        "Search and explore the DOM tree using CSS selectors or XPath. Returns structured information about matching elements including their attributes, text content, children count, and path. Use this to recursively explore the page structure.",
      parameters: {
        type: "object",
        properties: {
          selector: {
            type: "string",
            description:
              "CSS selector or XPath expression to find elements (e.g., 'div.container', '//button[@type=\"submit\"]')",
          },
          selectorType: {
            type: "string",
            enum: ["css", "xpath"],
            description: "Type of selector being used",
            default: "css",
          },
          includeChildren: {
            type: "boolean",
            description:
              "Whether to include information about immediate children",
            default: false,
          },
          includeText: {
            type: "boolean",
            description: "Whether to include text content of elements",
            default: true,
          },
          maxResults: {
            type: "number",
            description: "Maximum number of results to return",
            default: 10,
          },
        },
        required: ["selector"],
      },
    },
  },
];
