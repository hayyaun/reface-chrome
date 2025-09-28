import type { Fix } from "../types";

export const wikipediaCool: Fix = {
  name: "Cool Wikipedia",
  details: "Cool Theme and Features for Wikipedia",
  keywords: ["wikipedia", "cool"],
  urls: ["wikipedia.org", "www.wikipedia.org"],
  func: () => {
    document.body.style.backgroundColor = "black";
    document.querySelectorAll("div").forEach((el) => {
      el.style.backgroundColor = "black";
      el.style.color = "white";
    });
  },
};
