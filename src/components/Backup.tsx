import api from "@/shared/api";
import { RiDownload2Line, RiUpload2Line } from "react-icons/ri";
import Label from "./Label";

export default function Backup() {
  const onExport = async () => {
    if (import.meta.env.DEV) return;
    const data = await (typeof browser !== "undefined"
      ? browser.storage.local.get(null)
      : new Promise((resolve) => chrome.storage.local.get(null, resolve)));
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    api.downloads.download({ url, filename: "reface.backup.json" });
  };
  const onImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (ev) => {
      const file = (ev.target as HTMLInputElement)?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (readerEvent) => {
        const content = readerEvent.target?.result;
        console.log(content);
        if (!content) return;
        const data: { [k: string]: unknown } = JSON.parse(content?.toString());
        if (import.meta.env.PROD) {
          api.storage.local.set(data);
        } else {
          for (const key in data) {
            localStorage.setItem(key, data[key] as string);
          }
        }
      };
    };
    input.click();
  };
  return (
    <li className="odd-color flex items-center justify-between gap-4 p-2 py-1 pl-4 transition select-none">
      <Label name="Backup" details="Manually backup all your data" limit={400} lines={null} />
      <div aria-label="Buttons" className="flex h-12 gap-2 py-2">
        <button title="Import" className="icon-btn group/icon" onClick={onImport}>
          <RiUpload2Line className="icon-jump-reverse" />
        </button>
        <button className="btn-primary text-btn group/icon" onClick={onExport}>
          Export
          <RiDownload2Line className="icon-jump" />
        </button>
      </div>
    </li>
  );
}
