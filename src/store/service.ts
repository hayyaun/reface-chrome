import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chromeLocalStorage } from "../chrome/storage";
import type { HostnameConfig, PatchConfigData } from "../types";

export const STORE_KEY = "main";

interface Service {
  global: string[];
  addGlobal: (patchKey: string, hostname?: string) => void;
  removeGlobal: (patchKey: string, hostname?: string) => void;
  hostnames: { [hostname: string]: HostnameConfig | undefined };
  _initHostname: (hostname: string) => void;
  _deleteHostname: (hostname: string) => void;
  addPatch: (hostname: string, patchKey: string) => void;
  removePatch: (hostname: string, patchKey: string) => void;
  excludePatch: (hostname: string, patchKey: string) => void;
  includePatch: (hostname: string, patchKey: string) => void;
  config: { [patchKey: string]: PatchConfigData | undefined };
  updateConfig: (patchKey: string, data: PatchConfigData) => void;
  resetConfig: (patchKey: string) => void;
  // ai
  chat: ChatCompletionMessageParam[];
  addChatMessage: (message: ChatCompletionMessageParam) => void;
  clearChat: () => void;
}

export const useService = create(
  persist(
    immer<Service>((set) => ({
      global: [],
      addGlobal: (key, hostname) => {
        set((state) => {
          if (state.global.includes(key)) return;
          state.global.push(key);
        });
        // if current tab specified - include again
        if (hostname) useService.getState().includePatch(hostname, key);
      },
      removeGlobal: (key, hostname) => {
        set((state) => {
          state.global = state.global.filter((k) => k !== key);
        });
        // if current tab specified - remove patch
        if (hostname) useService.getState().removePatch(hostname, key);
      },
      hostnames: {},
      _initHostname: (hostname) => {
        set((state) => {
          if (state.hostnames[hostname]) return;
          state.hostnames[hostname] = { enabled: [], excluded: [] };
        });
      },
      _deleteHostname: (hostname) => {
        // Keeps the storage clean
        set((state) => {
          if (!state.hostnames[hostname]) {
            return delete state.hostnames[hostname];
          }
          if (state.hostnames[hostname].enabled.length) return;
          if (state.hostnames[hostname].excluded.length) return;
          delete state.hostnames[hostname];
        });
      },
      addPatch: (hostname, key) => {
        useService.getState()._initHostname(hostname);
        set((state) => {
          if (state.hostnames[hostname]!.enabled.includes(key)) return;
          state.hostnames[hostname]!.enabled.push(key);
        });
      },
      removePatch: (hostname, key) => {
        useService.getState()._initHostname(hostname);
        set((state) => {
          const index = state.hostnames[hostname]!.enabled.indexOf(key);
          if (index !== -1) state.hostnames[hostname]!.enabled.splice(index, 1);
        });
        useService.getState()._deleteHostname(hostname);
      },
      excludePatch: (hostname, key) => {
        useService.getState()._initHostname(hostname);
        set((state) => {
          if (state.hostnames[hostname]!.excluded.includes(key)) return;
          state.hostnames[hostname]!.excluded.push(key);
        });
        useService.getState().removePatch(hostname, key);
      },
      includePatch: (hostname, key) => {
        useService.getState()._initHostname(hostname);
        set((state) => {
          const index = state.hostnames[hostname]!.excluded.indexOf(key);
          if (index !== -1)
            state.hostnames[hostname]!.excluded.splice(index, 1);
        });
        useService.getState().addPatch(hostname, key);
      },
      config: {},
      updateConfig: (patchKey, data) => {
        set((state) => {
          state.config[patchKey] = data;
        });
      },
      resetConfig: (patchKey) => {
        set((state) => {
          if (state.config[patchKey]) delete state.config[patchKey];
        });
      },
      // ai
      chat: [],
      addChatMessage: (message) => {
        set((state) => {
          state.chat.push(message);
        });
      },
      clearChat: () => {
        set({ chat: [] });
      },
    })),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import.meta.env.DEV ? (localStorage as any) : chromeLocalStorage,
      ), // must return sync or async-compatible object
      version: 1,
      // migrate(persistedState, version) {},
    },
  ),
);
