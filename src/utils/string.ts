/* eslint-disable @typescript-eslint/no-explicit-any */

export function isRecord(obj: any): obj is { [k: string]: string } {
  return obj && typeof obj === "object" && !Array.isArray(obj);
}

export function isStringRecord(obj: any): obj is { [k: string]: string } {
  return (
    isRecord(obj) && Object.values(obj).every((v) => typeof v === "string")
  );
}
