const config = window.__rc_config["github-stats"];

const reserved = ["topics", "users", "orgs", "collections", "contact"];
const excludes = [
  "#code-tab",
  ".AppHeader-context-item",
  '[data-pjax="#repo-content-pjax-container"]',
  '[href="#readme-ov-file"]',
  '[href="#"]',
];

const links = document.querySelectorAll<HTMLAnchorElement>(
  "a" + excludes.map((q) => `:not(${q})`).join(""),
);

links.forEach(async (link) => {
  if (!link.hostname.includes("github.com")) return;
  const args = link.pathname.split("/");
  if (args.length !== 3) return;
  if (reserved.includes(args[1])) return;
  const stats = document.createElement("span");
  stats.classList.add("rc-github-stats-box");
  const items: string[] = [];
  async function addItem(key: string) {
    try {
      const res = await fetch(
        `https://img.shields.io/github/${key}/${args[1]}/${args[2]}.json`,
      );
      const data = (await res.json()) as { value: string };
      let value = parseFloat(data.value);
      if (Number.isNaN(value)) return;
      if (data.value.includes("k")) value *= 1_000;
      else if (data.value.includes("m")) value *= 1_000_000;
      items.push(data.value);
      if (key === "stars" && value > (config.threshold as number)) {
        stats.classList.add("rc-github-stats-threshold");
      }
    } catch {
      console.debug("Rate limit exceeded!");
    }
  }
  if (config.stars) await addItem("stars");
  if (config.forks) await addItem("forks");
  if (config.watchers) await addItem("watchers");
  // append
  if (!items.length) return;
  link.appendChild(stats);
  stats.textContent = `(${items.join("/")})`;
});
