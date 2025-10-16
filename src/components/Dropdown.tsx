import clsx from "clsx";
import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import type { Option } from "../types";

interface Props {
  placeholder?: string;
  options: Option[];
  value: Option["value"] | null;
  onChange: (option: Option) => void;
}

export default function Dropdown({
  placeholder = "Select option",
  options,
  value,
  onChange,
}: Props) {
  const [hidden, setHidden] = useState(true);
  const title = options.find((o) => o.value === value)?.name ?? placeholder;
  return (
    <div className="relative w-32">
      <button
        className="group flex w-full items-center justify-between rounded-lg border bg-white/5 px-4 py-2 pr-2 transition hover:bg-white/10 focus:bg-white/15 focus:outline-none"
        onClick={() => setHidden((s) => !s)}
      >
        <span>{title}</span>
        <RiArrowDownSLine className="-my-2 size-5 text-white/15 group-hover:-my-0" />
      </button>

      <ul
        className={clsx(
          "absolute z-10 mt-1 flex w-full flex-col overflow-hidden rounded-lg bg-zinc-800 shadow-lg backdrop-blur-2xl transition",
          { hidden },
        )}
      >
        {options.map((option, i) => (
          <li
            key={i}
            className="cursor-pointer px-4 py-2 hover:bg-white/15"
            onClick={() => {
              onChange(option);
              setHidden(true);
            }}
          >
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
