import indexHTML from "./static/index.html";
import api_ollama from "./api/ollama";
import api_ollama_models from "./api/ollama_models";

const faviconFile = Bun.file("./static/ollama-icon.webp");

const server = Bun.serve({
  port: 3000,
  routes: {
    "/favicon.ico": () => new Response(faviconFile),
    "/favicon.webp": () => new Response(faviconFile),

    "/": indexHTML,

    "/api/ollama": api_ollama,
    "/api/ollama-models": api_ollama_models,
  },
});

export { server };
