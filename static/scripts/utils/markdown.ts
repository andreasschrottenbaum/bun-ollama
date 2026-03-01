// src/utils/markdown.ts
import { marked, Renderer } from "marked";
import hljs from "highlight.js";

function setupMarkdown() {
  const renderer = new Renderer();

  renderer.code = ({ text, lang }) => {
    const validLang = lang && hljs.getLanguage(lang) ? lang : "plaintext";
    const highlighted = hljs.highlight(text, { language: validLang }).value;

    return `
      <div class="code-container">
        <header>
          <span class="language-label">${validLang}</span>
          <button class="copy-button" data-code="${encodeURIComponent(text)}" aria-label="Copy Code">Copy</button>
        </header>
        <pre><code class="hljs language-${validLang}">${highlighted}</code></pre>
      </div>`;
  };

  marked.setOptions({ renderer });
}

export { setupMarkdown };
