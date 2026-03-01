import { isOffline } from "./env";

const Ollama = {
  getModels: async () => {
    if (isOffline) {
      return [
        {
          name: "OFFLINE - No Models available",
          size: 0,
        },
        {
          name: "OFFLINE - Pull the repository and run it",
          size: 0,
        },
        {
          name: "OFFLINE - locally for the full demonstration",
          size: 0,
        },
      ];
    }

    const res = await fetch("/api/ollama-models");
    return res.json();
  },

  streamPrompt: async (
    prompt: string,
    model: string,
    signal: AbortSignal,
    onChunk: (text: string) => void,
  ) => {
    if (isOffline) {
      const demoText = `Welcome to the **Ollama Web UI** demo! 🚀

Since this page is hosted on **GitHub Pages**, there is no active backend. In a local environment, I would connect to your **Ollama** instance and stream real-time responses from your models.

Even in this demo mode, you can test all the interface features:
- **Streaming UI**: Experience the smooth typing effect.
- **Dynamic Theming**: Change colors using the **OKLCH** color space.
- **Syntax Highlighting**: Code blocks are automatically formatted.
- **A11Y & Responsive**: Try resizing your browser or using a screen reader!

Feel free to send another prompt to see the simulation again.`;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      let current = "";
      const words = demoText.split(" ");

      for (const word of words) {
        if (signal.aborted) break;
        current += word + " ";
        onChunk(current);

        // Pause simulieren: Länger bei Satzzeichen, sonst kurz
        const delay = /[.!?;]/.test(word) ? 300 : 60;
        await new Promise((r) => setTimeout(r, delay + Math.random() * 40));
      }
      return;
    }

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
