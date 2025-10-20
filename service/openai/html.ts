import browser from "webextension-polyfill";

export async function getRawHTML(tab: browser.Tabs.Tab): Promise<string> {
  const results = await browser.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => document.body.innerHTML,
  });
  const result = results[0].result as string;
  return result ?? "No content";
}
