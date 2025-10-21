export function getElementCSSPath(el: Element): string {
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

export function getElementXPath(el: Element): string {
  if (el.id) return `//*[@id="${el.id}"]`;

  const parts: string[] = [];
  while (el && el.nodeType === Node.ELEMENT_NODE) {
    let index = 1;
    let sibling = el.previousSibling;

    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === el.nodeName) {
        index++;
      }
      sibling = sibling.previousSibling;
    }

    const tagName = el.nodeName.toLowerCase();
    const pathIndex = `[${index}]`;
    parts.unshift(tagName + pathIndex);
    el = el.parentNode as Element;
  }

  return "/" + parts.join("/");
}

export function getElementByXPath(xpath: string): Element | null {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  );
  return result.singleNodeValue as Element;
}
