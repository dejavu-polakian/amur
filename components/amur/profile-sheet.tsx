"use client"

import type { Conversation } from "@/lib/amur-data"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useEffect } from "react"
import { ExpandedView } from "./profile-panel"

/**
 * Overlay sheet version of the profile panel for tablet and mobile (below xl).
 * Slides in from the right, closes on overlay click or Escape.
 */
export function ProfileSheet({
  conversation,
  open,
  onClose,
}: {
  conversation: Conversation
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 xl:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Закрыть профиль"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Профиль ${conversation.name}`}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[380px] flex-col overflow-hidden",
          "bg-background shadow-[0_0_48px_-12px_rgba(120,50,20,0.35)] ring-1 ring-border/60",
          "rounded-l-3xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-3 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
        >
          <X className="h-4 w-4" strokeWidth={1.8} />
        </button>

        <ExpandedView conversation={conversation} />
      </aside>
    </div>
  )
}
