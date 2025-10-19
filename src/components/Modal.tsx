import clsx from "clsx";
import { useState, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { RiCloseLine } from "react-icons/ri";
import type { ModalProps } from "@/shared/types";
import Label from "./Label";

interface Props {
  name: string;
  details: string;
  Icon: IconType;
  close: () => void;
  children: (props: ModalProps) => ReactNode;
}

export default function Modal({ name, details, Icon, close, children }: Props) {
  const [out, setOut] = useState(false);
  const onClose = () => {
    setOut(true);
    setTimeout(close, 500);
  };
  return (
    <section
      className={clsx(
        "flex flex-1 flex-col gap-2", // container
        "bg-background absolute inset-0 z-50 size-full", //  modal
        out ? "animate-slide-out" : "animate-slide-in",
      )}
    >
      <div aria-label="Header" className="flex gap-2 p-4 pr-2">
        <div className="group/icon mr-2 shrink-0 rounded-lg bg-white/10 p-1.75">
          <Icon className="size-5" />
        </div>
        <Label name={name} details={details} />
        <div className="flex-1" />
        <RiCloseLine
          className="size-6 cursor-pointer text-red-400 transition hover:-rotate-90 hover:text-red-600"
          onClick={onClose}
        />
      </div>
      {children({ close: onClose })}
    </section>
  );
}
