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

const STARTER_PROMPTS = [
  {
    label: "My Remaining Materials",
    prompt: "What materials do I still need for my remaining Hideout upgrades?",
  },
  {
    label: "RLSL-1 & Hacking Tool",
    prompt: "How do I open RLSL-1 Telescope Building and unlock the Superior Hacking Tool?",
  },
  {
    label: "Disassembly Farming",
    prompt: "Where do I find Manpack Tactical Radio and what does it disassemble into?",
  },
  {
    label: "Weapon Loadout Mounts",
    prompt: "What attachments or mounts does AK-74M need?",
  },
  {
    label: "Ammo, Armor & Medical Archive",
    prompt: "Which 5.56x45mm ammo penetrates NIJ III++ armor and how do I treat heavy bleeding?",
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
          className="font-mono-tabular px-1.5 py-0.5 rounded bg-[#080b10] border border-white/[0.1] text-[#fde68a] text-[12px]"
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
            className="text-[#38bdf8] hover:underline underline-offset-2 font-medium"
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

  return <div className="space-y-2 text-[13px] text-[#dbe4ef]">{blocks}</div>;
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

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

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
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
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
    if (open) {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      className="fixed inset-0 z-[2100] flex justify-end bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Tactical AI Intel Chatbot"
    >
      <aside
        className="w-full sm:w-[460px] h-full bg-[#0e131b] border-l border-white/[0.1] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/[0.08] bg-[#0a0e14] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#e5a93c]/15 border border-[#e5a93c]/40 flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5 text-[#e5a93c]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-sm font-semibold text-[#f8fafc] truncate">
                  Tactical Intel Bot
                </h2>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35 text-[10px] font-semibold text-emerald-300">
                  Built-In · Works Offline
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
                className="min-h-[34px] px-2 rounded-lg text-[11px] font-medium text-[#7dd3fc] hover:text-white hover:bg-white/[0.06] inline-flex items-center gap-1 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Archive</span>
              </button>
            )}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                title="Clear conversation"
                aria-label="Clear conversation"
                className="min-h-[40px] min-w-[40px] sm:min-h-[34px] sm:min-w-[34px] inline-flex items-center justify-center rounded-lg text-[#8b98a9] hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Tactical Intel Bot"
              className="min-h-[40px] min-w-[40px] sm:min-h-[34px] sm:min-w-[34px] inline-flex items-center justify-center rounded-lg text-[#8b98a9] hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3.5">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#121924] border border-white/[0.08] p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#e5a93c]">
                  <Sparkles className="w-4 h-4" />
                  <span>100% On-Site Knowledge · GitHub Pages Ready</span>
                </div>
                <p className="text-xs leading-relaxed text-[#a8b6c8]">
                  Runs completely in your browser using the website&apos;s own data and{" "}
                  <strong className="text-[#f8fafc]">Field Archive</strong>—no backend server or API keys required. Ask about{" "}
                  <strong className="text-[#f8fafc]">Hideout Upgrades</strong>,{" "}
                  <strong className="text-[#f8fafc]">Materials &amp; Grids</strong>,{" "}
                  <strong className="text-[#f8fafc]">Disassembly</strong>,{" "}
                  <strong className="text-[#f8fafc]">Tasks</strong>,{" "}
                  <strong className="text-[#f8fafc]">Keys &amp; Hacking Tools</strong>,{" "}
                  <strong className="text-[#f8fafc]">Weapons</strong>, or{" "}
                  <strong className="text-[#f8fafc]">Ammo, Armor, Medical &amp; NVGs</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-medium uppercase tracking-wider text-[#7f8ea1] px-1">
                  Try asking
                </div>
                <div className="space-y-1.5">
                  {STARTER_PROMPTS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => sendPrompt(item.prompt)}
                      className="w-full text-left rounded-xl bg-[#0a0e14] hover:bg-[#141b26] border border-white/[0.08] hover:border-[#38bdf8]/45 px-3.5 py-2.5 transition-colors group"
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
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 ${
                      isUser
                        ? "bg-[#1a2638] border border-[#38bdf8]/35 text-[#f8fafc] text-[13px] leading-relaxed"
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
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8b98a9] hover:text-white transition-colors ml-auto"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
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

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendPrompt(input);
          }}
          className="p-3 border-t border-white/[0.08] bg-[#0a0e14] shrink-0 space-y-2"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt(input);
                }
              }}
              placeholder="Ask about materials, doors, ammo, armor, medical, weapons…"
              aria-label="Ask Tactical Intel Bot"
              className="flex-1 min-w-0 resize-none rounded-xl bg-[#0e131b] border border-white/[0.1] focus:border-[#38bdf8] px-3 py-2 text-xs sm:text-[13px] text-[#f8fafc] placeholder-[#64748b] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="min-h-[44px] min-w-[44px] px-3.5 rounded-xl bg-[#e5a93c] hover:bg-[#f0b952] disabled:opacity-45 disabled:hover:bg-[#e5a93c] text-[#090d12] font-semibold inline-flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#64748b] px-1">
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
