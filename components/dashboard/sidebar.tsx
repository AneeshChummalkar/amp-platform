"use client"

import { Plus, Bot, MoreHorizontal, Trash2, Pencil, CreditCard, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface Agent {
  id: string
  name: string
  createdAt: Date
}

interface SidebarProps {
  agents: Agent[]
  selectedAgentId: string | null
  onSelectAgent: (id: string | null) => void
  onNewAgent: () => void
  onDeleteAgent: (id: string) => void
  onRenameAgent: (id: string) => void
  onOpenPricing: () => void
}

export function Sidebar({
  agents,
  selectedAgentId,
  onSelectAgent,
  onNewAgent,
  onDeleteAgent,
  onRenameAgent,
  onOpenPricing,
}: SidebarProps) {
  return (
    <aside className="flex h-screen w-[260px] flex-col bg-sidebar justify-between">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
          AMP
        </span>
      </div>

      {/* New Agent Button */}
      <div className="px-3 pb-3">
        <Button
          onClick={onNewAgent}
          className="w-full justify-start gap-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200"
          variant="secondary"
        >
          <Plus className="h-4 w-4" />
          New Agent
        </Button>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Your Agents
        </div>
        <nav className="flex flex-col gap-0.5">
          {agents.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No agents yet
            </p>
          ) : (
            <AnimatePresence mode="popLayout">
              {agents.map((agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-2.5 py-2 text-sm transition-colors duration-150",
                    selectedAgentId === agent.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <button
                    onClick={() => onSelectAgent(agent.id)}
                    className="flex flex-1 items-center gap-2.5 truncate text-left"
                  >
                    <Bot className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{agent.name}</span>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onRenameAgent(agent.id)}>
                        <Pencil className="mr-2 h-3 w-3" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteAgent(agent.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <Button
          onClick={onOpenPricing}
          variant="ghost"
          className="w-full justify-start gap-2 rounded-xl text-muted-foreground hover:text-sidebar-foreground transition-colors"
        >
          <CreditCard className="h-4 w-4" />
          <span className="text-sm">Upgrade Plan</span>
        </Button>
        <div className="mt-2 flex items-center gap-3 rounded-xl px-2.5 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            U
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              User
            </p>
            <p className="truncate text-[11px] text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
