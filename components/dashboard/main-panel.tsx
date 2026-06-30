"use client"

import { AgentOutput } from "./agent-output"
import { PromptInput } from "./prompt-input"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Bot,
  ChevronDown,
  Clock3,
  LogOut,
  Plus,
  Radar,
  Sparkles,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentData {
  id: string
  name: string
  goal: string
  steps: string[]
  tools: string[]
  createdAt: Date
}

interface MainPanelProps {
  agents: AgentData[]
  selectedAgent: AgentData | null
  selectedAgentId: string | null
  isGenerating: boolean
  onGenerate: (prompt: string) => void
  onSelectAgent: (id: string | null) => void
  onDeleteAgent: (id: string) => void | Promise<void>
  onNewAgent: () => void
  onSignOut: () => void
  onStartDemo: () => void
  prompt: string
  setPrompt: (value: string) => void
  userEmail: string | null
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function MainPanel({
  agents,
  selectedAgent,
  selectedAgentId,
  isGenerating,
  onGenerate,
  onSelectAgent,
  onDeleteAgent,
  onNewAgent,
  onSignOut,
  onStartDemo,
  prompt,
  setPrompt,
  userEmail,
}: MainPanelProps) {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="amp-grid absolute inset-0 opacity-55" />
      <div className="amp-scanlines absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(125,249,255,0.14),transparent_26%,rgba(168,85,247,0.1)_54%,transparent_78%),linear-gradient(248deg,transparent_12%,rgba(59,130,246,0.14)_42%,transparent_68%)]" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.08] via-cyan-200/[0.025] to-transparent" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="amp-orbit absolute left-1/2 top-[43%] h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10" />
        <div className="amp-orbit amp-orbit-reverse absolute left-1/2 top-[43%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200/10" />
        {Array.from({ length: 34 }).map((_, index) => (
          <span
            key={index}
            className="amp-particle absolute h-1 w-1 rounded-full bg-cyan-200/60"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 19) % 100}%`,
              animationDelay: `${index * 0.35}s`,
              animationDuration: `${7 + (index % 6)}s`,
            }}
          />
        ))}
      </div>

      <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={onNewAgent}
          className="group flex items-center gap-3"
          aria-label="Create a new AI Agent"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] shadow-[0_0_30px_rgba(34,211,238,0.14)] backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-cyan-100" />
          </span>
          <span className="text-lg font-semibold tracking-[0.34em] text-white">
            AMP
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsArchiveOpen((value) => !value)}
            className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm text-white/68 backdrop-blur-xl transition hover:border-cyan-200/30 hover:bg-white/[0.08] hover:text-white sm:px-4"
            aria-expanded={isArchiveOpen}
            aria-label="Open AI Agent history"
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">{agents.length} agents</span>
            <ChevronDown
              className={cn(
                "hidden h-4 w-4 transition sm:block",
                isArchiveOpen ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
          <button
            type="button"
            onClick={onNewAgent}
            className="hidden h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white/70 backdrop-blur-xl transition hover:border-cyan-200/30 hover:bg-white/[0.08] hover:text-white sm:flex"
          >
            <Plus className="h-4 w-4" />
            New
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm text-white/62 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white sm:px-4"
            title={userEmail || "Sign out"}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden max-w-[160px] truncate sm:inline">
              {userEmail || "Sign out"}
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isArchiveOpen ? (
          <motion.div
            className="absolute right-5 top-20 z-30 w-[min(28rem,calc(100vw-2.5rem))] overflow-hidden rounded-3xl border border-white/10 bg-black/72 p-3 shadow-[0_0_80px_rgba(0,0,0,0.72)] backdrop-blur-2xl sm:right-8"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.24 }}
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <div className="flex items-center justify-between px-2 py-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/42">
                  AI Agent history
                </p>
                <p className="mt-1 text-sm text-white/58">
                  Select a saved agent
                </p>
              </div>
              <Bot className="h-5 w-5 text-cyan-100/70" />
            </div>

            <div className="mt-2 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {agents.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-white/38"
                  >
                    No AI Agents created yet.
                  </motion.div>
                ) : (
                  agents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      layout
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 18, height: 0 }}
                      className={cn(
                        "group rounded-2xl border p-3 transition",
                        selectedAgentId === agent.id
                          ? "border-cyan-200/30 bg-cyan-200/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                          : "border-white/8 bg-white/[0.035] hover:border-white/16 hover:bg-white/[0.06]"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAgent(agent.id)
                            setIsArchiveOpen(false)
                          }}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="truncate text-sm font-medium text-white">
                            {agent.name || "Untitled AI Agent"}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/42">
                            {agent.goal}
                          </p>
                          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/32">
                            <Clock3 className="h-3 w-3" />
                            Created {formatTime(agent.createdAt)}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteAgent(agent.id)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/35 opacity-0 transition hover:bg-red-500/10 hover:text-red-200 group-hover:opacity-100"
                          aria-label={`Delete ${agent.name}`}
                          title="Delete AI Agent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl flex-col px-5 pb-10 sm:px-8">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex min-h-[calc(100vh-9rem)] w-full flex-col items-center justify-center py-7">
            <motion.div
              className="w-full max-w-4xl text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/80 backdrop-blur-xl">
                <Radar className="h-3.5 w-3.5 animate-pulse" />
                AI Agent Platform
              </div>

              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
                Build Autonomous
                <span className="block bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                  AI Agents
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/55 sm:text-xl">
                Describe the mission.
                <br />
                We&apos;ll build the agent.
              </p>

              <div className="mx-auto mt-10 max-w-3xl">
                <PromptInput
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onGenerate={onGenerate}
                  isGenerating={isGenerating}
                />
              </div>
            </motion.div>

            <div className="mt-7 w-full">
              <AgentOutput
                agent={selectedAgent}
                isGenerating={isGenerating}
                onStartDemo={onStartDemo}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
