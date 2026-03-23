"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, Suspense } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { WasBinIchGame } from "./components/WasBinIchGame";
import { useBroadcastRoom } from "@/lib/multiplayer/useBroadcastRoom";
import { RoomLobby } from "@/lib/multiplayer/RoomLobby";
import { Scoreboard } from "@/lib/multiplayer/Scoreboard";
import { buildRoomUrl } from "@/lib/multiplayer/roomUtils";
import { MSG } from "@/lib/multiplayer/types";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle, Lightbulb, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Products for multiplayer (synced hints revealed by host)
const PRODUCTS = [
    {
        name: "WiPro III safe.lock",
        hints: [
            "Ich schütze dein mobiles Zuhause.",
            "Ich reagiere auf unerlaubtes Eindringen.",
            "Ich kann auch per Fernbedienung gesteuert werden.",
            "Man nennt mich eine Alarmanlage für Reisemobile.",
            "Mein vollständiger Name enthält 'safe.lock'.",
        ],
    },
    {
        name: "Pro-finder",
        hints: [
            "Ich helfe dir, etwas Verlorenes wiederzufinden.",
            "Ich nutze GPS und Mobilfunk.",
            "Du kannst mich per App abfragen.",
            "Ich werde oft in Wohnmobilen verbaut.",
            "Man nennt mich einen Fahrzeugtracker.",
        ],
    },
    {
        name: "G.A.S.-connect",
        hints: [
            "Ich warne vor unsichtbarer Gefahr.",
            "Ich spüre bestimmte Gase in der Luft.",
            "Propan, Butan und KO-Gase sind mein Spezialgebiet.",
            "Ich bin per Funk mit der Zentrale verbunden.",
            "Mein Name enthält die Abkürzung G.A.S.",
        ],
    },
];

interface WBIGameState {
    phase: "waiting" | "playing" | "reveal" | "finished";
    currentProduct: number;
    hintsRevealed: number;
    guesses: Record<string, { guess: string; hintsUsed: number }>;
}

const INITIAL_STATE: WBIGameState = {
    phase: "waiting",
    currentProduct: 0,
    hintsRevealed: 1,
    guesses: {},
};

