export async function getReadableContent(
  tab: chrome.tabs.Tab,
): Promise<string> {
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => {
      // Selectors for elements to remove (navigation, ads, etc.)
      const excludeSelectors = [
        "nav",
        "header",
        "footer",
        "aside",
        '[role="navigation"]',
        '[role="banner"]',
        '[role="complementary"]',
        ".nav",
        ".navigation",
        ".navbar",
        ".header",
        ".footer",
        ".sidebar",
        ".ad",
        ".ads",
        ".advertisement",
        ".promo",
        ".related",
        ".comments",
        ".social",
        ".share",
        ".cookie",
        ".popup",
        ".modal",
        ".overlay",
        "script",
        "style",
        "noscript",
        "iframe",
      ];

      // Clone the body to avoid modifying the actual page
      const clone = document.body.cloneNode(true) as HTMLElement;

      // Remove excluded elements
      excludeSelectors.forEach((selector) => {
        clone.querySelectorAll(selector).forEach((el) => el.remove());
      });

      // Find the main content area
      const mainSelectors = [
        "main",
        "article",
        '[role="main"]',
        ".content",
        ".main-content",
        ".article",
        ".post",
        ".entry-content",
        "#content",
        "#main",
      ];

      let mainContent: Element | null = null;
      for (const selector of mainSelectors) {
        mainContent = clone.querySelector(selector);
        if (mainContent) break;
      }

      // If no main content found, use the whole clone
      const contentRoot = mainContent || clone;

      // Extract text with structure
      function extractText(element: Element, depth = 0): string {
        let text = "";
        const indent = "  ".repeat(depth);

        for (const node of Array.from(element.childNodes)) {
          if (node.nodeType === Node.TEXT_NODE) {
            const content = node.textContent?.trim();
            if (content) {
              text += content + " ";
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            const tag = el.tagName.toLowerCase();

            // Handle headings
            if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
              const content = el.textContent?.trim();
              if (content) {
                text +=
                  "\n\n" +
                  "#".repeat(parseInt(tag[1])) +
                  " " +
                  content +
                  "\n\n";
              }
            }
            // Handle paragraphs
            else if (tag === "p") {
              const content = el.textContent?.trim();
              if (content) {
                text += "\n\n" + content + "\n\n";
              }
            }
            // Handle lists
            else if (tag === "li") {
              const content = el.textContent?.trim();
              if (content) {
                text += "\n" + indent + "• " + content;
              }
            }
            // Handle line breaks
            else if (tag === "br") {
              text += "\n";
            }
            // Recursively process other elements
            else if (!["script", "style", "noscript"].includes(tag)) {
              text += extractText(el, depth + 1);
            }
          }
        }

        return text;
      }

      const rawText = extractText(contentRoot);

      // Clean up excessive whitespace and newlines
      const cleanText = rawText
        .replace(/\n{3,}/g, "\n\n")
        .replace(/ {2,}/g, " ")
        .trim();

      return cleanText || "No readable content found on this page.";
    },
  });

  return results[0].result ?? "No content";
}
