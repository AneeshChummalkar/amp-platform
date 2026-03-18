"use client"

import { X, Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic agent generation.",
    features: [
      "3 agents per month",
      "Basic templates",
      "Community support",
    ],
    cta: "Current Plan",
    highlighted: false,
    disabled: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For professionals building production agents.",
    features: [
      "Unlimited agents",
      "Advanced templates",
      "Priority support",
      "Custom tools integration",
      "API access",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    disabled: false,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/mo",
    description: "For teams shipping AI at scale.",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "SSO & SAML",
      "Dedicated support",
      "Custom SLAs",
      "Audit logs",
    ],
    cta: "Contact Sales",
    highlighted: false,
    disabled: false,
  },
]

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
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
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/40"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-foreground text-balance">
                Choose Your Plan
              </h2>
              <p className="text-sm text-muted-foreground text-balance">
                Scale your AI agent capabilities as your needs grow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col rounded-xl border p-5 transition-colors duration-200",
                    plan.highlighted
                      ? "border-foreground/30 bg-secondary/50"
                      : "border-border bg-card hover:border-border/80"
                  )}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">
                        <Zap className="h-3 w-3" />
                        Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
                  </div>

                  <ul className="mb-6 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-foreground/80">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-foreground/50" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    disabled={plan.disabled}
                    className={cn(
                      "w-full rounded-lg text-sm transition-all",
                      plan.highlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
