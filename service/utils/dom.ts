export function getElementPath(el: Element): string {
  if (!(el instanceof Element)) return "";
  const path: string[] = [];
  while (el && el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector += `#${el.id}`;
      path.unshift(selector);
      break; // ID is unique, stop here
    } else {
      let sib: Element | null = el,
        nth = 1;
      while ((sib = sib.previousElementSibling)) {
        if (sib.nodeName.toLowerCase() === selector) nth++;
      }
      selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    el = el.parentElement!;
  }
  return path.join(" > ");
}
