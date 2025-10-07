import clsx from "clsx";
import { memo } from "react";
import {
  RiAddFill,
  RiCheckDoubleFill,
  RiCloseFill,
  RiDeleteBinFill,
} from "react-icons/ri";
import { reloadActiveTab } from "../chrome/utils";
import { categories, icons } from "../config/mapping";
import patches from "../config/patches";
import { useStore } from "../store";

interface Props {
  hostname?: string;
  patchKey: string;
}

export default memo(function PatchItem({ hostname, patchKey }: Props) {
  const patch = patches[patchKey];
  const global = useStore((s) => s.global);
  const addGlobal = useStore((s) => s.addGlobal);
  const removeGlobal = useStore((s) => s.removeGlobal);
  const excludePatch = useStore((s) => s.excludePatch);
  const includePatch = useStore((s) => s.includePatch);
  const addPatch = useStore((s) => s.addPatch);
  const removePatch = useStore((s) => s.removePatch);
  const autoReload = useStore((s) => s.autoReload);
  const hostnames = useStore((s) => s.hostnames);
  const enabledGlobally = global.includes(patchKey);
  const enabled = !!hostname && hostnames[hostname]?.enabled.includes(patchKey);
  const excluded =
    !!hostname && hostnames[hostname]?.excluded.includes(patchKey);
  const Icon = icons[patch.keywords[0] ?? categories.all];
  return (
    <div className="flex items-center gap-3 p-2 transition select-none even:bg-white/1 hover:bg-white/5">
      {Icon && (
        <div className="rounded-lg bg-white/10 p-1.75">
          {!patch.logo ? (
            <Icon className="size-5" style={{ color: patch.color }} />
          ) : (
            <img
              alt={patch.name}
              src={
                import.meta.env.PROD
                  ? chrome.runtime.getURL(patch.logo)
                  : patch.logo
              }
              className="size-5 object-contain text-white"
            />
          )}
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
      {patch.global && (
        <div
          title="Apply Globally"
          className={clsx(
            "cursor-pointer rounded-sm p-1 transition",
            !enabledGlobally
              ? "bg-green-400/10 hover:bg-green-400/25"
              : "bg-red-400/10 hover:bg-red-400/25",
          )}
          onClick={() => {
            if (!enabledGlobally) addGlobal(patchKey, hostname);
            else removeGlobal(patchKey, hostname);
            if (autoReload) setTimeout(reloadActiveTab, 150);
          }}
        >
          {!enabledGlobally ? (
            <RiCheckDoubleFill className="size-4 text-green-400" />
          ) : (
            <RiCloseFill className="size-4 text-red-400" />
          )}
        </div>
      )}
      {typeof hostname !== "undefined" && (
        <div
          title={enabledGlobally ? "Exclude Globally" : "Enabled Locally"}
          className={clsx(
            "cursor-pointer rounded-sm p-1 transition",
            (enabledGlobally ? !excluded : enabled)
              ? "bg-red-400/10 hover:bg-red-400/25"
              : "bg-green-400/10 hover:bg-green-400/25",
          )}
          onClick={() => {
            if (enabledGlobally) {
              if (!excluded) excludePatch(hostname, patchKey);
              else includePatch(hostname, patchKey);
            } else {
              if (enabled) removePatch(hostname, patchKey);
              else addPatch(hostname, patchKey);
            }
            if (autoReload) setTimeout(reloadActiveTab, 150);
          }}
        >
          {(enabledGlobally ? !excluded : enabled) ? (
            <RiDeleteBinFill className="size-4 text-red-400" />
          ) : (
            <RiAddFill className="size-4 text-green-400" />
          )}
        </div>
      )}
    </div>
  );
});
