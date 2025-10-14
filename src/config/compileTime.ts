import type { Patch } from "../types";

export const patches = compileTime(async () => {
  const patches = (await import("../config/patches.ts")).default;
  const purePatches: { [key: string]: Omit<Patch, "profile" | "logo"> } =
    Object.fromEntries(
      Object.entries(patches).map(([key, patch]) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profile, logo, ...rest } = patch;
        return [key, rest];
      }),
    );
  return purePatches;
});
