import { useStore } from "../store";
import CheckboxItem from "./CheckboxItem";
import PatchItem from "./PatchItem";

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

  return (
    <section className="flex flex-1 flex-col overflow-y-auto">
      <p className="my-2 p-2 font-bold underline-offset-4">General</p>
      <CheckboxItem
        title="Show Badge"
        details="Show the number of enabled patches for active tab"
        enabled={showBadge}
        onChange={setShowBadge}
      />
      <CheckboxItem
        title="Fade In"
        details="Show websites final look after changes applied"
        enabled={fadeIn}
        onChange={setFadeIn}
      />
      <CheckboxItem
        title="Auto Reload"
        details="Reload pages after changes applied automatically"
        enabled={autoReload}
        onChange={setAutoReload}
      />
      <p className="my-2 mt-4 p-2 font-bold underline-offset-4">Patches</p>
      <CheckboxItem
        title="Recommendation"
        details="Shows recommendation popup of the most popular patches for every website"
        enabled={recommend}
        onChange={setRecommend}
      />
      <CheckboxItem
        title="Remove all ads"
        details="Enables all ad-removal patches for available websites"
        enabled={ads}
        onChange={setAds}
      />
      <CheckboxItem
        title="Dark-mode"
        details="Enables best dark theme from available themes"
        enabled={dark}
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
        <PatchItem key={patchKey} patchKey={patchKey} />
      ))}
    </section>
  );
}
