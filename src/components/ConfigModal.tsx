import { produce } from "immer";
import _ from "lodash";
import { useMemo, useState } from "react";
import { RiResetLeftLine } from "react-icons/ri";
import patches from "../../shared/config/patches";
import { reloadActiveTab } from "../../shared/chrome/utils";
import { usePrefs, useService } from "../../shared/store";
import { extractDefaultConfigData } from "../../shared/utils";
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
        {Object.keys(data)
          .filter((key) => !patch.config![key].hidden)
          .map((key, i) => (
            <SettingItem
              key={i}
              title={patch.config![key].name}
              details={patch.config![key].details}
              value={data[key]}
              onChange={(v) => {
                set(
                  produce((state) => {
                    state[key] = v;
                  }),
                );
              }}
              options={patch.config![key].options}
            />
          ))}
      </div>
      <div aria-label="Buttons" className="flex gap-2 p-2">
        <button className="icon-btn group/icon" onClick={onReset}>
          <RiResetLeftLine className="icon-rotate" />
        </button>
        <button className="btn-primary flex-1 rounded-lg p-2" onClick={onSave}>
          Save changes
        </button>
      </div>
    </>
  );
}
