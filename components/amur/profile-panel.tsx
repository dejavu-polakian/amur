"use client"

import type { Conversation } from "@/lib/amur-data"
import { cn } from "@/lib/utils"
import {
  BellOff,
  Flag,
  Images,
  Info,
  MapPin,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function ProfilePanel({ conversation }: { conversation: Conversation }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside
      className={cn(
        "relative hidden h-full shrink-0 flex-col overflow-hidden rounded-3xl bg-background shadow-[0_1px_2px_rgba(120,50,20,0.04),0_8px_24px_-12px_rgba(120,50,20,0.08)] ring-1 ring-border/60 transition-[width] duration-300 ease-out xl:flex",
        expanded ? "w-[360px]" : "w-[68px]",
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Свернуть панель профиля" : "Развернуть панель профиля"}
        aria-expanded={expanded}
        className={cn(
          "absolute top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary",
          expanded ? "left-3" : "left-1/2 -translate-x-1/2",
        )}
      >
        {expanded ? (
          <PanelRightClose className="h-4 w-4" strokeWidth={1.8} />
        ) : (
          <PanelRightOpen className="h-4 w-4" strokeWidth={1.8} />
        )}
      </button>

      {expanded ? (
        <ExpandedView conversation={conversation} />
      ) : (
        <CollapsedView
          conversation={conversation}
          onExpand={() => setExpanded(true)}
        />
      )}
    </aside>
  )
}

function CollapsedView({
  conversation,
  onExpand,
}: {
  conversation: Conversation
  onExpand: () => void
}) {
  return (
    <div className="flex h-full flex-col items-center gap-4 pt-16 pb-5">
      <button
        type="button"
        onClick={onExpand}
        aria-label={`Открыть профиль ${conversation.name}`}
        className="group relative"
      >
        <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-background transition-transform group-hover:scale-105">
          <Image
            src={conversation.photos[0] || "/placeholder.svg"}
            alt={conversation.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-accent-foreground ring-2 ring-background">
          <Sparkles className="h-2.5 w-2.5" strokeWidth={2.2} />
        </span>
      </button>

      <div className="h-px w-8 bg-border" />

      <div className="flex flex-col gap-1">
        <CollapsedIcon label="О профиле" icon={Info} onClick={onExpand} />
        <CollapsedIcon label="Фото" icon={Images} onClick={onExpand} />
      </div>

      <div className="mt-auto flex flex-col gap-1">
        <CollapsedIcon label="Без звука" icon={BellOff} onClick={onExpand} />
        <CollapsedIcon label="Пожаловаться" icon={Flag} onClick={onExpand} />
      </div>
    </div>
  )
}

function CollapsedIcon({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-[17px] w-[17px]" strokeWidth={1.6} />
    </button>
  )
}

export function ExpandedView({ conversation }: { conversation: Conversation }) {
  const { photos, name, age, city, distance, compatibility, about, facts, interests } =
    conversation

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      {/* Hero photo */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={photos[0] || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          sizes="360px"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

        {/* Photo indicator */}
        <div className="absolute left-4 right-4 top-4 flex gap-1 pl-10">
          {photos.map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-background/40"
            >
              <div
                className={i === 0 ? "h-full w-full bg-background" : "h-full w-0 bg-background"}
              />
            </div>
          ))}
        </div>

        {/* Name */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-4xl leading-none tracking-tight">
                {name} <span className="font-sans text-3xl font-light">{age}</span>
              </h2>
              <div className="mt-2.5 flex items-center gap-1.5 text-[13px] text-background/85">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>{city}</span>
                <span className="mx-1 opacity-60">·</span>
                <span>{distance}</span>
              </div>
            </div>
            <span className="rounded-full bg-background/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-background backdrop-blur-sm">
              {compatibility}% совместимости
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-6 px-6 py-6">
        <section>
          <SectionTitle>О себе</SectionTitle>
          <p className="text-[14px] leading-relaxed text-foreground/85">{about}</p>
        </section>

        <section>
          <SectionTitle>Факты</SectionTitle>
          <ul className="flex flex-col gap-2.5">
            {facts.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-[13.5px] text-foreground/85"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card">
                  <Icon className="h-4 w-4 text-primary" strokeWidth={1.6} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle>Общие интересы</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {interests.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[12.5px] text-primary"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                {label}
              </span>
            ))}
          </div>
        </section>

        {photos.length > 1 && (
          <section>
            <SectionTitle>Ещё фото</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {photos.slice(1).map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[3/4] overflow-hidden rounded-xl"
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Фото ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-2 flex items-center justify-between border-t border-border pt-5 text-[12px] text-muted-foreground">
          <button className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <BellOff className="h-3.5 w-3.5" strokeWidth={1.6} />
            Выключить уведомления
          </button>
          <button className="flex items-center gap-1.5 transition-colors hover:text-destructive">
            <Flag className="h-3.5 w-3.5" strokeWidth={1.6} />
            Пожаловаться
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </h3>
  )
}
