"use client"

import type { Conversation, Message } from "@/lib/amur-data"
import { cn } from "@/lib/utils"
import {
	Check,
	CheckCheck,
	ChevronLeft,
	ImageIcon,
	Info,
	Mic,
	MoreHorizontal,
	Phone,
	Send,
	Smile,
	Sparkles,
	Video,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const MAX_COMPOSER_HEIGHT = 180

export function ChatView({
  conversation,
  messages,
  isTyping,
  scenarioDone,
  onSend,
  onBack,
  onOpenProfile,
  className,
}: {
  conversation: Conversation
  messages: Message[]
  isTyping: boolean
  scenarioDone: boolean
  onSend: (text: string) => boolean
  onBack?: () => void
  onOpenProfile?: () => void
  className?: string
}) {
  const [value, setValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on mount, on message changes, and when typing indicator toggles.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isTyping, conversation.id])

  // Auto-grow textarea to fit content (up to a max), and shrink back as content is removed.
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "0px"
    const next = Math.min(ta.scrollHeight, MAX_COMPOSER_HEIGHT)
    ta.style.height = `${next}px`
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    const success = onSend(trimmed)
    if (success) {
      setValue("")
      // Reset textarea height after clearing.
      requestAnimationFrame(() => {
        const ta = textareaRef.current
        if (ta) ta.style.height = "0px"
      })
    }
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter inserts a newline.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section
      className={cn(
        "flex h-full min-w-0 flex-1 flex-col bg-background",
        className,
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 md:px-6 md:py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад к диалогам"
              className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            >
              <ChevronLeft className="h-[20px] w-[20px]" strokeWidth={1.8} />
            </button>
          )}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex min-w-0 items-center gap-2 text-left md:gap-3 xl:pointer-events-none"
            aria-label={`Профиль ${conversation.name}`}
          >
            <div className="relative shrink-0">
              <div className="relative h-10 w-10 overflow-hidden rounded-full md:h-11 md:w-11">
                <Image
                  src={conversation.avatar || "/placeholder.svg"}
                  alt={conversation.name}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              {conversation.online && (
                <span className="absolute bottom-0 right-0 h-[11px] w-[11px] rounded-full bg-accent ring-2 ring-background" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="truncate text-[15px] font-medium leading-tight text-foreground md:text-[17px] md:leading-none">
                  {conversation.name}, {conversation.age}
                </h2>
                {conversation.verified && (
                  <span className="hidden rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground lg:inline">
                    Верифицирован
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-[12px] text-muted-foreground md:mt-1.5">
                {conversation.status}
              </p>
            </div>
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 md:gap-1">
          <IconBtn
            aria-label="Голосовой звонок"
            className="hidden sm:flex"
          >
            <Phone className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </IconBtn>
          <IconBtn aria-label="Видеозвонок" className="hidden sm:flex">
            <Video className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </IconBtn>
          {onOpenProfile && (
            <IconBtn
              aria-label="Открыть профиль"
              onClick={onOpenProfile}
              className="xl:hidden"
            >
              <Info className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </IconBtn>
          )}
          <IconBtn aria-label="Ещё">
            <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </IconBtn>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3 px-4 py-6 md:gap-4 md:px-6 md:py-8 lg:px-8">
          {messages.map((m) => {
            if (m.kind === "system") {
              return (
                <div
                  key={m.id}
                  className="my-2 flex items-center gap-3 text-center md:gap-4"
                >
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground md:text-[11px]">
                    {m.text}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )
            }

            const mine = m.from === "me"
            const displayStatus: "sent" | "read" =
              m.status === "sent" ? "sent" : "read"

            return (
              <div
                key={m.id}
                className={cn(
                  "flex w-full",
                  mine ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "flex max-w-[85%] flex-col gap-1 md:max-w-[78%]",
                    mine ? "items-end" : "items-start",
                  )}
                >
                  {m.kind === "text" ? (
                    <div
                      className={cn(
                        "whitespace-pre-wrap break-words rounded-3xl px-4 py-2.5 text-[14.5px] leading-relaxed md:text-[15px]",
                        mine
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md border border-border bg-card text-card-foreground",
                      )}
                    >
                      {m.text}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "overflow-hidden rounded-3xl border border-border bg-card",
                        mine ? "rounded-br-md" : "rounded-bl-md",
                      )}
                    >
                      <div className="relative aspect-[4/5] w-[220px] md:w-[280px]">
                        <Image
                          src={m.src || "/placeholder.svg"}
                          alt={m.caption ?? "Изображение"}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 280px, 220px"
                        />
                      </div>
                      {m.caption && (
                        <div className="px-4 py-3 text-[13.5px] leading-relaxed text-card-foreground md:text-[14px]">
                          {m.caption}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
                    <span className="tabular-nums">{m.time}</span>
                    {mine && (
                      <span className="flex items-center">
                        {displayStatus === "read" ? (
                          <CheckCheck
                            className="h-3 w-3 text-accent"
                            strokeWidth={2}
                          />
                        ) : (
                          <Check className="h-3 w-3" strokeWidth={2} />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator — only visible while the other side is typing */}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex items-center gap-1.5 rounded-3xl rounded-bl-md border border-border bg-card px-4 py-3">
                <Dot delay="0ms" />
                <Dot delay="150ms" />
                <Dot delay="300ms" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer — multiline textarea that grows with content.
          Extra bottom padding on md..xl clears the floating dock. */}
      <div className="border-t border-border px-4 py-4 md:px-6 md:py-5 md:pb-[76px] lg:px-8 xl:pb-5">
        <div className="mx-auto w-full max-w-[720px]">
          <div className="flex items-end gap-1 rounded-3xl border border-border bg-card px-2 py-2 shadow-sm transition-[border-color,box-shadow] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 md:gap-2 md:px-3">
            <button
              type="button"
              aria-label="Эмодзи"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Smile className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              aria-label="Прикрепить изображение"
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
            >
              <ImageIcon className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Напишите ${conversation.name}у…`}
              className="max-h-[180px] min-h-[36px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none scrollbar-thin"
            />

            {value.trim().length === 0 ? (
              <button
                type="button"
                aria-label="Голосовое сообщение"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Mic className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                aria-label="Отправить"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Send className="h-[16px] w-[16px]" strokeWidth={1.8} />
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 px-1">
            <div className="flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3 shrink-0 text-accent" strokeWidth={1.8} />
              <span className="hidden shrink-0 sm:inline">Подсказка Амура:</span>
              <span className="shrink-0 sm:hidden">Амур:</span>
              <button
                type="button"
                onClick={() => setValue(conversation.suggestion)}
                className="truncate text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                «{conversation.suggestion}»
              </button>
            </div>
            <span className="hidden shrink-0 text-[11px] text-muted-foreground lg:inline">
              {scenarioDone
                ? "Enter — отправить · Shift+Enter — перенос"
                : "Enter — отправить · Shift+Enter — перенос"}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function IconBtn({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:h-10 md:w-10",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70"
      style={{ animationDelay: delay, animationDuration: "1.1s" }}
    />
  )
}
