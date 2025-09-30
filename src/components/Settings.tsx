import { useStore } from "../store";
import CheckboxItem from "./CheckboxItem";

export default function Settings() {
  const ads = useStore((s) => s.ads);
  const setAds = useStore((s) => s.setAds);

  return (
    <section className="flex flex-1 flex-col">
      <CheckboxItem
        title="Recommendation"
        details="Shows recommendation popup of the most popular patches for every website"
        enabled={false}
        onChange={() => {}}
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
        enabled={false}
        onChange={() => {}}
      />
    </section>
  );
}
