function renderReadingTime(
  article: HTMLDivElement | null,
  target: HTMLDivElement | null,
) {
  // If we weren't provided an article, we don't need to render anything.
  if (!article || !target) return;
  const text = article.textContent || "";
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  console.log({ wordCount, readingTime });
  const badge = document.createElement("span");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;
  target.appendChild(badge);
}

// TODO change article and target based on other websites too
renderReadingTime(
  document.querySelector<HTMLDivElement>("#mw-content-text"),
  document.querySelector<HTMLDivElement>("#firstHeading"),
);
