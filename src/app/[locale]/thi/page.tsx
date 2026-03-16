"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Message } from "ai/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PremiumBackground } from "@/components/layout/premium-background";

// ── Typen ─────────────────────────────────────────────────────────────────────
type TopicKey = "products" | "campus" | "mounting" | "certificates";

interface Topic {
    key: TopicKey;
    icon: string;
    label: string;
    color: string;
    prompt: string;
}

// ── Konfig ────────────────────────────────────────────────────────────────────
const TOPICS: Topic[] = [
    {
        key: "products",
        icon: "📦",
        label: "Produkte",
        color: "border-brand-sky/50 bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20",
        prompt: "Erkläre mir kurz die wichtigsten THITRONIK Produkte und ihre Einsatzbereiche.",
    },
    {
        key: "campus",
        icon: "🎓",
        label: "Campus",
        color: "border-brand-lime/50 bg-brand-lime/10 text-brand-lime hover:bg-brand-lime/20",
        prompt: "Was kann ich alles auf dem THITRONIK Campus lernen? Welche Module gibt es?",
    },
    {
        key: "mounting",
        icon: "🔧",
        label: "Einbau-Hilfe",
        color: "border-amber-400/50 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20",
        prompt: "Ich brauche Hilfe bei einer Einbaufrage. Was sind häufige Fehlerquellen beim Einbau von THITRONIK Produkten?",
    },
    {
        key: "certificates",
        icon: "🏆",
        label: "Zertifikate",
        color: "border-purple-400/50 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20",
        prompt: "Welche Zertifikate kann ich im Campus erwerben und wie verlängere ich sie?",
    },
];

const QUICK_REPLIES = [
    "WiPro III erklären",
    "Häufige Einbaufehler",
    "Zertifikat verlängern",
    "pro-finder Anleitung",
    "Rauchmelder prüfen",
    "Campus-Inseln freischalten",
];

