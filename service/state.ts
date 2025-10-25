import { usePrefs, useService } from "@/shared/store";

// State

export const state = {
  service: useService.getInitialState(),
  prefs: usePrefs.getInitialState(),
};
