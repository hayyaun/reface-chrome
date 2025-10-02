// Remove support and site notice
document
  .querySelector<HTMLDivElement>("#siteNotice, #pt-sitesupport-2")
  ?.style.setProperty("display", "none");

// Remove vote banner
const target = document.body;

const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    document.querySelectorAll(".wmde-banner").forEach((el) => {
      (el as HTMLDivElement).style.setProperty("display", "none");
    });
  });
});

observer.observe(target, { childList: true, subtree: true, attributes: false });
