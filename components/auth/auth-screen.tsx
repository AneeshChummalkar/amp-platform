"use client"

import { FormEvent, useState } from "react"
import {
  Apple,
  Bot,
  Chrome,
  Github,
  Loader2,
  LockKeyhole,
  Mail,
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
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.12),transparent_28%)]" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/60 backdrop-blur md:grid-cols-[1fr_420px]">
        <div className="hidden min-h-[560px] flex-col justify-between border-r border-white/10 p-10 md:flex">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight">
              AMP
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/55">
              Build, save, and revisit AI agents in your own private workspace.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-white/55">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <Bot className="h-4 w-4 text-white" />
              <span>Generated agents stay tied to your account.</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <LockKeyhole className="h-4 w-4 text-white" />
              <span>Your session is restored automatically.</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl font-semibold">AMP</span>
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/35">
              {isSignUp ? "Create account" : "Welcome back"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {isSignUp ? "Start building agents" : "Sign in to AMP"}
            </h2>
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
                  className="h-12 w-full justify-start rounded-xl border-white/10 bg-black/40 px-4 text-white hover:bg-white/10 hover:text-white"
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

          <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-black/40 p-1">
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
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  mode === item
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                )}
              >
                {item === "sign-in" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/70">
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
                  className="h-12 border-white/10 bg-black/40 pl-10 text-white placeholder:text-white/25"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/70"
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
                  className="h-12 border-white/10 bg-black/40 pl-10 text-white placeholder:text-white/25"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-white text-black hover:bg-white/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Working
                </>
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
