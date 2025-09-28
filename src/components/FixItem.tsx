import { RiAddFill, RiDeleteBinFill } from "react-icons/ri";
import { useStore } from "../store";
import type { Fix } from "../types";

interface Props {
  hostname: string;
  fixKey: string;
  fix: Fix;
}

export default function FixItem({ hostname, fixKey, fix }: Props) {
  const urls = useStore((s) => s.urls);
  const updateURL = useStore((s) => s.updateURL); // FIXME

  const onApply = () => {
    updateURL(hostname, { enabled: [fixKey] }); // FIXME
  };

  const onRemove = () => {
    updateURL(hostname, { enabled: [] }); // FIXME
  };

  const enabled = !urls[hostname] || !urls[hostname].enabled.includes(fixKey);

  return (
    <div className="flex items-center justify-between gap-2 p-2 transition select-none hover:bg-white/2">
      <div className="flex flex-col gap-1">
        <span>{fix.name}</span>
        <span className="text-tiny line-clamp-1 opacity-45">{fix.details}</span>
      </div>
      {enabled ? (
        <div
          className="cursor-pointer rounded-sm bg-green-400/5 p-1 transition hover:bg-green-400/25"
          onClick={onApply}
        >
          <RiAddFill className="size-4 text-green-400" />
        </div>
      ) : (
        <div
          className="cursor-pointer rounded-sm bg-red-400/5 p-1 transition hover:bg-red-400/25"
          onClick={onRemove}
        >
          <RiDeleteBinFill className="size-4 text-red-400" />
        </div>
      )}
    </div>
  );
}
