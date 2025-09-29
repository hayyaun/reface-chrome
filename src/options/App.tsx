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
          <ListItem
            title="General"
            active={selected === null}
            onClick={() => setSelected(null)}
          />
          {Object.keys(urls).map((url, i) => (
            <ListItem
              key={i}
              title={url}
              active={selected === url}
              onClick={() => setSelected(url)}
            />
          ))}
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
  title: string;
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
