"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, Suspense } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { SalesSimulator } from "@/components/games/sales-simulator";
import { useBroadcastRoom } from "@/lib/multiplayer/useBroadcastRoom";
import { RoomLobby } from "@/lib/multiplayer/RoomLobby";
import { Scoreboard } from "@/lib/multiplayer/Scoreboard";
import { buildRoomUrl } from "@/lib/multiplayer/roomUtils";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Scenarios for multiplayer sales challenge
const SCENARIOS = [
    {
        id: "reklamation",
        title: "Reklamation: Fehlalarm",
        customer: "Herr Müller ruft an – sein WiPro III löst seit einer Woche wiederholt Fehlalarme aus.",
        options: [
            { text: "Sofort einen Techniker beauftragen", points: 30 },
            { text: "Fragen, wann und wo der Alarm auslöst, und Sensoren prüfen lassen", points: 100 },
            { text: "Ihm ein neues Gerät anbieten", points: 20 },
            { text: "Daten per App auslesen und Diagnose stellen", points: 80 },
        ],
        bestAnswer: 1,
    },
    {
        id: "upselling",
        title: "Upselling: Nachrüstung",
        customer: "Ein Händler möchte WiPro III in ein älteres Wohnmobil nachrüsten. Budget ist eng.",
        options: [
            { text: "Nur Basispaket ohne Erklärung anbieten", points: 20 },
            { text: "Gesamtkonzept mit Finanzierungsoptionen erklären", points: 100 },
            { text: "Abwinken – zu aufwändig für altes Fahrzeug", points: 0 },
            { text: "Pro-finder als sinnvolle Ergänzung vorschlagen", points: 70 },
        ],
        bestAnswer: 1,
    },
];

interface SalesGameState {
    phase: "waiting" | "scenario" | "results" | "finished";
    currentScenario: number;
    choices: Record<string, number>; // participantId → chosen option index
}

const INITIAL_STATE: SalesGameState = { phase: "waiting", currentScenario: 0, choices: {} };

