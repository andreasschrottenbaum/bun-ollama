import homeHTML from "./static/home.html";
import api_ollama from "./api/ollama";

const faviconFile = Bun.file("./static/ollama-icon.webp");

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": homeHTML,
    "/favicon.ico": () => new Response(faviconFile),
    "/favicon.webp": () => new Response(faviconFile),
    "/api/ollama": api_ollama,
  },
});
