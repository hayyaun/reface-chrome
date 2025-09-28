import { useEffect, useState } from "react";
import { useStore } from "./store";

export default function App() {
  const urls = useStore((s) => s.urls);
  const updateURL = useStore((s) => s.updateURL);

  const onClick = () => {
    updateURL("wikipedia.org", { fixes: [] });
  };

  console.log(urls);

  const [activeTab, setActiveTab] = useState("Better");

  useEffect(() => {
    if (import.meta.env.DEV) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab) return;
      const url = new URL(activeTab.url!);
      setActiveTab(url.hostname);
    });
  }, []);

  return (
    <>
      <header className="bg-white/5 p-2 px-4">
        <p>{activeTab}</p>
      </header>
      <div className="">
        <button onClick={onClick}>update</button>
      </div>
      <div>
        {Object.keys(urls).map((url, i) => (
          <p key={i}>{url}</p>
        ))}
      </div>
    </>
  );
}
