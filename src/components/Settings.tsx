import { useState } from "react";
import { useStore } from "../store";
import ConfigModal from "./ConfigModal";
import PatchItem from "./PatchItem";
import SettingItem from "./SettingItem";

export default function Settings() {
  const global = useStore((s) => s.global);
  const fadeIn = useStore((s) => s.fadeIn);
  const setFadeIn = useStore((s) => s.setFadeIn);
  const showBadge = useStore((s) => s.showBadge);
  const setShowBadge = useStore((s) => s.setShowBadge);
  const autoReload = useStore((s) => s.autoReload);
  const setAutoReload = useStore((s) => s.setAutoReload);
  const recommend = useStore((s) => s.recommend);
  const setRecommend = useStore((s) => s.setRecommend);
  const ads = useStore((s) => s.ads);
  const setAds = useStore((s) => s.setAds);
  const dark = useStore((s) => s.dark);
  const setDark = useStore((s) => s.setDark);
  const [configModal, setConfigModal] = useState<string | null>(null);
  return (
    <section className="flex flex-1 flex-col overflow-y-auto">
      <p className="p-4 font-bold underline-offset-4">General</p>
      <SettingItem
        title="Show Badge"
        details="Show the number of enabled patches for active tab"
        value={showBadge}
        onChange={setShowBadge}
      />
      <SettingItem
        title="Fade In"
        details="Show websites final look after changes applied"
        value={fadeIn}
        onChange={setFadeIn}
      />
      <SettingItem
        title="Auto Reload"
        details="Reload pages after changes applied automatically"
        value={autoReload}
        onChange={setAutoReload}
      />
      <SettingItem
        title="Recommendation"
        details="Shows recommendation popup for the most popular patches"
        value={recommend}
        onChange={setRecommend}
      />
      <SettingItem
        title="Remove all ads"
        details="Enables all ad-removal patches for available websites"
        value={ads}
        onChange={setAds}
      />
      <SettingItem
        title="Dark-mode"
        details="Enables best dark theme from available themes"
        value={dark}
        onChange={setDark}
      />
      {!!global.length && (
        <div className="my-2 mt-4 p-2">
          <p className="font-bold underline-offset-4">Global</p>
          <p className="text-tiny mt-1 opacity-50">
            Patches that applied globally
          </p>
        </div>
      )}
      {global.map((patchKey) => (
        <PatchItem
          key={patchKey}
          patchKey={patchKey}
          openConfig={() => setConfigModal(patchKey)}
        />
      ))}
      {configModal && (
        <ConfigModal
          patchKey={configModal}
          close={() => setConfigModal(null)}
        />
      )}
    </section>
  );
}
