export async function getRawHTML(): Promise<string> {
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
