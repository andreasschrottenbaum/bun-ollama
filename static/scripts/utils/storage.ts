import { isOffline } from "./env";

const KEYS = {
  HISTORY: "lastPrompts",
  PRIMARY_COLOR: "primaryHue",
  PRIMARY_CHROMA: "primaryChroma",
  PREFERRED_DARKMODE: "preferredDarkmode",
  PREFERRED_MODEL: "preferredModel",
};

const DEMO_CONTENT = `## 🚀 Ollama Web UI: Local AI Interface

Welcome! This is a **high-performance**, minimalist chat interface. Since you are viewing the **GitHub Pages Demo**, I've pre-filled this history to show you what the UI can do.

---

### 🛠 Technical Excellence
| Feature | Implementation | Status |
| :--- | :--- | :---: |
| **Runtime** | Bun (Fast & Modern) | ✅ |
| **Colors** | Perceptually uniform **OKLCH** | 🌈 |
| **Security** | DOMPurify Sanitization | 🛡️ |
| **A11Y** | Semantic HTML & ARIA Live | ♿ |

### 💻 Syntax Highlighting & Copy
The UI automatically detects languages and provides a copy-to-clipboard button:

\`\`\`typescript
// Clean architecture: logic is separated into utils
import { Ollama } from "./utils/api";
import { Storage } from "./utils/storage";

const init = async () => {
  const models = await Ollama.getModels();
  console.log("Ready to chat with:", models);
};
\`\`\`

### 🎨 Design Philosophy
> "Simplicity is the ultimate sophistication." 
> This playground focuses on a **distraction-free** experience, utilizing modern CSS Nesting and Container Queries for maximum responsiveness.

### 📝 Task Tracking
- [x] Refactor monolith into modules
- [x] Implement streaming logic
- [x] Optimize for mobile devices (330px+)
- [ ] Add multi-modal support (Future)

---
*Feel free to change the theme color in the footer or clear the history to start fresh!*`;

interface Prompt {
  model: string;
  prompt: string;
  promptTimestamp: number;
  response: string;
  timestamp: number;
}

const Storage = {
  getHistory: () => {
    let history: Prompt[] = JSON.parse(
      localStorage.getItem(KEYS.HISTORY) || "[]",
    ) as Prompt[];

    if (isOffline && !history.length) {
      history = [
        {
          model: "Offline Demo",
          prompt: "Show me what you can do",
          promptTimestamp: Date.now() - 10000,
          response: DEMO_CONTENT,
          timestamp: Date.now(),
        },
      ];

      Storage.saveHistory(history);
    }

    return history;
  },
  saveHistory: (history: Prompt[]) =>
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.slice(-20))),
  clearHistory: () => localStorage.setItem(KEYS.HISTORY, JSON.stringify([])),

  getPrimaryColor: (fallback = 245) =>
    localStorage.getItem(KEYS.PRIMARY_COLOR) ?? fallback,
  savePrimaryColor: (color: string) =>
    localStorage.setItem(KEYS.PRIMARY_COLOR, color),

  getPrimaryChroma: (fallback = 0.25) =>
    localStorage.getItem(KEYS.PRIMARY_CHROMA) ?? fallback,
  savePrimaryChroma: (color: string) =>
    localStorage.setItem(KEYS.PRIMARY_CHROMA, color),

  getDarkMode: () => {
    const systemPreference =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return (
      JSON.parse(localStorage.getItem(KEYS.PREFERRED_DARKMODE) || "null") ??
      systemPreference
    );
  },
  saveDarkMode: (dark: boolean) =>
    localStorage.setItem(KEYS.PREFERRED_DARKMODE, JSON.stringify(dark)),

  getPreferredModel: () => localStorage.getItem(KEYS.PREFERRED_MODEL),
  savePreferredModel: (model: string) =>
    localStorage.setItem(KEYS.PREFERRED_MODEL, model),
};

export { Storage };
