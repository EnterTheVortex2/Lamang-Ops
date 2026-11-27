import {
  BookOpen,
  Bot,
  Check,
  Copy,
  CornerDownLeft,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import {
  answerFromWebsiteKnowledge,
  type LocalChatKnowledge,
} from "../services/localTacticalChat";

export interface TacticalChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  sourcesUsed?: string[];
  createdAt: number;
}

export interface OperatorChatContextPayload {
  operatorName: string;
  faction: string;
  activeSection: string;
  builtCount: number;
  totalUpgrades: number;
  completedTasksCount: number;
  totalTasksCount: number;
  ownedKeysCount: number;
  totalKeysCount: number;
  plannedUpgradeNames: string[];
  missingMaterials: {
    name: string;
    have: number;
    need: number;
    remaining: number;
  }[];
}

interface TacticalChatDrawerProps {
  open: boolean;
  onClose: () => void;
  knowledge: LocalChatKnowledge;
  pendingPrompt?: string | null;
  onConsumePendingPrompt?: () => void;
  onOpenArchive?: () => void;
}

interface ViewportBounds {
  top: number;
  left: number;
  width: number;
  height: number;
  isMobile: boolean;
}

const STARTER_PROMPTS = [
  {
    label: "Patch 0.5.1.0 & 0.5.1.1 Changes",
    prompt: "What changed in patch 0.5.1.0 and 0.5.1.1?",
  },
  {
    label: "My Remaining Materials",
    prompt: "What materials do I still need for my remaining Hideout upgrades?",
  },
  {
    label: "Bosses & Unique Drops",
    prompt: "Where do Lamang bosses spawn and what unique gear do they drop?",
  },
  {
    label: "RLSL-1 & Hacking Tool",
    prompt: "How do I open RLSL-1 Telescope Building and unlock the Superior Hacking Tool?",
  },
  {
    label: "Weapon Mounts, Optics & Repair",
    prompt: "What attachments does AK-74M need and which repair kits fix weapons vs armor?",
  },
];

function isSafeHttpUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function renderInlineMarkdown(text: string) {
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#f8fafc]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={idx} className="italic text-[#cbd5e1]">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="font-mono-tabular px-1.5 py-0.5 rounded bg-[#080b10] border border-white/[0.1] text-[#fde68a] text-[12px] break-all"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const href = linkMatch[2].trim();
      if (isSafeHttpUrl(href)) {
        return (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#38bdf8] hover:underline underline-offset-2 font-medium break-all"
          >
            {label}
          </a>
        );
      }
      return <Fragment key={idx}>{label}</Fragment>;
    }

    return <Fragment key={idx}>{part}</Fragment>;
  });
}

function MarkdownMessage({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (/^#{1,4}\s+/.test(trimmed)) {
      const level = trimmed.match(/^(#{1,4})\s+/)?.[1].length || 3;
      const content = trimmed.replace(/^#{1,4}\s+/, "");
      blocks.push(
        <div
          key={`h-${i}`}
          className={`font-display font-semibold text-[#f8fafc] ${
            level <= 2 ? "text-sm pt-1" : "text-[13px] text-[#e5a93c] pt-0.5"
          }`}
        >
          {renderInlineMarkdown(content)}
        </div>
      );
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, "").trim());
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="space-y-1.5 pl-4 list-disc marker:text-[#e5a93c]">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, "").trim());
        i += 1;
      }
      blocks.push(
        <ol
          key={`ol-${i}`}
          className="space-y-1.5 pl-4 list-decimal marker:text-[#38bdf8] marker:font-semibold"
        >
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,4}\s+/.test(lines[i].trim()) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i].trim());
      i += 1;
    }
    blocks.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInlineMarkdown(paraLines.join(" "))}
      </p>
    );
  }

  return (
    <div className="space-y-2 text-[13px] text-[#dbe4ef] break-words [overflow-wrap:anywhere]">
      {blocks}
    </div>
  );
}

function readVisualViewportBounds(): ViewportBounds {
  if (typeof window === "undefined") {
    return { top: 0, left: 0, width: 1024, height: 768, isMobile: false };
  }
  const vv = window.visualViewport;
  const width = vv ? Math.round(vv.width) : window.innerWidth;
  const height = vv ? Math.round(vv.height) : window.innerHeight;
  const top = vv ? Math.max(0, Math.round(vv.offsetTop)) : 0;
  const left = vv ? Math.max(0, Math.round(vv.offsetLeft)) : 0;
  return {
    top,
    left,
    width,
    height,
    isMobile: window.innerWidth < 640,
  };
}

