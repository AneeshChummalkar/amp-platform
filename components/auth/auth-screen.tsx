"use client"

import { FormEvent, useState } from "react"
import { motion } from "framer-motion"
import {
  Apple,
  Brain,
  Chrome,
  Cpu,
  Fingerprint,
  Github,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Provider } from "@supabase/supabase-js"

type AuthMode = "sign-in" | "sign-up"
type OAuthProvider = Extract<Provider, "google" | "github" | "apple">

const oauthProviders: {
  label: string
  provider: OAuthProvider
  icon: typeof Chrome
}[] = [
  {
    label: "Continue with Google",
    provider: "google",
    icon: Chrome,
  },
  {
    label: "Continue with GitHub",
    provider: "github",
    icon: Github,
  },
  {
    label: "Continue with Apple",
    provider: "apple",
    icon: Apple,
  },
]

const initializationSignals = [
  { label: "Identity protected", Icon: Fingerprint },
  { label: "Agent memory secured", Icon: Brain },
  { label: "Workspace encrypted", Icon: LockKeyhole },
  { label: "Runtime ready", Icon: Cpu },
]

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("sign-in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oauthLoadingProvider, setOauthLoadingProvider] =
    useState<OAuthProvider | null>(null)

  const isSignUp = mode === "sign-up"

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    setMessage(null)
    setError(null)
    setOauthLoadingProvider(provider)

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      setOauthLoadingProvider(null)
      setError(error.message)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setError(null)
    setIsSubmitting(true)

    const credentials = {
      email: email.trim(),
      password,
    }

    const { data, error } = isSignUp
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials)

    setIsSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    if (isSignUp && !data.session) {
      setMessage("Check your email to confirm your account, then sign in.")
      return
    }

    setMessage(isSignUp ? "Account created." : "Signed in.")
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080b] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-12%,rgba(255,255,255,0.16),transparent_36%),radial-gradient(circle_at_18%_28%,rgba(125,211,252,0.11),transparent_28%),radial-gradient(circle_at_82%_76%,rgba(167,139,250,0.1),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, index) => (
          <span
            key={index}
            className="amp-agent-particle absolute h-1 w-1 rounded-full bg-white/55"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 23) % 100}%`,
              animationDelay: `${index * 0.31}s`,
              animationDuration: `${9 + (index % 6)}s`,
            }}
          />
        ))}
      </div>

      <motion.section
        className="relative grid w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.055)_44%,rgba(8,12,20,0.78))] shadow-[0_44px_160px_rgba(0,0,0,0.58)] backdrop-blur-3xl lg:grid-cols-[1fr_440px]"
        initial={{ opacity: 0, y: 24, scale: 0.985, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative hidden min-h-[650px] overflow-hidden border-r border-white/10 p-10 lg:block">
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-3xl" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.075] shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-3xl">
                  <Sparkles className="h-5 w-5 text-white/82" />
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-[0.34em] text-white">
                    AMP
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/38">
                    AI Agent Platform
                  </p>
                </div>
              </div>

              <h1 className="mt-12 max-w-xl text-6xl font-medium tracking-tight text-white">
                Enter an intelligent agent environment.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white/56">
                Your identity opens a private workspace for autonomous AI
                Agents, mission memory, and connected systems.
              </p>
            </div>

            <div className="relative">
              <div className="mx-auto mb-8 flex h-44 w-44 items-center justify-center">
                <div className="amp-agent-core absolute h-44 w-44 rounded-full border border-white/14 bg-white/[0.04]" />
                <motion.div
                  className="absolute h-32 w-32 rounded-full border border-white/10"
                  animate={{ scale: [0.96, 1.08, 0.96], opacity: [0.48, 1, 0.48] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <Brain className="relative h-12 w-12 text-white/88" />
              </div>

              <div className="grid gap-3">
                {initializationSignals.map(({ label, Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white/64 backdrop-blur-2xl"
                  >
                    <Icon className="h-4 w-4 text-white/48" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.075] backdrop-blur-3xl">
              <Sparkles className="h-5 w-5 text-white/82" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-[0.34em]">AMP</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/38">
                AI Agent Platform
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-medium text-white/52 backdrop-blur-2xl">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isSignUp ? "Initialize identity" : "Resume environment"}
            </div>
            <h2 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
              {isSignUp ? "Create access to AMP" : "Enter AMP"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/52">
              Access your autonomous AI Agents and mission workspace.
            </p>
          </div>

          <div className="space-y-3">
            {oauthProviders.map(({ label, provider, icon: Icon }) => {
              const isLoading = oauthLoadingProvider === provider

              return (
                <Button
                  key={provider}
                  type="button"
                  variant="outline"
                  disabled={Boolean(oauthLoadingProvider) || isSubmitting}
                  onClick={() => handleOAuthSignIn(provider)}
                  className="h-12 w-full justify-start rounded-2xl border-white/10 bg-white/[0.045] px-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition hover:border-white/18 hover:bg-white/[0.075] hover:text-white"
                >
                  {isLoading ? (
                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="mr-3 h-4 w-4" />
                  )}
                  {label}
                </Button>
              )
            })}
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">
              or
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.045] p-1 backdrop-blur-xl">
            {(["sign-in", "sign-up"] as AuthMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item)
                  setMessage(null)
                  setError(null)
                }}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  mode === item
                    ? "bg-white text-black shadow-[0_18px_45px_rgba(255,255,255,0.14)]"
                    : "text-white/50 hover:text-white"
                )}
              >
                {item === "sign-in" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/68">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.045] pl-10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-white/25 focus-visible:ring-white/25"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/68"
              >
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <Input
                  id="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.045] pl-10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-white/25 focus-visible:ring-white/25"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-white font-semibold text-black shadow-[0_18px_60px_rgba(255,255,255,0.18)] transition hover:bg-white/92"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing
                </>
              ) : isSignUp ? (
                "Create access"
              ) : (
                "Enter AMP"
              )}
            </Button>
          </form>
        </div>
      </motion.section>
    </main>
  )
}
