import { lazy, useMemo, useState } from "react";
import { categories } from "../../shared/mapping";
import patches from "../../shared/patches";
import strings from "../../shared/strings";
import { match } from "../../shared/utils";
import PatchItem from "../components/PatchItem";
import Chips from "./Chips";

const Modals = lazy(() => import("./Modals"));

interface Props {
  hostname: string;
}

export default function PatchList({ hostname }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(categories.all);

  const relevantPatchKeys = useMemo(
    () =>
      Object.keys(patches).filter((k) => {
        const patch = patches[k];
        if (!patch.hostnames.some((rule) => match(hostname, rule))) {
          return false;
        }
        if (selectedCategory === categories.all) return true;
        return patch.keywords.some((kw) => selectedCategory === kw);
      }),
    [hostname, selectedCategory],
  );

  const supportParams = new URLSearchParams({
    title: `Add support for ${hostname}`,
  });

  return (
    <section className="flex flex-1 flex-col overflow-y-auto">
      <div className="hide-scrollbar mb-0.5 flex gap-2 overflow-x-scroll p-3">
        {Object.keys(categories).map((k, i) => (
          <Chips
            key={i}
            title={categories[k as keyof typeof categories]}
            active={
              selectedCategory === categories[k as keyof typeof categories]
            }
            onClick={() => setSelectedCategory(k)}
          />
        ))}
      </div>
      {relevantPatchKeys.map((patchKey) => (
        <PatchItem key={patchKey} hostname={hostname} patchKey={patchKey} />
      ))}
      <div className="mt-3 flex flex-col items-stretch justify-center gap-1 p-2">
        <a
          target="_blank"
          href={`${strings.github}/issues/new?${supportParams}`}
          className="cursor-pointer rounded-lg p-2 text-center text-blue-400/75 transition hover:bg-blue-400/10 hover:text-blue-300"
        >
          Request add-on
        </a>
      </div>
      <Modals />
    </section>
  );
}
