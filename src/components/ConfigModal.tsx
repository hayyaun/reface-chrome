import clsx from "clsx";
import { produce } from "immer";
import _ from "lodash";
import { useMemo, useState } from "react";
import { RiCloseLine, RiResetLeftLine, RiSettings2Line } from "react-icons/ri";
import { reloadActiveTab } from "../chrome/utils";
import patches from "../config/patches";
import { useStore } from "../store";
import { extractDefaultConfigData } from "../utils/patch";
import Label from "./Label";
import SettingItem from "./SettingItem";

interface Props {
  patchKey: string;
  close: () => void;
}

export default function ConfigModal({ patchKey, close }: Props) {
  const autoReload = useStore((s) => s.autoReload);
  const config = useStore((s) => s.config);
  const update = useStore((s) => s.updateConfig);
  const reset = useStore((s) => s.resetConfig);
  const defaultData = useMemo(
    () => extractDefaultConfigData(patchKey), // fallback
    [patchKey],
  );
  const [data, set] = useState(() => config[patchKey] || defaultData);
  const patch = patches[patchKey];
  const [out, setOut] = useState(false);
  const onClose = () => {
    setOut(true);
    setTimeout(close, 500);
  };
  const onReset = () => set(defaultData);
  const onSave = () => {
    if (_.isEqual(data, defaultData)) reset(patchKey);
    else update(patchKey, data);
    if (autoReload) setTimeout(reloadActiveTab, 150);
    onClose();
  };
  return (
    <section
      className={clsx(
        "flex flex-1 flex-col gap-2", // container
        "bg-background absolute inset-0 z-50 size-full", //  modal
        out ? "animate-slide-out" : "animate-slide-in",
      )}
    >
      <div aria-label="Header" className="flex gap-2 p-4 pr-2">
        <div className="mr-2 shrink-0 rounded-lg bg-white/10 p-1.75">
          <RiSettings2Line className="size-5" />
        </div>
        <Label name={patch.name + " config"} details={patch.details} />
        <div className="flex-1" />
        <RiCloseLine
          className="size-6 cursor-pointer text-red-400 transition hover:-rotate-90 hover:text-red-600"
          onClick={onClose}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        {Object.keys(data).map((configKey, i) => (
          <SettingItem
            key={i}
            title={patch.config![configKey].name}
            details={patch.config![configKey].details}
            value={data[configKey]}
            onChange={(v) => {
              set(
                produce((state) => {
                  state[configKey] = v;
                }),
              );
            }}
          />
        ))}
      </div>
      <div aria-label="Buttons" className="flex gap-2 p-2">
        <button
          className="shrink-0 rounded-lg bg-white/5 p-1.75 hover:bg-white/10"
          onClick={onReset}
        >
          <RiResetLeftLine className="size-5 transition hover:-rotate-12 active:-rotate-45" />
        </button>
        <button
          className="flex-1 rounded-lg bg-purple-600 p-2 text-center text-white transition hover:bg-purple-700 active:bg-purple-800"
          onClick={onSave}
        >
          Save changes
        </button>
      </div>
    </section>
  );
}
