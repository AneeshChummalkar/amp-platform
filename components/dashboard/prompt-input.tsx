"use client"

import { ArrowUp, Circle, Sparkles } from "lucide-react"

const examples = [
  "Build an AI that manages my Gmail",
  "Build an AI stock analyst",
  "Build an AI gym coach",
  "Build an AI study planner",
  "Build an AI coding assistant",
]

interface PromptInputProps {
  prompt: string
  setPrompt: (value: string) => void
  onGenerate: (prompt: string) => void
  isGenerating: boolean
}

export function PromptInput({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
}: PromptInputProps) {
  const canGenerate = Boolean(prompt.trim()) && !isGenerating

  return (
    <div className="w-full">
      <div className="amp-energy-border relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] p-2 shadow-[0_0_90px_rgba(56,189,248,0.2)] backdrop-blur-2xl">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
        <div className="grid gap-3 rounded-[1.55rem] bg-black/52 p-3 ring-1 ring-white/10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex min-h-[112px] gap-3">
            <div className="mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.24)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  if (canGenerate) {
                    onGenerate(prompt)
                  }
                }
              }}
              placeholder="Describe the mission your AI Agent should own..."
              className="min-h-[112px] flex-1 resize-none bg-transparent pt-2 text-lg leading-7 text-white outline-none placeholder:text-white/32 sm:text-xl sm:leading-8"
            />
          </div>

          <button
            type="button"
            onClick={() => onGenerate(prompt)}
            disabled={!canGenerate}
            className="group relative h-16 overflow-hidden rounded-2xl bg-white px-7 font-semibold text-black shadow-[0_0_45px_rgba(255,255,255,0.24)] transition duration-300 hover:scale-[1.01] hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
            <span className="relative flex items-center justify-center gap-2">
              {isGenerating ? "Building..." : "Generate AI Agent"}
              <ArrowUp className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setPrompt(example)}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/58 backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white disabled:opacity-40"
          >
            <Circle className="h-1.5 w-1.5 fill-current" />
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}
