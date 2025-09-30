import clsx from "clsx";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";

interface Props {
  enabled: boolean;
  onChange: (v: boolean) => void;
  title: string;
  details: string;
}

export default function CheckboxItem({
  enabled,
  onChange,
  title,
  details,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 transition select-none hover:bg-white/2">
      <div aria-label="Content" className="flex flex-col gap-1">
        <span>{title}</span>
        <span className="text-tiny line-clamp-1 opacity-45">{details}</span>
      </div>
      <div
        aria-label="Toggle Button"
        className={clsx(
          "cursor-pointer rounded-sm bg-white/5 p-1 transition",
          enabled ? "hover:bg-green-400/25" : "hover:bg-white/25",
        )}
        onClick={() => onChange(!enabled)}
      >
        {enabled ? (
          <RiCheckboxFill className="size-4 text-green-400" />
        ) : (
          <RiCheckboxBlankLine className="size-4 text-white" />
        )}
      </div>
    </div>
  );
}
