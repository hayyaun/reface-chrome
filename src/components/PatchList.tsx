import { useMemo, useState } from "react";
import { RiSettings2Line } from "react-icons/ri";
import PatchItem from "../components/PatchItem";
import { categories } from "../config/mapping";
import patches from "../config/patches";
import strings from "../config/strings";
import { match } from "../utils/match";
import Chips from "./Chips";
import ConfigModal from "./ConfigModal";
import Modal from "./Modal";

interface Props {
  hostname: string;
}

export default function PatchList({ hostname }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(categories.all);
  const [configModal, setConfigModal] = useState<string | null>(null);
  const [profileModal, setProfileModal] = useState<string | null>(null);

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

  const Component = profileModal
    ? patches[profileModal].profile?.Component
    : null;

  return (
    <section className="flex flex-1 flex-col overflow-y-auto">
      <div className="hide-scrollbar mb-0.5 flex gap-2 overflow-x-scroll p-3">
        {Object.keys(categories).map((k, i) => (
          <Chips
            key={i}
            title={categories[k]}
            active={selectedCategory === categories[k]}
            onClick={() => setSelectedCategory(k)}
          />
        ))}
      </div>
      {relevantPatchKeys.map((patchKey) => (
        <PatchItem
          key={patchKey}
          hostname={hostname}
          patchKey={patchKey}
          openConfig={() => setConfigModal(patchKey)}
          openProfile={() => setProfileModal(patchKey)}
        />
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
      {configModal && (
        <Modal
          Icon={RiSettings2Line}
          name={patches[configModal].name + " config"}
          details={patches[configModal].details}
          close={() => setConfigModal(null)}
        >
          {({ close }) => <ConfigModal patchKey={configModal} close={close} />}
        </Modal>
      )}
      {profileModal && Component && (
        <Modal
          Icon={patches[profileModal].profile!.icon}
          name={patches[profileModal].name + " profile"}
          details={patches[profileModal].details}
          close={() => setProfileModal(null)}
        >
          {({ close }) => <Component close={close} />}
        </Modal>
      )}
    </section>
  );
}
