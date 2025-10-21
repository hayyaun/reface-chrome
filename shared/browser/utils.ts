import api from "@/shared/api";

export async function reloadActiveTab() {
  if (!import.meta.env.PROD) return;
  api.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const activeTab = tabs[0];
    if (!activeTab.id || !activeTab.url) return;
    const protocol = new URL(activeTab.url).protocol;
    if (!["http:", "https:"].includes(protocol)) return;
    api.tabs.reload(activeTab.id);
  });
}