const WELCOME_MSG: Message = {
    id: "sys_welcome",
    role: "assistant",
    content: `Hallo! Ich bin **THI**, Ihr intelligenter KI-Assistent für THITRONIK Produkte und die Händler Akademie. 🤖

Ich helfe Ihnen bei:
- 📦 **Produktfragen** zu WiPro, Pro-finder & Co.
- 🔧 **Einbau-Support** und Fehleranalyse
- 🎓 **Campus-Navigation** und Lernpfaden
- 🏆 **Zertifikate** und Partnerschaft

Wie kann ich Ihnen heute helfen?`,
};

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
function formatTime(date?: Date | string): string {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={copy}
            title="Kopieren"
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 shrink-0"
        >
            {copied ? "✓ Kopiert" : "📋"}
        </button>
    );
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────
export default function ThiChatPage() {
    const [loaded, setLoaded] = useState(false);
    const [initialMessages, setInitialMessages] = useState<Message[]>([]);
    const [activeTopic, setActiveTopic] = useState<TopicKey | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Memory laden
    useEffect(() => {
        const savedMemory = localStorage.getItem("thi_chat_memory");
        if (savedMemory) {
            try {
                const parsed = JSON.parse(savedMemory);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setInitialMessages(parsed);
                }
            } catch (e) {
                console.error("Failed to parse chat memory:", e);
            }
        }
        setLoaded(true);
    }, []);

    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput } = useChat({
        api: "/api/chat",
        initialMessages: initialMessages.length > 0 ? initialMessages : [WELCOME_MSG],
    });

    // Memory speichern
    useEffect(() => {
        if (loaded && messages.length > 0) {
            localStorage.setItem("thi_chat_memory", JSON.stringify(messages));
        }
    }, [messages, loaded]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-resize Textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
        }
    }, [input]);

    const resetChat = () => {
        localStorage.removeItem("thi_chat_memory");
        setActiveTopic(null);
        setMessages([{ ...WELCOME_MSG, createdAt: new Date() }]);
    };

    const sendQuickReply = useCallback((text: string) => {
        setInput(text);
        setTimeout(() => {
            const form = document.getElementById("thi-form") as HTMLFormElement;
            form?.requestSubmit();
        }, 50);
    }, [setInput]);

    const handleTopicSelect = (topic: Topic) => {
        setActiveTopic(topic.key);
        sendQuickReply(topic.prompt);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const form = document.getElementById("thi-form") as HTMLFormElement;
            form?.requestSubmit();
        }
    };

    const isFirstMessage = messages.length <= 1;

    if (!loaded) return null;

    return (
        <PremiumBackground>
            <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in flex flex-col h-[calc(100vh-80px)] relative z-10">

                {/* Page Title */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-extrabold flex items-center gap-3 text-white">
                        <span className="text-brand-lime">🤖</span> THI Assistent
                        <Badge className="bg-brand-lime/20 text-brand-lime border-brand-lime/30 text-xs">Beta</Badge>
                    </h1>
                </div>

                <Card className="flex-1 flex flex-col border-border overflow-hidden shadow-xl bg-card min-h-0">

                    {/* ── Chat Header ─────────────────────────────────────────── */}
                    <div className="p-3 border-b border-border bg-brand-navy text-white flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-lime/30 to-brand-sky/30 flex items-center justify-center text-xl shadow-inner border border-white/20">
                                    🤖
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-brand-navy" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white leading-none">THI</h3>
                                <p className="text-[11px] text-brand-sky font-semibold uppercase tracking-wider mt-0.5">
                                    Online · KI-Assistent
                                </p>
                            </div>
                        </div>

                        {/* Topic Pills */}
                        <div className="hidden md:flex items-center gap-2">
                            {TOPICS.map((topic) => (
                                <button
                                    key={topic.key}
                                    onClick={() => handleTopicSelect(topic)}
                                    className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                                        activeTopic === topic.key
                                            ? topic.color + " scale-105"
                                            : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
                                    }`}
                                >
                                    {topic.icon} {topic.label}
                                </button>
                            ))}
                        </div>

                        {messages.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={resetChat}
                                className="text-white/50 hover:text-white hover:bg-white/10 text-xs shrink-0"
                            >
                                🗑 Leeren
                            </Button>
                        )}
                    </div>

                    {/* ── Chat Body ────────────────────────────────────────────── */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 min-h-0">

                        {/* Welcome Topic Cards (nur beim ersten Mal) */}
                        {isFirstMessage && (
                            <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
                                {TOPICS.map((topic) => (
                                    <button
                                        key={topic.key}
                                        onClick={() => handleTopicSelect(topic)}
                                        className={`text-left p-3 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${topic.color}`}
                                    >
                                        <div className="text-lg mb-1">{topic.icon}</div>
                                        <div className="font-semibold text-sm">{topic.label}</div>
                                        <div className="text-[11px] opacity-70 mt-0.5">Direkt starten →</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Messages */}
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
                            >
                                {/* THI Avatar */}
                                {m.role === "assistant" && (
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-lime/20 to-brand-sky/20 border border-white/10 flex items-center justify-center text-sm mr-2 mt-1 shrink-0">
                                        🤖
                                    </div>
                                )}

                                <div className={`group max-w-[80%] flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                            m.role === "user"
                                                ? "bg-brand-sky text-white rounded-br-sm"
                                                : "bg-background text-foreground border border-border rounded-bl-sm"
                                        }`}
                                    >
                                        {m.role === "assistant" ? (
                                            <div className="flex items-start gap-1">
                                                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:text-foreground prose-strong:text-foreground">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {m.content}
                                                    </ReactMarkdown>
                                                </div>
                                                <CopyButton text={m.content} />
                                            </div>
                                        ) : (
                                            m.content
                                        )}
                                    </div>
                                    {/* Timestamp */}
                                    <span className="text-[10px] text-muted-foreground px-1">
                                        {formatTime(m.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-lime/20 to-brand-sky/20 border border-white/10 flex items-center justify-center text-sm mr-2 mt-1 shrink-0">
                                    🤖
                                </div>
                                <div className="bg-background border border-border text-muted-foreground rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                                    <span className="animate-bounce inline-block w-2 h-2 bg-brand-sky rounded-full" />
                                    <span className="animate-bounce inline-block w-2 h-2 bg-brand-sky rounded-full" style={{ animationDelay: "0.2s" }} />
                                    <span className="animate-bounce inline-block w-2 h-2 bg-brand-sky rounded-full" style={{ animationDelay: "0.4s" }} />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} className="pb-2" />
                    </div>

                    {/* ── Quick Replies ─────────────────────────────────────────── */}
                    <div className="px-4 pt-2 pb-1 border-t border-border/50 bg-background/50 flex flex-wrap gap-1.5 shrink-0">
                        {QUICK_REPLIES.map((reply) => (
                            <button
                                key={reply}
                                onClick={() => sendQuickReply(reply)}
                                disabled={isLoading}
                                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-brand-sky/50 hover:text-brand-sky hover:bg-brand-sky/5 transition-all disabled:opacity-40 cursor-pointer"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>

                    {/* ── Chat Footer ───────────────────────────────────────────── */}
                    <div className="p-3 bg-background border-t border-border shrink-0">
                        <form
                            id="thi-form"
                            onSubmit={handleSubmit}
                            className="flex gap-2 items-end"
                        >
                            <div className="flex-1 relative">
                                <Textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ihre Frage an THI… (Enter = Senden, Shift+Enter = Zeilenumbruch)"
                                    className="flex-1 min-h-[48px] max-h-[160px] bg-muted/50 focus-visible:ring-brand-sky rounded-xl resize-none pr-3 py-3 text-sm leading-relaxed"
                                    disabled={isLoading}
                                    rows={1}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-brand-navy hover:bg-brand-sky text-white shadow-sm h-12 px-5 rounded-xl font-bold transition-all active:scale-95 shrink-0"
                            >
                                ➤
                            </Button>
                        </form>
                        <p className="text-center text-[10px] text-muted-foreground mt-2">
                            THI ist eine KI und kann Fehler machen. Bei Einbaufragen bitte das gedruckte Handbuch prüfen.
                        </p>
                    </div>
                </Card>
            </div>
        </PremiumBackground>
    );
}
