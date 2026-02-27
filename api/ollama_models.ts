import ollama from "ollama";

let response: Response | null = null;
try {
  const list = await ollama.list();
  response = new Response(JSON.stringify(list.models), {
    headers: { "Content-Type": "application/json" },
  });
} catch (error) {
  console.error("Error fetching models from Ollama API:", error);

  response = new Response(
    JSON.stringify({ error: "Failed to fetch models from Ollama API" }),
    {
      headers: { "Content-Type": "application/json" },
      status: 500,
    },
  );
}

export default response as Response;
