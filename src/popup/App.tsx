import { useEffect, useMemo, useState } from "react";
import {
  RiCheckboxCircleFill,
  RiGithubFill,
  RiSettingsFill,
} from "react-icons/ri";
import PatchItem from "../components/PatchItem";
import patches from "../config/patches";
import strings from "../config/strings";
import { useStore } from "../store";

export default function App() {
  const urls = useStore((s) => s.urls);
  const [hostname, setHostname] = useState("betterer.dev");

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

  const relevantPatchKeys = useMemo(
    () =>
      Object.keys(patches).filter((k) =>
        patches[k].urls.find((url) => hostname.includes(url)),
      ),
    [hostname],
  );

  const openOptions = () => {
    if (import.meta.env.DEV) return;
    chrome.runtime.openOptionsPage();
  };

  return (
    <>
      <header className="flex items-center justify-between gap-2 bg-white/5 p-2 text-xs">
        <p>{hostname}</p>
        {!!active && (
          <div className="p-1">
            <RiCheckboxCircleFill className="size-4 text-green-400" />
          </div>
        )}
      </header>
      <main className="flex flex-col gap-1">
        {relevantPatchKeys.map((patchKey) => (
          <PatchItem
            key={patchKey}
            hostname={hostname}
            patchKey={patchKey}
            patch={patches[patchKey]}
          />
        ))}
      </main>
      <footer className="flex items-center justify-between gap-2 p-2">
        <div className="flex items-center gap-2">
          <a href={strings.github} target="_blank" className="text-current">
            <RiGithubFill className="size-4" />
          </a>
          <span className="text-tiny opacity-25">{"Contribute on Github"}</span>
        </div>
        <div className="cursor-pointer p-1" onClick={openOptions}>
          <RiSettingsFill className="size-4 cursor-pointer" />
        </div>
      </footer>
    </>
  );
}
