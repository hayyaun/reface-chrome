import clsx from "clsx";
import { useState, type ReactNode } from "react";
import type { ModalProps } from "../types";

interface Props {
  close: () => void;
  children: (props: ModalProps) => ReactNode;
}

export default function Modal({ close, children }: Props) {
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
      {children({ close: onClose })}
    </section>
  );
}
