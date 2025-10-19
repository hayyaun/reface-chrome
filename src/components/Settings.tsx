import { usePrefs, useService } from "../../shared/store";
import Backup from "./Backup";
import ClearData from "./ClearData";
import Modals from "./Modals";
import PatchItem from "./PatchItem";
import SettingItem from "./SettingItem";

export default function Settings() {
  const global = useService((s) => s.global);
  const fadeIn = usePrefs((s) => s.fadeIn);
  const setFadeIn = usePrefs((s) => s.setFadeIn);
  const showBadge = usePrefs((s) => s.showBadge);
  const setShowBadge = usePrefs((s) => s.setShowBadge);
  const autoReload = usePrefs((s) => s.autoReload);
  const setAutoReload = usePrefs((s) => s.setAutoReload);
  const recommend = usePrefs((s) => s.recommend);
  const setRecommend = usePrefs((s) => s.setRecommend);
  const ads = usePrefs((s) => s.ads);
  const setAds = usePrefs((s) => s.setAds);
  const dark = usePrefs((s) => s.dark);
  const setDark = usePrefs((s) => s.setDark);
  const sync = usePrefs((s) => s.sync);
  return (
    <section className="flex flex-1 flex-col overflow-y-auto pb-12">
      <p className="p-4 opacity-50">General</p>
      <ul>
        <SettingItem
          title="Samantha"
          details="AI assistant"
          value={true}
          onChange={() => {}}
        />
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
      </ul>
      <p className="p-4 opacity-50">Data</p>
      <ul>
        <SettingItem
          title="Sync"
          details="Automatically sync preferences across devices"
          value={sync}
          onChange={() => {}}
        />
        <Backup />
        <ClearData />
      </ul>
      <p className="p-4 opacity-50">Patches</p>
      <ul>
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
          title="Dark mode"
          details="Enables best dark theme from available themes"
          value={dark}
          onChange={setDark}
        />
      </ul>
      {!!global.length && (
        <div className="my-2 mt-4 p-2">
          <p className="opacity-50">Global</p>
          <p className="text-tiny mt-1 opacity-50">
            Patches that applied globally
          </p>
        </div>
      )}
      {global.map((patchKey) => (
        <PatchItem key={patchKey} patchKey={patchKey} />
      ))}
      <Modals />
    </section>
  );
}
