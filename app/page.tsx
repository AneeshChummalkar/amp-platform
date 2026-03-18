"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MainPanel } from "@/components/dashboard/main-panel"
import { PricingModal } from "@/components/dashboard/pricing-modal"
import { DemoWalkthrough } from "@/components/dashboard/demo-walkthrough"
import { supabase } from "@/lib/supabase"

interface AgentData {
  id: string
  name: string
  goal: string
  steps: string[]
  tools: string[]
  createdAt: Date
}

const mockAgentTemplates = [
  {
    name: "Customer Support Agent",
    goal: "Handle customer inquiries and resolve issues efficiently while maintaining a friendly and professional tone.",
    steps: [
      "Greet the customer and identify their issue",
      "Search knowledge base for relevant solutions",
      "Provide step-by-step guidance to resolve the problem",
      "Escalate to human support if unable to resolve",
      "Follow up to ensure customer satisfaction",
    ],
    tools: ["Knowledge Base", "Ticket System", "Email API", "CRM Integration"],
  },
  {
    name: "Research Assistant",
    goal: "Gather, analyze, and synthesize information from multiple sources to provide comprehensive research summaries.",
    steps: [
      "Understand the research topic and scope",
      "Search academic and web sources for relevant information",
      "Analyze and cross-reference findings",
      "Synthesize information into coherent summaries",
      "Cite sources and highlight key insights",
    ],
    tools: ["Web Search", "Academic Database", "PDF Parser", "Citation Generator"],
  },
  {
    name: "Code Review Agent",
    goal: "Review code submissions for quality, security vulnerabilities, and adherence to best practices.",
    steps: [
      "Parse and understand the code structure",
      "Check for common security vulnerabilities",
      "Analyze code complexity and performance",
      "Verify adherence to coding standards",
      "Generate detailed feedback report",
    ],
    tools: ["Static Analyzer", "Security Scanner", "Linter", "Git Integration"],
  },
  {
    name: "Content Writer Agent",
    goal: "Create engaging, SEO-optimized content tailored to the target audience and brand voice.",
    steps: [
      "Analyze content brief and target keywords",
      "Research topic and gather relevant information",
      "Create outline and structure content",
      "Write compelling copy with proper formatting",
      "Optimize for SEO and readability",
    ],
    tools: ["SEO Analyzer", "Grammar Checker", "Plagiarism Detector", "Image Suggester"],
  },
]

export default function Dashboard() {
  const [agents, setAgents] = useState<AgentData[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [prompt, setPrompt] = useState("")

  // 🔥 LOAD AGENTS FROM SUPABASE
  useEffect(() => {
    const loadAgents = async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Load error:", error)
        return
      }

      if (data) {
        const formatted = data.map((a) => ({
  id: a.id,
  name: a.name,
  goal: a.goal,
  steps: a.steps ? JSON.parse(a.steps) : [],
  tools: a.tools ? JSON.parse(a.tools) : [],
  createdAt: a.created_at ? new Date(a.created_at) : new Date(),
}))

        setAgents(formatted)
      }
    }

    loadAgents()
  }, [])

  const selectedAgent = useMemo(
    () => agents.find((a) => a.id === selectedAgentId) || null,
    [agents, selectedAgentId]
  )

  // 🔥 GENERATE + SAVE
  const handleGenerate = useCallback(async (promptValue: string) => {
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const template =
      mockAgentTemplates[Math.floor(Math.random() * mockAgentTemplates.length)]

    const words = promptValue.split(" ").slice(0, 3)
    const agentName =
      words.length > 0
        ? words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") +
          " Agent"
        : template.name

    const newAgent: AgentData = {
      id: crypto.randomUUID(),
      name: agentName,
      goal: template.goal,
      steps: template.steps,
      tools: template.tools,
      createdAt: new Date(),
    }

    // 🔥 SAVE TO SUPABASE
    const { data, error } = await supabase.from("agents").insert([
      {
        id: newAgent.id,
        name: newAgent.name,
        goal: newAgent.goal,
        steps: JSON.stringify(newAgent.steps), // ✅ FIX
        tools: JSON.stringify(newAgent.tools), // ✅ FIX
        created_at: new Date().toISOString(),  // ✅ FIX
      },
    ]).select()

    if (error) {
      console.error("❌ Supabase Error:", error.message)
    } else {
      console.log("✅ Saved:", data)
    }

    // UI UPDATE
    setAgents((prev) => [newAgent, ...prev])
    setSelectedAgentId(newAgent.id)
    setIsGenerating(false)
  }, [])

  // 🔥 NEW AGENT
  const handleNewAgent = useCallback(() => {
    setSelectedAgentId(null)
    setPrompt("")
  }, [])

  // 🔥 DELETE (UI ONLY)
  const handleDeleteAgent = useCallback((id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id))
    setSelectedAgentId((prev) => (prev === id ? null : prev))
  }, [])

  // 🔥 RENAME (UI ONLY)
  const handleRenameAgent = useCallback((id: string) => {
    const newName = window.prompt("Enter new agent name:")
    if (newName?.trim()) {
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, name: newName.trim() } : a))
      )
    }
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
        onNewAgent={handleNewAgent}
        onDeleteAgent={handleDeleteAgent}
        onRenameAgent={handleRenameAgent}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      <MainPanel
        selectedAgent={selectedAgent}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        onStartDemo={() => setIsDemoOpen(true)}
        prompt={prompt}
        setPrompt={setPrompt}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />

      <DemoWalkthrough
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        agentName={selectedAgent?.name || ""}
      />
    </div>
  )
}