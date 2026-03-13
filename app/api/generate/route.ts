export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;

  console.log("Received prompt:", prompt);

  return Response.json({
    message: "Agent generation started",
    prompt: prompt
  });
}