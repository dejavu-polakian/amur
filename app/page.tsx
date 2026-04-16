"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { LeftNav } from "@/components/amur/left-nav"
import { BottomDock } from "@/components/amur/bottom-dock"
import { ConversationsList } from "@/components/amur/conversations-list"
import { ChatView } from "@/components/amur/chat-view"
import { ProfilePanel } from "@/components/amur/profile-panel"
import { ProfileSheet } from "@/components/amur/profile-sheet"
import { cn } from "@/lib/utils"
import {
  conversations as seed,
  type Conversation,
  type Message,
  type ScriptStep,
} from "@/lib/amur-data"

type ConvState = {
  messages: Message[]
  /** Next scripted step to consume. When >= script.length, the scenario is over. */
  scriptIndex: number
  isTyping: boolean
  preview: {
    lastMessage: string
    time: string
    unread?: number
    fromMe?: boolean
  }
}

function buildInitialState(): Record<string, ConvState> {
  const map: Record<string, ConvState> = {}
  for (const c of seed) {
    map[c.id] = {
      // Start empty — only the "matched on …" system separator.
      messages: [{ id: `${c.id}-system`, kind: "system", text: c.matchedLabel }],
      scriptIndex: 0,
      isTyping: false,
      preview: c.preview,
    }
  }
  return map
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
}

