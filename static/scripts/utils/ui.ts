import { getMessage } from "./message";

const UI = {
  elements: {
    output: document.querySelector("#output") as HTMLDivElement,
    promptForm: document.querySelector("#prompt-form") as HTMLFormElement,
    modelSelect: document.querySelector("#model-select") as HTMLSelectElement,
    resetBtn: document.getElementById("reset-btn") as HTMLButtonElement,
  },

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  },

  clearOutput() {
    this.elements.output.innerHTML = "";
    this.focusPrompt();
  },

  setLoading(isLoading: boolean) {
    this.elements.promptForm.classList.toggle("loading", isLoading);
  },

  async appendMessage(config: {
    text: string;
    type: "question" | "answer";
    model?: string;
    timestamp?: number;
    element?: HTMLDivElement;
  }) {
    const msgElement = await getMessage({
      text: config.text,
      type: config.type,
      timestamp: config.timestamp,
      model: config.model,
      outputElement: config.element,
    });

    if (!config.element) {
      this.elements.output.appendChild(msgElement);
    }

    this.scrollToBottom();
    return msgElement;
  },

  showThinking(parent: HTMLElement) {
    const hint = document.createElement("p");
    hint.innerText = "Thinking...";
    hint.classList.add("thinking-hint");
    parent.appendChild(hint);
    return hint;
  },

  updateModelSelect(models: any[], preferred: string) {
    const select = this.elements.modelSelect;
    select.querySelector("option.loading")?.remove();

    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.name;
      const sizeGB = (model.size / 1024 ** 3).toFixed(2);
      option.innerText = `${model.name} (${sizeGB} GB)`;
      option.selected = model.name === preferred;
      select.appendChild(option);
    });
  },

  focusPrompt() {
    const textarea = this.elements.promptForm.querySelector("textarea");
    textarea?.focus();
  },

  resetForm() {
    this.elements.promptForm.reset();
    this.focusPrompt();
  },
};

export { UI };
