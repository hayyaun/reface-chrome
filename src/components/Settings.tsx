import { useStore } from "../store";
import CheckboxItem from "./CheckboxItem";

export default function Settings() {
  const showBadge = useStore((s) => s.showBadge);
  const setShowBadge = useStore((s) => s.setShowBadge);
  const recommend = useStore((s) => s.recommend);
  const setRecommend = useStore((s) => s.setRecommend);
  const ads = useStore((s) => s.ads);
  const setAds = useStore((s) => s.setAds);
  const dark = useStore((s) => s.dark);
  const setDark = useStore((s) => s.setDark);

  return (
    <section className="flex flex-1 flex-col">
      <CheckboxItem
        title="Show Badge"
        details="Show the number of enabled patches for active tab"
        enabled={showBadge}
        onChange={setShowBadge}
      />
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
        details="Enables best dark theme from available website themes"
        enabled={dark}
        onChange={setDark}
      />
    </section>
  );
}
