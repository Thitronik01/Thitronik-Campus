"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, Suspense } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { KahootQuiz } from "@/components/interactive/kahoot-quiz";
import { useBroadcastRoom } from "@/lib/multiplayer/useBroadcastRoom";
import { RoomLobby } from "@/lib/multiplayer/RoomLobby";
import { Scoreboard } from "@/lib/multiplayer/Scoreboard";
import { buildRoomUrl } from "@/lib/multiplayer/roomUtils";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Participant } from "@/lib/multiplayer/types";
import { MSG } from "@/lib/multiplayer/types";

// ── Kahoot questions (shared for multiplayer) ──────────────
const QUESTIONS = [
    { question: "In welcher Stadt ist Thitronik ansässig?", answers: ["Kiel", "Eckernförde", "Flensburg", "Schleswig"], correct: 1, time: 20 },
    { question: "In welchem Bundesland liegt der Standort von Thitronik?", answers: ["Niedersachsen", "Hamburg", "Schleswig-Holstein", "Mecklenburg-Vorpommern"], correct: 2, time: 20 },
    { question: "Für welche Branche entwickelt Thitronik hauptsächlich Produkte?", answers: ["Luftfahrt", "Automobilindustrie", "Marine & Freizeitboote", "Bergbau"], correct: 2, time: 20 },
    { question: "Was ist das Kernprodukt von Thitronik?", answers: ["GPS-Navigationssysteme", "Gaswarngeräte", "Motorsteuerungen", "Tauchcomputer"], correct: 1, time: 20 },
    { question: "Welches Gas wird von Thitroniks Geräten NICHT primär erkannt?", answers: ["LPG / Propan", "Benzindämpfe", "CO (Kohlenmonoxid)", "Stickstoff (N₂)"], correct: 3, time: 20 },
    { question: "An welchem Gewässer liegt Eckernförde?", answers: ["Nordsee", "Eckernförder Bucht (Ostsee)", "Kieler Förde", "Schlei"], correct: 1, time: 20 },
    { question: "Wie lautet ein bekanntes Gaswarngerät-Modell von Thitronik?", answers: ["Gas-Max", "Gas-Pro", "Gas-Alert", "Gas-Safe"], correct: 1, time: 20 },
    { question: "Für welche Fahrzeugtypen bietet Thitronik neben Booten Lösungen an?", answers: ["Flugzeuge", "Wohnmobile & Caravans", "Züge", "Motorräder"], correct: 1, time: 20 },
];

const ACFG = [
    { color: "#E21B3C", shape: "▲" },
    { color: "#1368CE", shape: "◆" },
    { color: "#FFA602", shape: "●" },
    { color: "#26890C", shape: "■" },
];

// ── Game State Type ────────────────────────────────────────
interface KahootGameState {
    currentQuestion: number;
    phase: "waiting" | "question" | "reveal" | "scores" | "finished";
    timeLeft: number;
    answers: Record<string, number>; // participantId → answerIndex
    questionStartedAt: number;
}

const INITIAL_STATE: KahootGameState = {
    currentQuestion: 0,
    phase: "waiting",
    timeLeft: 20,
    answers: {},
    questionStartedAt: 0,
};

