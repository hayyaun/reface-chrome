export function match(str: string, rule: string) {
  const escapeRegex = (str: string) =>
    // eslint-disable-next-line no-useless-escape
    str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(
    "^" + rule.split("*").map(escapeRegex).join(".*") + "$",
  ).test(str);
}
