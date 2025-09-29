export async function reloadActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab.id) return;
    chrome.tabs.reload(activeTab.id);
  });
}
