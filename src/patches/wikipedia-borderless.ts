function run() {
  document
    .querySelectorAll<HTMLDivElement>(
      "table, table tbody, figure, figcaption, figure img",
    )
    ?.forEach((el) => el.style.setProperty("border", "none"));

  function xxx(a: string, b: string) {
    console.log(a, b);
  }
  xxx("1", "2");
  xxx("1", "3");
}

if (document.readyState === "complete") run();
else document.addEventListener("DOMContentLoaded", run);
