"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, Suspense } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { OrderQuiz } from "@/components/tools/order-quiz";
import { useBroadcastRoom } from "@/lib/multiplayer/useBroadcastRoom";
import { RoomLobby } from "@/lib/multiplayer/RoomLobby";
import { Scoreboard } from "@/lib/multiplayer/Scoreboard";
import { buildRoomUrl } from "@/lib/multiplayer/roomUtils";
import { MSG } from "@/lib/multiplayer/types";
import { ArrowLeft, ListOrdered, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Simplified items for multiplayer mode
const ORDER_ITEMS = [
    { id: "s1", label: "Montageort festlegen und Fahrzeug prüfen" },
    { id: "s2", label: "Material und Werkzeug vorbereiten" },
    { id: "s3", label: "Bauteil sicher montieren" },
    { id: "s4", label: "Elektrisch anschließen" },
    { id: "s5", label: "Funktionstest durchführen" },
    { id: "s6", label: "Einbau dokumentieren" },
];

const CORRECT_ORDER = ["s1", "s2", "s3", "s4", "s5", "s6"];

interface OrderGameState {
    round: number;
    phase: "waiting" | "playing" | "results" | "finished";
    submissions: Record<string, string[]>; // participantId → submitted order
    roundStartedAt: number;
    timeLimit: number; // seconds
}

const INITIAL_STATE: OrderGameState = {
    round: 0,
    phase: "waiting",
    submissions: {},
    roundStartedAt: 0,
    timeLimit: 60,
};

function shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function OrderMultiplayer({ roomId, role: initialRole }: { roomId: string; role: "host" | "participant" }) {
    const [playerName, setPlayerName] = useState("");
    const [nameSet, setNameSet] = useState(initialRole === "host");
    const [localOrder, setLocalOrder] = useState<string[]>(CORRECT_ORDER);
    const [submitted, setSubmitted] = useState(false);

    const { room, participants, clientId, sendMessage, updateGameState, setStatus, updateParticipantScore } =
        useBroadcastRoom<OrderGameState>({
            roomId, gameId: "order", role: initialRole,
            playerName: initialRole === "host" ? "Host" : playerName,
            initialGameState: INITIAL_STATE,
        });

    const roomUrl = buildRoomUrl("de", "order", roomId, "participant");
    const gameState = room?.gameState ?? INITIAL_STATE;

    const handleNameSubmit = useCallback((name: string) => { setPlayerName(name); setNameSet(true); }, []);

    const startGame = useCallback(() => {
        setStatus("running");
        setLocalOrder(shuffleArray(CORRECT_ORDER));
        setSubmitted(false);
        updateGameState(() => ({
            round: 1, phase: "playing", submissions: {}, roundStartedAt: Date.now(), timeLimit: 60,
        }));
    }, [setStatus, updateGameState]);

    const moveItem = (fromIdx: number, toIdx: number) => {
        if (submitted) return;
        setLocalOrder((prev) => {
            const next = [...prev];
            const [item] = next.splice(fromIdx, 1);
            next.splice(toIdx, 0, item);
            return next;
        });
    };

    const submitOrder = useCallback(() => {
        setSubmitted(true);
        sendMessage(MSG.GAME_ACTION, { action: "submit-order", data: { participantId: clientId, order: localOrder } });
        updateGameState((prev) => ({
            ...prev,
            submissions: { ...prev.submissions, [clientId]: localOrder },
        }));
    }, [localOrder, clientId, sendMessage, updateGameState]);

    const revealResults = useCallback(() => {
        // Score: count correct positions
        Object.entries(gameState.submissions).forEach(([pid, order]) => {
            const correct = order.filter((id, i) => id === CORRECT_ORDER[i]).length;
            const score = Math.round((correct / CORRECT_ORDER.length) * 1000);
            const p = participants.find((pp) => pp.id === pid);
            if (p) updateParticipantScore(pid, (p.score || 0) + score);
        });
        updateGameState((prev) => ({ ...prev, phase: "results" }));
    }, [gameState.submissions, participants, updateParticipantScore, updateGameState]);

    const finishGame = useCallback(() => {
        updateGameState((prev) => ({ ...prev, phase: "finished" }));
        setStatus("finished");
    }, [updateGameState, setStatus]);

    const playAgain = useCallback(() => {
        participants.forEach((p) => updateParticipantScore(p.id, 0));
        setStatus("lobby");
        setSubmitted(false);
        setLocalOrder(shuffleArray(CORRECT_ORDER));
        updateGameState(() => INITIAL_STATE);
    }, [participants, updateParticipantScore, setStatus, updateGameState]);

    if (!nameSet) {
        return (
            <div className="min-h-screen bg-[#1D3661] flex items-center justify-center p-4">
                <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={false} participants={participants}
                    hostName={room?.host.name ?? "Host"} onStart={() => {}} onNameSubmit={handleNameSubmit} showNameInput />
            </div>
        );
    }

    if (room?.status === "lobby" || gameState.phase === "waiting") {
        return (
            <div className="min-h-screen bg-[#1D3661] flex flex-col items-center justify-center p-4">
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/games"><Button variant="ghost" className="gap-2 text-white hover:bg-white/20"><ArrowLeft className="w-4 h-4" /> Zurück</Button></Link>
                </div>
                <div className="text-3xl font-bold text-white mb-6 flex items-center gap-3 animate-[fade-in_0.3s_ease-out]">
                    <ListOrdered className="w-8 h-8 text-brand-lime" /> Multiplayer Reihenfolge-Quiz
                </div>
                <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={initialRole === "host"} participants={participants}
                    hostName={room?.host.name ?? "Host"} onStart={startGame} />
            </div>
        );
    }

    if (room?.status === "finished" || gameState.phase === "finished") {
        return (
            <div className="min-h-screen bg-[#1D3661] flex items-center justify-center p-4">
                <Scoreboard participants={participants} hostName={room?.host.name ?? "Host"} isHost={initialRole === "host"} onPlayAgain={playAgain} />
            </div>
        );
    }

    // Results phase
    if (gameState.phase === "results") {
        return (
            <div className="min-h-screen bg-[#1D3661] text-white p-6 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6">📊 Ergebnisse</h2>
                <div className="max-w-lg w-full space-y-4 mb-8">
                    {Object.entries(gameState.submissions).map(([pid, order]) => {
                        const name = participants.find((p) => p.id === pid)?.name ?? (pid === room?.host.id ? room?.host.name : "?");
                        const correct = order.filter((id, i) => id === CORRECT_ORDER[i]).length;
                        return (
                            <div key={pid} className="bg-white/10 rounded-xl p-4 border border-white/10">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold">{name}</span>
                                    <span className="text-brand-lime font-bold">{correct}/{CORRECT_ORDER.length} richtig</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-lime rounded-full transition-all" style={{ width: `${(correct / CORRECT_ORDER.length) * 100}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="text-sm text-white/50 mb-4">Richtige Reihenfolge:</div>
                <div className="max-w-lg w-full space-y-2 mb-8">
                    {CORRECT_ORDER.map((id, i) => {
                        const item = ORDER_ITEMS.find((it) => it.id === id);
                        return (
                            <div key={id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                                <span className="w-8 h-8 rounded-lg bg-brand-lime/20 text-brand-lime font-bold flex items-center justify-center text-sm">{i + 1}</span>
                                <span className="text-sm">{item?.label}</span>
                            </div>
                        );
                    })}
                </div>
                {initialRole === "host" && (
                    <Button onClick={finishGame} className="bg-brand-lime text-brand-navy font-bold">Endstand anzeigen 🏆</Button>
                )}
            </div>
        );
    }

    // Playing phase
    const submissionCount = Object.keys(gameState.submissions).length;
    return (
        <div className="min-h-screen bg-[#1D3661] text-white p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ListOrdered className="w-5 h-5 text-brand-lime" /> Runde {gameState.round}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-white/60">
                        <Clock className="w-4 h-4" />
                        {submissionCount}/{participants.length + 1} abgegeben
                    </div>
                </div>

                <p className="text-white/60 text-sm mb-4">Bringe die Schritte in die richtige Reihenfolge:</p>

                <div className="space-y-2 mb-6">
                    {localOrder.map((id, idx) => {
                        const item = ORDER_ITEMS.find((it) => it.id === id);
                        return (
                            <div key={id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                                submitted ? "bg-white/5 border-white/10 opacity-60" : "bg-white/10 border-white/20 hover:bg-white/15"
                            }`}>
                                <span className="w-8 h-8 rounded-lg bg-white/10 font-bold flex items-center justify-center text-sm shrink-0">{idx + 1}</span>
                                <span className="flex-1 text-sm font-medium">{item?.label}</span>
                                {!submitted && (
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => moveItem(idx, Math.max(0, idx - 1))} disabled={idx === 0}
                                            className="px-2 py-1 rounded bg-white/10 text-xs disabled:opacity-30 hover:bg-white/20">↑</button>
                                        <button onClick={() => moveItem(idx, Math.min(localOrder.length - 1, idx + 1))} disabled={idx === localOrder.length - 1}
                                            className="px-2 py-1 rounded bg-white/10 text-xs disabled:opacity-30 hover:bg-white/20">↓</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {!submitted ? (
                    <Button onClick={submitOrder} className="w-full bg-brand-lime text-brand-navy font-bold py-6 text-lg">
                        <CheckCircle2 className="w-5 h-5 mr-2" /> Reihenfolge abgeben
                    </Button>
                ) : (
                    <div className="text-center py-4">
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20">
                            <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
                            <span className="text-white/60 text-sm">Abgegeben – warte auf andere Spieler...</span>
                        </div>
                    </div>
                )}

                {initialRole === "host" && submissionCount > 0 && (
                    <Button onClick={revealResults} variant="outline" className="w-full mt-3 border-white/20 text-white hover:bg-white/10">
                        Auswertung starten ({submissionCount} Abgaben)
                    </Button>
                )}
            </div>
        </div>
    );
}

function OrderPageInner() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("room");
    const role = searchParams.get("role") as "host" | "participant" | null;

    if (roomId && (role === "host" || role === "participant")) {
        return <RoleGuard requiredRole="user"><OrderMultiplayer roomId={roomId} role={role} /></RoleGuard>;
    }

    return (
        <RoleGuard requiredRole="user">
            <div className="bg-[#F0F0F0] min-h-screen">
                <div className="container mx-auto py-8"><OrderQuiz /></div>
            </div>
        </RoleGuard>
    );
}

export default function OrderQuizPage() {
    return <Suspense fallback={<div className="min-h-screen bg-[#1D3661]" />}><OrderPageInner /></Suspense>;
}
