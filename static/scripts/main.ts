import { marked, Renderer } from "marked";
import hljs from "highlight.js";
import DOMPurify from "dompurify";

const output = document.querySelector("#output") as HTMLDivElement;
const promptForm = document.querySelector(
  "form#prompt-form",
) as HTMLFormElement;
const colorPicker = document.querySelector("#color-picker") as HTMLInputElement;

let abortController: AbortController | null = null;

/*
 * Configure marked to use highlight.js for code block syntax highlighting.
 * This will automatically apply syntax highlighting to any code blocks in the markdown response.
 */
const renderer = new Renderer();
renderer.code = ({ text, lang }) => {
  const validLang = lang && hljs.getLanguage(lang) ? lang : "plaintext";
  const highlighted = hljs.highlight(text, { language: validLang }).value;

  return `
    <div class="code-container">
      <header>
        <span class="language-label">${validLang}</span>
        <button class="copy-button" data-code="${encodeURIComponent(text)}">Copy</button>
      </header>
      <pre><code class="hljs language-${validLang}">${highlighted}</code></pre>
    </div>`;
};

marked.setOptions({ renderer });

output.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("copy-button")) {
    const code = decodeURIComponent(target.getAttribute("data-code") || "");
    navigator.clipboard.writeText(code);

    target.innerText = "Copied!";

    setTimeout(() => {
      target.innerText = "Copy";
    }, 2000);
  }
});

/**
 * On page load, check for any previously stored prompts and responses in localStorage,
 * and render them in the output area using marked for markdown parsing.
 */
let lastPromptsStr = localStorage.getItem("lastPrompts");
let lastPrompts: { prompt: string; response: string }[] = [];
if (lastPromptsStr) {
  try {
    lastPrompts = JSON.parse(lastPromptsStr);

    for (const { prompt, response } of lastPrompts) {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("question", "message");
      const rawQuestion = await marked.parse(prompt);
      questionDiv.innerHTML = DOMPurify.sanitize(rawQuestion);
      output.appendChild(questionDiv);

      const answerDiv = document.createElement("div");
      answerDiv.classList.add("answer", "message");
      const rawAnswer = await marked.parse(response);
      answerDiv.innerHTML = DOMPurify.sanitize(rawAnswer);
      output.appendChild(answerDiv);
    }

    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  } catch (e) {
    console.error("Error parsing last prompts from localStorage:", e);
  }
}

/*
 * On page load, check for a stored primary color in localStorage and apply it to the CSS variable.
 * Also set the color picker's value to the stored color and adjust text color for readability.
 */
const storedColor = localStorage.getItem("primaryColor") || "#c0c0c0";
document.documentElement.style.setProperty("--primary", storedColor);
colorPicker.value = storedColor;
setTextColorBasedOnBackground(storedColor);

/*
 * Handle color picker input to update the primary color and related CSS variables.
 */
colorPicker.addEventListener("input", () => {
  document.documentElement.style.setProperty("--primary", colorPicker.value);
  localStorage.setItem("primaryColor", colorPicker.value);
  setTextColorBasedOnBackground(colorPicker.value);
});

/*
 * Handle ctrl + enter to submit the prompt form
 * and send the prompt to the Ollama API.
 */
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    promptForm.requestSubmit();
  }
});

/*
 * Handle form submission, send the prompt to the Ollama API,
 * and stream the response back to the client.
 */
promptForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(promptForm);
  const prompt = formData.get("prompt") as string;

  if (!prompt.trim()) return;

  const newQuestion = document.createElement("div");
  newQuestion.classList.add("question", "message");
  const rawQuestion = await marked.parse(prompt);
  newQuestion.innerHTML = DOMPurify.sanitize(rawQuestion);
  output.appendChild(newQuestion);

  promptForm.reset();

  const newAnswer = document.createElement("div");
  newAnswer.classList.add("answer", "message");
  output.appendChild(newAnswer);

  const thinkingHint = document.createElement("p");
  thinkingHint.innerText = "Thinking...";
  thinkingHint.classList.add("thinking-hint");
  newAnswer.appendChild(thinkingHint);

  if (abortController) {
    abortController.abort();
    abortController = null;
  }

  abortController = new AbortController();
  let fullMarkdown = "";

  try {
    const response = await fetch("/api/ollama", {
      method: "POST",
      signal: abortController?.signal,
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = document.createElement("p");
      errorText.innerText = `Error: ${response.status} ${response.statusText}`;
      newAnswer.appendChild(errorText);

      thinkingHint.remove();
      return;
    }

    if (!response.body) return;

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let isFirstChunk = true;

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      if (isFirstChunk) {
        thinkingHint.remove();
        isFirstChunk = false;
      }

      const chunk = decoder.decode(value, { stream: true });
      fullMarkdown += chunk;

      if (fullMarkdown.trim()) {
        const rawMarkdown = await marked.parse(fullMarkdown);
        newAnswer.innerHTML = DOMPurify.sanitize(rawMarkdown);
      }

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      const abortText = document.createElement("p");
      abortText.innerText = "Response aborted.";
      newAnswer.appendChild(abortText);
    } else {
      const errorText = document.createElement("p");
      errorText.innerText = "An error occurred while processing your request.";
      newAnswer.appendChild(errorText);
    }
  } finally {
    abortController = null;
    thinkingHint?.remove();

    // Save the prompt and response to localStorage
    lastPrompts.push({ prompt, response: fullMarkdown });

    if (lastPrompts.length > 20) {
      lastPrompts.shift();
    }

    localStorage.setItem("lastPrompts", JSON.stringify(lastPrompts));
  }
});

/**
 * Automatically set text color based on the brightness of the selected background color for better readability.
 * @param hexColor Input color to measure
 */
function setTextColorBasedOnBackground(hexColor: string) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 128 ? "#000000" : "#FFFFFF";
  document.documentElement.style.setProperty("--text-color", textColor);
}
