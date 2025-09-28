import type { Fix } from "../types";

const func = () => {
  document.querySelectorAll("div").forEach((v) => {
    v.style.backgroundColor = "black";
    v.style.color = "white";
  });
};

export const wikipediaCool: Fix = {
  name: "Cool Wikipedia",
  details: "Cool Theme and Features for Wikipedai",
  keywords: ["wikipedia", "cool"],
  urls: ["wikipedia.org", "www.wikipedia.org"],
  func,
};
