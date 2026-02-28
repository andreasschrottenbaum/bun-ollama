/**
 * Copies the [data-code] of the element to the clipboard
 * and updates the 'Copy' text temporarily
 *
 * @param event MouseEvent
 */
const copyTargetToClipboard = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("copy-button")) {
    const code = decodeURIComponent(target.getAttribute("data-code") || "");
    navigator.clipboard.writeText(code);

    target.innerText = "Copied!";
    target.classList.add("copied");

    setTimeout(() => {
      target.innerText = "Copy";
      target.classList.remove("copied");
    }, 2000);
  }
};

export { copyTargetToClipboard };
