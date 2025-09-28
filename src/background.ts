import { useStore } from "./store";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const urls = useStore().urls;
    for (const url of Object.keys(urls)) {
      if (url && tab.url?.includes(url)) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            document.body.style.backgroundColor = "purple";
            // TODO
          },
        });
      }
    }
  }
});
