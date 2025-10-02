document
  .querySelectorAll<HTMLDivElement>(
    "table, table tbody, figure, figcaption, figure img",
  )
  ?.forEach((el) => el.style.setProperty("border", "none"));
