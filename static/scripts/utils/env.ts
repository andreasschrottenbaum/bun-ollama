const isOffline = location.href.includes(".github.io");

if (isOffline) {
  const baseEl = document.createElement("base");
  baseEl.href = "https://andreasschrottenbaum.github.io/bun-ollama/";

  document.head.appendChild(baseEl);
}

export { isOffline };
