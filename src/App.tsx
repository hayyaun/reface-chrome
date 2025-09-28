import { useEffect, useMemo, useState } from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { useStore } from "./store";

export default function App() {
  const urls = useStore((s) => s.urls);
  const updateURL = useStore((s) => s.updateURL);
  const [activeTab, setActiveTab] = useState("Better");

  console.log(urls);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab) return;
      const url = new URL(activeTab.url!);
      setActiveTab(url.hostname);
    });
  }, []);

  const onClick = () => {
    updateURL(activeTab, { enabled: ["wikipedia-cool"] });
  };

  const extActive = useMemo(() => {
    return !!Object.keys(urls).find((url) => activeTab.includes(url));
  }, [activeTab, urls]);

  return (
    <>
      <header className="flex justify-between gap-2 bg-white/5 p-2">
        <p>{activeTab}</p>
        {extActive && (
          <RiCheckboxCircleFill className="size-4 text-green-400" />
        )}
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
