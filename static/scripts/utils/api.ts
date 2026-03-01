const Ollama = {
  getModels: async () => {
    const res = await fetch("/api/ollama-models");
    return res.json();
  },

  streamPrompt: async (
    prompt: string,
    model: string,
    signal: AbortSignal,
    onChunk: (text: string) => void,
  ) => {
    const response = await fetch("/api/ollama", {
      method: "POST",
      signal,
      body: JSON.stringify({ prompt, model }),
    });

    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        const finalChunk = decoder.decode();
        fullText += finalChunk;

        if (!fullText) onChunk("An error occured!");
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onChunk(fullText);
    }
  },
};

export { Ollama };
