import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import Label from "./Label";

export default function ClearData() {
  const [clicks, setClicks] = useState(0);
  const onClear = async () => {
    if (import.meta.env.PROD) {
      await chrome.storage.local.clear();
    } else localStorage.clear();
    alert("Data cleared!");
    setClicks(0);
  };
  const onClick = () => {
    if (clicks > 2) return onClear();
    alert(`Click ${3 - clicks} more times to clear data...`);
    setClicks((s) => s + 1);
  };
  return (
    <li className="odd-color flex items-center justify-between gap-4 p-2 py-1 pl-4 transition select-none">
      <Label
        name="Clear Data"
        details="Clears all data stored on this device or across all devices."
        limit={400}
        lines={null}
      />
      <div aria-label="Buttons" className="flex h-12 gap-2 py-2">
        <button
          className="group flex items-center gap-2 rounded-md bg-white/5 p-1.5 px-1 pr-3 pl-4 text-center text-red-300 transition hover:bg-red-500/25"
          onClick={onClick}
        >
          Clear data
          <RiDeleteBinLine className="size-5 transition group-hover:-translate-y-0.25 group-active:translate-y-0.25" />
        </button>
      </div>
    </li>
  );
}
