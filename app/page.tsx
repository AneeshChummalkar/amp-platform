"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = async () => {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  console.log("API Response:", data);
};

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">AMP</h1>

      <p className="text-gray-400 mb-8">
        Create AI agents with a single prompt
      </p>

      <div className="w-full max-w-xl flex flex-col gap-4">
        <input
          type="text"
          placeholder="Describe the agent you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="p-4 rounded-lg border border-gray-300 text-black bg-white"
        />

        <button
          onClick={handleGenerate}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
        >
          Generate Agent
        </button>
      </div>
    </main>
  );
}