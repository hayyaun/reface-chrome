import clsx from "clsx";
import { RiAddFill, RiDeleteBinFill } from "react-icons/ri";
import { reloadActiveTab } from "../chrome/utils";
import { useStore } from "../store";
import type { Patch } from "../types";

interface Props {
  hostname: string;
  patchKey: string;
  patch: Patch;
}

export default function PatchItem({ hostname, patchKey, patch }: Props) {
  const urls = useStore((s) => s.urls);
  const addPatch = useStore((s) => s.addPatch);
  const removePatch = useStore((s) => s.removePatch);
  const enabled = !urls[hostname] || !urls[hostname].enabled.includes(patchKey);
  return (
    <div className="flex items-center justify-between gap-2 p-2 transition select-none hover:bg-white/2">
      <div className="flex flex-col gap-1">
        <span>{patch.name}</span>
        <span className="text-tiny line-clamp-1 opacity-45">
          {patch.details}
        </span>
      </div>
      <div
        className={clsx(
          "cursor-pointer rounded-sm p-1 transition",
          enabled
            ? "bg-green-400/5 hover:bg-green-400/25"
            : "bg-red-400/5 hover:bg-red-400/25",
        )}
        onClick={() => {
          if (!enabled) addPatch(hostname, patchKey);
          else removePatch(hostname, patchKey);
          setTimeout(reloadActiveTab, 1000);
        }}
      >
        {enabled ? (
          <RiAddFill className="size-4 text-green-400" />
        ) : (
          <RiDeleteBinFill className="size-4 text-red-400" />
        )}
      </div>
    </div>
  );
}
