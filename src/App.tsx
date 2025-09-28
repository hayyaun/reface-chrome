import { useEffect, useMemo, useState } from "react";
import { RiCheckboxCircleFill, RiGithubFill } from "react-icons/ri";
import FixItem from "./components/FixItem";
import strings from "./config/strings";
import fixes from "./fixes";
import { useStore } from "./store";

export default function App() {
  const urls = useStore((s) => s.urls);
  const [activeTab, setActiveTab] = useState("betterer.dev");

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

  const active = useMemo(
    () => Object.keys(urls).find((url) => activeTab.includes(url)),
    [activeTab, urls],
  );

  const relevantFixKeys = useMemo(
    () =>
      Object.keys(fixes).filter((k) =>
        fixes[k].urls.find((url) => url === activeTab),
      ),
    [activeTab],
  );

  return (
    <>
      <header className="flex items-center justify-between gap-2 bg-white/5 p-2">
        <p>{activeTab}</p>
        {!!active && <RiCheckboxCircleFill className="size-4 text-green-400" />}
      </header>
      <main className="p-2">
        {relevantFixKeys.map((fixKey) => (
          <FixItem activeTab={activeTab} key={fixKey} fix={fixes[fixKey]} />
        ))}
      </main>
      <footer className="flex items-center gap-2 p-2 text-sm">
        <a href={strings.github} className="text-current">
          <RiGithubFill className="size-4" />
        </a>
        <span className="opacity-15">{"Contribute on Github"}</span>
      </footer>
    </>
  );
}
