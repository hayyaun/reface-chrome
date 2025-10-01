export function customNthIdentifier(prefix: string) {
  return { get: (n: number) => prefix + n };
}
