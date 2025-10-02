import { useEffect, useMemo, useState } from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import Footer from "../components/Footer";
import PatchList from "../components/PatchList";
import { useStore } from "../store";

export default function App() {
  const urls = useStore((s) => s.urls);
  const [hostname, setHostname] = useState("reface");

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
      <main className="mt-1 flex flex-1 flex-col gap-1">
        <PatchList hostname={hostname} />
      </main>
      <Footer />
    </>
  );
}