function buildMessage(
  convId: string,
  from: "me" | "them",
  step: ScriptStep,
  time: string,
  status?: "sent" | "read",
): Message {
  const base = { id: `${convId}-${from}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, from, time }
  if (step.kind === "text") {
    return { ...base, kind: "text", text: step.text, ...(from === "me" ? { status } : {}) }
  }
  return {
    ...base,
    kind: "image",
    src: step.src,
    caption: step.caption,
    ...(from === "me" ? { status } : {}),
  }
}

function previewOf(step: ScriptStep, mine: boolean): string {
  const text = step.kind === "text" ? step.text : step.caption ?? "Фотография"
  return mine ? `Вы: ${text}` : text
}

export default function Page() {
  const [activeId, setActiveId] = useState<string>(seed[0].id)
  const [state, setState] = useState<Record<string, ConvState>>(
    () => buildInitialState(),
  )
  // Mobile single-pane state: on screens below md, we show either the list
  // or the chat, not both. On md+ both are visible via CSS and this state
  // has no visible effect.
  const [mobileView, setMobileView] = useState<"list" | "chat">("list")
  // Tablet/mobile profile sheet (below xl).
  const [profileOpen, setProfileOpen] = useState(false)

  // Desktop (md+) resizable list width. Below COMPACT_BELOW, the list
  // switches to an icon-only view (avatars + unread-count badges).
  const LIST_MIN = 72
  const LIST_MAX = 460
  const COMPACT_BELOW = 240
  const [listWidth, setListWidth] = useState<number>(340)
  const listCompact = listWidth < COMPACT_BELOW

  const startResize = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      const startX = e.clientX
      const startW = listWidth
      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX
        const next = Math.min(LIST_MAX, Math.max(LIST_MIN, startW + dx))
        setListWidth(next)
      }
      const onUp = () => {
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onUp)
    },
    [listWidth],
  )

  const activeConv: Conversation = useMemo(
    () => seed.find((c) => c.id === activeId)!,
    [activeId],
  )
  const activeState = state[activeId]
  const activeScriptIndex = activeState?.scriptIndex ?? 0
  const activeIsTyping = activeState?.isTyping ?? false

  const handleSelect = useCallback((id: string) => {
    setActiveId(id)
    // On mobile, opening a conversation switches the single-pane view
    // to the chat. On md+ this has no visual effect (CSS handles layout).
    setMobileView("chat")
    // Clear unread badge when opening
    setState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        preview: { ...prev[id].preview, unread: 0 },
      },
    }))
  }, [])

  // Autoplay "them" steps for the active conversation.
  useEffect(() => {
    const id = activeId
    const conv = seed.find((c) => c.id === id)!
    const cur = state[id]
    if (!cur) return
    const step = conv.script[cur.scriptIndex]
    if (!step || step.from !== "them") return

    if (!cur.isTyping) {
      // Phase 1: show typing indicator after a short beat.
      const typingTimer = window.setTimeout(() => {
        setState((prev) => ({
          ...prev,
          [id]: { ...prev[id], isTyping: true },
        }))
      }, 550)
      return () => clearTimeout(typingTimer)
    }

    // Phase 2: typing is visible — reveal the scripted message.
    const revealTimer = window.setTimeout(
      () => {
        setState((prev) => {
          const c = prev[id]
          const now = new Date()
          const msg = buildMessage(id, "them", step, formatTime(now))
          return {
            ...prev,
            [id]: {
              ...c,
              isTyping: false,
              scriptIndex: c.scriptIndex + 1,
              messages: [...c.messages, msg],
              preview: {
                lastMessage: previewOf(step, false),
                time: "сейчас",
                unread: 0,
                fromMe: false,
              },
            },
          }
        })
      },
      step.kind === "image" ? 1800 : 1400,
    )
    return () => clearTimeout(revealTimer)
  }, [activeId, activeScriptIndex, activeIsTyping, state])

  const handleSend = useCallback(
    (text: string): boolean => {
      const id = activeId
      const conv = seed.find((c) => c.id === id)!
      const cur = state[id]
      if (!cur) return false
      const step = conv.script[cur.scriptIndex]

      // During an active scenario, the next step being "them" means the
      // other side is speaking — autoplay handles it, user input is ignored.
      if (step && step.from === "them") return false

      const now = new Date()
      const myMsgId = `${id}-me-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`
      const timeStr = formatTime(now)

      setState((prev) => {
        const c = prev[id]
        if (step && step.from === "me") {
          // Consume the scripted "me" step — user's typed text is ignored,
          // the scripted line appears instead.
          const scriptedText =
            step.kind === "text" ? step.text : step.caption ?? ""
          const msg: Message =
            step.kind === "text"
              ? {
                  id: myMsgId,
                  kind: "text",
                  from: "me",
                  text: scriptedText,
                  time: timeStr,
                  status: "sent",
                }
              : {
                  id: myMsgId,
                  kind: "image",
                  from: "me",
                  src: step.src,
                  caption: step.caption,
                  time: timeStr,
                  status: "sent",
                }
          return {
            ...prev,
            [id]: {
              ...c,
              scriptIndex: c.scriptIndex + 1,
              messages: [...c.messages, msg],
              preview: {
                lastMessage: previewOf(step, true),
                time: "сейчас",
                unread: 0,
                fromMe: true,
              },
            },
          }
        }

        // Script has finished — free chat. Send exactly what the user typed.
        const msg: Message = {
          id: myMsgId,
          kind: "text",
          from: "me",
          text,
          time: timeStr,
          status: "sent",
        }
        return {
          ...prev,
          [id]: {
            ...c,
            messages: [...c.messages, msg],
            preview: {
              lastMessage: `Вы: ${text}`,
              time: "сейчас",
              unread: 0,
              fromMe: true,
            },
          },
        }
      })

      // Only flip status to "read" while a scripted exchange is in progress
      // (the other side is following the scenario). After the scripted
      // scenario is finished, free-chat messages stay at "sent" — the
      // other side does not read them.
      const scriptedExchange = !!(step && step.from === "me")
      if (scriptedExchange) {
        window.setTimeout(() => {
          setState((prev) => {
            const c = prev[id]
            return {
              ...prev,
              [id]: {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === myMsgId &&
                  (m.kind === "text" || m.kind === "image")
                    ? { ...m, status: "read" }
                    : m,
                ),
              },
            }
          })
        }, 700)
      }

      return true
    },
    [activeId, state],
  )

  const previews = useMemo(() => {
    const byId: Record<string, ConvState["preview"]> = {}
    for (const c of seed) byId[c.id] = state[c.id].preview
    return byId
  }, [state])

  const scenarioDone =
    activeConv.script.length <= activeState.scriptIndex

  return (
    <main className="relative flex h-[100dvh] w-full overflow-hidden bg-sidebar">
      {/* Desktop vertical left nav (xl+) */}
      <LeftNav />

      <div className="flex min-w-0 flex-1 gap-2 p-2 md:gap-3 md:p-3">
        {/* Main messenger card — conversations + chat as one rounded surface */}
        <div className="flex min-w-0 flex-1 overflow-hidden rounded-2xl bg-background shadow-[0_1px_2px_rgba(120,50,20,0.04),0_8px_24px_-12px_rgba(120,50,20,0.08)] ring-1 ring-border/60 md:rounded-3xl">
          <ConversationsList
            activeId={activeId}
            onSelect={handleSelect}
            previews={previews}
            width={listWidth}
            compact={listCompact}
            className={cn(mobileView === "chat" && "hidden md:flex")}
          />

          {/* Resizer — desktop (md+) only. Drag to resize the list pane. */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Изменить ширину списка диалогов"
            onMouseDown={startResize}
            onDoubleClick={() => setListWidth(340)}
            className="group relative hidden w-px shrink-0 cursor-col-resize bg-border md:block"
          >
            {/* Wider invisible hit area + visible highlight bar on hover */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2"
            />
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-transparent transition-colors group-hover:bg-primary/40 group-active:bg-primary/60"
            />
          </div>

          <ChatView
            key={activeConv.id}
            conversation={activeConv}
            messages={activeState.messages}
            isTyping={activeState.isTyping}
            scenarioDone={scenarioDone}
            onSend={handleSend}
            onBack={() => setMobileView("list")}
            onOpenProfile={() => setProfileOpen(true)}
            className={cn(mobileView === "list" && "hidden md:flex")}
          />
        </div>

        {/* Desktop-only inline profile card (xl+) */}
        <ProfilePanel conversation={activeConv} />
      </div>

      {/* Tablet/mobile profile sheet (below xl) */}
      <ProfileSheet
        conversation={activeConv}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      {/*
        Tablet/mobile glass bottom dock (below xl).
        On mobile (below md), hide it while the chat view is active.
        On tablet (md..xl) it stays visible regardless.
      */}
      <BottomDock hidden={mobileView === "chat"} />
    </main>
  )
}
