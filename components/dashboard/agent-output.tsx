"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Activity,
  Brain,
  Check,
  Clock3,
  Copy,
  Gauge,
  Play,
  Rocket,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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

const buildStages = [
  "Understanding your mission...",
  "Designing your AI employee...",
  "Connecting required systems...",
  "Preparing deployment plan...",
  "Building execution strategy...",
]

function estimateComplexity(agent: AgentData) {
  const score = agent.steps.length + agent.tools.length

  if (score >= 9) {
    return "High"
  }

  if (score >= 5) {
    return "Medium"
  }

  return "Focused"
}

function estimateImpact(agent: AgentData) {
  const text = `${agent.name} ${agent.goal} ${agent.steps.join(" ")} ${agent.tools.join(" ")}`.toLowerCase()

  if (text.includes("email") || text.includes("gmail") || text.includes("report")) {
    return { time: "3 hours/week", efficiency: "85%" }
  }

  if (text.includes("code") || text.includes("developer")) {
    return { time: "6 hours/week", efficiency: "78%" }
  }

  if (text.includes("stock") || text.includes("analyst") || text.includes("research")) {
    return { time: "5 hours/week", efficiency: "82%" }
  }

  return { time: "4 hours/week", efficiency: "80%" }
}

function employeeName(name: string) {
  return name.trim() ? name.trim().toUpperCase() : "AUTONOMOUS EMPLOYEE AI"
}

function normalizeItem(value: string) {
  return value
    .replace(/^\s*[-*\d.)]+/, "")
    .replace(/\s+/g, " ")
    .trim()
}

function titleCase(value: string) {
  return normalizeItem(value)
    .replace(/\.$/, "")
    .split(" ")
    .filter(Boolean)
    .map((word) =>
      word.length <= 3 && word === word.toUpperCase()
        ? word
        : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
    )
    .join(" ")
}

function classifyAgent(agent: AgentData) {
  const text = `${agent.name} ${agent.goal} ${agent.steps.join(" ")} ${agent.tools.join(" ")}`.toLowerCase()

  if (text.includes("gmail") || text.includes("email") || text.includes("inbox")) {
    return {
      mission:
        "Your AI employee will continuously monitor your inbox, detect important messages, summarize what matters, and deliver reliable follow-up reports.",
      capabilities: [
        "Inbox Monitoring",
        "Priority Detection",
        "AI Summarization",
        "Daily Reporting",
        "Autonomous Follow-Up",
      ],
      integrations: ["Gmail", "Scheduler", "AI Engine"],
      execution: "Daily",
    }
  }

  if (text.includes("stock") || text.includes("analyst") || text.includes("market")) {
    return {
      mission:
        "Your AI employee will track market signals, research companies, summarize risks, and prepare analyst-grade briefings on a recurring cadence.",
      capabilities: [
        "Market Monitoring",
        "Signal Detection",
        "Company Research",
        "Risk Summaries",
        "Briefing Generation",
      ],
      integrations: ["Market Data", "News Sources", "AI Engine"],
      execution: "Market days",
    }
  }

  if (text.includes("gym") || text.includes("fitness") || text.includes("workout")) {
    return {
      mission:
        "Your AI employee will plan training, adapt workouts, track progress, and keep your fitness routine moving without constant manual planning.",
      capabilities: [
        "Workout Planning",
        "Progress Tracking",
        "Recovery Awareness",
        "Habit Reminders",
        "Plan Adaptation",
      ],
      integrations: ["Calendar", "Health Notes", "AI Engine"],
      execution: "Weekly",
    }
  }

  if (text.includes("study") || text.includes("planner") || text.includes("school")) {
    return {
      mission:
        "Your AI employee will organize study goals, break work into sessions, track deadlines, and turn scattered material into focused study plans.",
      capabilities: [
        "Schedule Planning",
        "Deadline Tracking",
        "Topic Breakdown",
        "Review Reminders",
        "Progress Reports",
      ],
      integrations: ["Calendar", "Documents", "AI Engine"],
      execution: "Daily",
    }
  }

  if (text.includes("code") || text.includes("coding") || text.includes("developer")) {
    return {
      mission:
        "Your AI employee will inspect code context, plan implementation work, propose changes, and accelerate repetitive engineering tasks.",
      capabilities: [
        "Codebase Analysis",
        "Implementation Planning",
        "Change Drafting",
        "Bug Investigation",
        "Review Support",
      ],
      integrations: ["Repository", "Issue Tracker", "AI Engine"],
      execution: "On demand",
    }
  }

  const mission = agent.goal
    .replace(/^\s*(to|it will|the agent will|your ai will)\s+/i, "")
    .replace(/\.$/, "")
    .trim()

  const capabilities = agent.steps
    .map(titleCase)
    .filter(Boolean)
    .slice(0, 5)

  const integrations = agent.tools
    .map(titleCase)
    .filter(Boolean)
    .slice(0, 5)

  return {
    mission: mission
      ? `Your AI employee will ${mission}.`
      : "Your AI employee will turn the requested mission into an autonomous operating plan.",
    capabilities: capabilities.length
      ? capabilities
      : ["Autonomous Planning", "Priority Detection", "Execution Monitoring"],
    integrations: integrations.length ? integrations : ["AI Engine"],
    execution: "Daily",
  }
}

