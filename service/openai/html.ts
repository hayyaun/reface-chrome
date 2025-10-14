export async function getRawHTML(tab: chrome.tabs.Tab): Promise<string> {
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => document.body.innerHTML,
  });
  const result = results[0].result;
  return result ?? "No content";
}
