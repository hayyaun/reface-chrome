const config = { count: 0 };
const id = setInterval(() => {
  config.count++;
  if (config.count > 10) {
    clearInterval(id);
    return;
  }
  document.querySelectorAll(".wmde-banner").forEach((el) => {
    (el as HTMLDivElement).style.display = "none";
  });
}, 1000);

document
  .querySelector<HTMLDivElement>("#siteNotice")
  ?.style.setProperty("display", "none");

document
  .querySelector<HTMLDivElement>("#pt-sitesupport-2")
  ?.style.setProperty("display", "none");
