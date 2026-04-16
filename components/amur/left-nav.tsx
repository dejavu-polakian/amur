"use client"

import { useState } from "react"
import { Flame, MessageCircle, Compass, Heart, Settings, Sparkles, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const items = [
  { icon: Flame, label: "Лента", key: "feed" },
  { icon: Compass, label: "Поиск", key: "discover" },
  { icon: Heart, label: "Симпатии", key: "likes" },
  { icon: MessageCircle, label: "Сообщения", key: "messages", active: true },
  { icon: Sparkles, label: "Амур+", key: "premium" },
]

export function LeftNav() {
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col justify-between bg-sidebar py-6 transition-[width] duration-300 ease-out xl:flex",
        expanded ? "w-[256px]" : "w-[76px]",
      )}
    >
      <div className={cn("flex flex-col gap-8", expanded ? "items-stretch px-4" : "items-center")}>
        {/* Brand mark + toggle */}
        <div className={cn("flex flex-col", expanded ? "gap-3" : "items-center gap-2")}>
          <div className={cn("relative h-20", expanded ? "w-full" : "w-14")}>
            {/* Wordmark (expanded) */}
            <Image
              src="/amur-logo.png"
              alt="Амур"
              fill
              priority
              sizes="240px"
              className={cn(
                "object-contain object-center transition-opacity duration-200 ease-out [filter:brightness(0)_saturate(100%)_invert(22%)_sepia(88%)_saturate(2490%)_hue-rotate(338deg)_brightness(92%)_contrast(95%)]",
                expanded ? "opacity-100 delay-150" : "opacity-0",
              )}
            />
            {/* Cupid mark (collapsed) */}
            <Image
              src="/amur-mark.png"
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="56px"
              className={cn(
                "object-contain transition-opacity duration-200 ease-out [filter:brightness(0)_saturate(100%)_invert(22%)_sepia(88%)_saturate(2490%)_hue-rotate(338deg)_brightness(92%)_contrast(95%)]",
                expanded ? "opacity-0" : "opacity-100 delay-150",
              )}
            />
          </div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Свернуть панель" : "Развернуть панель"}
            aria-expanded={expanded}
            className={cn(
              "flex h-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
              expanded ? "w-full gap-2 px-3 text-xs font-medium" : "w-8",
            )}
          >
            {expanded ? (
              <>
                <PanelLeftClose className="h-[16px] w-[16px]" strokeWidth={1.6} />
                <span className="tracking-tight">Свернуть</span>
              </>
            ) : (
              <PanelLeftOpen className="h-[16px] w-[16px]" strokeWidth={1.6} />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className={cn("flex flex-col gap-2", expanded ? "items-stretch" : "items-center")}>
          {items.map(({ icon: Icon, label, key, active }) => (
            <button
              key={key}
              type="button"
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex h-11 items-center rounded-full transition-colors",
                expanded ? "w-full justify-start gap-3 px-3" : "w-11 justify-center",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
              {expanded && (
                <span
                  className={cn(
                    "truncate text-sm tracking-tight",
                    active ? "font-semibold text-primary" : "font-normal text-foreground/80",
                  )}
                >
                  {label}
                </span>
              )}
              {active && !expanded && (
                <span className="absolute -left-[17px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              {active && expanded && (
                <span className="absolute -left-4 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className={cn("flex flex-col gap-3", expanded ? "items-stretch px-4" : "items-center")}>
        <button
          type="button"
          aria-label="Настройки"
          className={cn(
            "flex h-11 items-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
            expanded ? "w-full justify-start gap-3 px-3" : "w-11 justify-center",
          )}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={1.6} />
          {expanded && (
            <span className="truncate text-sm font-normal tracking-tight text-foreground/80">Настройки</span>
          )}
        </button>

        <div
          className={cn(
            "flex items-center",
            expanded ? "gap-3 rounded-full px-1 py-1 hover:bg-sidebar-accent/60" : "flex-col",
          )}
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-background">
            <Image src="/profiles/user-me.jpg" alt="Ваш профиль" fill className="object-cover" sizes="40px" />
          </div>
          {expanded && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-semibold text-foreground">Анастасия</span>
              <span className="truncate text-xs text-muted-foreground">Мой профиль</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
