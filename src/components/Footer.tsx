import { RiGithubFill, RiSettingsFill } from "react-icons/ri";
import strings from "@/shared/strings";

interface Props {
  options?: boolean;
}

export default function Footer({ options }: Props) {
  const openOptions = () => {
    if (import.meta.env.DEV) return;
    chrome.runtime.openOptionsPage();
  };

  return (
    <footer className="flex items-center justify-between gap-2 p-2">
      <div className="flex items-center gap-2">
        <a href={strings.github} target="_blank" className="text-current">
          <RiGithubFill className="size-4" />
        </a>
        <span className="text-tiny opacity-25">{"Contribute on Github"}</span>
      </div>
      {!options && (
        <div className="cursor-pointer p-1" onClick={openOptions}>
          <RiSettingsFill className="size-4 cursor-pointer" />
        </div>
      )}
    </footer>
  );
}
