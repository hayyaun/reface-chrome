function run() {
  document
    .querySelectorAll<HTMLDivElement>(
      "table, table tbody, figure, figcaption, figure img",
    )
    ?.forEach((el) => el.style.setProperty("border", "none"));
}

run();

if (document.readyState === "complete") run();
else document.addEventListener("DOMContentLoaded", run);
