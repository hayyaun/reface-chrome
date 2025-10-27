import type { Tab } from "@/shared/api";
import api from "@/shared/api";
import patches from "@/shared/patches";
import { extractDefaultConfigData, match } from "@/shared/utils";
import { state } from "./state";

const applied: { [tabId: number]: string[] } = {};

export function findApplicablePatches(tab: Tab) {
  if (!tab.url) return [];
  const hostname = new URL(tab.url).hostname;
  const applicable: string[] = [];
  // match global
  for (const key of state.service.global) {
    const patch = patches[key];
    if (!patch) continue;
    const valid = patch.hostnames.some((rule) => match(hostname, rule));
    if (!valid) continue;
    const excluded = state.service.hostnames[hostname]?.excluded.includes(key);
    if (excluded) continue;
    applicable.push(key);
  }
  // match local
  for (const hn in state.service.hostnames) {
    if (!hn || hostname !== hn) continue;
    const patchKeys = state.service.hostnames[hn]!.enabled;
    if (!patchKeys.length) continue;
    const valid = patchKeys.filter((key) => {
      const patch = patches[key];
      if (!patch) return false; // not found
      return !state.service.global.includes(key); // not local
    });
    applicable.push(...valid);
  }
  return [...new Set(applicable)]; // unique
}

export function applyPatch(patchKey: string, tab: Tab) {
  if (!tab.id) return;
  if (applied[tab.id]?.includes(patchKey)) return;
  if (!applied[tab.id]) applied[tab.id] = [];
  applied[tab.id].push(patchKey);
  const patch = patches[patchKey];
  // Config
  if (patches[patchKey].config) {
    // extract defaults
    let data = extractDefaultConfigData(patchKey);
    // override - defined by user
    if (state.service.config[patchKey]) {
      data = state.service.config[patchKey];
    }
    api.scripting.executeScript({
      target: { tabId: tab.id },
      func: ({ patchKey, data }) => {
        window.__rc_config = window.__rc_config || {};
        window.__rc_config[patchKey] = data;
      },
      args: [{ patchKey, data }],
    });
  }
  // JS
  if (!patch.noJS) {
    api.scripting.executeScript({
      target: { tabId: tab.id },
      files: [`patches/${patchKey}.js`],
    });
  }
  // CSS
  const pathname = new URL(tab.url!).pathname;
  if (patch.css) {
    for (const pathRule in patch.css) {
      if (!match(pathname, pathRule)) continue;
      api.scripting.insertCSS({
        target: { tabId: tab.id },
        files: [`patches/${patchKey}-${patch.css[pathRule]}.css`],
      });
    }
  }
}

export function clearPatches(tabId: number) {
  if (applied[tabId]) delete applied[tabId];
}
