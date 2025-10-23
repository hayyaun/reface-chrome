import api from "@/shared/api";

export async function getRawHTML(tab: browser.tabs.Tab): Promise<string> {
  const results = await api.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => document.body.innerHTML,
  });
  const result = results[0].result;
  return result ?? "No content";
}
