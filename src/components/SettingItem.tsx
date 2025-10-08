import clsx from "clsx";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import Label from "./Label";

interface Props<T> {
  title: string;
  details: string;
  value: T;
  onChange: (v: T) => void;
}

export default function SettingItem<T>({
  title,
  details,
  value,
  onChange,
}: Props<T>) {
  return (
    <div className="odd-color flex flex-wrap items-center justify-between gap-2 p-2 pl-4 transition select-none">
      <Label name={title} details={details} />
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
      {typeof value === "string" && (
        <input
          aria-label="Text Input"
          className="w-full rounded-md bg-white/5 p-1.5 px-2"
          placeholder={title}
          value={value}
          onChange={(ev) => onChange(ev.target.value as T)}
        />
      )}
    </div>
  );
}
