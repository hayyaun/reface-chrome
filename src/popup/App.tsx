import { getActiveTab } from "@/shared/api/utils";
import { useService } from "@/shared/store";
import { useEffect, useMemo, useState } from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import Footer from "../components/Footer";
import PatchList from "../components/PatchList";

export default function App() {
  const hostnames = useService((s) => s.hostnames);
  const [activeTabHostname, set] = useState("");

  useEffect(() => {
    if (import.meta.env.DEV) return;
    async function init() {
      const activeTab = await getActiveTab();
      if (!activeTab) return;
      const url = new URL(activeTab.url!);
      set(url.hostname);
    }
    init();
  }, []);

  const active = useMemo(
    () =>
      Object.keys(hostnames).find(
        (item) => activeTabHostname.includes(item) && !!hostnames[item]!.enabled.length,
      ),
    [activeTabHostname, hostnames],
  );

  return (
    <>
      <header className="flex items-center justify-between gap-2 bg-white/5 p-2 text-xs">
        <p>{activeTabHostname || "localhost (not functional)"}</p>
        {!!active && (
          <div className="px-1">
            <RiCheckboxCircleFill className="size-4 text-green-400" />
          </div>
        )}
      </header>
      <main className="mt-1 flex flex-1 flex-col gap-1">
        <PatchList hostname={activeTabHostname} />
      </main>
      <Footer />
    </>
  );
}
