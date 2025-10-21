import clsx from "clsx";
import _ from "lodash";
import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { RiFilterFill, RiFilterOffFill, RiSettingsFill } from "react-icons/ri";
import Footer from "../components/Footer";
import PatchList from "../components/PatchList";
import Settings from "../components/Settings";
import { hostnames as entireHostnames } from "@/shared/patches";
import { useService } from "@/shared/store";

export default function App() {
  const hostnames = useService((s) => s.hostnames);
  const [selected, setSelected] = useState<string | null>(null);
  const [enabledOnly, setEnabledOnly] = useState(true);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const relevantItems = useMemo(() => {
    const enabledHostnames = _.pickBy(hostnames, (hn) => hn && hn.enabled.length > 0);
    const keys = Object.keys(Object.assign({}, enabledOnly ? {} : entireHostnames, enabledHostnames));
    return _.sortBy(keys).filter((k) => k.includes(deferredQuery));
  }, [deferredQuery, enabledOnly, hostnames]);
  return (
    <>
      <header className="flex items-center justify-between gap-2 bg-white/5 p-2 text-xs">
        <span>Settings</span>
      </header>
      <main className="relative flex min-h-0 flex-1 items-stretch">
        <aside aria-label="Tabs" className="flex basis-48 flex-col border-r border-white/5">
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
            {relevantItems.map((hostname, i) => (
              <ListItem key={i} title={hostname} active={selected === hostname} onClick={() => setSelected(hostname)} />
            ))}
          </div>
          <div aria-label="Searchbox" className="flex items-center gap-1 p-2">
            <input
              className="flex-1 rounded-full bg-white/5 p-1.5 px-4"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div
              aria-label="Filter"
              title="Show enabled only"
              className="cursor-pointer rounded-sm p-1 transition"
              onClick={() => setEnabledOnly(!enabledOnly)}
            >
              {enabledOnly ? (
                <RiFilterFill className="size-4 text-green-400" />
              ) : (
                <RiFilterOffFill className="size-4 text-white" />
              )}
            </div>
          </div>
        </aside>
        <section aria-label="Content" className="relative flex flex-1 flex-col overflow-hidden">
          {!selected ? <Settings /> : <PatchList hostname={selected} />}
          <Footer options />
        </section>
      </main>
    </>
  );
}

function ListItem({ title, active, onClick }: { title: ReactNode; active: boolean; onClick: () => void }) {
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
