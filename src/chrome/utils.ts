export async function reloadActiveTab() {
  if (import.meta.env.DEV) return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab.id || !activeTab.url) return;
    const protocol = new URL(activeTab.url).protocol;
    if (!["http:", "https:"].includes(protocol)) return;
    chrome.tabs.reload(activeTab.id);
  });
}
