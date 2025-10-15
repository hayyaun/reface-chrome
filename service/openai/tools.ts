import type OpenAI from "openai";

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  // DOM
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
  // Chrome tabs
  {
    type: "function",
    function: {
      name: "chrome_tabs_query",
      description:
        "Gets all tabs that have the specified properties, or all tabs if no properties are specified.",
      parameters: {
        type: "object",
        properties: {
          queryInfo: {
            type: "object",
            properties: {
              active: {
                type: "boolean",
                description: "Whether the tabs are active in their windows.",
              },
              audible: {
                type: "boolean",
                description: "Whether the tabs are audible.",
              },
              autoDiscardable: {
                type: "boolean",
                description:
                  "Whether the tabs can be discarded automatically by the browser when resources are low.",
              },
              currentWindow: {
                type: "boolean",
                description: "Whether the tabs are in the current window.",
              },
              discarded: {
                type: "boolean",
                description:
                  "Whether the tabs are discarded. A discarded tab is one whose content has been unloaded from memory, but is still visible in the tabstrip. Its content is reloaded the next time it is activated.",
              },
              frozen: {
                type: "boolean",
                description: "Whether the tabs are frozen.",
              },
              groupId: {
                type: "number",
                description: "The ID of the group that the tabs are in.",
              },
              highlighted: {
                type: "boolean",
                description: "Whether the tabs are highlighted.",
              },
              index: {
                type: "number",
                description:
                  "The zero-based index of the tabs within their windows.",
              },
              lastFocusedWindow: {
                type: "boolean",
                description: "Whether the tabs are in the last focused window.",
              },
              muted: {
                type: "boolean",
                description: "Whether the tabs are muted.",
              },
              pinned: {
                type: "boolean",
                description: "Whether the tabs are pinned.",
              },
              splitViewId: {
                type: "number",
                description: "The ID of the split view that the tabs are in.",
              },
              status: {
                type: "string",
                description:
                  "The status of the tabs. Can be either loading or complete.",
                enum: ["loading", "complete"],
              },
              title: {
                type: "string",
                description: "Match page titles against a pattern.",
              },
              url: {
                type: ["string", "array"],
                description:
                  "Match tabs against one or more URL patterns. Fragment identifiers are not matched.",
                items: { type: "string" },
              },
              windowId: {
                type: "number",
                description:
                  "The ID of the parent window, or windows.WINDOW_ID_CURRENT for the current window.",
              },
              windowType: {
                type: "string",
                description: "The type of window the tabs are in.",
                enum: ["normal", "popup", "panel", "app", "devtools"],
              },
            },
            additionalProperties: false,
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_tabs_create",
      description: "Creates a new tab.",
      parameters: {
        type: "object",
        properties: {
          createProperties: {
            type: "object",
            properties: {
              active: {
                type: "boolean",
                description:
                  "Whether the tab should become the active tab in the window.",
              },
              index: {
                type: "number",
                description: "The position the tab should take in the window.",
              },
              openerTabId: {
                type: "number",
                description: "The ID of the tab that opened this tab.",
              },
              pinned: {
                type: "boolean",
                description: "Whether the tab should be pinned.",
              },
              selected: {
                type: "boolean",
                description: "Deprecated; use active instead.",
              },
              url: {
                type: "string",
                description: "The URL to initially navigate the tab to.",
              },
              windowId: {
                type: "number",
                description: "The window to create the tab in.",
              },
            },
            additionalProperties: false,
          },
        },
        required: ["createProperties"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_tabs_update",
      description:
        "Modifies the properties of a tab. Properties that are not specified in updateProperties are not modified.",
      parameters: {
        type: "object",
        properties: {
          tabId: {
            type: "number",
            description: "The ID of the tab to update.",
          },
          updateProperties: {
            type: "object",
            properties: {
              active: {
                type: "boolean",
                description: "Whether the tab should be active.",
              },
              autoDiscardable: {
                type: "boolean",
                description:
                  "Whether the tab should be discarded automatically by the browser when resources are low.",
              },
              highlighted: {
                type: "boolean",
                description:
                  "Adds or removes the tab from the current selection.",
              },
              muted: {
                type: "boolean",
                description: "Whether the tab should be muted.",
              },
              openerTabId: {
                type: "number",
                description: "The ID of the tab that opened this tab.",
              },
              pinned: {
                type: "boolean",
                description: "Whether the tab should be pinned.",
              },
              selected: {
                type: "boolean",
                description: "Deprecated; use highlighted instead.",
              },
              url: {
                type: "string",
                description: "A URL to change the tab's document to.",
              },
            },
            additionalProperties: false,
          },
        },
        required: ["updateProperties"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_tabs_remove",
      description: "Closes one or more tabs.",
      parameters: {
        type: "object",
        properties: {
          tabIds: {
            type: ["number", "array"],
            description: "The tab or list of tabs to close.",
            items: { type: "number" },
          },
        },
        required: ["tabIds"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_tabs_get",
      description: "Retrieves details about the specified tab.",
      parameters: {
        type: "object",
        properties: {
          tabId: {
            type: "number",
            description: "The ID of the tab to retrieve.",
          },
        },
        required: ["tabId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_tabs_move",
      description:
        "Moves one or more tabs to a new position within its window, or to a new window.",
      parameters: {
        type: "object",
        properties: {
          tabIds: {
            type: ["number", "array"],
            description: "The tab or list of tabs to move.",
            items: { type: "number" },
          },
          moveProperties: {
            type: "object",
            properties: {
              index: {
                type: "number",
                description: "The position to move the tab to.",
              },
              windowId: {
                type: "number",
                description: "The window to move the tab to.",
              },
            },
            additionalProperties: false,
          },
        },
        required: ["tabIds", "moveProperties"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_tabs_reload",
      description: "Reload a tab.",
      parameters: {
        type: "object",
        properties: {
          tabId: {
            type: "number",
            description:
              "The ID of the tab to reload; defaults to the selected tab of the current window.",
          },
          reloadProperties: {
            type: "object",
            properties: {
              bypassCache: {
                type: "boolean",
                description: "Whether using any local cache. Default is false.",
              },
            },
            additionalProperties: false,
          },
        },
        required: [],
      },
    },
  },
  // Chrome bookmarks
  {
    type: "function",
    function: {
      name: "chrome_bookmarks_search",
      description:
        "Searches for BookmarkTreeNodes matching the given query. Queries specified with an object produce BookmarkTreeNodes matching all specified properties.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: ["string", "object"],
            description:
              "Either a string of words and quoted phrases that are matched against bookmark URLs and titles, or an object. If an object, the properties `query`, `url`, and `title` may be specified and bookmarks matching all specified properties will be produced.",
            properties: {
              query: {
                type: "string",
                description:
                  "A string of words and quoted phrases that are matched against bookmark URLs and titles.",
              },
              title: {
                type: "string",
                description: "The title of the bookmark; matches verbatim.",
              },
              url: {
                type: "string",
                description:
                  "The URL of the bookmark; matches verbatim. Note that folders have no URL.",
              },
            },
            additionalProperties: false,
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_bookmarks_create",
      description:
        "Creates a bookmark or folder under the specified parentId. If url is NULL or missing, it will be a folder.",
      parameters: {
        type: "object",
        properties: {
          bookmark: {
            type: "object",
            properties: {
              index: {
                type: "number",
                description: "The position of the new bookmark.",
              },
              parentId: {
                type: "string",
                description:
                  "The ID of the parent folder. Defaults to the Other Bookmarks folder.",
              },
              title: {
                type: "string",
                description: "The title of the bookmark.",
              },
              url: { type: "string", description: "The URL of the bookmark." },
            },
            additionalProperties: false,
          },
        },
        required: ["bookmark"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_bookmarks_update",
      description:
        "Updates the properties of a bookmark or folder. Specify only the properties that you want to change; unspecified properties will be left unchanged. Note: Currently, only 'title' and 'url' are supported.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The ID of the bookmark to update.",
          },
          changes: {
            type: "object",
            properties: {
              title: { type: "string", description: "The new title." },
              url: { type: "string", description: "The new URL." },
            },
            additionalProperties: false,
          },
        },
        required: ["id", "changes"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_bookmarks_remove",
      description: "Removes a bookmark or an empty bookmark folder.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The ID of the bookmark to remove.",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_bookmarks_removeTree",
      description: "Recursively removes a bookmark folder.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The ID of the folder to remove recursively.",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_bookmarks_get",
      description: "Retrieves the specified BookmarkTreeNode(s).",
      parameters: {
        type: "object",
        properties: {
          idOrIdList: {
            type: ["string", "array"],
            description:
              "A single string-valued id, or an array of string-valued ids.",
            items: { type: "string" },
          },
        },
        required: ["idOrIdList"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_bookmarks_move",
      description:
        "Moves the specified BookmarkTreeNode to the provided location.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The ID of the bookmark to move.",
          },
          destination: {
            type: "object",
            properties: {
              index: { type: "number", description: "The new position." },
              parentId: {
                type: "string",
                description: "The new parent folder ID.",
              },
            },
            additionalProperties: false,
          },
        },
        required: ["id", "destination"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_bookmarks_getChildren",
      description:
        "Retrieves the children of the specified BookmarkTreeNode id.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string", description: "The ID of the folder." },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "chrome_bookmarks_getTree",
      description: "Retrieves the entire Bookmarks hierarchy.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
];