// ── Multiplayer Kahoot Component ───────────────────────────
function KahootMultiplayer({ roomId, role: initialRole }: { roomId: string; role: "host" | "participant" }) {
    const t = useTranslations("multiplayer");
    const [playerName, setPlayerName] = useState("");
    const [nameSet, setNameSet] = useState(initialRole === "host");
    const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

    const {
        room,
        participants,
        isConnected,
        clientId,
        sendMessage,
        updateGameState,
        setStatus,
        updateParticipantScore,
    } = useBroadcastRoom<KahootGameState>({
        roomId,
        gameId: "kahoot",
        role: initialRole,
        playerName: initialRole === "host" ? "Host" : playerName,
        initialGameState: INITIAL_STATE,
    });

    const roomUrl = buildRoomUrl("de", "kahoot", roomId, "participant");
    const gameState = room?.gameState ?? INITIAL_STATE;
    const currentQ = QUESTIONS[Math.min(gameState.currentQuestion, QUESTIONS.length - 1)];

    const handleNameSubmit = useCallback((name: string) => {
        setPlayerName(name);
        setNameSet(true);
    }, []);

    // Host: start the game
    const startGame = useCallback(() => {
        setStatus("running");
        updateGameState(() => ({
            ...INITIAL_STATE,
            phase: "question",
            timeLeft: QUESTIONS[0].time,
            questionStartedAt: Date.now(),
            answers: {},
        }));
    }, [setStatus, updateGameState]);

    // Host: advance to next question
    const nextQuestion = useCallback(() => {
        const nextIdx = gameState.currentQuestion + 1;
        if (nextIdx >= QUESTIONS.length) {
            updateGameState((prev) => ({ ...prev, phase: "finished" }));
            setStatus("finished");
        } else {
            updateGameState(() => ({
                currentQuestion: nextIdx,
                phase: "question",
                timeLeft: QUESTIONS[nextIdx].time,
                answers: {},
                questionStartedAt: Date.now(),
            }));
        }
    }, [gameState.currentQuestion, updateGameState, setStatus]);

    // Host: reveal answers
    const revealAnswers = useCallback(() => {
        // Calculate scores
        const q = QUESTIONS[gameState.currentQuestion];
        Object.entries(gameState.answers).forEach(([pid, ansIdx]) => {
            if (ansIdx === q.correct) {
                const participant = participants.find((p) => p.id === pid);
                if (participant) {
                    const timeFactor = Math.max(gameState.timeLeft / q.time, 0.1);
                    const points = Math.round(1000 + timeFactor * 500);
                    updateParticipantScore(pid, (participant.score || 0) + points);
                }
            }
        });
        updateGameState((prev) => ({ ...prev, phase: "reveal" }));
    }, [gameState, participants, updateGameState, updateParticipantScore]);

    // Participant: submit answer
    const submitAnswer = useCallback((answerIndex: number) => {
        sendMessage(MSG.GAME_ACTION, {
            action: "answer",
            data: { participantId: clientId, answerIndex, questionIndex: gameState.currentQuestion },
        });
        // Also update local state optimistically
        updateGameState((prev) => ({
            ...prev,
            answers: { ...prev.answers, [clientId]: answerIndex },
        }));
    }, [sendMessage, clientId, gameState.currentQuestion, updateGameState]);

    // Host: listen for participant answers via the game action messages
    // This is handled in the useBroadcastRoom hook's GAME_ACTION handler
    // We extend by checking incoming messages in the broadcast channel

    const playAgain = useCallback(() => {
        // Reset participants scores
        participants.forEach((p) => updateParticipantScore(p.id, 0));
        setStatus("lobby");
        updateGameState(() => INITIAL_STATE);
    }, [participants, updateParticipantScore, setStatus, updateGameState]);

    // ── Name input for participants ────────────────────────
    if (!nameSet) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#46178f] to-[#2a0a6b] flex items-center justify-center p-4">
                <RoomLobby
                    roomId={roomId}
                    roomUrl={roomUrl}
                    isHost={false}
                    participants={participants}
                    hostName={room?.host.name ?? "Host"}
                    onStart={() => {}}
                    onNameSubmit={handleNameSubmit}
                    showNameInput
                />
            </div>
        );
    }

    // ── Lobby ──────────────────────────────────────────────
    if (room?.status === "lobby" || gameState.phase === "waiting") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#46178f] to-[#2a0a6b] flex flex-col items-center justify-center p-4">
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/games">
                        <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
                            <ArrowLeft className="w-4 h-4" /> Zurück
                        </Button>
                    </Link>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black text-white italic mb-8 text-center drop-shadow-lg"
                >
                    kahoot!
                </motion.div>
                <RoomLobby
                    roomId={roomId}
                    roomUrl={roomUrl}
                    isHost={initialRole === "host"}
                    participants={participants}
                    hostName={room?.host.name ?? "Host"}
                    onStart={startGame}
                />
            </div>
        );
    }

    // ── Finished → Scoreboard ──────────────────────────────
    if (gameState.phase === "finished") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#46178f] to-[#2a0a6b] flex items-center justify-center p-4">
                <Scoreboard
                    participants={participants}
                    hostName={room?.host.name ?? "Host"}
                    isHost={initialRole === "host"}
                    onPlayAgain={playAgain}
                />
            </div>
        );
    }

    // ── Question / Reveal Phase ────────────────────────────
    const hasAnswered = clientId in gameState.answers;
    const answeredCount = Object.keys(gameState.answers).length;
    const tPct = (gameState.timeLeft / currentQ.time) * 100;
    const tColor = tPct > 50 ? "#26890C" : tPct > 25 ? "#FFA602" : "#E21B3C";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#46178f] to-[#2a0a6b] flex flex-col items-center justify-start p-0">
            <style>{`
                @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .ans-btn:hover:not(:disabled) { filter: brightness(1.1); transform: scale(1.02); }
                .ans-btn:active:not(:disabled) { transform: scale(0.97); }
            `}</style>

            {/* Top bar */}
            <div className="flex items-center w-full max-w-[760px] mx-auto p-3 gap-3">
                <div className="bg-white/20 text-white rounded-lg px-3 py-1 text-xs font-bold">
                    {gameState.currentQuestion + 1}/{QUESTIONS.length}
                </div>
                <div className="flex-1" />
                {/* Timer Circle */}
                <div className="relative w-14 h-14">
                    <svg viewBox="0 0 56 56" className="absolute -rotate-90 w-14 h-14">
                        <circle cx="28" cy="28" r="23" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
                        <circle cx="28" cy="28" r="23" fill="none" stroke={tColor} strokeWidth="5"
                            strokeDasharray={`${2 * Math.PI * 23}`}
                            strokeDashoffset={`${2 * Math.PI * 23 * (1 - tPct / 100)}`}
                            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-black text-lg">
                        {gameState.timeLeft}
                    </div>
                </div>
                <div className="flex-1" />
                {initialRole === "host" && (
                    <div className="text-white/60 text-xs font-bold">
                        📊 {answeredCount}/{participants.length} Antworten
                    </div>
                )}
            </div>

            {/* Timer bar */}
            <div className="h-1 bg-white/15 w-[calc(100%-28px)] max-w-[732px] mx-auto rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 ease-linear" style={{ background: tColor, width: `${tPct}%` }} />
            </div>

            {/* Question Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/95 w-[calc(100%-24px)] max-w-[736px] mx-auto mt-3 rounded-2xl p-5 shadow-lg"
            >
                <p className="text-[#1a0533] font-extrabold text-lg text-center leading-snug">{currentQ.question}</p>
            </motion.div>

            {/* Answer grid */}
            {gameState.phase === "question" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 gap-3 w-[calc(100%-24px)] max-w-[736px] mx-auto mt-3"
                >
                    {currentQ.answers.map((ans, idx) => {
                        const cfg = ACFG[idx];
                        const myAnswer = gameState.answers[clientId];
                        const disabled = hasAnswered || initialRole === "host";
                        let bg = cfg.color;
                        let opacity = 1;

                        if (hasAnswered) {
                            if (idx === myAnswer) {
                                bg = "#4a4a4a";
                                opacity = 1;
                            } else {
                                opacity = 0.4;
                            }
                        }

                        return (
                            <button
                                key={idx}
                                className="ans-btn"
                                disabled={disabled}
                                onClick={() => submitAnswer(idx)}
                                style={{
                                    width: "100%", border: "none", borderRadius: 13,
                                    padding: "14px 12px", cursor: disabled ? "default" : "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "flex-start",
                                    gap: 8, minHeight: 92, background: bg, opacity,
                                    boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
                                    transition: "transform 0.15s, opacity 0.3s, background 0.3s",
                                }}
                            >
                                <span className="text-xl text-white/90 shrink-0">{cfg.shape}</span>
                                <span className="text-white font-extrabold text-sm text-left leading-snug">{ans}</span>
                            </button>
                        );
                    })}
                </motion.div>
            )}

            {/* Reveal phase */}
            {gameState.phase === "reveal" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-[calc(100%-24px)] max-w-[736px] mx-auto mt-6 space-y-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        {currentQ.answers.map((ans, idx) => {
                            const cfg = ACFG[idx];
                            const isCorrect = idx === currentQ.correct;
                            const bg = isCorrect ? "#26890C" : "#333";
                            const opacity = isCorrect ? 1 : 0.4;
                            const answerCount = Object.values(gameState.answers).filter((a) => a === idx).length;

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        borderRadius: 13, padding: "14px 12px",
                                        display: "flex", alignItems: "center", gap: 8,
                                        minHeight: 72, background: bg, opacity,
                                        boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
                                    }}
                                >
                                    <span className="text-xl text-white/90 shrink-0">{cfg.shape}</span>
                                    <span className="text-white font-extrabold text-sm flex-1">{ans}</span>
                                    <span className="text-white/70 text-sm font-bold">{answerCount}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mini scoreboard */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-white font-bold text-sm">Zwischenstand</span>
                        </div>
                        <div className="space-y-1">
                            {[...participants].sort((a, b) => b.score - a.score).slice(0, 5).map((p, i) => (
                                <div key={p.id} className="flex items-center gap-2 text-sm">
                                    <span className="text-white/50 w-5">{i + 1}.</span>
                                    <span className="text-white font-semibold flex-1 truncate">{p.name}</span>
                                    <span className="text-yellow-400 font-bold">{p.score.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {initialRole === "host" && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={nextQuestion}
                            className="w-full py-3 rounded-xl font-bold text-lg bg-white/20 text-white hover:bg-white/30 border border-white/20 transition-all"
                        >
                            {gameState.currentQuestion + 1 >= QUESTIONS.length ? "Ergebnis anzeigen 🏆" : "Nächste Frage →"}
                        </motion.button>
                    )}
                </motion.div>
            )}

            {/* Host controls during question phase */}
            {initialRole === "host" && gameState.phase === "question" && (
                <div className="fixed bottom-6 right-6 z-30">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={revealAnswers}
                        className="px-6 py-3 rounded-xl font-bold bg-white/20 text-white hover:bg-white/30 border border-white/20 backdrop-blur-sm"
                    >
                        Auflösen ✓
                    </motion.button>
                </div>
            )}

            {/* Participant waiting feedback */}
            {initialRole === "participant" && hasAnswered && gameState.phase === "question" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
                        <span className="text-white/80 font-semibold">Antwort gesendet – warte auf Auflösung...</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// ── Page Component ─────────────────────────────────────────
function KahootPageInner() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("room");
    const role = searchParams.get("role") as "host" | "participant" | null;

    // If room params present → multiplayer mode
    if (roomId && (role === "host" || role === "participant")) {
        return (
            <RoleGuard requiredRole="user">
                <KahootMultiplayer roomId={roomId} role={role} />
            </RoleGuard>
        );
    }

    // Default: singleplayer (existing component unchanged)
    return (
        <RoleGuard requiredRole="user">
            <KahootQuiz />
        </RoleGuard>
    );
}

export default function KahootPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#46178f] to-[#2a0a6b]" />}>
            <KahootPageInner />
        </Suspense>
    );
}
