declare module "webextension-polyfill?*" {
  import type { Browser } from "webextension-polyfill";
  const browser: Browser;
  export default browser;
}