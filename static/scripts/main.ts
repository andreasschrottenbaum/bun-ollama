import { marked, Renderer } from "marked";
import hljs from "highlight.js";

import * as Utils from "./utils/";

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

output.addEventListener("click", Utils.copyTargetToClipboard);

/**
 * On page load, check for any previously stored prompts and responses in localStorage,
 * and render them in the output area using marked for markdown parsing.
 */
let lastPrompts: {
  prompt: string;
  response: string;
  model: string;
  timestamp: number;
  promptTimestamp: number;
}[] = Utils.Storage.getHistory();
for (const {
  prompt,
  response,
  model,
  timestamp,
  promptTimestamp,
} of lastPrompts) {
  const questionDiv = await Utils.getMessage({
    text: prompt,
    type: "question",
    timestamp: promptTimestamp,
  });
  output.appendChild(questionDiv);

  const answerDiv = await Utils.getMessage({
    text: response,
    type: "answer",
    timestamp,
    model,
  });
  output.appendChild(answerDiv);
}

window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

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
  const model = formData.get("model") as string;

  if (!prompt.trim()) return;

  const newQuestion = await Utils.getMessage({
    text: prompt,
    type: "question",
  });
  output.appendChild(newQuestion);
  const promptTimestamp = Date.now();

  promptForm.reset();
  const modelSelect = document.querySelector(
    "#model-select",
  ) as HTMLSelectElement;
  modelSelect.value = model;

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
  let now = Date.now();
  let answerText = "";

  try {
    await Utils.Ollama.streamPrompt(
      prompt,
      model,
      abortController.signal,
      (currentText) => {
        Utils.getMessage({
          text: currentText,
          type: "answer",
          outputElement: newAnswer,
          model,
        });

        answerText = currentText;

        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      },
    );
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
    lastPrompts.push({
      prompt,
      response: answerText,
      model,
      timestamp: now,
      promptTimestamp,
    });

    if (lastPrompts.length > 20) {
      lastPrompts.shift();
    }

    Utils.Storage.saveHistory(lastPrompts);
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

/**
 * On page load, fetch the list of available Ollama models from the API and create a dropdown for model selection in the UI.
 * This allows users to choose which model they want to interact with when sending prompts.
 */
const availableModels = await Utils.Ollama.getModels();
const preferredModel = Utils.Storage.getPreferredModel() || availableModels[0];

const modelSelect = document.querySelector(
  "#model-select",
) as HTMLSelectElement;

const loadingOption = modelSelect.querySelector("option.loading");
if (loadingOption) {
  loadingOption.remove();
}

availableModels.forEach((model: any) => {
  const option = document.createElement("option");
  option.value = model.name;

  const sizeGB = (model.size / 1024 ** 3).toFixed(2);
  option.innerText = `${model.name} (${sizeGB} GB)`;

  if (model.name === preferredModel) {
    option.selected = true;
  }

  modelSelect.appendChild(option);
});

modelSelect.addEventListener("change", () => {
  const selectedModel = modelSelect.value;
  Utils.Storage.savePreferredModel(selectedModel);
});
