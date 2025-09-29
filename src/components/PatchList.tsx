import { useMemo } from "react";
import PatchItem from "../components/PatchItem";
import patches from "../config/patches";

interface Props {
  hostname: string;
}

export default function PatchList({ hostname }: Props) {
  const relevantPatchKeys = useMemo(
    () =>
      Object.keys(patches).filter((k) =>
        patches[k].urls.find((url) => hostname.includes(url)),
      ),
    [hostname],
  );

  return (
    <section className="flex flex-1 flex-col">
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
