"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { supabase } from "../lib/supabase"

export default function Home() {

  const [prompt,setPrompt] = useState("")
  const [result,setResult] = useState("")
  const [loading,setLoading] = useState(false)
  const [thinking,setThinking] = useState(false)
  const [agents,setAgents] = useState<any[]>([])

  async function loadAgents(){

    const { data } = await supabase
      .from("agents")
      .select("*")
      .order("created_at",{ascending:false})

    if(data) setAgents(data)

  }

  useEffect(()=>{
    loadAgents()
  },[])

  const newAgent = ()=>{
    setPrompt("")
    setResult("")
    setLoading(false)
    setThinking(false)
  }

  const generateAgent = async ()=>{

    if(!prompt) return

    setLoading(true)
    setThinking(true)
    setResult("")

    const res = await fetch("/api/generate",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({prompt})
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    if(!reader) return

    while(true){

      const {done,value} = await reader.read()

      if(done) break

      const chunk = decoder.decode(value,{stream:true})

      const lines = chunk.split("\n")

      for(const line of lines){

        if(!line.trim()) continue

        try{

          const parsed = JSON.parse(line)

          if(parsed.response){

            setThinking(false)

            setResult(prev => prev + parsed.response)

          }

        }catch{}

      }

    }

    setLoading(false)

  }

  const saveAgent = async ()=>{

    if(!result) return

    await supabase.from("agents").insert([
      {
        prompt,
        result
      }
    ])

    loadAgents()

  }

  return (

    <div className="flex h-screen bg-[#343541] text-white">

      {/* Sidebar */}

      <div className="w-64 bg-[#202123] p-4 border-r border-gray-800">

        <button
          onClick={newAgent}
          className="w-full mb-6 p-3 bg-white text-black rounded font-semibold hover:bg-gray-200"
        >
          + New Agent
        </button>

        <h2 className="text-gray-400 mb-3 text-sm">
          Saved Agents
        </h2>

        <div className="space-y-2">

          {agents.length === 0 && (
            <p className="text-gray-500 text-sm">
              No agents yet
            </p>
          )}

          {agents.map((agent)=>(
            <div
              key={agent.id}
              className="p-2 bg-[#343541] rounded cursor-pointer hover:bg-gray-700 text-sm"
              onClick={()=>{
                setPrompt(agent.prompt)
                setResult(agent.result)
              }}
            >
              {agent.prompt.slice(0,40)}...
            </div>
          ))}

        </div>

      </div>

      {/* Main */}

      <div className="flex-1 flex flex-col items-center justify-center p-10">

        <h1 className="text-4xl font-bold mb-2">
          AMP
        </h1>

        <p className="text-gray-400 mb-8">
          Create AI agents with a single prompt
        </p>

        {/* Prompt */}

        <div className="w-full max-w-xl">

          <input
            value={prompt}
            onChange={(e)=>setPrompt(e.target.value)}
            placeholder="Create an AI agent that researches AI startups..."
            className="w-full p-4 rounded-lg bg-[#40414f] border border-gray-600 mb-4"
          />

          <button
            onClick={generateAgent}
            className="w-full p-4 rounded-lg bg-white text-black font-semibold hover:bg-gray-200"
          >
            {loading ? "Generating..." : "Generate Agent"}
          </button>

        </div>

        {/* Result */}

        {(loading || result || thinking) && (

          <div className="mt-10 w-full max-w-xl bg-[#40414f] border border-gray-600 rounded-xl p-6">

            <h2 className="text-lg font-semibold mb-4">
              Agent Plan
            </h2>

            {thinking && (
              <p className="text-gray-400 animate-pulse">
                Thinking...
              </p>
            )}

            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>
                {result}
              </ReactMarkdown>
            </div>

            {!loading && result && (

              <button
                onClick={saveAgent}
                className="mt-6 px-4 py-2 bg-green-500 rounded text-black font-semibold"
              >
                Save Agent
              </button>

            )}

          </div>

        )}

      </div>

    </div>

  )

}