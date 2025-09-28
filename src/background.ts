chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.storage.local.get("targetDomain", ({ targetDomain }) => {
      console.log(targetDomain);
      if (targetDomain && tab.url?.includes(targetDomain)) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            document.body.style.backgroundColor = "black";
          },
        });
      }
    });
  }
});
