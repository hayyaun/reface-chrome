import clsx from "clsx";
import { RiAddFill, RiDeleteBinFill } from "react-icons/ri";
import { reloadActiveTab } from "../chrome/utils";
import { categories, icons } from "../config/patches";
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
  const enabled = urls[hostname] && urls[hostname].enabled.includes(patchKey);
  const Icon = icons[patch.keywords[0] ?? categories.all];
  return (
    <div className="flex items-center gap-3 p-2 transition select-none even:bg-white/1 hover:bg-white/5">
      {Icon && (
        <div className="rounded-lg bg-white/10 p-1.75">
          {<Icon className="size-5" />}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <span>{patch.name}</span>
        <span
          title={patch.details.length > 40 ? patch.details : undefined}
          className="text-tiny line-clamp-1 opacity-45"
        >
          {patch.details}
        </span>
      </div>
      <div className="flex-1" />
      <div
        className={clsx(
          "cursor-pointer rounded-sm p-1 transition",
          !enabled
            ? "bg-green-400/10 hover:bg-green-400/25"
            : "bg-red-400/10 hover:bg-red-400/25",
        )}
        onClick={() => {
          if (!enabled) addPatch(hostname, patchKey);
          else removePatch(hostname, patchKey);
          setTimeout(reloadActiveTab, 1000);
        }}
      >
        {!enabled ? (
          <RiAddFill className="size-4 text-green-400" />
        ) : (
          <RiDeleteBinFill className="size-4 text-red-400" />
        )}
      </div>
    </div>
  );
}
