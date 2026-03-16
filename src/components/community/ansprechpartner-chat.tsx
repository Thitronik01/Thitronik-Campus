"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, HelpCircle, CheckCircle2, Clock, Shield, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/user-store";
import { useAuthStore } from "@/store/auth-store";

// ── Typen ──────────────────────────────────────────────────────────────────────
type StaffRole = "manager" | "admin";
type QuestionStatus = "open" | "answered";

interface Answer {
    id: string;
    staffName: string;
    staffRole: StaffRole;
    content: string;
    time: string;
}

interface Question {
    id: string;
    dealerName: string;
    content: string;
    time: string;
    status: QuestionStatus;
    answers: Answer[];
}

// ── THITRONIK Design Tokens ────────────────────────────────────────────────────
const TH = {
    navy: "#0a1628",
    navyLight: "#1D3661",
    sky: "#3BA9D3",
    lime: "#A3E635",
    red: "#CE132D",
    white: "#FFFFFF",
    textStrong: "#18212F",
    textMuted: "#485467",
    textSoft: "#677488",
    borderSoft: "#D7DCE3",
    panelBg: "#F7F9FC",
    graySoft: "#F0F0F0",
};

// ── Seed-Daten (Demo) ─────────────────────────────────────────────────────────
const SEED_QUESTIONS: Question[] = [
    {
        id: "q-1",
        dealerName: "Autohaus Kühn GmbH",
        content: "Was gibt es heute beim Campus zum Mittagessen?",
        time: "11:30",
        status: "answered",
        answers: [
            {
                id: "a-1",
                staffName: "Campus Team",
                staffRole: "admin",
                content: "Heute gibt es: Schnitzel mit Pommes, Gemüsetopf vegetarisch und als Dessert Apfelkuchen. Guten Appetit! 🍽️",
                time: "11:35",
            },
        ],
    },
    {
        id: "q-2",
        dealerName: "Camping Nord GmbH",
        content: "Wann startet die nächste WiPro III Schulung?",
        time: "11:42",
        status: "answered",
        answers: [
            {
                id: "a-2",
                staffName: "THITRONIK Vertrieb",
                staffRole: "manager",
                content: "Die nächste WiPro III Schulung startet heute um 14:00 Uhr im Schulungsraum 2. Einfach direkt erscheinen!",
                time: "11:45",
            },
        ],
    },
    {
        id: "q-3",
        dealerName: "VanTec Leipzig",
        content: "Wo finde ich die aktuellen Verkaufsunterlagen für den Pro-finder?",
        time: "12:05",
        status: "open",
        answers: [],
    },
];

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
function formatTime(): string {
    return new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function StaffBadge({ role }: { role: StaffRole }) {
    if (role === "admin") {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                <Shield className="w-3 h-3" /> Admin
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            <Briefcase className="w-3 h-3" /> THITRONIK
        </span>
    );
}

// ── Haupt-Komponente ───────────────────────────────────────────────────────────
export function AnsprechpartnerChat() {
    const { name: userName } = useUserStore();
    const { user: authUser } = useAuthStore();

    // manager + admin = THITRONIK-Mitarbeiter, der antworten kann
    const isStaff = authUser?.role === "manager" || authUser?.role === "admin";
    const staffRole: StaffRole = authUser?.role === "admin" ? "admin" : "manager";

    const [questions, setQuestions] = useState<Question[]>(SEED_QUESTIONS);
    const [input, setInput] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [questions.length]);

    // Auto-expand the newest open question
    useEffect(() => {
        const openQ = questions.filter((q) => q.status === "open");
        if (openQ.length > 0) setExpandedId(openQ[openQ.length - 1].id);
    }, [questions.length]);

    const sendQuestion = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        const newQ: Question = {
            id: `q-${Date.now()}`,
            dealerName: userName || "Händler",
            content: trimmed,
            time: formatTime(),
            status: "open",
            answers: [],
        };
        setQuestions((prev) => [...prev, newQ]);
        setExpandedId(newQ.id);
        setInput("");
    };

    const sendAnswer = (questionId: string) => {
        const text = (replyInputs[questionId] || "").trim();
        if (!text) return;
        const answer: Answer = {
            id: `a-${Date.now()}`,
            staffName: userName || "THITRONIK Team",
            staffRole,
            content: text,
            time: formatTime(),
        };
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? { ...q, status: "answered", answers: [...q.answers, answer] }
                    : q
            )
        );
        setReplyInputs((prev) => ({ ...prev, [questionId]: "" }));
    };

    const openCount = questions.filter((q) => q.status === "open").length;

    return (
        <div className="flex flex-col gap-6">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div
                className="rounded-3xl px-6 py-8 md:px-10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between"
                style={{ background: `linear-gradient(100deg, ${TH.navyLight} 0%, #162845 100%)` }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
                        👤
                    </div>
                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/70 mb-1">THITRONIK Campus</div>
                        <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">Ansprechpartner finden</h1>
                        <p className="text-sm text-white/70 mt-0.5">
                            {isStaff
                                ? "Sie sehen alle Händler-Fragen und können antworten."
                                : "Stellen Sie Fragen direkt an unser THITRONIK-Team."}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="rounded-2xl px-6 py-4 bg-white/10 border border-white/15 text-white">
                        <div className="text-[10px] uppercase tracking-wider text-white/70">Offen</div>
                        <div className="text-2xl font-bold mt-0.5">{openCount}</div>
                    </div>
                    <div className="rounded-2xl px-6 py-4 bg-white/10 border border-white/15 text-white">
                        <div className="text-[10px] uppercase tracking-wider text-white/70">Gesamt</div>
                        <div className="text-2xl font-bold mt-0.5">{questions.length}</div>
                    </div>
                </div>
            </div>

            {/* ── Frage stellen (nur Händler) ──────────────────────────────────── */}
            {!isStaff && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <label className="block text-sm font-semibold mb-2" style={{ color: TH.navyLight }}>
                        Ihre Frage an das THITRONIK-Team
                    </label>
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendQuestion(); } }}
                            placeholder="z.B. Was gibt es heute zum Mittagessen? Wann startet die Schulung?..."
                            className="flex-1 h-12 rounded-2xl border px-4 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                            style={{ borderColor: TH.borderSoft, color: TH.textStrong }}
                        />
                        <Button
                            onClick={sendQuestion}
                            disabled={!input.trim()}
                            className="h-12 px-5 rounded-2xl font-semibold"
                            style={{ backgroundColor: TH.navyLight, color: TH.white }}
                        >
                            <Send className="w-4 h-4 mr-2" /> Fragen
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Fragen-Liste ─────────────────────────────────────────────────── */}
            <div className="space-y-3">
                {questions.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Noch keine Fragen. Seien Sie der Erste!</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {[...questions].reverse().map((q) => {
                        const isExpanded = expandedId === q.id;
                        const isOwn = q.dealerName === (userName || "Händler");

                        // Händler sehen nur eigene Fragen; Staff sieht alle
                        if (!isStaff && !isOwn) return null;

                        return (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-3xl border shadow-sm overflow-hidden"
                                style={{ borderColor: q.status === "open" ? "#FBBF24" : TH.borderSoft }}
                            >
                                {/* Question Header */}
                                <button
                                    className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors"
                                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                                >
                                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${q.status === "open" ? "bg-amber-100" : "bg-green-100"}`}>
                                        {q.status === "open"
                                            ? <Clock className="w-3 h-3 text-amber-600" />
                                            : <CheckCircle2 className="w-3 h-3 text-green-600" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-semibold" style={{ color: TH.navyLight }}>{q.dealerName}</span>
                                            <span className="text-[11px]" style={{ color: TH.textSoft }}>{q.time}</span>
                                            {q.status === "open"
                                                ? <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">Offen</Badge>
                                                : <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Beantwortet</Badge>
                                            }
                                        </div>
                                        <p className="mt-1 text-sm leading-relaxed line-clamp-2" style={{ color: TH.textStrong }}>
                                            {q.content}
                                        </p>
                                    </div>
                                    <div className="shrink-0 mt-1" style={{ color: TH.textSoft }}>
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </button>

                                {/* Expanded: Answers + Reply */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: TH.borderSoft, backgroundColor: TH.panelBg }}>
                                                {/* Full question */}
                                                <div className="pt-4 pb-2 text-sm leading-relaxed" style={{ color: TH.textStrong }}>
                                                    {q.content}
                                                </div>

                                                {/* Answers */}
                                                {q.answers.map((ans) => (
                                                    <motion.div
                                                        key={ans.id}
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex gap-3 bg-white rounded-2xl p-4 border"
                                                        style={{ borderColor: TH.borderSoft }}
                                                    >
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                                                            style={{ backgroundColor: TH.navyLight, color: TH.white }}>
                                                            T
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-semibold" style={{ color: TH.navyLight }}>{ans.staffName}</span>
                                                                <StaffBadge role={ans.staffRole} />
                                                                <span className="text-[11px]" style={{ color: TH.textSoft }}>{ans.time}</span>
                                                            </div>
                                                            <p className="text-sm leading-relaxed" style={{ color: TH.textStrong }}>{ans.content}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                {q.answers.length === 0 && (
                                                    <div className="flex items-center gap-2 text-sm py-2" style={{ color: TH.textSoft }}>
                                                        <Clock className="w-4 h-4" />
                                                        Das THITRONIK-Team wurde benachrichtigt und antwortet in Kürze.
                                                    </div>
                                                )}

                                                {/* Reply box: nur für Staff */}
                                                {isStaff && (
                                                    <div className="flex gap-2 pt-2">
                                                        <input
                                                            value={replyInputs[q.id] || ""}
                                                            onChange={(e) => setReplyInputs((prev) => ({ ...prev, [q.id]: e.target.value }))}
                                                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendAnswer(q.id); } }}
                                                            placeholder="Antwort eingeben..."
                                                            className="flex-1 h-10 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                                            style={{ borderColor: TH.borderSoft, color: TH.textStrong, backgroundColor: TH.white }}
                                                        />
                                                        <Button
                                                            onClick={() => sendAnswer(q.id)}
                                                            disabled={!(replyInputs[q.id] || "").trim()}
                                                            size="sm"
                                                            className="h-10 px-4 rounded-xl"
                                                            style={{ backgroundColor: TH.navyLight, color: TH.white }}
                                                        >
                                                            <Send className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
