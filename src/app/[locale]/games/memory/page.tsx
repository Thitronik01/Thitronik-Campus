"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, Suspense } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { ThitronikMemory } from "@/components/tools/thitronik-memory";
import { useBroadcastRoom } from "@/lib/multiplayer/useBroadcastRoom";
import { RoomLobby } from "@/lib/multiplayer/RoomLobby";
import { Scoreboard } from "@/lib/multiplayer/Scoreboard";
import { buildRoomUrl } from "@/lib/multiplayer/roomUtils";
import { MSG } from "@/lib/multiplayer/types";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ── Card & Pair data (same as singleplayer) ────────────────
const PAIRS = [
    { id: "freizeitfahrzeuge", title: "Freizeitfahrzeuge", accent: "from-sky-500/20 to-cyan-500/20" },
    { id: "gruendung", title: "2010", accent: "from-emerald-500/20 to-teal-500/20" },
    { id: "umzug", title: "Seit 2019 in Eckernförde", accent: "from-violet-500/20 to-fuchsia-500/20" },
    { id: "adresse", title: "Finkenweg 9–15", accent: "from-amber-500/20 to-orange-500/20" },
    { id: "wipro", title: "WiPro III safe.lock", accent: "from-blue-500/20 to-indigo-500/20" },
    { id: "profinder", title: "Pro-finder", accent: "from-rose-500/20 to-pink-500/20" },
    { id: "gas", title: "G.A.S.-connect", accent: "from-red-500/20 to-amber-500/20" },
    { id: "werkseinbau", title: "Werkseinbauservice", accent: "from-lime-500/20 to-green-500/20" },
];

interface MemoryCard {
    uid: string;
    pairId: string;
    matched: boolean;
    faceUp: boolean;
}

interface MemoryGameState {
    board: MemoryCard[];
    currentTurn: string; // participant ID whose turn it is
    scores: Record<string, number>;
    selected: string[];   // currently selected card uids
    matchedPairs: number;
    totalPairs: number;
}

function shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildDeck(): MemoryCard[] {
    return shuffle(
        PAIRS.flatMap((pair) => [
            { uid: `${pair.id}-a`, pairId: pair.id, matched: false, faceUp: false },
            { uid: `${pair.id}-b`, pairId: pair.id, matched: false, faceUp: false },
        ])
    );
}

const INITIAL_STATE: MemoryGameState = {
    board: [],
    currentTurn: "",
    scores: {},
    selected: [],
    matchedPairs: 0,
    totalPairs: PAIRS.length,
};

