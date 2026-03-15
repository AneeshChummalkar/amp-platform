import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { prompt } = await req.json()

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "phi3:mini",
      stream: true,
      prompt: `
You are designing an AI agent.

Create a concise agent plan.

STRICT RULES:
- Maximum 5 steps only
- Each step maximum 2 sentences
- Do not generate more than 5 steps
- Keep answers short and structured

FORMAT EXACTLY LIKE THIS:

Goal:
(1 short paragraph)

Steps:
1.
2.
3.
4.
5.

Tools:
- tool
- tool
- tool

User Request:
${prompt}
`,
      options: {
        num_predict: 150,
        temperature: 0.2
      }
    })
  })

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/plain"
    }
  })

}