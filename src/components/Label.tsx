import clsx from "clsx";

interface Props {
  name: string;
  details: string;
  limit?: number;
  lines?: number | null;
}

export default function Label({ name, details, limit = 40, lines = 1 }: Props) {
  return (
    <div aria-label="Label" className="flex flex-col gap-1">
      <span>{name}</span>
      <span
        title={details.length > limit ? details : undefined}
        className={clsx("text-tiny opacity-45", {
          "line-clamp-1": lines === 1,
          "line-clamp-2": lines === 2,
          "line-clamp-3": lines === 3,
        })}
      >
        {details}
      </span>
    </div>
  );
}
