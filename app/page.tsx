"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { MainPanel } from "@/components/dashboard/main-panel"
import { DemoWalkthrough } from "@/components/dashboard/demo-walkthrough"
import { AuthScreen } from "@/components/auth/auth-screen"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"

interface AgentData {
  id: string
  name: string
  goal: string
  steps: string[]
  tools: string[]
  createdAt: Date
}

interface AgentRow {
  id: string
  name: string
  goal: string
  steps: string | null
  tools: string | null
  created_at: string | null
}

function parseJsonList(value: string | null) {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : []
  } catch {
    return []
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const CREATION_STAGE_DURATION_MS = 1000
const CREATION_STAGE_COUNT = 5

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [agents, setAgents] = useState<AgentData[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [prompt, setPrompt] = useState("")

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return
      }

      setSession(data.session)
      setIsAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsAuthLoading(false)
      setSelectedAgentId(null)
      setPrompt("")
      setAgents([])
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  // 🔥 LOAD AGENTS FROM SUPABASE
  useEffect(() => {
    if (!session?.user.id) {
      setAgents([])
      setSelectedAgentId(null)
      return
    }

    const loadAgents = async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("id,name,goal,steps,tools,created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (error) {
        setAgents([])
        setSelectedAgentId(null)
        console.error("❌ Load error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
        return
      }

      const formatted = ((data || []) as AgentRow[]).map((agent) => ({
        id: agent.id,
        name: agent.name,
        goal: agent.goal,
        steps: parseJsonList(agent.steps),
        tools: parseJsonList(agent.tools),
        createdAt: agent.created_at ? new Date(agent.created_at) : new Date(),
      }))

      setAgents(formatted)
    }

    loadAgents()
  }, [session?.user.id])

  const selectedAgent = useMemo(
    () => agents.find((a) => a.id === selectedAgentId) || null,
    [agents, selectedAgentId]
  )

  // 🔥 GENERATE + SAVE
  const handleGenerate = useCallback(async (promptValue: string) => {
    if (!session?.user.id) {
      console.error("Cannot generate an agent without an authenticated user.")
      return
    }

    console.log("handleGenerate:start")
    setIsGenerating(true)
    const creationStages = wait(CREATION_STAGE_DURATION_MS * CREATION_STAGE_COUNT)

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
        await creationStages
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
      await creationStages
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
          user_id: session.user.id,
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
        return
      } else {
        console.log("✅ Saved:", data)
      }
    } catch (error) {
      console.error("handleGenerate:stopped during Supabase insert", error)
      console.error("Supabase insert test result:", {
        ok: false,
        error,
      })
      return
    } finally {
      await creationStages
      setIsGenerating(false)
    }

    // UI UPDATE
    console.log("handleGenerate:before setAgents")
    setAgents((prev) => [newAgent, ...prev])
    console.log("handleGenerate:after setAgents")
    console.log("handleGenerate:before setSelectedAgentId")
    setSelectedAgentId(newAgent.id)
    console.log("handleGenerate:after setSelectedAgentId")
  }, [session?.user.id])

  const handleSignOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("❌ Sign out error:", error.message)
    }
  }, [])

  // 🔥 NEW AGENT
  const handleNewAgent = useCallback(() => {
    setSelectedAgentId(null)
    setPrompt("")
  }, [])

  // 🔥 DELETE FROM SUPABASE
  const handleDeleteAgent = useCallback(async (id: string) => {
    if (!session?.user.id) {
      console.error("Cannot delete an agent without an authenticated user.")
      return
    }

    if (!window.confirm("Delete this agent?")) {
      return
    }

    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("❌ Delete error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      return
    }

    setAgents((prev) => prev.filter((a) => a.id !== id))
    setSelectedAgentId((prev) => (prev === id ? null : prev))
  }, [session?.user.id])

  if (isAuthLoading) {
    return (
      <main className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-sm text-white/50">Loading AMP...</div>
      </main>
    )
  }

  if (!session) {
    return <AuthScreen />
  }

  return (
    <div className="min-h-screen bg-black">
      <MainPanel
        agents={agents}
        selectedAgent={selectedAgent}
        selectedAgentId={selectedAgentId}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        onSelectAgent={setSelectedAgentId}
        onDeleteAgent={handleDeleteAgent}
        onNewAgent={handleNewAgent}
        onSignOut={handleSignOut}
        onStartDemo={() => setIsDemoOpen(true)}
        prompt={prompt}
        setPrompt={setPrompt}
        userEmail={session.user.email ?? null}
      />

      <DemoWalkthrough
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        agentName={selectedAgent?.name || ""}
      />
    </div>
  )
}
