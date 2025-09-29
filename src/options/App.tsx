import clsx from "clsx";
import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { RiSettingsFill } from "react-icons/ri";
import PatchList from "../components/PatchList";
import Settings from "../components/Settings";
import { useStore } from "../store";

export default function App() {
  const urls = useStore((s) => s.urls);
  const [selected, setSelected] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const relevantItems = useMemo(
    () => Object.keys(urls).filter((k) => k.includes(deferredQuery)),
    [deferredQuery, urls],
  );

  return (
    <>
      <header className="flex items-center justify-between gap-2 bg-white/5 p-2 text-xs">
        Settings
      </header>
      <main className="relative flex min-h-0 flex-1 items-stretch">
        <aside className="flex basis-48 flex-col border-r border-white/5">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <ListItem
              title={
                <span className="flex items-center justify-between gap-1">
                  General
                  <RiSettingsFill />
                </span>
              }
              active={selected === null}
              onClick={() => setSelected(null)}
            />
            {relevantItems.map((url, i) => (
              <ListItem
                key={i}
                title={url}
                active={selected === url}
                onClick={() => setSelected(url)}
              />
            ))}
          </div>
          <div className="p-2">
            <input
              className="w-full rounded-full bg-white/5 p-1.5 px-4"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </aside>
        {!selected ? <Settings /> : <PatchList hostname={selected} />}
      </main>
    </>
  );
}

function ListItem({
  title,
  active,
  onClick,
}: {
  title: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={clsx("cursor-pointer p-2 even:bg-white/2 hover:bg-white/5", {
        "bg-white/25 hover:bg-white/25": active,
      })}
      onClick={onClick}
    >
      {title}
    </div>
  );
}