function SalesMultiplayer({ roomId, role: initialRole }: { roomId: string; role: "host" | "participant" }) {
    const [playerName, setPlayerName] = useState("");
    const [nameSet, setNameSet] = useState(initialRole === "host");
    const [chosen, setChosen] = useState(false);

    const { room, participants, clientId, sendMessage, updateGameState, setStatus, updateParticipantScore } =
        useBroadcastRoom<SalesGameState>({
            roomId, gameId: "sales-simulator", role: initialRole,
            playerName: initialRole === "host" ? "Host" : playerName,
            initialGameState: INITIAL_STATE,
        });

    const roomUrl = buildRoomUrl("de", "sales-simulator", roomId, "participant");
    const gameState = room?.gameState ?? INITIAL_STATE;
    const scenario = SCENARIOS[Math.min(gameState.currentScenario, SCENARIOS.length - 1)];

    const handleNameSubmit = useCallback((name: string) => { setPlayerName(name); setNameSet(true); }, []);

    const startGame = useCallback(() => {
        setStatus("running");
        setChosen(false);
        updateGameState(() => ({ phase: "scenario", currentScenario: 0, choices: {} }));
    }, [setStatus, updateGameState]);

    const chooseOption = useCallback((idx: number) => {
        setChosen(true);
        updateGameState((prev) => ({ ...prev, choices: { ...prev.choices, [clientId]: idx } }));
    }, [clientId, updateGameState]);

    const revealResults = useCallback(() => {
        Object.entries(gameState.choices).forEach(([pid, optIdx]) => {
            const points = scenario.options[optIdx]?.points ?? 0;
            const p = participants.find((pp) => pp.id === pid);
            if (p) updateParticipantScore(pid, (p.score || 0) + points);
        });
        updateGameState((prev) => ({ ...prev, phase: "results" }));
    }, [gameState.choices, scenario, participants, updateParticipantScore, updateGameState]);

    const nextScenario = useCallback(() => {
        const nextIdx = gameState.currentScenario + 1;
        setChosen(false);
        if (nextIdx >= SCENARIOS.length) {
            updateGameState((prev) => ({ ...prev, phase: "finished" }));
            setStatus("finished");
        } else {
            updateGameState(() => ({ phase: "scenario", currentScenario: nextIdx, choices: {} }));
        }
    }, [gameState.currentScenario, updateGameState, setStatus]);

    const playAgain = useCallback(() => {
        participants.forEach((p) => updateParticipantScore(p.id, 0));
        setStatus("lobby");
        setChosen(false);
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
                    <Briefcase className="w-8 h-8 text-brand-lime" /> Multiplayer Sales Simulator
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

    const choiceCount = Object.keys(gameState.choices).length;

    // Results
    if (gameState.phase === "results") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2744] text-white p-6">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold mb-2">{scenario.title}</h2>
                    <p className="text-white/50 text-sm mb-6">{scenario.customer}</p>
                    <div className="space-y-3 mb-6">
                        {scenario.options.map((opt, i) => {
                            const isBest = i === scenario.bestAnswer;
                            const voterNames = Object.entries(gameState.choices)
                                .filter(([, idx]) => idx === i)
                                .map(([pid]) => participants.find((p) => p.id === pid)?.name ?? "?");
                            return (
                                <div key={i} className={`p-4 rounded-xl border ${isBest ? "bg-brand-lime/10 border-brand-lime/30" : "bg-white/5 border-white/10"}`}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{opt.text}</span>
                                        <span className={`text-xs font-bold ${isBest ? "text-brand-lime" : "text-white/40"}`}>{opt.points} Pkt</span>
                                    </div>
                                    {voterNames.length > 0 && <p className="text-xs text-white/40">→ {voterNames.join(", ")}</p>}
                                </div>
                            );
                        })}
                    </div>
                    {initialRole === "host" && (
                        <Button onClick={nextScenario} className="w-full bg-brand-lime text-brand-navy font-bold">
                            {gameState.currentScenario + 1 >= SCENARIOS.length ? "Endstand 🏆" : "Nächstes Szenario →"}
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // Scenario phase
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2744] text-white p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-white/50">Szenario {gameState.currentScenario + 1}/{SCENARIOS.length}</div>
                    <div className="text-sm text-white/50">{choiceCount} Antworten</div>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
                    <div className="flex items-center gap-2 text-brand-lime text-sm font-bold mb-3">
                        <MessageSquare className="w-4 h-4" /> {scenario.title}
                    </div>
                    <p className="text-white/80 text-lg leading-relaxed italic">"{scenario.customer}"</p>
                </motion.div>

                <p className="text-white/40 text-sm mb-4">Wie reagierst du?</p>

                <div className="space-y-3 mb-6">
                    {scenario.options.map((opt, i) => {
                        const isChosen = gameState.choices[clientId] === i;
                        return (
                            <motion.button
                                key={i}
                                whileHover={!chosen ? { scale: 1.01 } : {}}
                                whileTap={!chosen ? { scale: 0.99 } : {}}
                                onClick={() => !chosen && chooseOption(i)}
                                disabled={chosen}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${
                                    isChosen ? "bg-brand-lime/10 border-brand-lime/30" :
                                    chosen ? "bg-white/3 border-white/5 opacity-50" :
                                    "bg-white/10 border-white/20 hover:bg-white/15"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">{String.fromCharCode(65 + i)}</span>
                                    <span className="text-sm font-medium">{opt.text}</span>
                                    {isChosen && <CheckCircle2 className="w-4 h-4 text-brand-lime ml-auto" />}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {chosen && (
                    <div className="text-center py-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                            <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
                            <span className="text-white/60 text-sm">Antwort abgegeben – warte auf Auswertung...</span>
                        </div>
                    </div>
                )}

                {initialRole === "host" && choiceCount > 0 && (
                    <Button onClick={revealResults} className="w-full bg-brand-lime text-brand-navy font-bold mt-3">
                        Auswertung anzeigen ({choiceCount} Antworten)
                    </Button>
                )}
            </div>
        </div>
    );
}

function SalesSimulatorPageInner() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("room");
    const role = searchParams.get("role") as "host" | "participant" | null;

    if (roomId && (role === "host" || role === "participant")) {
        return <RoleGuard requiredRole="user"><SalesMultiplayer roomId={roomId} role={role} /></RoleGuard>;
    }

    return (
        <RoleGuard requiredRole="user">
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <Link href="/games"><Button aria-label="Zurück" variant="outline" size="icon" className="h-10 w-10 shrink-0 border-white/20 text-white hover:bg-white/10"><ArrowLeft className="h-5 w-5" /></Button></Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-white"><span className="text-4xl">💼</span> Sales Simulator</h1>
                        <p className="text-white/60 mt-1">Trainieren Sie Kundengesprächssituationen im Team</p>
                    </div>
                </div>
                <SalesSimulator />
            </div>
        </RoleGuard>
    );
}

export default function SalesSimulatorPage() {
    return <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2744]" />}><SalesSimulatorPageInner /></Suspense>;
}
