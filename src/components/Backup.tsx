import { RiDownload2Line, RiUpload2Line } from "react-icons/ri";
import Label from "./Label";

export default function Backup() {
  const onExport = () => {
    if (import.meta.env.DEV) return;
    chrome.storage.local.get(null, (data) => {
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({ url, filename: "reface.backup.json" });
    });
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
          chrome.storage.local.set(data);
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
      <Label
        name="Backup"
        details="Manually backup all your data"
        limit={400}
        lines={null}
      />
      <div aria-label="Buttons" className="flex h-12 gap-2 py-2">
        <button
          title="Import"
          className="group shrink-0 rounded-lg bg-white/5 p-1.5 hover:bg-white/10"
          onClick={onImport}
        >
          <RiUpload2Line className="size-5 transition group-hover:translate-y-0.25 group-active:-translate-y-0.25" />
        </button>
        <button
          className="group flex items-center gap-2 rounded-md bg-purple-600 pr-3 pl-4 text-center text-white transition hover:bg-purple-700 active:bg-purple-800"
          onClick={onExport}
        >
          Export
          <RiDownload2Line className="size-5 transition group-hover:-translate-y-0.25 group-active:translate-y-0.25" />
        </button>
      </div>
    </li>
  );
}
