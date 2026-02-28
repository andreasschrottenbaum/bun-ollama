import { dateTimeFormat } from "./datetime";

import { marked } from "marked";
import DOMPurify from "dompurify";

interface MessageOptions {
  text: string;
  type: "question" | "answer";
  timestamp?: number;
  model?: string;
  outputElement?: HTMLDivElement;
}

/**
 * Creates the markup for the message
 * @param text Text to display
 * @param type Type of text
 * @param timestamp UNIX timestamp
 * @param model LLM model
 * @param outputElement Element to update
 */
const getMessage = async ({
  text,
  type,
  timestamp = Date.now(),
  model,
  outputElement,
}: MessageOptions): Promise<HTMLDivElement> => {
  const el = outputElement ?? document.createElement("div");
  el.classList.add("message", type);

  const rawMessage = await marked.parse(text);

  el.innerHTML = `
    <span class="badge timestamp">${dateTimeFormat(timestamp)}</span>
    ${DOMPurify.sanitize(rawMessage)}
    ${model ? `<span class="badge model">${model}</span>` : ""}
  `;

  return el;
};

export { getMessage };
