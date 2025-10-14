import clsx from "clsx";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import type { Option } from "../types";
import Dropdown from "./Dropdown";
import Label from "./Label";

type Props<T> = {
  title: string;
  details: string;
  value: T;
  onChange: (v: T) => void;
  options?: Option[];
};

export default function SettingItem<T>({
  title,
  details,
  value,
  onChange,
  options,
}: Props<T>) {
  return (
    <li className="odd-color flex flex-wrap items-center justify-between gap-2 p-2 pl-4 transition select-none">
      <Label name={title} details={details} lines={0} />
      {typeof value === "boolean" ? (
        <div
          aria-label="Toggle Button"
          className={clsx(
            "cursor-pointer rounded-sm bg-white/5 p-1 transition",
            value ? "hover:bg-green-400/25" : "hover:bg-white/25",
          )}
          onClick={() => onChange(!value as T)}
        >
          {value ? (
            <RiCheckboxFill className="size-4 text-green-400" />
          ) : (
            <RiCheckboxBlankLine className="size-4 text-white" />
          )}
        </div>
      ) : null}
      {typeof value === "number" && (
        <input
          aria-label="Number Input"
          className="w-24 rounded-md bg-white/5 p-1.5 px-2"
          type="number"
          placeholder={title}
          value={value}
          onChange={(ev) => onChange(Number(ev.target.value) as T)}
        />
      )}
      {typeof value === "string" && !Array.isArray(options) && (
        <input
          aria-label="Text Input"
          className="w-full rounded-md bg-white/5 p-1.5 px-2"
          placeholder={title}
          value={value}
          onChange={(ev) => onChange(ev.target.value as T)}
        />
      )}
      {Array.isArray(options) && (
        <Dropdown
          value={value as string}
          onChange={(option) => onChange(option.value as T)}
          options={options}
        />
      )}
    </li>
  );
}
