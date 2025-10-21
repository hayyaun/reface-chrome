import clsx from "clsx";

interface Props {
  title: string;
  active: boolean;
  onClick: () => void;
}

export default function Chips({ title, active, onClick }: Props) {
  return (
    <div
      className={clsx("cursor-pointer rounded-full bg-white/5 px-3 py-1 transition select-none hover:bg-white/10", {
        "bg-white/25 hover:bg-white/25": active,
      })}
      onClick={onClick}
    >
      {title}
    </div>
  );
}
