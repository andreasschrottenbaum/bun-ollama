import { Utils } from "./utils/";

// Initialization
Utils.Theme.setupListeners();
Utils.setupMarkdown();

let abortController: AbortController | null = null;
let history = Utils.Storage.getHistory();

// 1. Load History
(async () => {
  for (const entry of history) {
    await Utils.UI.appendMessage({
      text: entry.prompt,
      type: "question",
      timestamp: entry.promptTimestamp,
    });
    await Utils.UI.appendMessage({
      text: entry.response,
      type: "answer",
      timestamp: entry.timestamp,
      model: entry.model,
    });
  }
})();

// 2. Setup Models
const availableModels = await Utils.Ollama.getModels();
Utils.UI.updateModelSelect(
  availableModels,
  Utils.Storage.getPreferredModel() || availableModels[0].name,
);

// 3. Event Listeners
Utils.UI.elements.promptForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(Utils.UI.elements.promptForm);
  const prompt = formData.get("prompt") as string;
  const model = formData.get("model") as string;

  if (!prompt.trim()) return;

  // UI preparation
  await Utils.UI.appendMessage({ text: prompt, type: "question" });
  const promptTimestamp = Date.now();
  Utils.UI.resetForm();
  Utils.UI.elements.modelSelect.value = model;

  const answerContainer = await Utils.UI.appendMessage({
    text: "",
    type: "answer",
    model,
  });
  const thinkingHint = Utils.UI.showThinking(answerContainer);

  // Stream Management
  if (abortController) abortController.abort();
  abortController = new AbortController();

  let answerText = "";
  try {
    await Utils.Ollama.streamPrompt(
      prompt,
      model,
      abortController.signal,
      (currentText) => {
        answerText = currentText;
        Utils.getMessage({
          text: currentText,
          type: "answer",
          outputElement: answerContainer,
          model,
        });
        Utils.UI.scrollToBottom();
      },
    );
  } catch (error: any) {
    const errorMsg =
      error.name === "AbortError" ? "Response aborted." : "An error occurred.";
    answerContainer.appendChild(
      Object.assign(document.createElement("p"), { innerText: errorMsg }),
    );
  } finally {
    thinkingHint.remove();
    abortController = null;

    // History Management
    history.push({
      prompt,
      response: answerText,
      model,
      timestamp: Date.now(),
      promptTimestamp,
    });
    if (history.length > 20) history.shift();
    Utils.Storage.saveHistory(history);
  }
});

// Shortcuts & Reset
document.addEventListener(
  "keydown",
  (e) =>
    e.key === "Enter" &&
    e.ctrlKey &&
    Utils.UI.elements.promptForm.requestSubmit(),
);
Utils.UI.elements.resetBtn?.addEventListener("click", () => {
  Utils.Storage.clearHistory();
  Utils.UI.clearOutput();
});
Utils.UI.elements.output.addEventListener("click", Utils.copyTargetToClipboard);
