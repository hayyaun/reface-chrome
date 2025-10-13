import { RiSettings2Line } from "react-icons/ri";
import patches from "../config/patches";
import { useUI } from "../store";
import ConfigModal from "./ConfigModal";
import Modal from "./Modal";

export default function Modals() {
  const configModal = useUI((s) => s.configModal);
  const setConfigModal = useUI((s) => s.setConfigModal);
  const profileModal = useUI((s) => s.profileModal);
  const setProfileModal = useUI((s) => s.setProfileModal);

  const Component = profileModal
    ? patches[profileModal].profile?.Component
    : null;

  return (
    <>
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
          name={patches[profileModal].name}
          details={patches[profileModal].details}
          close={() => setProfileModal(null)}
        >
          {({ close }) => <Component close={close} />}
        </Modal>
      )}
    </>
  );
}
