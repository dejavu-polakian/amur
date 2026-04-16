"use client"

import Image from "next/image"
import { Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { conversations, newMatches } from "@/lib/amur-data"

type PreviewMap = Record<
  string,
  { lastMessage: string; time: string; unread?: number; fromMe?: boolean }
>

export function ConversationsList({
  activeId,
  onSelect,
  previews,
  compact = false,
  width,
  className,
}: {
  activeId: string
  onSelect: (id: string) => void
  previews: PreviewMap
  /**
   * When true, render an icon-only sidebar showing just avatars with their
   * unread-count badges. Names and previews are hidden to save room.
   */
  compact?: boolean
  /** Explicit width in pixels applied on md+ screens. */
  width?: number
  className?: string
}) {
  return (
    <div
      style={width != null ? { width } : undefined}
      className={cn(
        // On mobile, the list fills the single pane via flex-1; on md+,
        // explicit width from the resize handle takes effect.
        "flex h-full min-w-0 flex-1 flex-col bg-sidebar/60 md:flex-none md:shrink-0",
        className,
      )}
    >
      {compact ? (
        <CompactView
          activeId={activeId}
          onSelect={onSelect}
          previews={previews}
        />
      ) : (
        <ExpandedView
          activeId={activeId}
          onSelect={onSelect}
          previews={previews}
        />
      )}
    </div>
  )
}

function CompactView({
  activeId,
  onSelect,
  previews,
}: {
  activeId: string
  onSelect: (id: string) => void
  previews: PreviewMap
}) {
  return (
    <div className="flex h-full min-w-0 flex-col items-center pt-6">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
        aria-hidden
      >
        <span className="font-serif text-xl leading-none">А</span>
      </div>
      <div className="mx-auto my-4 h-px w-7 bg-border" />
      <ul className="flex w-full flex-1 flex-col items-center gap-1.5 overflow-y-auto px-2 pb-24 scrollbar-thin xl:pb-6">
        {conversations.map((c) => {
          const preview = previews[c.id] ?? c.preview
          const active = c.id === activeId
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                title={
                  preview.unread
                    ? `${c.name} · ${preview.unread} новых`
                    : c.name
                }
                aria-label={
                  preview.unread
                    ? `${c.name}, ${preview.unread} новых сообщений`
                    : c.name
                }
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full transition-transform",
                  active &&
                    "ring-2 ring-primary/60 ring-offset-2 ring-offset-sidebar",
                  "hover:scale-[1.03]",
                )}
              >
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    src={c.avatar}
                    alt={c.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-accent ring-2 ring-sidebar" />
                )}
                {preview.unread ? (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground tabular-nums shadow-sm ring-2 ring-sidebar">
                    {preview.unread}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ExpandedView({
  activeId,
  onSelect,
  previews,
}: {
  activeId: string
  onSelect: (id: string) => void
  previews: PreviewMap
}) {
  return (
    <>
      {/* Header */}
      <div className="px-4 pt-6 pb-4 md:px-6 md:pt-7">
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl leading-none tracking-tight text-foreground">
            Сообщения
          </h1>
          <span className="text-xs tabular-nums text-muted-foreground">
            {conversations.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по именам и сообщениям"
            className="h-10 w-full rounded-full border border-border bg-background/60 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      {/* New matches carousel */}
      <div className="px-4 pb-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" strokeWidth={1.8} />
            Новые совпадения
          </div>
          <button className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground">
            Все
          </button>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-thin">
          {newMatches.map((m) => (
            <button
              key={m.id}
              type="button"
              className="group flex flex-col items-center gap-1.5"
            >
              <div className="relative">
                <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-accent/40 ring-offset-2 ring-offset-sidebar transition-all group-hover:ring-accent">
                  <Image
                    src={m.avatar}
                    alt={m.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                {m.isNew && (
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-accent ring-2 ring-sidebar" />
                )}
              </div>
              <span className="max-w-[60px] truncate text-[11px] text-foreground/80">
                {m.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 h-px bg-border md:mx-6" />

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 pb-24 pt-3 scrollbar-thin xl:pb-3">
        <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Диалоги
        </div>
        <ul className="flex flex-col gap-1">
          {conversations.map((c) => {
            const preview = previews[c.id] ?? c.preview
            const active = c.id === activeId
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-[background-color,border-radius] duration-300 ease-out",
                    active
                      ? "rounded-full bg-primary/8 hover:bg-primary/10"
                      : "rounded-2xl hover:rounded-full hover:bg-sidebar-accent",
                  )}
                >
                  <div className="relative">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={c.avatar}
                        alt={c.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-accent ring-2 ring-sidebar" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-[15px]",
                          active
                            ? "font-medium text-foreground"
                            : "text-foreground/90",
                        )}
                      >
                        {c.name}
                      </span>
                      <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                        {preview.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "truncate text-[13px]",
                          preview.unread
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {preview.fromMe &&
                        !preview.lastMessage.startsWith("Вы:")
                          ? `Вы: ${preview.lastMessage}`
                          : preview.lastMessage}
                      </span>
                      {preview.unread ? (
                        <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium leading-none text-primary-foreground tabular-nums">
                          {preview.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
