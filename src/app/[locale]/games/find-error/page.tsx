"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, Suspense } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { FindErrorQuiz } from "@/components/tools/find-error-quiz";
import { useBroadcastRoom } from "@/lib/multiplayer/useBroadcastRoom";
import { RoomLobby } from "@/lib/multiplayer/RoomLobby";
import { Scoreboard } from "@/lib/multiplayer/Scoreboard";
import { buildRoomUrl } from "@/lib/multiplayer/roomUtils";
import { MSG } from "@/lib/multiplayer/types";
import { motion } from "framer-motion";
import { ArrowLeft, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Error zones matching the singleplayer component
const ERROR_ZONES = [
    { id: "error-1", x: 65, y: 35, w: 8, h: 8, isError: true, desc: "Massekabel an Pluspol angeschlossen!" },
    { id: "error-2", x: 25, y: 70, w: 10, h: 10, isError: true, desc: "CAN-Bus Stecker im falschen Port!" },
    { id: "decoy-1", x: 40, y: 40, w: 15, h: 15, isError: false, desc: "WiPro III Zentrale – alles korrekt." },
    { id: "decoy-2", x: 80, y: 80, w: 12, h: 12, isError: false, desc: "Fahrzeugbatterie – Verkabelung intakt." },
];

const TOTAL_ERRORS = ERROR_ZONES.filter((z) => z.isError).length;

interface FindErrorGameState {
    phase: "waiting" | "playing" | "finished";
    found: Record<string, string[]>; // participantId → found error IDs
    clicks: Record<string, Array<{ zoneId: string; timestamp: number }>>;
}

const INITIAL_STATE: FindErrorGameState = { phase: "waiting", found: {}, clicks: {} };

function FindErrorMultiplayer({ roomId, role: initialRole }: { roomId: string; role: "host" | "participant" }) {
    const [playerName, setPlayerName] = useState("");
    const [nameSet, setNameSet] = useState(initialRole === "host");
    const [feedback, setFeedback] = useState<string | null>(null);

    const { room, participants, clientId, sendMessage, updateGameState, setStatus, updateParticipantScore } =
        useBroadcastRoom<FindErrorGameState>({
            roomId, gameId: "find-error", role: initialRole,
            playerName: initialRole === "host" ? "Host" : playerName,
            initialGameState: INITIAL_STATE,
        });

    const roomUrl = buildRoomUrl("de", "find-error", roomId, "participant");
    const gameState = room?.gameState ?? INITIAL_STATE;
    const myFound = gameState.found[clientId] ?? [];

    const handleNameSubmit = useCallback((name: string) => { setPlayerName(name); setNameSet(true); }, []);

    const startGame = useCallback(() => {
        setStatus("running");
        updateGameState(() => ({ phase: "playing", found: {}, clicks: {} }));
    }, [setStatus, updateGameState]);

    const handleZoneClick = useCallback((zone: typeof ERROR_ZONES[0]) => {
        if (gameState.phase !== "playing") return;

        if (zone.isError) {
            if (!myFound.includes(zone.id)) {
                setFeedback(`✅ ${zone.desc}`);
                updateGameState((prev) => {
                    const newFound = { ...prev.found, [clientId]: [...(prev.found[clientId] ?? []), zone.id] };
                    return { ...prev, found: newFound };
                });
                // Score: first to find gets more points
                const allFoundThis = Object.values(gameState.found).flat().filter((id) => id === zone.id).length;
                const points = allFoundThis === 0 ? 500 : 250; // first finder gets bonus
                const p = participants.find((pp) => pp.id === clientId);
                if (p) updateParticipantScore(clientId, (p.score || 0) + points);
            }
        } else {
            setFeedback(`ℹ️ ${zone.desc}`);
        }
        setTimeout(() => setFeedback(null), 3000);
    }, [gameState, myFound, clientId, participants, updateGameState, updateParticipantScore]);

    // Check if all errors found by any player
    const allErrorsFound = ERROR_ZONES.filter((z) => z.isError).every((z) =>
        Object.values(gameState.found).flat().includes(z.id)
    );

    const finishGame = useCallback(() => {
        updateGameState((prev) => ({ ...prev, phase: "finished" }));
        setStatus("finished");
    }, [updateGameState, setStatus]);

    const playAgain = useCallback(() => {
        participants.forEach((p) => updateParticipantScore(p.id, 0));
        setStatus("lobby");
        setFeedback(null);
        updateGameState(() => INITIAL_STATE);
    }, [participants, updateParticipantScore, setStatus, updateGameState]);

    if (!nameSet) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
                <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={false} participants={participants}
                    hostName={room?.host.name ?? "Host"} onStart={() => {}} onNameSubmit={handleNameSubmit} showNameInput />
            </div>
        );
    }

    if (room?.status === "lobby" || gameState.phase === "waiting") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/games"><Button variant="ghost" className="gap-2 text-white hover:bg-white/20"><ArrowLeft className="w-4 h-4" /> Zurück</Button></Link>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Search className="w-8 h-8 text-brand-lime" /> Multiplayer Fehlersuche
                </motion.div>
                <RoomLobby roomId={roomId} roomUrl={roomUrl} isHost={initialRole === "host"} participants={participants}
                    hostName={room?.host.name ?? "Host"} onStart={startGame} />
            </div>
        );
    }

    if (room?.status === "finished" || gameState.phase === "finished") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
                <Scoreboard participants={participants} hostName={room?.host.name ?? "Host"} isHost={initialRole === "host"} onPlayAgain={playAgain} />
            </div>
        );
    }

    // Playing phase
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Search className="w-5 h-5 text-brand-lime" /> Race: Finde die Fehler!
                    </h2>
                    <div className="text-sm text-white/60">{myFound.length}/{TOTAL_ERRORS} gefunden</div>
                </div>

                {/* Live found indicators */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {participants.map((p) => {
                        const pFound = gameState.found[p.id]?.length ?? 0;
                        return (
                            <div key={p.id} className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-xs font-bold">
                                {p.name}: {pFound}/{TOTAL_ERRORS}
                            </div>
                        );
                    })}
                </div>

                {/* Diagram with clickable zones */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-800 border border-white/10">
                    <img src="/wiring_diagram_error.png" alt="Schaltplan" className="w-full h-auto max-h-[500px] object-contain" />
                    {ERROR_ZONES.map((zone) => {
                        const isFound = myFound.includes(zone.id);
                        return (
                            <div
                                key={zone.id}
                                onClick={() => handleZoneClick(zone)}
                                className={`absolute cursor-pointer border-2 rounded-lg transition-all hover:bg-white/10 ${
                                    isFound && zone.isError ? "border-brand-lime bg-brand-lime/20" : "border-transparent"
                                }`}
                                style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
                            >
                                {isFound && zone.isError && (
                                    <div className="absolute -top-2 -right-2"><CheckCircle2 className="w-5 h-5 text-brand-lime" /></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Feedback toast */}
                {feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-white/10 border border-white/10 text-sm font-medium">
                        {feedback}
                    </motion.div>
                )}

                {initialRole === "host" && allErrorsFound && (
                    <Button onClick={finishGame} className="w-full mt-4 bg-brand-lime text-brand-navy font-bold">Spiel beenden 🏆</Button>
                )}
            </div>
        </div>
    );
}

function FindErrorPageInner() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("room");
    const role = searchParams.get("role") as "host" | "participant" | null;

    if (roomId && (role === "host" || role === "participant")) {
        return <RoleGuard requiredRole="user"><FindErrorMultiplayer roomId={roomId} role={role} /></RoleGuard>;
    }

    return (
        <RoleGuard requiredRole="user">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <Link href="/games"><Button aria-label="Zurück" variant="outline" size="icon" className="h-10 w-10 shrink-0 border-white/20 text-white hover:bg-white/10"><ArrowLeft className="h-5 w-5" /></Button></Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-white"><span className="text-4xl drop-shadow-sm">🔍</span> Finde den Fehler</h1>
                        <p className="text-white/60 mt-1">Interaktives Training zur Fehlerdiagnose und Schaltplan-Analyse</p>
                    </div>
                </div>
                <div className="mt-8"><FindErrorQuiz /></div>
            </div>
        </RoleGuard>
    );
}

export default function FindErrorQuizPage() {
    return <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950" />}><FindErrorPageInner /></Suspense>;
}
