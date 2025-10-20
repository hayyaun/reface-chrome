import browser from "webextension-polyfill";

export async function reloadActiveTab() {
  if (!import.meta.env.PROD) return;
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  if (!activeTab.id || !activeTab.url) return;
  const protocol = new URL(activeTab.url).protocol;
  if (!["http:", "https:"].includes(protocol)) return;
  browser.tabs.reload(activeTab.id);
}