export function TacticalChatDrawer({
  open,
  onClose,
  knowledge,
  pendingPrompt,
  onConsumePendingPrompt,
  onOpenArchive,
}: TacticalChatDrawerProps) {
  const [messages, setMessages] = useState<TacticalChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewportBounds, setViewportBounds] = useState<ViewportBounds>(() =>
    readVisualViewportBounds()
  );

  const threadRef = useRef<HTMLDivElement | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Keep fixed chat container pinned strictly inside the active visual viewport
  // so mobile soft keyboards never push the X close button or Send button off-screen.
  useEffect(() => {
    if (!open) return;

    const syncBounds = () => {
      setViewportBounds(readVisualViewportBounds());
    };
    syncBounds();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", syncBounds);
    vv?.addEventListener("scroll", syncBounds);
    window.addEventListener("resize", syncBounds);
    window.addEventListener("orientationchange", syncBounds);

    return () => {
      vv?.removeEventListener("resize", syncBounds);
      vv?.removeEventListener("scroll", syncBounds);
      window.removeEventListener("resize", syncBounds);
      window.removeEventListener("orientationchange", syncBounds);
    };
  }, [open]);

  const sendPrompt = (rawPrompt: string) => {
    const text = rawPrompt.trim();
    if (!text) return;

    const userTurn: TacticalChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      createdAt: Date.now(),
    };

    const nextHistory = [...messages, userTurn];
    const result = answerFromWebsiteKnowledge(
      text,
      nextHistory.map((m) => ({ role: m.role, text: m.text })),
      knowledge
    );

    const modelTurn: TacticalChatMessage = {
      id: `model-${Date.now() + 1}`,
      role: "model",
      text: result.reply,
      sourcesUsed: result.sourcesUsed,
      createdAt: Date.now() + 1,
    };

    setMessages([...nextHistory, modelTurn]);
    setInput("");

    // On mobile phones, dismiss the virtual keyboard after submitting so the full answer
    // and top-right X close button are immediately visible without any manual scrolling.
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      requestAnimationFrame(() => {
        inputRef.current?.blur();
        window.scrollTo(0, 0);
      });
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    // Only auto-focus text input on desktop; on mobile let the user tap a prompt or the box
    const isDesktopViewport = window.matchMedia("(min-width: 640px)").matches;
    const focusTimer = isDesktopViewport
      ? setTimeout(() => inputRef.current?.focus(), 120)
      : undefined;
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (focusTimer) clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && pendingPrompt) {
      sendPrompt(pendingPrompt);
      onConsumePendingPrompt?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pendingPrompt]);

  useEffect(() => {
    if (open && messages.length > 0) {
      requestAnimationFrame(() => {
        threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
  }, [open, messages]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  if (!open) return null;

  const { operatorContext } = knowledge;

  return (
    <div
      style={{
        top: `${viewportBounds.top}px`,
        left: `${viewportBounds.left}px`,
        width: viewportBounds.isMobile ? `${viewportBounds.width}px` : undefined,
        right: viewportBounds.isMobile ? undefined : "0px",
        height: `${viewportBounds.height}px`,
      }}
      className="fixed z-[2100] flex justify-end bg-black/65 backdrop-blur-[2px] overscroll-none overflow-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Tactical AI Intel Chatbot"
    >
      <aside
        className="w-full sm:w-[460px] max-w-full h-full bg-[#0e131b] sm:border-l border-white/[0.1] shadow-2xl flex flex-col overflow-hidden overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Top Header with Always-Reachable Close (X) Button */}
        <div className="px-3.5 sm:px-4 pt-[max(0.65rem,env(safe-area-inset-top))] pb-2.5 border-b border-white/[0.08] bg-[#0a0e14] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#e5a93c]/15 border border-[#e5a93c]/40 flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5 text-[#e5a93c]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-sm font-semibold text-[#f8fafc] truncate">
                  Tactical Intel Bot
                </h2>
                <span className="hidden xs:inline-flex px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35 text-[10px] font-semibold text-emerald-300 shrink-0">
                  Offline
                </span>
              </div>
              <p className="text-[11px] text-[#8899ae] truncate">
                {operatorContext.operatorName} · {operatorContext.faction} ·{" "}
                {operatorContext.builtCount}/{operatorContext.totalUpgrades} built
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onOpenArchive && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenArchive();
                }}
                title="Open Field Archive Library"
                className="min-h-[44px] sm:min-h-[36px] px-2.5 rounded-xl text-xs font-medium text-[#7dd3fc] hover:text-white hover:bg-white/[0.08] active:bg-white/[0.12] inline-flex items-center gap-1.5 transition-colors shrink-0"
              >
                <BookOpen className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span>Archive</span>
              </button>
            )}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                title="Clear conversation"
                aria-label="Clear conversation"
                className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] inline-flex items-center justify-center rounded-xl text-[#8b98a9] hover:text-white hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Tactical Intel Bot"
              className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] inline-flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#f8fafc] hover:bg-white/[0.12] active:bg-white/[0.18] transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Conversation Thread */}
        <div
          ref={threadRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 sm:px-4 py-3.5 space-y-3"
        >
          {messages.length === 0 ? (
            <div className="space-y-3.5">
              <div className="rounded-2xl bg-[#121924] border border-white/[0.08] p-3.5 sm:p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#e5a93c]">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>100% On-Site Knowledge · Works Offline</span>
                </div>
                <p className="text-xs leading-relaxed text-[#a8b6c8]">
                  Ask about{" "}
                  <strong className="text-[#f8fafc]">0.5–0.5.1.1 Patch Notes</strong>,{" "}
                  <strong className="text-[#f8fafc]">Hideout &amp; Materials</strong>,{" "}
                  <strong className="text-[#f8fafc]">Bosses &amp; Drops</strong>,{" "}
                  <strong className="text-[#f8fafc]">Keys &amp; Hacking Tools</strong>,{" "}
                  <strong className="text-[#f8fafc]">Weapons &amp; Optics</strong>,{" "}
                  <strong className="text-[#f8fafc]">Repair Kits &amp; Medical</strong>, or{" "}
                  <strong className="text-[#f8fafc]">Game Modes, Squad Strike &amp; XP</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-medium uppercase tracking-wider text-[#7f8ea1] px-1">
                  Tap to ask
                </div>
                <div className="space-y-1.5">
                  {STARTER_PROMPTS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => sendPrompt(item.prompt)}
                      className="w-full min-h-[48px] text-left rounded-xl bg-[#0a0e14] hover:bg-[#141b26] active:bg-[#1a2333] border border-white/[0.08] hover:border-[#38bdf8]/45 px-3.5 py-2.5 transition-colors group"
                    >
                      <div className="text-xs font-semibold text-[#f8fafc] group-hover:text-[#7dd3fc] transition-colors">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#8899ae] mt-0.5 line-clamp-2">
                        {item.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[94%] sm:max-w-[92%] rounded-2xl px-3.5 py-2.5 ${
                      isUser
                        ? "bg-[#1a2638] border border-[#38bdf8]/35 text-[#f8fafc] text-[13px] leading-relaxed break-words [overflow-wrap:anywhere]"
                        : "bg-[#121924] border border-white/[0.09] text-[#e2e8f0]"
                    }`}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    ) : (
                      <div className="space-y-2.5">
                        <MarkdownMessage text={msg.text} />

                        <div className="pt-1.5 border-t border-white/[0.07] flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1 flex-wrap">
                            {msg.sourcesUsed &&
                              msg.sourcesUsed.map((src) => (
                                <span
                                  key={src}
                                  className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] font-medium text-[#9fb0c4]"
                                >
                                  {src}
                                </span>
                              ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="min-h-[32px] px-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#8b98a9] hover:text-white active:text-white transition-colors ml-auto"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div ref={threadEndRef} />
        </div>

        {/* Pinned Bottom Composer (16px text on mobile prevents iOS Safari zoom) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendPrompt(input);
          }}
          className="px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-white/[0.08] bg-[#0a0e14] shrink-0 space-y-1.5"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              enterKeyHint="send"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                setTimeout(() => {
                  setViewportBounds(readVisualViewportBounds());
                  threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
                }, 150);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt(input);
                }
              }}
              placeholder="Ask about 0.5.1.1 patches, doors, ammo, bosses…"
              aria-label="Ask Tactical Intel Bot"
              className="flex-1 min-w-0 min-h-[44px] max-h-[96px] resize-none rounded-xl bg-[#0e131b] border border-white/[0.12] focus:border-[#38bdf8] px-3 py-2.5 text-[16px] sm:text-[13px] leading-snug text-[#f8fafc] placeholder-[#64748b] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              onPointerDown={(e) => {
                // Keep touch submit one-tap reliable without losing focus mid-tap
                e.preventDefault();
              }}
              aria-label="Send message"
              className="min-h-[44px] min-w-[48px] px-3.5 rounded-xl bg-[#e5a93c] hover:bg-[#f0b952] active:scale-[0.97] disabled:opacity-45 disabled:hover:bg-[#e5a93c] text-[#090d12] font-semibold inline-flex items-center justify-center transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="hidden sm:flex items-center justify-between text-[10px] text-[#64748b] px-1">
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" />
              Enter to send · Shift+Enter for new line
            </span>
            <span>Uses website &amp; Archive data locally</span>
          </div>
        </form>
      </aside>
    </div>
  );
}
