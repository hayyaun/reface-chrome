import { useMemo, useState } from "react";
import PatchItem from "../components/PatchItem";
import patches, { categories } from "../config/patches";
import Chips from "./Chips";

interface Props {
  hostname: string;
}

export default function PatchList({ hostname }: Props) {
  const [selected, setSelected] = useState(categories.all);

  const relevantPatchKeys = useMemo(
    () =>
      Object.keys(patches).filter((k) => {
        const patch = patches[k];
        if (!patch.urls.find((url) => hostname.includes(url))) return false;
        if (
          selected !== categories.all &&
          !patch.keywords.find((kw) => selected === kw)
        ) {
          return false;
        }
        return true;
      }),
    [hostname, selected],
  );

  return (
    <section className="flex flex-1 flex-col overflow-y-auto">
      <div className="hide-scrollbar flex gap-2 overflow-x-scroll p-2">
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
    </section>
  );
}
