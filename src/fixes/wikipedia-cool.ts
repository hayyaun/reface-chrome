import type { Fix } from "../types";

export const wikipediaCool: Fix = {
  name: "Cool Wikipedia",
  details: "Cool Theme and Features for Wikipedia",
  keywords: ["wikipedia", "cool"],
  urls: ["wikipedia.org", "www.wikipedia.org"],
  func: () => {
    console.log("here!");
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
      document
        .getElementById("siteNotice")
        ?.style.setProperty("display", "none");
      document
        .getElementById("pt-sitesupport-2")
        ?.style.setProperty("display", "none");
    }, 1000);
  },
};