export function AgentOutput({
  agent,
  isGenerating,
  onStartDemo,
}: AgentOutputProps) {
  const [copied, setCopied] = useState(false)
  const [activeStage, setActiveStage] = useState(0)
  const [showDeploy, setShowDeploy] = useState(false)

  useEffect(() => {
    if (!isGenerating) {
      return
    }

    const resetTimer = window.setTimeout(() => setActiveStage(0), 0)
    const interval = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % buildStages.length)
    }, 1150)

    return () => {
      window.clearTimeout(resetTimer)
      window.clearInterval(interval)
    }
  }, [isGenerating])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowDeploy(Boolean(agent && !isGenerating))
    }, agent && !isGenerating ? 800 : 0)

    return () => window.clearTimeout(timer)
  }, [agent, isGenerating])

  const profile = useMemo(() => {
    if (!agent) {
      return null
    }

    return {
      ...classifyAgent(agent),
      complexity: estimateComplexity(agent),
      impact: estimateImpact(agent),
    }
  }, [agent])

  const handleCopy = () => {
    if (!agent || !profile) return

    const text = `${employeeName(agent.name)}

MISSION ACCEPTED
${profile.mission}

CAPABILITIES
${profile.capabilities.map((item) => `- ${item}`).join("\n")}

INTEGRATIONS
${profile.integrations.map((item) => `- ${item}`).join("\n")}

DEPLOYMENT PROFILE
Agent Type: Cloud Autonomous Employee
Runtime: 24/7
Execution: ${profile.execution}
Complexity: ${profile.complexity}

PROJECTED IMPACT
Estimated time saved: ${profile.impact.time}
Efficiency gain: ${profile.impact.efficiency}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  if (isGenerating) {
    return (
      <section className="relative mx-auto w-full max-w-4xl py-8">
        <div className="absolute inset-0 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/55 p-6 shadow-[0_0_80px_rgba(6,182,212,0.16)] backdrop-blur-2xl sm:p-8">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          <div className="grid gap-6 md:grid-cols-[240px_1fr] md:items-center">
            <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-300/30" />
              <div className="absolute inset-5 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-blue-300/30" />
              <div className="absolute inset-12 animate-pulse rounded-full bg-cyan-300/10 blur-xl" />
              <Brain className="relative h-16 w-16 text-cyan-100 drop-shadow-[0_0_24px_rgba(103,232,249,0.65)]" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-cyan-100/55">
                Deployment foundry active
              </p>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeStage}
                  initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(10px)" }}
                  transition={{ duration: 0.45 }}
                  className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl"
                >
                  {buildStages[activeStage]}
                </motion.h2>
              </AnimatePresence>

              <div className="mt-7 grid gap-3">
                {buildStages.map((stage, index) => (
                  <div
                    key={stage}
                    className="flex items-center gap-3 text-sm text-white/56"
                  >
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      {index <= activeStage ? (
                        <Check className="h-4 w-4 text-cyan-200" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                      )}
                    </span>
                    <span className={index === activeStage ? "text-white" : ""}>
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!agent || !profile) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={agent.id}
        className="relative mx-auto w-full max-w-5xl py-10"
        initial={{ opacity: 0, y: 34, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute -inset-8 rounded-[3rem] bg-[linear-gradient(115deg,rgba(34,211,238,0.18),transparent_36%,rgba(99,102,241,0.15)_72%,transparent)] blur-2xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] shadow-[0_0_120px_rgba(14,165,233,0.16)] backdrop-blur-2xl">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-cyan-200/15" />
          <div className="absolute right-14 top-14 h-16 w-16 rounded-full border border-cyan-200/15" />

          <div className="relative border-b border-white/10 p-6 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Mission accepted
                </div>
                <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                  {employeeName(agent.name)}
                </h2>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.45em] text-cyan-100/70">
                  Autonomous employee created
                </p>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
                  {profile.mission}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onStartDemo}
                  className="rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  aria-label="Preview employee"
                  title="Preview employee"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  aria-label="Copy deployment profile"
                  title="Copy deployment profile"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="relative grid gap-px bg-white/10 md:grid-cols-2">
            <div className="bg-black/45 p-6 sm:p-8">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/42">
                <Zap className="h-4 w-4 text-cyan-200" />
                Capabilities
              </h3>
              <div className="grid gap-3">
                {profile.capabilities.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-white/78">
                    <Check className="h-4 w-4 text-cyan-200" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/45 p-6 sm:p-8">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/42">
                <Activity className="h-4 w-4 text-blue-200" />
                Integrations
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.integrations.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/75"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black/45 p-6 sm:p-8">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/42">
                <Gauge className="h-4 w-4 text-violet-200" />
                Deployment profile
              </h3>
              <dl className="grid gap-4 text-sm">
                {[
                  ["Agent Type", "Cloud Autonomous Employee"],
                  ["Runtime", "24/7"],
                  ["Execution", profile.execution],
                  ["Complexity", profile.complexity],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-5">
                    <dt className="text-white/42">{label}</dt>
                    <dd className="text-right font-medium text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-black/45 p-6 sm:p-8">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/42">
                <Clock3 className="h-4 w-4 text-emerald-200" />
                Projected impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Time saved
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {profile.impact.time}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Efficiency
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {profile.impact.efficiency}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {showDeploy ? (
            <motion.div
              className="relative p-6 sm:p-8"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <button
                type="button"
                onClick={() => alert("Deploy flow coming next")}
                className="group relative h-20 w-full overflow-hidden rounded-3xl bg-white text-lg font-bold text-black shadow-[0_0_80px_rgba(255,255,255,0.32)] transition hover:scale-[1.01] hover:bg-cyan-100 sm:h-24 sm:text-xl"
              >
                <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-cyan-200 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
                <span className="relative flex items-center justify-center gap-3">
                  <Rocket className="h-5 w-5" />
                  DEPLOY AI EMPLOYEE
                </span>
              </button>
            </motion.div>
          ) : null}
        </div>
      </motion.section>
    </AnimatePresence>
  )
}
