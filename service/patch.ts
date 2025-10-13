import patches from "../src/config/patches";
import { match } from "../src/utils/match";
import { extractDefaultConfigData } from "../src/utils/patch";
import { state } from "./state";

const applied: { [tabId: number]: string[] } = {};

export function findApplicablePatches(tab: chrome.tabs.Tab) {
  if (!tab.url) return [];
  const hostname = new URL(tab.url).hostname;
  const applicable: string[] = [];
  // match global
  for (const key of state.store.global) {
    const patch = patches[key];
    if (!patch) continue;
    const valid = patch.hostnames.some((rule) => match(hostname, rule));
    if (!valid) continue;
    const excluded = state.store.hostnames[hostname]?.excluded.includes(key);
    if (excluded) continue;
    applicable.push(key);
  }
  // match local
  for (const hn in state.store.hostnames) {
    if (!hn || hostname !== hn) continue;
    const patchKeys = state.store.hostnames[hn]!.enabled;
    if (!patchKeys.length) continue;
    const valid = patchKeys.filter((key) => {
      const patch = patches[key];
      if (!patch) return false; // not found
      return !state.store.global.includes(key); // not local
    });
    applicable.push(...valid);
  }
  return [...new Set(applicable)]; // unique
}

export function applyPatch(patchKey: string, tabId: number, pathname: string) {
  if (applied[tabId]?.includes(patchKey)) return;
  if (!applied[tabId]) applied[tabId] = [];
  applied[tabId].push(patchKey);
  const patch = patches[patchKey];
  // Config
  if (patches[patchKey].config) {
    // extract defaults
    let data = extractDefaultConfigData(patchKey);
    // override - defined by user
    if (state.store.config[patchKey]) {
      data = state.store.config[patchKey];
    }
    chrome.scripting.executeScript({
      target: { tabId },
      func: ({ patchKey, data }) => {
        window.__rc_config = window.__rc_config || {};
        window.__rc_config[patchKey] = data;
      },
      args: [{ patchKey, data }],
    });
  }
  // JS
  if (!patch.noJS) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: [`patches/${patchKey}.js`],
    });
  }
  // CSS
  if (patch.css) {
    for (const pathRule in patch.css) {
      if (!match(pathname, pathRule)) continue;
      chrome.scripting.insertCSS({
        target: { tabId },
        files: [`patches/${patchKey}-${patch.css[pathRule]}.css`],
      });
    }
  }
}

export function clearPatches(tabId: number) {
  if (applied[tabId]) delete applied[tabId];
}
