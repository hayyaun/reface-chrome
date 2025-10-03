import { useMemo, useState } from "react";
import PatchItem from "../components/PatchItem";
import { categories } from "../config/mapping";
import patches from "../config/patches";
import strings from "../config/strings";
import Chips from "./Chips";

interface Props {
  hostname: string;
}

export default function PatchList({ hostname }: Props) {
  const [selected, setSelected] = useState(categories.all);

  console.log(patches);

  const relevantPatchKeys = useMemo(
    () =>
      Object.keys(patches).filter((k) => {
        const patch = patches[k];
        if (!patch.hostnames.some((item) => hostname.includes(item))) {
          return false;
        }
        if (selected === categories.all) return true;
        return patch.keywords.some((kw) => selected === kw);
      }),
    [hostname, selected],
  );

  const supportParams = new URLSearchParams({
    title: `Add support for ${hostname}`,
  });

  return (
    <section className="flex flex-1 flex-col overflow-y-auto">
      <div className="hide-scrollbar my-1 flex gap-2 overflow-x-scroll p-2">
        {Object.keys(categories).map((k, i) => (
          <Chips
            key={i}
            title={categories[k]}
            active={selected === categories[k]}
            onClick={() => setSelected(k)}
          />
        ))}
      </div>
      {relevantPatchKeys.map((patchKey) => (
        <PatchItem
          key={patchKey}
          hostname={hostname}
          patchKey={patchKey}
          patch={patches[patchKey]}
        />
      ))}
      <div className="mt-1 flex cursor-pointer flex-col items-stretch justify-center gap-1 p-2 select-none">
        <a
          target="_blank"
          href={`${strings.github}/issues/new?${supportParams}`}
          className="rounded-lg p-2 text-center text-blue-400 transition hover:bg-blue-400/10 hover:text-blue-300"
        >
          Request add-on
        </a>
      </div>
    </section>
  );
}
