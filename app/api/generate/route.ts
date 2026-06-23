import { NextResponse } from "next/server"

interface AgentResponse {
  name: string
  goal: string
  steps: string[]
  tools: string[]
}

function extractJson(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")

  return JSON.parse(cleaned)
}

function normalizeAgentResponse(value: Partial<AgentResponse>): AgentResponse {
  return {
    name: typeof value.name === "string" ? value.name : "",
    goal: typeof value.goal === "string" ? value.goal : "",
    steps: Array.isArray(value.steps)
      ? value.steps.filter((step): step is string => typeof step === "string")
      : [],
    tools: Array.isArray(value.tools)
      ? value.tools.filter((tool): tool is string => typeof tool === "string")
      : [],
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY" },
      { status: 500 }
    )
  }

  const { prompt } = await req.json()

  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json(
      { error: "Prompt is required" },
      { status: 400 }
    )
  }

  const modelName = "gemini-2.5-flash"
  console.log("Gemini model:", modelName)

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`
  const geminiRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are designing an AI agent.

Create a concise agent plan for this user request:
${prompt}

Return only valid JSON in this exact shape:
{
  "name": "",
  "goal": "",
  "steps": [],
  "tools": []
}

Rules:
- name must be a short agent name.
- goal must be one concise paragraph.
- steps must contain 3 to 5 short strings.
- tools must contain 3 to 5 short strings.
- Do not include markdown, comments, or extra text.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 400,
        responseMimeType: "application/json",
      },
    }),
  }

  const maxRetries = 3
  let response = await fetch(geminiUrl, geminiRequest)

  for (
    let retry = 0;
    !response.ok && response.status === 503 && retry < maxRetries;
    retry++
  ) {
    await wait(2000)
    response = await fetch(geminiUrl, geminiRequest)
  }

  console.log("Gemini HTTP status:", response.status)

  if (!response.ok) {
    const errorText = await response.text()

    return NextResponse.json(
      { error: "Gemini request failed", details: errorText },
      { status: response.status }
    )
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (typeof text !== "string") {
    return NextResponse.json(
      { error: "Gemini returned an invalid response" },
      { status: 502 }
    )
  }

  try {
    console.log("Raw Gemini text first 500 chars:", text.slice(0, 500))

    const parsed = extractJson(text)
    const agent = normalizeAgentResponse(parsed)

    return NextResponse.json(agent)
  } catch {
    return NextResponse.json(
      { error: "Failed to parse Gemini JSON response" },
      { status: 502 }
    )
  }
}