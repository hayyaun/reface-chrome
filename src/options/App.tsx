import clsx from "clsx";
import { useState } from "react";
import PatchList from "../components/PatchList";
import Settings from "../components/Settings";
import { useStore } from "../store";

export default function App() {
  const urls = useStore((s) => s.urls);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <header className="flex items-center justify-between gap-2 bg-white/5 p-2 text-xs">
        Settings
      </header>
      <main className="relative flex min-h-0 flex-1 items-stretch">
        <aside className="flex basis-48 flex-col overflow-y-auto border-r border-white/5">
          <div
            className={clsx(
              "cursor-pointer p-2 even:bg-white/2 hover:bg-white/5",
              { "bg-white/25 hover:bg-white/50": selected === null },
            )}
            onClick={() => setSelected(null)}
          >
            General
          </div>
          {Object.keys(urls).map((url, i) => (
            <div
              key={i}
              className={clsx(
                "cursor-pointer p-2 even:bg-white/2 hover:bg-white/5",
                { "bg-white/25 hover:bg-white/50": selected === url },
              )}
              onClick={() => setSelected(url)}
            >
              {url}
            </div>
          ))}
        </aside>
        {!selected ? <Settings /> : <PatchList hostname={selected} />}
      </main>
    </>
  );
}
