import { useEffect, useMemo, useState } from "react";
import { RiCheckboxCircleFill, RiGithubFill } from "react-icons/ri";
import FixItem from "./components/FixItem";
import strings from "./config/strings";
import fixes from "./fixes";
import { useStore } from "./store";

export default function App() {
  const urls = useStore((s) => s.urls);
  const [hostname, setHostname] = useState("betterer.dev");

  console.log(urls);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab) return;
      const url = new URL(activeTab.url!);
      setHostname(url.hostname);
    });
  }, []);

  const active = useMemo(
    () => Object.keys(urls).find((url) => hostname.includes(url)),
    [hostname, urls],
  );

  const relevantFixKeys = useMemo(
    () =>
      Object.keys(fixes).filter((k) =>
        fixes[k].urls.find((url) => hostname.includes(url)),
      ),
    [hostname],
  );

  return (
    <>
      <header className="flex items-center justify-between gap-2 bg-white/5 p-2 text-xs">
        <p>{hostname}</p>
        {!!active && <RiCheckboxCircleFill className="size-4 text-green-400" />}
      </header>
      <main className="">
        {relevantFixKeys.map((fixKey) => (
          <FixItem
            key={fixKey}
            hostname={hostname}
            fixKey={fixKey}
            fix={fixes[fixKey]}
          />
        ))}
      </main>
      <footer className="flex items-center gap-2 p-2">
        <a href={strings.github} className="text-current">
          <RiGithubFill className="size-4" />
        </a>
        <span className="text-tiny opacity-25">{"Contribute on Github"}</span>
      </footer>
    </>
  );
}
