import { produce } from "immer";
import _ from "lodash";
import { useMemo, useState } from "react";
import { RiCloseLine, RiResetLeftLine, RiSettings2Line } from "react-icons/ri";
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
  const config = useStore((s) => s.config);
  const update = useStore((s) => s.updateConfig);
  const reset = useStore((s) => s.resetConfig);
  const defaultData = useMemo(
    () => extractDefaultConfigData(patchKey), // fallback
    [patchKey],
  );
  const [data, set] = useState(() => config[patchKey] || defaultData);
  const patch = patches[patchKey];
  return (
    <section className="modal flex flex-1 flex-col gap-2">
      <div aria-label="Header" className="flex items-center gap-2 p-2">
        <div className="mr-2 shrink-0 rounded-lg bg-white/10 p-1.75">
          <RiSettings2Line className="size-5" />
        </div>
        <Label name={patch.name + " config"} details={patch.details} />
        <div className="flex-1" />
        <RiCloseLine
          className="size-6 cursor-pointer text-red-200 transition hover:text-red-400"
          onClick={close}
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
      <div aria-label="Spacer" className="flex-1 basis-2" />
      <div className="flex gap-2 p-2">
        <button
          className="flex-1 rounded-lg bg-green-400/5 p-2 text-center text-green-400/75 transition hover:bg-green-400/10 hover:text-green-300"
          onClick={() => {
            if (_.isEqual(data, defaultData)) {
              reset(patchKey);
            } else {
              update(patchKey, data);
            }
            close();
          }}
        >
          Save changes
        </button>
        <button
          className="shrink-0 rounded-lg bg-white/5 p-1.75 hover:bg-white/10"
          onClick={() => {
            set(defaultData);
          }}
        >
          <RiResetLeftLine className="size-5 transition hover:-rotate-12 active:-rotate-45" />
        </button>
      </div>
    </section>
  );
}
