"use client"

import { PromptInput } from "./prompt-input"
import { AgentOutput } from "./agent-output"
import { motion } from "framer-motion"

interface AgentData {
  id: string
  name: string
  goal: string
  steps: string[]
  tools: string[]
  createdAt: Date
}

interface MainPanelProps {
  selectedAgent: AgentData | null
  isGenerating: boolean
  onGenerate: (prompt: string) => void
  onStartDemo: () => void

  // 🔥 NEW
  prompt: string
  setPrompt: (value: string) => void
}

export function MainPanel({
  selectedAgent,
  isGenerating,
  onGenerate,
  onStartDemo,
  prompt,
  setPrompt,
}: MainPanelProps) {
  return (
    <main className="flex flex-1 flex-col bg-black text-white">

      {/* Content */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-4">

        {/* Center Container */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-8">

          {/* Hero */}
          <motion.div
            className="text-center space-y-4 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-semibold tracking-tight leading-tight">
              Create AI Agents
              <br />
              <span className="text-white/40">with a Prompt</span>
            </h2>

            <p className="text-sm text-white/50 max-w-md mx-auto">
              Describe what you want your agent to do. AMP handles the rest.
            </p>
          </motion.div>

          {/* Prompt Input */}
          <div className="w-full">
            <PromptInput
              key={selectedAgent ? "existing" : "new"} // 🔥 CRITICAL FIX
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={onGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Output */}
          <div className="w-full">
            <AgentOutput
              agent={selectedAgent}
              isGenerating={isGenerating}
              onStartDemo={onStartDemo}
            />
          </div>

        </div>
      </div>
    </main>
  )
}