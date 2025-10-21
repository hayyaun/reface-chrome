// Remove support and site notice

const config = window.__rc_config["wikipedia-focus"];

if (config["remove-donation"] as boolean) {
  document
    .querySelector<HTMLDivElement>("#siteNotice, #pt-sitesupport-2")
    ?.style.setProperty("display", "none");
}

// Remove vote banner

const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    document.querySelectorAll(".wmde-banner").forEach((el) => {
      (el as HTMLDivElement).style.setProperty("display", "none");
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
});