// ── Multiplayer Memory Component ───────────────────────────
function MemoryMultiplayer({ roomId, role: initialRole }: { roomId: string; role: "host" | "participant" }) {
    const [playerName, setPlayerName] = useState("");
    const [nameSet, setNameSet] = useState(initialRole === "host");

    const {
        room, participants, clientId, sendMessage, updateGameState, setStatus, updateParticipantScore,
    } = useBroadcastRoom<MemoryGameState>({
        roomId,
        gameId: "memory",
        role: initialRole,
        playerName: initialRole === "host" ? "Host" : playerName,
        initialGameState: INITIAL_STATE,
    });

    const roomUrl = buildRoomUrl("de", "memory", roomId, "participant");
    const gameState = room?.gameState ?? INITIAL_STATE;
    const isMyTurn = gameState.currentTurn === clientId;
    const currentPlayerName = participants.find((p) => p.id === gameState.currentTurn)?.name ??
        (gameState.currentTurn === room?.host.id ? room?.host.name : "...");

    const handleNameSubmit = useCallback((name: string) => {
        setPlayerName(name);
        setNameSet(true);
    }, []);

    const startGame = useCallback(() => {
        const deck = buildDeck();
        const allPlayerIds = [room?.host.id ?? clientId, ...participants.map((p) => p.id)];
        const scores: Record<string, number> = {};
        allPlayerIds.forEach((id) => { if (id) scores[id] = 0; });
        const firstTurn = allPlayerIds[0] || clientId;

        setStatus("running");
        updateGameState(() => ({
            board: deck,
            currentTurn: firstTurn,
            scores,
            selected: [],
            matchedPairs: 0,
            totalPairs: PAIRS.length,
        }));
    }, [room, participants, clientId, setStatus, updateGameState]);

    const flipCard = useCallback((uid: string) => {
        if (!isMyTurn && initialRole !== "host") return;

        const card = gameState.board.find((c) => c.uid === uid);
        if (!card || card.faceUp || card.matched) return;
        if (gameState.selected.length >= 2) return;

        // If host is the one playing, handle directly. Otherwise send action.
        if (initialRole === "host" || isMyTurn) {
            updateGameState((prev) => {
                const nextBoard = prev.board.map((c) =>
                    c.uid === uid ? { ...c, faceUp: true } : c
                );
                const nextSelected = [...prev.selected, uid];

                if (nextSelected.length === 2) {
                    // Check for match after a delay – we set selected and flip, then process
                    const [firstId, secondId] = nextSelected;
                    const first = nextBoard.find((c) => c.uid === firstId);
                    const second = nextBoard.find((c) => c.uid === secondId);

                    if (first && second && first.pairId === second.pairId) {
                        // Match!
                        const matchedBoard = nextBoard.map((c) =>
                            c.uid === firstId || c.uid === secondId ? { ...c, matched: true } : c
                        );
                        return {
                            ...prev,
                            board: matchedBoard,
                            selected: [],
                            scores: {
                                ...prev.scores,
                                [prev.currentTurn]: (prev.scores[prev.currentTurn] || 0) + 10,
                            },
                            matchedPairs: prev.matchedPairs + 1,
                        };
                    } else {
                        // No match – will flip back after delay (handled in effect)
                        return { ...prev, board: nextBoard, selected: nextSelected };
                    }
                }

                return { ...prev, board: nextBoard, selected: nextSelected };
            });
        }
    }, [isMyTurn, initialRole, gameState, updateGameState]);

    // Auto-flip back unmatched cards and advance turn
    useEffect(() => {
        if (gameState.selected.length !== 2) return;

        const [firstId, secondId] = gameState.selected;
        const first = gameState.board.find((c) => c.uid === firstId);
        const second = gameState.board.find((c) => c.uid === secondId);

        if (first && second && first.pairId !== second.pairId) {
            const timeout = setTimeout(() => {
                if (initialRole === "host") {
                    const allPlayerIds = [room?.host.id ?? clientId, ...participants.map((p) => p.id)];
                    const currentIdx = allPlayerIds.indexOf(gameState.currentTurn);
                    const nextTurn = allPlayerIds[(currentIdx + 1) % allPlayerIds.length];

                    updateGameState((prev) => ({
                        ...prev,
                        board: prev.board.map((c) =>
                            c.uid === firstId || c.uid === secondId ? { ...c, faceUp: false } : c
                        ),
                        selected: [],
                        currentTurn: nextTurn,
                    }));
                }
            }, 1200);
            return () => clearTimeout(timeout);
        }
    }, [gameState.selected, gameState.board, gameState.currentTurn, initialRole, room, participants, clientId, updateGameState]);

    // Check game end
    useEffect(() => {
        if (gameState.matchedPairs === gameState.totalPairs && gameState.totalPairs > 0) {
            // Update participant scores from gameState
            Object.entries(gameState.scores).forEach(([pid, score]) => {
                const p = participants.find((pp) => pp.id === pid);
                if (p) updateParticipantScore(pid, score);
            });
            if (initialRole === "host") {
                setTimeout(() => setStatus("finished"), 1500);
            }
        }
    }, [gameState.matchedPairs, gameState.totalPairs, gameState.scores, participants, initialRole, updateParticipantScore, setStatus]);

    const playAgain = useCallback(() => {
        participants.forEach((p) => updateParticipantScore(p.id, 0));
        setStatus("lobby");
        updateGameState(() => INITIAL_STATE);
    }, [participants, updateParticipantScore, setStatus, updateGameState]);

    // Name input
    if (!nameSet) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
                <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={false} participants={participants}
                    hostName={room?.host.name ?? "Host"} onStart={() => {}} onNameSubmit={handleNameSubmit} showNameInput />
            </div>
        );
    }

    // Lobby
    if (room?.status === "lobby") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/games"><Button variant="ghost" className="gap-2 text-white hover:bg-white/20"><ArrowLeft className="w-4 h-4" /> Zurück</Button></Link>
                </div>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Brain className="w-8 h-8 text-brand-lime" /> Multiplayer Memory
                </motion.div>
                <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={initialRole === "host"} participants={participants}
                    hostName={room?.host.name ?? "Host"} onStart={startGame} />
            </div>
        );
    }

    // Finished
    if (room?.status === "finished") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
                <Scoreboard participants={participants} hostName={room?.host.name ?? "Host"} isHost={initialRole === "host"} onPlayAgain={playAgain} />
            </div>
        );
    }

    // Game board
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-4">
            <div className="max-w-4xl mx-auto">
                {/* Turn indicator */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 text-center py-3 px-6 rounded-2xl border backdrop-blur-sm ${
                        isMyTurn ? "bg-brand-lime/10 border-brand-lime/30 text-brand-lime" : "bg-white/5 border-white/10 text-white/60"
                    }`}>
                    <span className="font-bold text-lg">
                        {isMyTurn ? "🎯 Du bist dran!" : `⏳ ${currentPlayerName} ist dran...`}
                    </span>
                </motion.div>

                {/* Score display */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    {Object.entries(gameState.scores).map(([pid, score]) => {
                        const name = participants.find((p) => p.id === pid)?.name ??
                            (pid === room?.host.id ? room?.host.name : "?");
                        const isActive = pid === gameState.currentTurn;
                        return (
                            <div key={pid} className={`flex-shrink-0 px-4 py-2 rounded-xl border text-sm font-bold ${
                                isActive ? "bg-brand-lime/10 border-brand-lime/30 text-brand-lime" : "bg-white/5 border-white/10 text-white/60"
                            }`}>
                                {name}: {score}
                            </div>
                        );
                    })}
                    <div className="flex-shrink-0 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm">
                        {gameState.matchedPairs}/{gameState.totalPairs} Paare
                    </div>
                </div>

                {/* Card grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {gameState.board.map((card) => {
                        const pair = PAIRS.find((p) => p.id === card.pairId);
                        if (!pair) return null;
                        const isActive = card.faceUp || card.matched;
                        const canClick = isMyTurn && !card.faceUp && !card.matched && gameState.selected.length < 2;

                        return (
                            <motion.button
                                key={card.uid}
                                whileHover={canClick ? { scale: 1.02 } : {}}
                                whileTap={canClick ? { scale: 0.98 } : {}}
                                onClick={() => flipCard(card.uid)}
                                disabled={!canClick}
                                className="group relative aspect-[4/5] rounded-[20px] text-left outline-none"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {isActive ? (
                                        <motion.div
                                            key="front"
                                            initial={{ rotateY: -90, opacity: 0.35 }}
                                            animate={{ rotateY: 0, opacity: 1 }}
                                            exit={{ rotateY: 90, opacity: 0.35 }}
                                            transition={{ duration: 0.22 }}
                                            className={`absolute inset-0 rounded-[20px] border ${card.matched ? "border-emerald-400/40" : "border-white/10"
                                            } bg-gradient-to-br ${pair.accent} p-3 shadow-lg backdrop-blur`}
                                        >
                                            <div className="flex h-full flex-col justify-between">
                                                <div className="flex items-start justify-between">
                                                    {card.matched && (
                                                        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-200">✓</span>
                                                    )}
                                                </div>
                                                <div className="text-lg font-semibold leading-tight">{pair.title}</div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="back"
                                            initial={{ rotateY: 90, opacity: 0.35 }}
                                            animate={{ rotateY: 0, opacity: 1 }}
                                            exit={{ rotateY: -90, opacity: 0.35 }}
                                            transition={{ duration: 0.22 }}
                                            className={`absolute inset-0 rounded-[20px] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-3 shadow-lg ${
                                                canClick ? "cursor-pointer hover:border-brand-lime/30" : "opacity-70"
                                            }`}
                                        >
                                            <div className="flex h-full items-center justify-center">
                                                <ShieldCheck className="h-8 w-8 text-white/30" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── Page ────────────────────────────────────────────────────
function MemoryPageInner() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("room");
    const role = searchParams.get("role") as "host" | "participant" | null;

    if (roomId && (role === "host" || role === "participant")) {
        return (
            <RoleGuard requiredRole="user">
                <MemoryMultiplayer roomId={roomId} role={role} />
            </RoleGuard>
        );
    }

    // Singleplayer (unchanged)
    return (
        <RoleGuard requiredRole="user">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <Link href="/games">
                        <Button aria-label="Zurück" variant="outline" size="icon" className="h-10 w-10 shrink-0 border-white/20 text-white hover:bg-white/10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                            <span className="text-4xl drop-shadow-sm">🧠</span> THITRONIK-Memory
                        </h1>
                        <p className="text-white/60 mt-1">Spielerisches Erlernen von Unternehmenswissen. Finde alle passenden Paare!</p>
                    </div>
                </div>
                <div className="mt-8" style={{ height: "calc(100vh - 250px)", minHeight: "600px" }}>
                    <ThitronikMemory />
                </div>
            </div>
        </RoleGuard>
    );
}

export default function MemoryQuizPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950" />}>
            <MemoryPageInner />
        </Suspense>
    );
}
