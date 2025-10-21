/* eslint-disable @typescript-eslint/no-explicit-any */

export function isRecord(obj: unknown): obj is { [k: string]: unknown } {
  return !!obj && typeof obj === "object" && !Array.isArray(obj);
}

export function isStringRecord(obj: unknown): obj is { [k: string]: string } {
  return (
    isRecord(obj) && Object.values(obj).every((v) => typeof v === "string")
  );
}
