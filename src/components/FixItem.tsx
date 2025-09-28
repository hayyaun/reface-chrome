import { useStore } from "../store";
import type { Fix } from "../types";

interface Props {
  activeTab: string;
  key: string;
  fix: Fix;
}

export default function FixItem({ activeTab, key, fix }: Props) {
  const urls = useStore((s) => s.urls);
  const updateURL = useStore((s) => s.updateURL); // FIXME

  const onApply = () => {
    updateURL(activeTab, { enabled: [key] }); // FIXME
  };

  return (
    <div className="flex justify-between gap-2 p-2 hover:bg-white/5">
      <span>{fix.name}</span>
      {urls[activeTab].enabled.includes(key) ? (
        <button onClick={onApply}>apply</button>
      ) : (
        <button className="bg-red-400" onClick={() => {}}>
          remove
        </button>
      )}
    </div>
  );
}
