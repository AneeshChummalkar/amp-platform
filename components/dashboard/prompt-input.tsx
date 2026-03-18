"use client"

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
  return (
    <div className="w-full">
      <textarea
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (prompt && !isGenerating) {
        onGenerate(prompt)
      }
    }
  }}
  placeholder="Describe the AI agent you want to create..."
  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
/>

      <button
        onClick={() => onGenerate(prompt)}
        disabled={!prompt || isGenerating}
        className="w-full mt-3 bg-white text-black rounded-xl py-3 hover:bg-gray-200 transition"
      >
        {isGenerating ? "Generating..." : "Generate Agent"}
      </button>
    </div>
  )
}