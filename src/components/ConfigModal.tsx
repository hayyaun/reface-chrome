import { reloadActiveTab } from "@/shared/api/utils";
import patches from "@/shared/patches";
import { usePrefs, useService } from "@/shared/store";
import type { ConfigValue } from "@/shared/types";
import { extractDefaultConfigData } from "@/shared/utils";
import { produce } from "immer";
import _ from "lodash";
import { useMemo, useState } from "react";
import { RiResetLeftLine } from "react-icons/ri";
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
          .filter((key) => typeof patch.config![key] !== "undefined" && !patch.config![key].hidden) // filter out removed or hidden items
          .map((key, i) => (
            <SettingItem
              key={i}
              title={patch.config![key].name}
              details={patch.config![key].details}
              value={data[key]}
              onChange={(v) => {
                set(
                  produce((state) => {
                    state[key] = v as ConfigValue;
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
