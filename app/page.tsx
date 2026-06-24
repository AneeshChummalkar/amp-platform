"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MainPanel } from "@/components/dashboard/main-panel"
import { PricingModal } from "@/components/dashboard/pricing-modal"
import { DemoWalkthrough } from "@/components/dashboard/demo-walkthrough"
import { supabase, supabaseHostname } from "@/lib/supabase"

interface AgentData {
  id: string
  name: string
  goal: string
  steps: string[]
  tools: string[]
  createdAt: Date
}

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
      console.log("Supabase URL hostname:", supabaseHostname)

      try {
        const connectionTest = await supabase
          .from("agents")
          .select("id")
          .limit(1)

        console.log("Supabase connection test result:", {
          ok: !connectionTest.error,
          error: connectionTest.error
            ? {
                message: connectionTest.error.message,
                code: connectionTest.error.code,
                details: connectionTest.error.details,
                hint: connectionTest.error.hint,
              }
            : null,
        })
      } catch (error) {
        console.error("Supabase connection test result:", {
          ok: false,
          error,
        })
      }

      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Load error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
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
    console.log("handleGenerate:start")
    setIsGenerating(true)

    let generatedAgent: AgentData

    try {
      console.log("handleGenerate:before /api/generate fetch")

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptValue }),
      })

      console.log("handleGenerate:after /api/generate fetch", {
        ok: response.ok,
        status: response.status,
      })

      if (!response.ok) {
        console.error("❌ Generate Error:", await response.text())
        setIsGenerating(false)
        return
      }

      console.log("handleGenerate:before response.json")
      generatedAgent = await response.json()
      console.log("handleGenerate:after response.json", {
        hasName: typeof generatedAgent.name === "string",
        steps: Array.isArray(generatedAgent.steps)
          ? generatedAgent.steps.length
          : null,
        tools: Array.isArray(generatedAgent.tools)
          ? generatedAgent.tools.length
          : null,
      })
    } catch (error) {
      console.error("handleGenerate:stopped before Supabase insert", error)
      setIsGenerating(false)
      return
    }

    const newAgent: AgentData = {
      id: crypto.randomUUID(),
      name: generatedAgent.name,
      goal: generatedAgent.goal,
      steps: generatedAgent.steps,
      tools: generatedAgent.tools,
      createdAt: new Date(),
    }

    // 🔥 SAVE TO SUPABASE
    try {
      console.log("handleGenerate:before Supabase insert", {
        id: newAgent.id,
        name: newAgent.name,
      })

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

      console.log("handleGenerate:after Supabase insert", {
        ok: !error,
        rows: data?.length ?? 0,
      })

      console.log("Supabase insert test result:", {
        ok: !error,
        error: error
          ? {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint,
            }
          : null,
      })

      if (error) {
        console.error("❌ Supabase Error:", error.message)
      } else {
        console.log("✅ Saved:", data)
      }
    } catch (error) {
      console.error("handleGenerate:stopped during Supabase insert", error)
      console.error("Supabase insert test result:", {
        ok: false,
        error,
      })
    } finally {
      setIsGenerating(false)
    }

    // UI UPDATE
    console.log("handleGenerate:before setAgents")
    setAgents((prev) => [newAgent, ...prev])
    console.log("handleGenerate:after setAgents")
    console.log("handleGenerate:before setSelectedAgentId")
    setSelectedAgentId(newAgent.id)
    console.log("handleGenerate:after setSelectedAgentId")
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
