import api from "@/shared/api";

export async function reloadActiveTab() {
  if (!import.meta.env.PROD) return;
  const activeTab = await getActiveTab();
  if (!activeTab?.id || !activeTab.url) return;
  const protocol = new URL(activeTab.url).protocol;
  if (!["http:", "https:"].includes(protocol)) return;
  await api.tabs.reload(activeTab.id);
}

export async function getActiveTab(): Promise<browser.tabs.Tab | undefined> {
  if (typeof browser !== "undefined") {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs.length || !tabs[0]) return;
    return tabs[0];
  }
  if (typeof chrome !== "undefined") {
    const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) =>
      chrome.tabs.query({ active: true, currentWindow: true }, resolve),
    );
    if (!tabs.length || !tabs[0]) return;
    return tabs[0];
  }
}
