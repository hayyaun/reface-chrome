const config = window.__rc_config["github-stats"];

const reserved = ["topics", "users", "orgs", "collections", "contact"];
const excludes = ["#code-tab", ".AppHeader-context-item", '[data-pjax="#repo-content-pjax-container"]'];

const links = document.querySelectorAll<HTMLAnchorElement>("a" + excludes.map((q) => `:not(${q})`).join(""));

links.forEach(async (link) => {
  const rawHref = link.getAttribute("href");
  if (!rawHref) return;
  const url = new URL(rawHref);
  if (!url.hostname.includes("github.com")) return;
  const args = link.pathname.split("/");
  if (args.length !== 3) return;
  if (reserved.includes(args[1])) return;
  const stats = document.createElement("span");
  stats.classList.add("rc-github-stats-box");
  const items: string[] = [];
  async function addItem(key: string): Promise<number> {
    try {
      const res = await fetch(`https://img.shields.io/github/${key}/${args[1]}/${args[2]}.json`);
      const data = (await res.json()) as { value: string };
      let value = parseFloat(data.value);
      if (Number.isNaN(value)) return 0;
      if (data.value.includes("k")) value *= 1_000;
      else if (data.value.includes("m")) value *= 1_000_000;
      items.push(data.value);
      return value;
    } catch {
      console.debug("Rate limit exceeded!");
      return 0;
    }
  }
  if (config.stars) {
    const value = await addItem("stars");
    if (value > (config.threshold as number)) {
      stats.classList.add("rc-github-stats-threshold");
    }
  }
  if (config.forks) await addItem("forks");
  if (config.watchers) await addItem("watchers");
  // append
  if (!items.length) return;
  link.appendChild(stats);
  stats.textContent = `(${items.join("/")})`;
});
