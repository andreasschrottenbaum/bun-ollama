# 🚀 Ollama Web UI

A minimalist, high-performance web interface for your local Ollama models. Built with **Bun**, **TypeScript**, and modern **CSS (OKLCH)**.

[Live Demo](https://andreasschrottenbaum.github.io/bun-ollama/)

## ✨ Features

- **Streaming Architecture**: Real-time response rendering with a natural typing effect.
- **Modern Theming**: Fully dynamic color system using the **OKLCH** color space for perceptually uniform colors.
- **Robust Markdown**: Full support for tables, task lists, and syntax-highlighted code blocks (via Marked.js & DOMPurify).
- **Responsive Design**: Optimized for devices from 330px up to 4K desktops.
- **Local-First**: No data leaves your machine. Communicates directly with your local Ollama instance.
- **Demo Mode**: Automatic fallback to a simulated environment when hosted on static platforms like GitHub Pages.

## 🛠 Tech Stack

- **Runtime:** [Bun](https://bun.sh/)
- **Language:** TypeScript
- **Bundler:** Bun.build (Zero-config bundling)
- **Styling:** Modern CSS (Nesting, Variables, Container Queries)
- **CI/CD:** GitHub Actions for automated deployment

## 🚀 Getting Started

### Prerequisites

Ensure you have [Ollama](https://ollama.com/) installed and running locally.

### Installation

1. Clone the repository:

   ```bash
   git clone [https://github.com/andreasschrottenbaum/bun-ollama.git](https://github.com/andreasschrottenbaum/bun-ollama.git)
   cd bun-ollama
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Running Locally

Start the development server:

```bash
bun index
```

Open http://localhost:3000 in your browser.

## 📦 Build & Deployment

```bash
bun run build
```

This script cleans the `dist` directory, bundles the assets, and prepares the favicon for deployment.

<hr>

_Created with passion for clean code and local AI._
