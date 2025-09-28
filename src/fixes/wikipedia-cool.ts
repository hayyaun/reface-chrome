import type { Fix } from "../types";

export const wikipediaCool: Fix = {
  name: "Cool Wikipedia",
  details: "Cool Theme and Features for Wikipedia",
  keywords: ["wikipedia", "cool"],
  urls: ["wikipedia.org", "www.wikipedia.org"],
  func: () => {
    document.querySelectorAll(".wmde-banner").forEach((el) => {
      (el as HTMLDivElement).style.display = "none";
    });
    document.querySelectorAll("#siteNotice").forEach((el) => {
      (el as HTMLDivElement).style.display = "none";
    });
  },
};
