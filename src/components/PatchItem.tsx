import clsx from "clsx";
import { memo } from "react";
import { CiCoffeeCup } from "react-icons/ci";
import {
  RiAddFill,
  RiCheckDoubleFill,
  RiCloseFill,
  RiDeleteBinFill,
  RiSettings2Line,
} from "react-icons/ri";
import { reloadActiveTab } from "../chrome/utils";
import { categories, icons } from "../config/mapping";
import patches from "../config/patches";
import { usePrefs, useStore } from "../store";
import Label from "./Label";

interface Props {
  hostname?: string;
  patchKey: string;
  openConfig: () => void;
  openProfile: () => void;
}

export default memo(function PatchItem({
  hostname,
  patchKey,
  openConfig,
  openProfile,
}: Props) {
  const patch = patches[patchKey];
  const global = useStore((s) => s.global);
  const addGlobal = useStore((s) => s.addGlobal);
  const removeGlobal = useStore((s) => s.removeGlobal);
  const excludePatch = useStore((s) => s.excludePatch);
  const includePatch = useStore((s) => s.includePatch);
  const addPatch = useStore((s) => s.addPatch);
  const removePatch = useStore((s) => s.removePatch);
  const hostnames = useStore((s) => s.hostnames);
  const autoReload = usePrefs((s) => s.autoReload);
  const enabledGlobally = global.includes(patchKey);
  const enabled = !!hostname && hostnames[hostname]?.enabled.includes(patchKey);
  const excluded =
    !!hostname && hostnames[hostname]?.excluded.includes(patchKey);
  const Icon = !patch.logo
    ? icons[patch.keywords[0] ?? categories.all]
    : typeof patch.logo !== "string"
      ? patch.logo
      : null;
  return (
    <div className="relative flex items-center gap-1.5 p-2 transition select-none even:bg-white/1 hover:bg-white/5">
      {Icon && (
        <div className="mr-2 shrink-0 rounded-lg bg-white/10 p-1.75">
          {typeof patch.logo !== "string" ? (
            <Icon className="size-5" style={{ color: patch.color }} />
          ) : (
            <img
              alt={patch.name}
              src={
                import.meta.env.PROD
                  ? chrome.runtime.getURL(patch.logo)
                  : patch.logo
              }
              className="size-5 object-contain"
            />
          )}
        </div>
      )}
      <Label name={patch.name} details={patch.details} />
      <div aria-label="Spacer" className="flex-1 basis-2" />
      {/* Buttons */}
      {patch.author?.donation && (
        <a
          title="Buy me a coffee"
          className="tiny-btn bg-yellow-300/3 hover:bg-yellow-400/10"
          target="_blank"
          href={patch.author.donation}
        >
          <CiCoffeeCup className="size-4 text-yellow-400" />
        </a>
      )}
      {patch.config && (
        <div
          title="Global Config"
          className="tiny-btn bg-white/3 hover:bg-white/10"
          onClick={openConfig}
        >
          <RiSettings2Line className="size-4" />
        </div>
      )}
      {!!patch.profile && (
        <div
          title={patch.profile.title}
          className="tiny-btn bg-white/3 hover:bg-white/10"
          onClick={openProfile}
        >
          <patch.profile.icon className="size-4" />
        </div>
      )}
      {patch.global && !patch.profile && (
        <div
          title={!enabledGlobally ? "Enable Globally" : "Disable Globally"}
          className={clsx(
            "tiny-btn",
            !enabledGlobally
              ? "bg-green-300/3 hover:bg-green-400/10"
              : "bg-red-300/3 hover:bg-red-400/10",
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
      {typeof hostname !== "undefined" && !patch.profile && (
        <div
          title={
            enabledGlobally
              ? !excluded
                ? "Exclude"
                : "Include"
              : enabled
                ? "Remove"
                : "Apply"
          }
          className={clsx(
            "tiny-btn",
            (enabledGlobally ? !excluded : enabled)
              ? "bg-red-300/3 hover:bg-red-400/10"
              : "bg-green-300/3 hover:bg-green-400/10",
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