function WasBinIchMultiplayer({ roomId, role: initialRole }: { roomId: string; role: "host" | "participant" }) {
    const [playerName, setPlayerName] = useState("");
    const [nameSet, setNameSet] = useState(initialRole === "host");
    const [localGuess, setLocalGuess] = useState("");
    const [guessSubmitted, setGuessSubmitted] = useState(false);

    const { room, participants, clientId, sendMessage, updateGameState, setStatus, updateParticipantScore } =
        useBroadcastRoom<WBIGameState>({
            roomId, gameId: "was-bin-ich", role: initialRole,
            playerName: initialRole === "host" ? "Host" : playerName,
            initialGameState: INITIAL_STATE,
        });

    const roomUrl = buildRoomUrl("de", "was-bin-ich", roomId, "participant");
    const gameState = room?.gameState ?? INITIAL_STATE;
    const product = PRODUCTS[Math.min(gameState.currentProduct, PRODUCTS.length - 1)];
    const visibleHints = product.hints.slice(0, gameState.hintsRevealed);

    const handleNameSubmit = useCallback((name: string) => { setPlayerName(name); setNameSet(true); }, []);

    const startGame = useCallback(() => {
        setStatus("running");
        setGuessSubmitted(false);
        updateGameState(() => ({ phase: "playing", currentProduct: 0, hintsRevealed: 1, guesses: {} }));
    }, [setStatus, updateGameState]);

    const revealHint = useCallback(() => {
        if (gameState.hintsRevealed < product.hints.length) {
            updateGameState((prev) => ({ ...prev, hintsRevealed: prev.hintsRevealed + 1 }));
        }
    }, [gameState.hintsRevealed, product.hints.length, updateGameState]);

    const submitGuess = useCallback(() => {
        if (!localGuess.trim()) return;
        setGuessSubmitted(true);
        updateGameState((prev) => ({
            ...prev,
            guesses: { ...prev.guesses, [clientId]: { guess: localGuess.trim(), hintsUsed: prev.hintsRevealed } },
        }));
    }, [localGuess, clientId, updateGameState]);

    const revealAnswer = useCallback(() => {
        // Score based on correctness and hints used
        Object.entries(gameState.guesses).forEach(([pid, { guess, hintsUsed }]) => {
            const isCorrect = guess.toLowerCase().includes(product.name.toLowerCase().split(" ")[0].toLowerCase());
            if (isCorrect) {
                const points = Math.max(100, 500 - (hintsUsed - 1) * 100); // fewer hints = more points
                const p = participants.find((pp) => pp.id === pid);
                if (p) updateParticipantScore(pid, (p.score || 0) + points);
            }
        });
        updateGameState((prev) => ({ ...prev, phase: "reveal" }));
    }, [gameState.guesses, product.name, participants, updateParticipantScore, updateGameState]);

    const nextProduct = useCallback(() => {
        const nextIdx = gameState.currentProduct + 1;
        setLocalGuess("");
        setGuessSubmitted(false);
        if (nextIdx >= PRODUCTS.length) {
            updateGameState((prev) => ({ ...prev, phase: "finished" }));
            setStatus("finished");
        } else {
            updateGameState(() => ({ phase: "playing", currentProduct: nextIdx, hintsRevealed: 1, guesses: {} }));
        }
    }, [gameState.currentProduct, updateGameState, setStatus]);

    const playAgain = useCallback(() => {
        participants.forEach((p) => updateParticipantScore(p.id, 0));
        setStatus("lobby");
        setGuessSubmitted(false);
        setLocalGuess("");
        updateGameState(() => INITIAL_STATE);
    }, [participants, updateParticipantScore, setStatus, updateGameState]);

    if (!nameSet) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2744] flex items-center justify-center p-4">
                <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={false} participants={participants}
                    hostName={room?.host.name ?? "Host"} onStart={() => {}} onNameSubmit={handleNameSubmit} showNameInput />
            </div>
        );
    }

    if (room?.status === "lobby" || gameState.phase === "waiting") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2744] flex flex-col items-center justify-center p-4">
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/games"><Button variant="ghost" className="gap-2 text-white hover:bg-white/20"><ArrowLeft className="w-4 h-4" /> Zurück</Button></Link>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-brand-lime" /> Multiplayer: Was bin ich?
                </motion.div>
                <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={initialRole === "host"} participants={participants}
                    hostName={room?.host.name ?? "Host"} onStart={startGame} />
            </div>
        );
    }

    if (room?.status === "finished" || gameState.phase === "finished") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2744] flex items-center justify-center p-4">
                <Scoreboard participants={participants} hostName={room?.host.name ?? "Host"} isHost={initialRole === "host"} onPlayAgain={playAgain} />
            </div>
        );
    }

    const guessCount = Object.keys(gameState.guesses).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2744] text-white p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-white/50">Runde {gameState.currentProduct + 1}/{PRODUCTS.length}</div>
                    <div className="text-sm text-white/50">{guessCount} Tipps abgegeben</div>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8">
                    <div className="text-5xl mb-4">🤔</div>
                    <h2 className="text-3xl font-black mb-2">Was bin ich?</h2>
                    <p className="text-white/50 text-sm">Hinweis {gameState.hintsRevealed}/{product.hints.length}</p>
                </motion.div>

                {/* Hints */}
                <div className="space-y-3 mb-8">
                    {visibleHints.map((hint, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                        >
                            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                            <span className="text-sm italic text-white/80">"{hint}"</span>
                        </motion.div>
                    ))}
                </div>

                {/* Host: reveal more hints */}
                {initialRole === "host" && gameState.phase === "playing" && gameState.hintsRevealed < product.hints.length && (
                    <Button onClick={revealHint} variant="outline" className="w-full mb-4 border-white/20 text-white hover:bg-white/10">
                        💡 Nächsten Hinweis aufdecken ({gameState.hintsRevealed}/{product.hints.length})
                    </Button>
                )}

                {/* Guess input (participants) */}
                {gameState.phase === "playing" && (
                    <>
                        {!guessSubmitted ? (
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={localGuess}
                                    onChange={(e) => setLocalGuess(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && submitGuess()}
                                    placeholder="Produktname eingeben…"
                                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-lime/50"
                                />
                                <Button onClick={submitGuess} disabled={!localGuess.trim()} className="bg-brand-lime text-brand-navy font-bold px-6">
                                    Raten
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-3 mb-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                                    <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
                                    <span className="text-white/60 text-sm">Tipp abgegeben: "{gameState.guesses[clientId]?.guess}"</span>
                                </div>
                            </div>
                        )}

                        {initialRole === "host" && guessCount > 0 && (
                            <Button onClick={revealAnswer} className="w-full bg-brand-lime text-brand-navy font-bold">
                                Auflösen ({guessCount} Tipps) 🎯
                            </Button>
                        )}
                    </>
                )}

                {/* Reveal phase */}
                {gameState.phase === "reveal" && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                        <div className="text-center p-6 rounded-2xl bg-brand-lime/10 border border-brand-lime/30">
                            <p className="text-brand-lime font-bold text-2xl mb-1">{product.name}</p>
                            <p className="text-white/50 text-sm">Das ist die Antwort!</p>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(gameState.guesses).map(([pid, { guess }]) => {
                                const name = participants.find((p) => p.id === pid)?.name ?? "?";
                                const isCorrect = guess.toLowerCase().includes(product.name.toLowerCase().split(" ")[0].toLowerCase());
                                return (
                                    <div key={pid} className={`flex items-center gap-3 p-3 rounded-xl border ${isCorrect ? "bg-brand-lime/10 border-brand-lime/30" : "bg-white/5 border-white/10"}`}>
                                        <span className="text-lg">{isCorrect ? "✅" : "❌"}</span>
                                        <span className="font-bold text-sm flex-1">{name}</span>
                                        <span className="text-sm text-white/60 italic">"{guess}"</span>
                                    </div>
                                );
                            })}
                        </div>
                        {initialRole === "host" && (
                            <Button onClick={nextProduct} className="w-full bg-white/20 text-white font-bold border border-white/20 hover:bg-white/30 mt-4">
                                {gameState.currentProduct + 1 >= PRODUCTS.length ? "Endstand 🏆" : "Nächstes Produkt →"}
                            </Button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function WasBinIchPageInner() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("room");
    const role = searchParams.get("role") as "host" | "participant" | null;

    if (roomId && (role === "host" || role === "participant")) {
        return <RoleGuard requiredRole="user"><WasBinIchMultiplayer roomId={roomId} role={role} /></RoleGuard>;
    }

    return (
        <RoleGuard requiredRole="user">
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <Link href="/games"><Button aria-label="Zurück" variant="outline" size="icon" className="h-10 w-10 shrink-0 border-white/20 text-white hover:bg-white/10"><ArrowLeft className="h-5 w-5" /></Button></Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-white"><span className="text-4xl">🤔</span> Was bin ich?</h1>
                        <p className="text-white/60 mt-1">Erraten Sie THITRONIK-Produkte anhand schrittweiser Hinweise</p>
                    </div>
                </div>
                <WasBinIchGame />
            </div>
        </RoleGuard>
    );
}

export default function WasBinIchPage() {
    return <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2744]" />}><WasBinIchPageInner /></Suspense>;
}
