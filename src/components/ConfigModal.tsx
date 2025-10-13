import { produce } from "immer";
import _ from "lodash";
import { useMemo, useState } from "react";
import { RiResetLeftLine } from "react-icons/ri";
import { reloadActiveTab } from "../chrome/utils";
import patches from "../config/patches";
import { usePrefs } from "../prefs";
import { useStore } from "../store";
import { extractDefaultConfigData } from "../utils/patch";
import SettingItem from "./SettingItem";

interface Props {
  patchKey: string;
  close: () => void;
}

export default function ConfigModal({ patchKey, close }: Props) {
  const autoReload = usePrefs((s) => s.autoReload);
  const config = useStore((s) => s.config);
  const update = useStore((s) => s.updateConfig);
  const reset = useStore((s) => s.resetConfig);
  const defaultData = useMemo(
    () => extractDefaultConfigData(patchKey), // fallback
    [patchKey],
  );
  const [data, set] = useState(() => config[patchKey] || defaultData);
  const patch = patches[patchKey];
  const onReset = () => set(defaultData);
  const onSave = () => {
    if (_.isEqual(data, defaultData)) reset(patchKey);
    else update(patchKey, data);
    if (autoReload) setTimeout(reloadActiveTab, 150);
    close();
  };
  return (
    <>
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
    </>
  );
}
