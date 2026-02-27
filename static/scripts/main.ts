import { marked } from "marked";

const output = document.querySelector("#output") as HTMLDivElement;
const promptForm = document.querySelector(
  "form#prompt-form",
) as HTMLFormElement;
const colorPicker = document.querySelector("#color-picker") as HTMLInputElement;

/*
 * Handle color picker input to update the primary color and related CSS variables.
 */
colorPicker.addEventListener("input", () => {
  const color = colorPicker.value;
  document.documentElement.style.setProperty("--primary", color);
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

  const newQuestion = document.createElement("div");
  newQuestion.classList.add("question", "message");
  newQuestion.innerHTML = await marked.parse(prompt);
  output.appendChild(newQuestion);

  promptForm.reset();

  const newAnswer = document.createElement("div");
  newAnswer.classList.add("answer", "message");
  output.appendChild(newAnswer);

  const thinkingHint = document.createElement("p");
  thinkingHint.innerText = "Thinking...";
  thinkingHint.classList.add("thinking-hint");
  newAnswer.appendChild(thinkingHint);

  const response = await fetch("/api/ollama", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });

  if (!response.body) return;

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  let fullMarkdown = "";
  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    fullMarkdown += chunk;

    newAnswer.innerHTML = await marked.parse(fullMarkdown);
    thinkingHint?.remove();

    window.scrollTo(0, document.body.scrollHeight);
  }
});
