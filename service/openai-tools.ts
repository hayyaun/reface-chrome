import type OpenAI from "openai";

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  // {
  //   type: "function",
  //   function: {
  //     name: "getCurrentTabHTML",
  //     description:
  //       "Get the current tab html content, could be used to summerize or look for specific elements or anything else.",
  //   },
  // },
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
  return result ?? "No content";
}

interface SearchDOMParams {
  selector: string;
  selectorType?: "css" | "xpath";
  includeChildren?: boolean;
  includeText?: boolean;
  maxResults?: number;
}

interface ElementInfo {
  tagName: string;
  id?: string;
  classes: string[];
  attributes: Record<string, string>;
  textContent?: string;
  childrenCount: number;
  children?: Array<{ tagName: string; classes: string[]; id?: string }>;
  path: string;
}

export async function searchDOM(params: SearchDOMParams): Promise<string> {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (!tab) return JSON.stringify({ error: "No active tab found!" });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: (args) => {
      const {
        selector,
        selectorType = "css",
        includeChildren = false,
        includeText = true,
        maxResults = 10,
      } = args;

      function getElementPath(element: Element): string {
        const path: string[] = [];
        let current: Element | null = element;
        while (current && current !== document.body) {
          let selector = current.tagName.toLowerCase();
          if (current.id) {
            selector += `#${current.id}`;
          } else if (current.className) {
            const classes = Array.from(current.classList).join(".");
            if (classes) selector += `.${classes}`;
          }
          path.unshift(selector);
          current = current.parentElement;
        }
        return path.join(" > ");
      }

      function getElementInfo(element: Element): ElementInfo {
        const info: ElementInfo = {
          tagName: element.tagName.toLowerCase(),
          classes: Array.from(element.classList),
          attributes: {},
          childrenCount: element.children.length,
          path: getElementPath(element),
        };

        if (element.id) info.id = element.id;

        Array.from(element.attributes).forEach((attr) => {
          if (attr.name !== "class") {
            info.attributes[attr.name] = attr.value;
          }
        });

        if (includeText) {
          const text = element.textContent?.trim();
          if (text && text.length <= 200) {
            info.textContent = text;
          } else if (text) {
            info.textContent = text.substring(0, 200) + "...";
          }
        }

        if (includeChildren && element.children.length > 0) {
          info.children = Array.from(element.children)
            .slice(0, 5)
            .map((child) => ({
              tagName: child.tagName.toLowerCase(),
              classes: Array.from(child.classList),
              id: child.id || undefined,
            }));
        }

        return info;
      }

      try {
        let elements: Element[];

        if (selectorType === "xpath") {
          const xpathResult = document.evaluate(
            selector,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null,
          );
          elements = [];
          for (
            let i = 0;
            i < Math.min(xpathResult.snapshotLength, maxResults);
            i++
          ) {
            const node = xpathResult.snapshotItem(i);
            if (node instanceof Element) elements.push(node);
          }
        } else {
          elements = Array.from(document.querySelectorAll(selector)).slice(
            0,
            maxResults,
          );
        }

        const results = elements.map(getElementInfo);

        return JSON.stringify({
          count: elements.length,
          results,
        });
      } catch (error) {
        return JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    args: [params],
  });

  return results[0].result ?? JSON.stringify({ error: "No result" });
}
