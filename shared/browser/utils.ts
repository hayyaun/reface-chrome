import api from "@/shared/api";

export async function reloadActiveTab() {
  if (!import.meta.env.PROD) return;
  const activeTab = await getActiveTab();
  if (!activeTab?.id || !activeTab.url) return;
  const protocol = new URL(activeTab.url).protocol;
  if (!["http:", "https:"].includes(protocol)) return;
  api.tabs.reload(activeTab.id);
}

export async function getActiveTab(): Promise<browser.tabs.Tab | undefined> {
  if (typeof browser !== "undefined") {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs.length || !tabs[0]) return;
    return tabs[0];
  }
  const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) =>
    chrome.tabs.query({ active: true, currentWindow: true }, resolve),
  );
  if (!tabs.length || !tabs[0]) return;
  return tabs[0];
}

export async function getTab(tabId: number): Promise<browser.tabs.Tab> {
  if (typeof browser !== "undefined") {
    return await browser.tabs.get(tabId);
  }
  return new Promise<chrome.tabs.Tab>((resolve) => chrome.tabs.get(tabId, resolve));
}
