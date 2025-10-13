import type { ModalProps } from "../types";

export default function Samantha({ close }: ModalProps) {
  return (
    <div className="p-4" onClick={close}>
      Samantha
    </div>
  );
}
