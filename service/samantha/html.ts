import api, { type Tab } from "@/shared/api";

export async function getRawHTML(tab: Tab): Promise<string> {
  const results = await api.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => document.body.innerHTML,
  });
  const result = results[0].result;
  return result ?? "No content";
}
