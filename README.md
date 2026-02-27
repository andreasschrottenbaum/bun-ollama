# Bun-Ollama Playground 🧪

A minimalist, high-performance local AI chat interface built with **Bun**, **TypeScript**, and modern **CSS**. This playground provides a clean, distraction-free environment to interact with your local Ollama models.

## ✨ Features

- **Streaming Responses**: Real-time text generation using the Web Streams API for a smooth "typing" experience.
- **Smart UI/UX**:
  - **Dynamic Theming**: Powered by the **OKLCH** color space for vibrant and perceptually uniform colors.
  - **Accessibility**: Automatic text contrast adjustment based on the background brightness (YIQ formula).
  - **Code Highlighting**: Full syntax highlighting with language labels via `highlight.js`.
  - **Copy-to-Clipboard**: Quick-copy buttons integrated into every code block.
- **Robust Architecture**:
  - **Auto-Abort**: Uses `AbortController` to cancel pending streams when a new prompt is sent.
  - **Chat History**: Persists the last 20 conversations in `localStorage`.
  - **XSS Protection**: All Markdown output is sanitized using `DOMPurify`.
- **Developer Friendly**:
  - `Ctrl + Enter` to submit.
  - Clean TypeScript codebase.
  - Minimal dependencies.

## 🛠 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Markdown Parser**: [Marked](https://marked.js.org/)
- **Syntax Highlighting**: [Highlight.js](https://highlightjs.org/)
- **Security**: [DOMPurify](https://github.com/cure53/dompurify)
- **Styling**: Modern CSS (Nesting, Custom Properties, OKLCH)

## 🚀 Getting Started

### Prerequisites

1. Install [Bun](https://bun.sh/).
2. Install and run [Ollama](https://ollama.ai/) (defaulting to port `11434`).

### Installation

```bash
# Clone the repository
git clone [https://github.com/andreasschrottenbaum/bun-ollama-playground.git](https://github.com/andreasschrottenbaum/bun-ollama-playground.git)

# Install dependencies
bun install

# Run the application
bun run server
```
