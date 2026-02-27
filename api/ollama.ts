import ollama from "ollama";

/*
 * Handle incoming POST requests to the /api/ollama endpoint,
 * send the prompt to the Ollama API, and stream the response back to the client.
 */
async function main(request: Request) {
  const input = (await request.json()) as { prompt: string };

  const response = await ollama.chat({
    model: "llama3.2",
    messages: [{ role: "user", content: input.prompt }],
    stream: true,
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of response) {
            const content = chunk.message?.content || "";
            controller.enqueue(encoder.encode(content));
          }
        } catch (error) {
          console.error("Error in Ollama API stream:", error);
          controller.enqueue(
            encoder.encode("An error occurred while processing your request."),
          );
        } finally {
          controller.close();
        }
      },
    }),
  );
}

export default main;
