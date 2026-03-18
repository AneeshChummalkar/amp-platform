"use client"

import { X, ArrowRight, ArrowLeft, Sparkles, MessageSquare, Settings, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface DemoWalkthroughProps {
  isOpen: boolean
  onClose: () => void
  agentName: string
}

const steps = [
  {
    icon: MessageSquare,
    title: "1. Describe Your Agent",
    description:
      "Start by typing a natural language description of what you want your AI agent to do. Be as specific as possible for best results.",
    tip: "Include the agent's purpose, target audience, and any specific behaviors you need.",
  },
  {
    icon: Sparkles,
    title: "2. Review Configuration",
    description:
      "AMP generates a structured configuration including the agent's goal, execution steps, and required tools. Review each section carefully.",
    tip: "You can copy the configuration and modify it to better suit your needs.",
  },
  {
    icon: Settings,
    title: "3. Customize & Refine",
    description:
      "Fine-tune your agent by editing the generated steps and tools. Add or remove capabilities based on your specific use case.",
    tip: "Iterate on your prompt to refine the agent's behavior over time.",
  },
  {
    icon: Rocket,
    title: "4. Deploy & Monitor",
    description:
      "Deploy your agent to production with a single click. Monitor its performance, track interactions, and make adjustments as needed.",
    tip: "Upgrade to Pro for API access and advanced monitoring capabilities.",
  },
]

export function DemoWalkthrough({ isOpen, onClose, agentName }: DemoWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleClose = () => {
    setCurrentStep(0)
    onClose()
  }

  const step = steps[currentStep]
  const StepIcon = step.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/40"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Agent Walkthrough
              </p>
              <h2 className="text-lg font-bold text-foreground text-balance">
                How to use {agentName || "your agent"}
              </h2>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-6 flex items-start gap-4 rounded-xl bg-secondary/50 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <StepIcon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Tip
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {step.tip}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots + navigation */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === currentStep
                        ? "w-6 bg-foreground"
                        : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    className="gap-1 rounded-lg text-muted-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {currentStep === steps.length - 1 ? "Done" : "Next"}
                  {currentStep < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
