"use client"

import {
  Target,
  ListChecks,
  Wrench,
  Bot,
  Copy,
  Check,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AgentData {
  id: string
  name: string
  goal: string
  steps: string[]
  tools: string[]
  createdAt: Date
}

interface AgentOutputProps {
  agent: AgentData | null
  isGenerating: boolean
  onStartDemo: () => void
}

export function AgentOutput({
  agent,
  isGenerating,
  onStartDemo,
}: AgentOutputProps) {
  const [copied, setCopied] = useState(false)
  const [showDeploy, setShowDeploy] = useState(false)

  // Deploy button delay effect
  useEffect(() => {
    if (agent && !isGenerating) {
      const timer = setTimeout(() => {
        setShowDeploy(true)
      }, 600)

      return () => clearTimeout(timer)
    } else {
      setShowDeploy(false)
    }
  }, [agent, isGenerating])

  const handleCopy = () => {
    if (!agent) return

    const text = `Agent: ${agent.name}

Goal: ${agent.goal}

Steps:
${agent.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Tools:
${agent.tools.map((t) => `- ${t}`).join("\n")}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading state
  if (isGenerating) {
    return (
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Bot className="h-5 w-5 animate-pulse text-white/60" />
            </div>
            <div className="flex-1">
              <div className="mb-2 h-4 w-32 animate-pulse bg-white/10 rounded" />
              <div className="h-3 w-48 animate-pulse bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!agent) {
    return (
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <Bot className="mx-auto mb-4 h-8 w-8 text-white/40" />
          <h3 className="text-lg font-medium text-white">
            No agent generated yet
          </h3>
          <p className="text-sm text-white/40">
            Describe your agent above to begin
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={agent.id}
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{agent.name}</h3>
                <p className="text-xs text-white/40">
                  Generated {new Date(agent.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onStartDemo}>
                <Play className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-6">

            {/* What it does */}
            <div>
              <h4 className="text-xs uppercase text-white/40 mb-2">
                What this agent does
              </h4>
              <p className="text-sm text-white/80">{agent.goal}</p>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-xs uppercase text-white/40 mb-2">
                How it works
              </h4>
              <ol className="space-y-2">
                {agent.steps.slice(0, 5).map((step, i) => (
                  <li key={i} className="text-sm text-white/80">
                    {i + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Tools */}
            <div>
              <h4 className="text-xs uppercase text-white/40 mb-2">
                Tools used
              </h4>
              <div className="flex flex-wrap gap-2">
                {agent.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/10 px-2 py-1 rounded text-white/70"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Deploy Button */}
          {showDeploy && (
            <motion.div
              className="p-5 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => alert("Deploy flow coming next")}
                className="w-full bg-white text-black hover:bg-gray-200 rounded-xl py-3 font-medium transition-all"
              >
                🚀 Deploy Agent
              </button>

              <p className="text-xs text-white/40 text-center mt-2">
                Free for 7 days • Then $20/month
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}