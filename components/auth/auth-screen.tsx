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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-10 text-white">
      <div className="amp-grid absolute inset-0 opacity-55" />
      <div className="amp-scanlines absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(125,249,255,0.14),transparent_26%,rgba(168,85,247,0.1)_54%,transparent_78%),linear-gradient(248deg,transparent_12%,rgba(59,130,246,0.14)_42%,transparent_68%)]" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.08] via-cyan-200/[0.025] to-transparent" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="amp-orbit absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10" />
        <div className="amp-orbit amp-orbit-reverse absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200/10" />
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="amp-particle absolute h-1 w-1 rounded-full bg-cyan-200/60"
            style={{
              left: `${(index * 41) % 100}%`,
              top: `${(index * 23) % 100}%`,
              animationDelay: `${index * 0.38}s`,
              animationDuration: `${8 + (index % 5)}s`,
            }}
          />
        ))}
      </div>

      <section className="amp-energy-border relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] p-px shadow-[0_0_120px_rgba(14,165,233,0.16)] backdrop-blur-2xl md:grid-cols-[1fr_430px]">
        <div className="relative hidden min-h-[580px] flex-col justify-between overflow-hidden border-r border-white/10 bg-black/45 p-10 md:flex">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-cyan-200/15" />
          <div className="absolute right-14 top-14 h-16 w-16 rounded-full border border-cyan-200/15" />

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.16)] backdrop-blur-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-[0.34em] text-white">
                AMP
              </span>
            </div>
            <h1 className="mt-10 max-w-md text-5xl font-semibold tracking-tight">
              Hire Your First AI Employee
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/55">
              Sign in to continue building autonomous AI employees.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-white/55">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
              <Bot className="h-4 w-4 text-cyan-100" />
              <span>Your AI employees stay tied to your account.</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
              <LockKeyhole className="h-4 w-4 text-cyan-100" />
              <span>Your session is restored automatically.</span>
            </div>
          </div>
        </div>

        <div className="relative bg-black/58 p-6 sm:p-8 md:p-10">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent md:hidden" />
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.16)] backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-[0.34em]">AMP</span>
          </div>

          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/70">
              {isSignUp ? "Create account" : "Secure access"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Hire Your First AI Employee
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/52">
              Sign in to continue building autonomous AI employees.
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
                  className="h-12 w-full justify-start rounded-xl border-white/10 bg-white/[0.04] px-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl hover:border-cyan-200/30 hover:bg-white/[0.08] hover:text-white"
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

          <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
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
                    ? "bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.16)]"
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
                  className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-white/25 focus-visible:ring-cyan-200/30"
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
                  className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-white/25 focus-visible:ring-cyan-200/30"
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
              className="h-12 w-full rounded-xl bg-white font-semibold text-black shadow-[0_0_45px_rgba(255,255,255,0.22)] hover:bg-cyan-100"
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
