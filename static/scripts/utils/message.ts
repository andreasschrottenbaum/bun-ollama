import { dateTimeFormat } from "./datetime";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface MessageOptions {
  text: string;
  type: "question" | "answer";
  timestamp?: number;
  model?: string;
  outputElement?: HTMLElement;
}

const getMessage = async ({
  text,
  type,
  timestamp = Date.now(),
  model,
  outputElement,
}: MessageOptions): Promise<HTMLElement> => {
  const el = (outputElement ?? document.createElement("div")) as HTMLElement;

  if (!outputElement) {
    el.classList.add("message", type);
    el.innerHTML = `
      <span class="badge timestamp">${dateTimeFormat(timestamp)}</span>
      <div class="content"></div>
      ${model ? `<span class="badge model">${model}</span>` : ""}
    `;
  }

  const contentDiv = el.querySelector(".content");
  if (contentDiv) {
    const rawHTML = await marked.parse(text);
    contentDiv.innerHTML = DOMPurify.sanitize(rawHTML);
  }

  return el;
};

export { getMessage };
