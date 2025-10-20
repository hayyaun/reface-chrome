import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import browser from "webextension-polyfill";
import Label from "./Label";

export default function ClearData() {
  const [clicks, setClicks] = useState(0);
  const onClear = async () => {
    if (import.meta.env.PROD) {
      await browser.storage.local.clear();
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
        details="Clears all data stored on this device."
        limit={400}
        lines={null}
      />
      <div aria-label="Buttons" className="flex h-12 gap-2 py-2">
        <button
          className="text-btn group/icon text-red-300 hover:bg-red-500/25"
          onClick={onClick}
        >
          Clear data
          <RiDeleteBinLine className="icon-jump" />
        </button>
      </div>
    </li>
  );
}
