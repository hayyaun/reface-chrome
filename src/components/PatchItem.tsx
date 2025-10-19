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
import { useUIActions } from "../hooks/ui";
import { usePrefs, useService } from "../store";
import Label from "./Label";

interface Props {
  hostname?: string;
  patchKey: string;
}

export default memo(function PatchItem({ hostname, patchKey }: Props) {
  const global = useService((s) => s.global);
  const addGlobal = useService((s) => s.addGlobal);
  const removeGlobal = useService((s) => s.removeGlobal);
  const excludePatch = useService((s) => s.excludePatch);
  const includePatch = useService((s) => s.includePatch);
  const addPatch = useService((s) => s.addPatch);
  const removePatch = useService((s) => s.removePatch);
  const hostnames = useService((s) => s.hostnames);
  const autoReload = usePrefs((s) => s.autoReload);

  const { openConfig, openProfile } = useUIActions(patchKey);

  const patch = patches[patchKey];
  const enabledGlobally = global.includes(patchKey);
  const enabled = !!hostname && hostnames[hostname]?.enabled.includes(patchKey);
  const excluded =
    !!hostname && hostnames[hostname]?.excluded.includes(patchKey);
  const Icon = !patch.logo
    ? icons[patch.keywords[0] ?? categories.all]
    : typeof patch.logo !== "string"
      ? patch.logo
      : null;

  const neutral = !patch.css && patch.noJS;
  const profile = neutral || enabled ? patch.profile : undefined;

  return (
    <div
      className={clsx(
        "group/item relative flex items-center gap-1.5 p-2 transition select-none even:bg-white/1 hover:bg-white/5",
        { "cursor-pointer": profile },
      )}
      onClick={profile && openConfig}
    >
      <div
        aria-label="Bg shade"
        className="pointer-events-none absolute inset-0 z-0 size-full opacity-5 group-hover/item:opacity-10"
        style={{ backgroundColor: patch.bgcolor }}
      />
      {Icon && (
        <div
          className="mr-2 shrink-0 rounded-lg bg-white/10 p-1.75"
          style={{ backgroundColor: patch.bgcolor }}
        >
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
          className="tiny-btn group/icon bg-zinc-400/3 text-zinc-400 hover:bg-yellow-600/10 hover:text-yellow-600 active:bg-yellow-600/20"
          target="_blank"
          href={patch.author.donation}
        >
          <CiCoffeeCup className="icon-zoom" />
        </a>
      )}
      {patch.config && (
        <div
          title="Global Config"
          className="tiny-btn group/icon bg-zinc-400/3 text-zinc-400 hover:bg-purple-300/10 hover:text-purple-300 active:bg-purple-300/20"
          onClick={openConfig}
        >
          <RiSettings2Line className="icon-rotate" />
        </div>
      )}
      {profile && (
        <div
          title={profile.title}
          className="tiny-btn group/icon"
          onClick={openProfile}
        >
          <profile.icon className="icon-zoom" />
        </div>
      )}
      {patch.global && !neutral && (
        <div
          title={!enabledGlobally ? "Enable Globally" : "Disable Globally"}
          className={clsx(
            "tiny-btn group/icon",
            !enabledGlobally ? "btn-green" : "btn-red",
          )}
          onClick={() => {
            if (!enabledGlobally) addGlobal(patchKey, hostname);
            else removeGlobal(patchKey, hostname);
            if (autoReload) setTimeout(reloadActiveTab, 150);
          }}
        >
          {!enabledGlobally ? (
            <RiCheckDoubleFill className="icon-zoom" />
          ) : (
            <RiCloseFill className="icon-zoom" />
          )}
        </div>
      )}
      {typeof hostname !== "undefined" && !neutral && (
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
            "tiny-btn group/icon",
            (enabledGlobally ? !excluded : enabled) ? "btn-red" : "btn-green",
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
            <RiDeleteBinFill className="icon-zoom" />
          ) : (
            <RiAddFill className="icon-zoom" />
          )}
        </div>
      )}
    </div>
  );
});
