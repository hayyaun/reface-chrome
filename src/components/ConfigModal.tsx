import { produce } from "immer";
import _ from "lodash";
import { useMemo, useState } from "react";
import { RiResetLeftLine } from "react-icons/ri";
import { reloadActiveTab } from "../chrome/utils";
import patches from "../config/patches";
import { usePrefs, useService } from "../store";
import { extractDefaultConfigData } from "../utils/patch";
import SettingItem from "./SettingItem";

interface Props {
  patchKey: string;
  close: () => void;
}

export default function ConfigModal({ patchKey, close }: Props) {
  const autoReload = usePrefs((s) => s.autoReload);
  const config = useService((s) => s.config);
  const update = useService((s) => s.updateConfig);
  const reset = useService((s) => s.resetConfig);
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
            options={patch.config![configKey].options}
          />
        ))}
      </div>
      <div aria-label="Buttons" className="flex gap-2 p-2">
        <button className="icon-btn group" onClick={onReset}>
          <RiResetLeftLine className="group icon-rotate" />
        </button>
        <button className="btn-primary flex-1 rounded-lg p-2" onClick={onSave}>
          Save changes
        </button>
      </div>
    </>
  );
}
