"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ----------------------------------------------------------------------
// TYPES & CONSTANTS
// ----------------------------------------------------------------------

const STORAGE_PREFIX = "menti-mp-room-v1:";
const CHANNEL_NAME = "menti-mp-sync-v1";
const PRESENCE_TTL = 15000;
const HEARTBEAT_MS = 3000;

const COLORS = [
    "#00C9FF",
    "#FF6B9D",
    "#FFD166",
    "#4ECDC4",
    "#A78BFA",
    "#FF6B6B",
    "#06D6A0",
    "#F8961E",
];

const QTYPES = [
    { id: "multiple_choice", label: "Multiple Choice", emoji: "📊", color: "#00C9FF" },
    { id: "word_cloud", label: "Word Cloud", emoji: "☁️", color: "#4ECDC4" },
    { id: "open_ended", label: "Offene Frage", emoji: "💬", color: "#FFD166" },
    { id: "rating", label: "Bewertung", emoji: "⭐", color: "#A78BFA" },
];

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

function nowIso() {
    return new Date().toISOString();
}

function safeWindow() {
    return typeof window !== "undefined" ? window : null;
}

function getChannel() {
    const win = safeWindow() as any;
    if (!win || !("BroadcastChannel" in win)) return null;
    if (!win.__mentiDemoChannel) {
        win.__mentiDemoChannel = new BroadcastChannel(CHANNEL_NAME);
    }
    return win.__mentiDemoChannel;
}

function getStorageKey(code: string) {
    return `${STORAGE_PREFIX}${String(code || "").toUpperCase()}`;
}

function clone(value: any) {
    return JSON.parse(JSON.stringify(value));
}

function getClientId() {
    const win = safeWindow();
    if (!win) return `client_${uid()}`;
    const key = "menti-mp-client-id";
    let id = win.sessionStorage.getItem(key);
    if (!id) {
        id = `client_${uid()}`;
        win.sessionStorage.setItem(key, id);
    }
    return id;
}

function getSavedIdentity() {
    const win = safeWindow();
    if (!win) return null;
    try {
        const raw = win.sessionStorage.getItem("menti-mp-identity");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveIdentity(identity: any) {
    const win = safeWindow();
    if (!win) return;
    win.sessionStorage.setItem("menti-mp-identity", JSON.stringify(identity));
}

function clearIdentity() {
    const win = safeWindow();
    if (!win) return;
    win.sessionStorage.removeItem("menti-mp-identity");
}

function sanitizeRoom(room: any) {
    if (!room) return null;
    const next = clone(room);
    const cutoff = Date.now() - PRESENCE_TTL;
    next.questions = Array.isArray(next.questions) ? next.questions : [];
    next.responses = Array.isArray(next.responses) ? next.responses : [];
    next.presence = Object.fromEntries(
        Object.entries(next.presence || {}).filter(([, value]: [any, any]) => Number(value?.lastSeen || 0) >= cutoff),
    );
    if (next.activeQuestionId && !next.questions.some((question: any) => question.id === next.activeQuestionId)) {
        next.activeQuestionId = next.questions[0]?.id || null;
    }
    return next;
}

function readRoom(code: string) {
    const win = safeWindow();
    if (!win || !code) return null;
    try {
        const raw = win.localStorage.getItem(getStorageKey(code));
        return raw ? sanitizeRoom(JSON.parse(raw)) : null;
    } catch {
        return null;
    }
}

function writeRoom(room: any) {
    const win = safeWindow();
    if (!win || !room?.code) return;
    const next = sanitizeRoom({ ...room, updatedAt: nowIso() });
    win.localStorage.setItem(getStorageKey(next.code), JSON.stringify(next));
    const channel = getChannel();
    if (channel) {
        channel.postMessage({ type: "room-updated", code: next.code, timestamp: Date.now() });
    }
}

function mutateRoom(code: string, updater: (draft: any) => void) {
    const room = readRoom(code);
    if (!room) return null;
    const next = sanitizeRoom(room);
    updater(next);
    writeRoom(next);
    return next;
}

function generateRoomCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    do {
        code = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
    } while (readRoom(code));
    return code;
}

function starterQuestions() {
    return [
        {
            id: uid(),
            type: "multiple_choice",
            text: "Wie sicher fühlst du dich aktuell im Umgang mit Alarmanlagen?",
            options: ["Sehr sicher", "Eher sicher", "Unsicher"],
            isOpen: true,
            createdAt: nowIso(),
        },
        {
            id: uid(),
            type: "word_cloud",
            text: "Welches Stichwort verbindest du spontan mit Thitronik?",
            options: [],
            isOpen: true,
            createdAt: nowIso(),
        },
        {
            id: uid(),
            type: "rating",
            text: "Wie hilfreich war der heutige Teil bisher?",
            options: [],
            isOpen: true,
            createdAt: nowIso(),
        },
    ];
}

function createRoom() {
    const clientId = getClientId();
    const questions = starterQuestions();
    const room = {
        code: generateRoomCode(),
        title: "Thitronik LernCampus",
        createdAt: nowIso(),
        updatedAt: nowIso(),
        hostId: clientId,
        activeQuestionId: questions[0]?.id || null,
        questions,
        responses: [],
        presence: {},
    };
    writeRoom(room);
    return room;
}

function typeMeta(type: string) {
    return QTYPES.find((item) => item.id === type) || QTYPES[0];
}

function onlineMembers(room: any) {
    return Object.values(room?.presence || {}).sort((a: any, b: any) => (b.lastSeen || 0) - (a.lastSeen || 0));
}

function questionResponses(room: any, questionId: string) {
    return (room?.responses || []).filter((response: any) => response.questionId === questionId);
}

function participantResponses(room: any, questionId: string, participantId: string) {
    return questionResponses(room, questionId).filter((response: any) => response.participantId === participantId);
}

function normalizeWord(word: string) {
    return String(word || "")
        .trim()
        .replace(/[!?.,;:]+$/g, "")
        .replace(/\s+/g, " ")
        .toLowerCase();
}

function useRoomSync(roomCode: string | null, identity: any) {
    const [room, setRoom] = useState(() => (roomCode ? readRoom(roomCode) : null));

    useEffect(() => {
        if (roomCode) setRoom(readRoom(roomCode));
    }, [roomCode]);

    useEffect(() => {
        if (!roomCode) return undefined;

        const refresh = () => setRoom(readRoom(roomCode));
        refresh();

        const handleStorage = (event: StorageEvent) => {
            if (event.key === getStorageKey(roomCode)) refresh();
        };

        const channel = getChannel();
        const handleChannel = (event: any) => {
            if (event?.data?.type === "room-updated" && event?.data?.code === roomCode) refresh();
        };

        safeWindow()?.addEventListener("storage", handleStorage);
        if (channel) channel.addEventListener("message", handleChannel);

        return () => {
            safeWindow()?.removeEventListener("storage", handleStorage);
            if (channel) channel.removeEventListener("message", handleChannel);
        };
    }, [roomCode]);

    useEffect(() => {
        if (!roomCode || !identity?.clientId || !identity?.role) return undefined;

        const beat = () => {
            mutateRoom(roomCode, (draft) => {
                draft.presence[identity.clientId] = {
                    clientId: identity.clientId,
                    role: identity.role,
                    name: identity.name || (identity.role === "host" ? "Host" : "Gast"),
                    lastSeen: Date.now(),
                };
            });
            setRoom(readRoom(roomCode));
        };

        beat();
        const interval = setInterval(beat, HEARTBEAT_MS);

        const leave = () => {
            mutateRoom(roomCode, (draft) => {
                delete draft.presence[identity.clientId];
            });
        };

        safeWindow()?.addEventListener("beforeunload", leave);

        return () => {
            clearInterval(interval);
            safeWindow()?.removeEventListener("beforeunload", leave);
            leave();
        };
    }, [roomCode, identity?.clientId, identity?.name, identity?.role]);

    return room;
}

// ----------------------------------------------------------------------
// UI STYLES
// ----------------------------------------------------------------------

function inputStyle(extra: React.CSSProperties = {}): React.CSSProperties {
    return {
        width: "100%",
        padding: "12px 14px",
        background: "#111827",
        border: "1px solid #334155",
        borderRadius: 12,
        color: "#f8fafc",
        fontSize: 14,
        boxSizing: "border-box",
        fontFamily: "inherit",
        ...extra,
    };
}

function primaryButton(disabled: boolean, extra: React.CSSProperties = {}): React.CSSProperties {
    return {
        width: "100%",
        padding: "12px 14px",
        borderRadius: 12,
        border: "none",
        background: disabled ? "#1e293b" : "linear-gradient(135deg,#00C9FF,#4ECDC4)",
        color: disabled ? "#475569" : "#081018",
        fontWeight: 800,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        ...extra,
    };
}

// ----------------------------------------------------------------------
// SUB COMPONENTS
// ----------------------------------------------------------------------

function Pill({ children, color = "#00C9FF" }: { children: React.ReactNode, color?: string }) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 999,
                background: `${color}22`,
                color,
                fontSize: 11,
                fontWeight: 700,
            }}
        >
            {children}
        </span>
    );
}

function Backdrop({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(6px)",
                padding: 16,
            }}
        >
            {children}
        </div>
    );
}

function BarChartResults({ question, responses }: { question: any, responses: any[] }) {
    const options = (question.options || []).filter(Boolean);
    const total = Math.max(responses.length, 1);
    const counts = options.map((option: string) => responses.filter((item) => item.value === option).length);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {options.map((option: string, index: number) => {
                const pct = Math.round((counts[index] / total) * 100);
                return (
                    <div key={`${option}-${index}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 110, fontSize: 12, color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{option}</div>
                        <div style={{ flex: 1, height: 28, background: "#1e293b", borderRadius: 8, overflow: "hidden" }}>
                            <div
                                style={{
                                    height: "100%",
                                    width: `${pct}%`,
                                    background: COLORS[index % COLORS.length],
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    paddingLeft: 8,
                                    transition: "width 0.5s ease",
                                    minWidth: pct > 5 ? 4 : 0,
                                }}
                            >
                                {pct > 14 && <span style={{ fontSize: 11, fontWeight: 700, color: "#081018" }}>{pct}%</span>}
                            </div>
                        </div>
                        <div style={{ width: 22, textAlign: "right", fontSize: 11, color: "#64748b" }}>{counts[index]}</div>
                    </div>
                );
            })}
            <div style={{ fontSize: 11, color: "#475569" }}>{responses.length} Stimmen</div>
        </div>
    );
}

function WordCloudResults({ responses }: { responses: any[] }) {
    const freq: Record<string, number> = {};
    responses.forEach((response) => {
        const key = normalizeWord(response.value);
        if (!key) return;
        freq[key] = (freq[key] || 0) + 1;
    });
    const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map((entry) => entry[1]), 1);

    if (!entries.length) {
        return <div style={{ color: "#475569", textAlign: "center", padding: 20, fontSize: 13 }}>Noch keine Wörter…</div>;
    }

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", padding: 12 }}>
            {entries.map(([word, count], index) => {
                const size = 0.8 + (count / max) * 1.4;
                return (
                    <span
                        key={`${word}-${index}`}
                        style={{
                            fontSize: `${size}rem`,
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: `${COLORS[index % COLORS.length]}22`,
                            color: COLORS[index % COLORS.length],
                            border: `1px solid ${COLORS[index % COLORS.length]}66`,
                        }}
                    >
                        {word}
                    </span>
                );
            })}
        </div>
    );
}

function OpenListResults({ responses }: { responses: any[] }) {
    if (!responses.length) {
        return <div style={{ color: "#475569", textAlign: "center", padding: 20, fontSize: 13 }}>Noch keine Antworten…</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
            {[...responses].reverse().map((response) => (
                <div key={response.id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "8px 12px" }}>
                    <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>{response.participantName || "Anonym"}</div>
                    <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.35, wordBreak: "break-word" }}>{response.value}</div>
                </div>
            ))}
        </div>
    );
}

function RatingChartResults({ responses }: { responses: any[] }) {
    const labels = ["😞", "😕", "😐", "🙂", "😄"];
    const counts = [1, 2, 3, 4, 5].map((score) => responses.filter((item) => item.value === score).length);
    const max = Math.max(...counts, 1);
    const avg = responses.length ? (responses.reduce((sum, item) => sum + item.value, 0) / responses.length).toFixed(1) : null;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                {counts.map((count, index) => (
                    <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{count}</div>
                        <div style={{ width: 36, height: 110, background: "#1e293b", borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
                            <div style={{ width: "100%", height: `${(count / max) * 100}%`, background: COLORS[index], borderRadius: 8, transition: "height 0.5s ease" }} />
                        </div>
                        <div style={{ fontSize: 18 }}>{labels[index]}</div>
                    </div>
                ))}
            </div>
            {avg && <div style={{ fontSize: 11, color: "#475569" }}>Ø {avg} · {responses.length} Bewertungen</div>}
        </div>
    );
}

function ResultsPanel({ question, responses }: { question: any, responses: any[] }) {
    if (!question) return null;
    if (question.type === "multiple_choice") return <BarChartResults question={question} responses={responses} />;
    if (question.type === "word_cloud") return <WordCloudResults responses={responses} />;
    if (question.type === "open_ended") return <OpenListResults responses={responses} />;
    return <RatingChartResults responses={responses} />;
}

// ----------------------------------------------------------------------
// MAIN EXPORT
// ----------------------------------------------------------------------

export function MentimeterClone() {
    const [mounted, setMounted] = useState(false);
    const [clientId, setClientId] = useState<string>("");
    const [identity, setIdentity] = useState<any>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const room = useRoomSync(roomCode, identity);

    useEffect(() => {
        const id = getClientId();
        const saved = getSavedIdentity();
        setClientId(id);
        if (saved) {
            setIdentity({ ...saved, clientId: id });
            setRoomCode(saved.roomCode || null);
        }
        setMounted(true);
    }, []);

    const enterHost = ({ name }: { name: string }) => {
        const created = createRoom();
        const nextIdentity = { role: "host", name, roomCode: created.code, clientId };
        setIdentity(nextIdentity);
        setRoomCode(created.code);
        saveIdentity(nextIdentity);
    };

    const enterParticipant = ({ name, roomCode: code }: { name: string, roomCode: string }) => {
        const nextIdentity = { role: "participant", name, roomCode: code, clientId };
        setIdentity(nextIdentity);
        setRoomCode(code);
        saveIdentity(nextIdentity);
    };

    const leaveRoom = () => {
        if (identity?.clientId && roomCode) {
            mutateRoom(roomCode, (draft) => {
                delete draft.presence[identity.clientId];
            });
        }
        setIdentity(null);
        setRoomCode(null);
        clearIdentity();
    };

    if (!mounted) {
        return (
            <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#00C9FF", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!identity || !roomCode) {
        return <HomeScreen onCreateRoom={enterHost} onJoinRoom={enterParticipant} />;
    }

    if (!room) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0e1a", color: "#f8fafc", padding: 20 }}>
                <div style={{ width: "100%", maxWidth: 460, border: "1px solid #1e293b", background: "#0f172a", borderRadius: 28, padding: 24, textAlign: "center" }}>
                    <div style={{ fontSize: 42, marginBottom: 12 }}>🛰️</div>
                    <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Raum nicht verfügbar</div>
                    <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.5, marginBottom: 16 }}>Der Raumcode {roomCode} wurde nicht gefunden oder die Session wurde gelöscht.</div>
                    <button onClick={leaveRoom} style={primaryButton(false)}>Zur Startseite</button>
                </div>
            </div>
        );
    }

    if (identity.role === "host") {
        return <HostView identity={identity} room={room} onLeave={leaveRoom} />;
    }

    return <ParticipantView identity={identity} room={room} onLeave={leaveRoom} />;
}

// ----------------------------------------------------------------------
// SCREEN COMPONENTS
// ----------------------------------------------------------------------

function HomeScreen({ onCreateRoom, onJoinRoom }: { onCreateRoom: (p: { name: string }) => void, onJoinRoom: (p: { name: string, roomCode: string }) => void }) {
    const [mode, setMode] = useState("host");
    const [hostName, setHostName] = useState("Trainer");
    const [joinName, setJoinName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [error, setError] = useState("");

    const submitJoin = () => {
        const code = joinCode.trim().toUpperCase();
        const room = readRoom(code);
        if (!room) {
            setError("Raum nicht gefunden. Prüfe den Code.");
            return;
        }
        setError("");
        onJoinRoom({ name: joinName.trim() || "Gast", roomCode: code });
    };

    return (
        <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, #172554 0%, #0a0e1a 48%)", color: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ width: "100%", maxWidth: 1040, display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 22 }}>
                <div style={{ border: "1px solid #1e293b", borderRadius: 28, padding: 28, background: "rgba(15,23,42,0.88)", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}>
                    <Pill>⚡ Multiplayer-Demo</Pill>
                    <div style={{ fontSize: 42, lineHeight: 1.05, fontWeight: 900, marginTop: 18 }}>Live-Abstimmungen mit Raumcode und Realtime-Sync.</div>
                    <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 14, lineHeight: 1.5 }}>
                        Diese Version synchronisiert Fragen, Antworten und Presence zwischen mehreren Tabs oder Fenstern. Host und Teilnehmende können denselben Raumcode nutzen und sehen Änderungen sofort.
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginTop: 22 }}>
                        {[
                            ["🎤 Host-Ansicht", "Fragen verwalten, live schalten und Ergebnisse zurücksetzen."],
                            ["🙋 Join-Ansicht", "Per Raumcode beitreten und direkt vom Handy-Layout aus antworten."],
                            ["🔄 Realtime", "BroadcastChannel + localStorage für sofortige Demo-Synchronisierung."],
                        ].map(([title, text]) => (
                            <div key={title} style={{ padding: 14, borderRadius: 18, background: "#0f172a", border: "1px solid #1e293b" }}>
                                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>{title}</div>
                                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.45 }}>{text}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 18, lineHeight: 1.5 }}>
                        Tipp: Öffne die Vorschau zweimal oder in einem zweiten Browser-Fenster. Erstelle einen Raum als Host und tritt im zweiten Fenster mit dem Raumcode bei.
                    </div>
                </div>

                <div style={{ border: "1px solid #1e293b", borderRadius: 28, padding: 24, background: "rgba(15,23,42,0.96)", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                        {[
                            ["host", "Host erstellen"],
                            ["join", "Beitreten"],
                        ].map(([value, label]) => (
                            <button key={value} onClick={() => setMode(value)} style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: `1px solid ${mode === value ? "#00C9FF" : "#334155"}`, background: mode === value ? "rgba(0,201,255,0.12)" : "#111827", color: mode === value ? "#e0f7ff" : "#94a3b8", fontWeight: 700, cursor: "pointer" }}>{label}</button>
                        ))}
                    </div>

                    {mode === "host" ? (
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Raum als Host starten</div>
                            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>Erstellt sofort einen neuen Raum mit Starter-Fragen und aktiviertem Live-Sync.</div>
                            <label style={{ fontSize: 12, color: "#64748b" }}>Dein Name</label>
                            <input value={hostName} onChange={(event) => setHostName(event.target.value)} style={inputStyle({ marginTop: 6, marginBottom: 14 })} placeholder="Trainer" />
                            <button onClick={() => onCreateRoom({ name: hostName.trim() || "Trainer" })} style={primaryButton(false)}>Raum erstellen</button>
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Per Raumcode beitreten</div>
                            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>Für die Demo reicht derselbe Browser in einem zweiten Tab oder Fenster.</div>
                            <label style={{ fontSize: 12, color: "#64748b" }}>Dein Name</label>
                            <input value={joinName} onChange={(event) => setJoinName(event.target.value)} style={inputStyle({ marginTop: 6, marginBottom: 12 })} placeholder="Max" />
                            <label style={{ fontSize: 12, color: "#64748b" }}>Raumcode</label>
                            <input value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} style={inputStyle({ marginTop: 6, marginBottom: 12, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 800 })} placeholder="ABC123" maxLength={6} />
                            {error && <div style={{ fontSize: 12, color: "#fda4af", marginBottom: 10 }}>{error}</div>}
                            <button onClick={submitJoin} style={primaryButton(false)}>Raum beitreten</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function HeaderBar({ identity, room, onLeave }: { identity: any, room: any, onLeave: () => void }) {
    const online = onlineMembers(room);
    const participants = online.filter((entry: any) => entry.role === "participant");
    const hosts = online.filter((entry: any) => entry.role === "host");

    return (
        <div style={{ padding: "12px 18px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: "#0f172a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Link href="/tools">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: identity.role === "host" ? "#00C9FF" : "#FF6B9D", textTransform: "uppercase" }}>
                        {identity.role === "host" ? "🎤 Host-Modus" : "🙋 Teilnehmer-Modus"}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>{room?.title || "Live Session"}</div>
                        <Pill color="#FFD166">Raum {room?.code}</Pill>
                        <Pill color="#4ECDC4">{participants.length} Teilnehmer online</Pill>
                        <Pill color="#A78BFA">{hosts.length} Host online</Pill>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                    onClick={() => {
                        const text = room?.code || "";
                        if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(text);
                    }}
                    style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #334155", background: "transparent", color: "#cbd5e1", cursor: "pointer", fontWeight: 700 }}
                >
                    Code kopieren
                </button>
                <button onClick={onLeave} style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #334155", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: 700 }}>
                    Logout
                </button>
            </div>
        </div>
    );
}

function HostView({ identity, room, onLeave }: { identity: any, room: any, onLeave: () => void }) {
    const [showPicker, setShowPicker] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [questionText, setQuestionText] = useState("");
    const [questionOptions, setQuestionOptions] = useState(["", "", ""]);
    const activeQuestion = room?.questions?.find((question: any) => question.id === room?.activeQuestionId) || room?.questions?.[0] || null;
    const activeResponses = activeQuestion ? questionResponses(room, activeQuestion.id) : [];
    const presence = onlineMembers(room);

    useEffect(() => {
        const editTarget = room?.questions?.find((question: any) => question.id === editingId);
        if (!editTarget) return;
        setQuestionText(editTarget.text || "");
        setQuestionOptions(editTarget.type === "multiple_choice" ? (editTarget.options?.length ? editTarget.options : ["", "", ""]) : []);
    }, [editingId, room]);

    const setActiveQuestion = (questionId: string) => {
        mutateRoom(room.code, (draft) => {
            draft.activeQuestionId = questionId;
        });
    };

    const addQuestion = (type: string) => {
        const question = {
            id: uid(),
            type,
            text: "",
            options: type === "multiple_choice" ? ["", "", ""] : [],
            isOpen: true,
            createdAt: nowIso(),
        };
        mutateRoom(room.code, (draft) => {
            draft.questions.push(question);
            draft.activeQuestionId = question.id;
        });
        setEditingId(question.id);
        setQuestionText("");
        setQuestionOptions(["", "", ""]);
        setShowPicker(false);
    };

    const saveQuestion = () => {
        mutateRoom(room.code, (draft) => {
            draft.questions = draft.questions.map((question: any) => {
                if (question.id !== editingId) return question;
                return {
                    ...question,
                    text: questionText.trim(),
                    options: question.type === "multiple_choice" ? questionOptions.map((value) => value.trim()) : [],
                };
            });
        });
        setEditingId(null);
    };

    const deleteQuestion = (questionId: string) => {
        if (!window.confirm("Frage wirklich löschen?")) return;
        mutateRoom(room.code, (draft) => {
            draft.questions = draft.questions.filter((question: any) => question.id !== questionId);
            draft.responses = draft.responses.filter((response: any) => response.questionId !== questionId);
            if (draft.activeQuestionId === questionId) {
                draft.activeQuestionId = draft.questions[0]?.id || null;
            }
        });
    };

    const toggleQuestion = () => {
        if (!activeQuestion) return;
        mutateRoom(room.code, (draft) => {
            draft.questions = draft.questions.map((question: any) => question.id === activeQuestion.id ? { ...question, isOpen: !question.isOpen } : question);
        });
    };

    const resetResults = () => {
        if (!activeQuestion || !window.confirm("Antworten dieser Frage löschen?")) return;
        mutateRoom(room.code, (draft) => {
            draft.responses = draft.responses.filter((response: any) => response.questionId === activeQuestion.id ? false : true);
        });
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#f8fafc", position: "relative" }}>
            <HeaderBar identity={identity} room={room} onLeave={onLeave} />
            <div style={{ display: "grid", gridTemplateColumns: "340px 1fr 280px", minHeight: "calc(100vh - 73px)" }}>
                <div style={{ borderRight: "1px solid #1e293b", background: "#0f172a", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: 16, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#00C9FF", textTransform: "uppercase", letterSpacing: "0.14em" }}>Fragen</div>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{room.questions.length} Elemente</div>
                        </div>
                        <button onClick={() => setShowPicker(true)} style={{ padding: "8px 12px", borderRadius: 10, border: "none", background: "#00C9FF", color: "#081018", fontWeight: 800, cursor: "pointer" }}>+ Frage</button>
                    </div>

                    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
                        {room.questions.map((question: any, index: number) => {
                            const meta = typeMeta(question.type);
                            const isActive = question.id === activeQuestion?.id;
                            const responses = questionResponses(room, question.id);
                            return (
                                <div key={question.id} style={{ border: `1px solid ${isActive ? "#00C9FF" : "#1e293b"}`, background: isActive ? "#102741" : "#111827", borderRadius: 16, overflow: "hidden" }}>
                                    <button onClick={() => setActiveQuestion(question.id)} style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", color: "inherit", padding: 12, cursor: "pointer" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: 16 }}>{meta.emoji}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 10, fontWeight: 800, color: meta.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{meta.label}</div>
                                                <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#e2e8f0" }}>{question.text || `Frage ${index + 1}`}</div>
                                            </div>
                                            {isActive && <div style={{ width: 8, height: 8, borderRadius: 999, background: "#00C9FF", flexShrink: 0 }} />}
                                        </div>
                                        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                                            <Pill color={question.isOpen ? "#4ECDC4" : "#64748b"}>{question.isOpen ? "offen" : "geschlossen"}</Pill>
                                            <Pill color="#FFD166">{responses.length} Antworten</Pill>
                                        </div>
                                    </button>
                                    {isActive && (
                                        <div style={{ borderTop: "1px solid #1e293b", padding: 10, display: "flex", gap: 8 }}>
                                            <button onClick={() => setEditingId(question.id)} style={{ flex: 1, padding: "8px 10px", borderRadius: 10, border: "1px solid #334155", background: "transparent", color: "#cbd5e1", cursor: "pointer", fontWeight: 700 }}>Bearbeiten</button>
                                            <button onClick={() => deleteQuestion(question.id)} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #334155", background: "transparent", color: "#f87171", cursor: "pointer", fontWeight: 700 }}>Löschen</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ padding: 22, overflowY: "auto" }}>
                    {!activeQuestion ? (
                        <div style={{ border: "1px dashed #334155", borderRadius: 24, padding: 30, textAlign: "center", color: "#64748b" }}>Noch keine Frage vorhanden.</div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                                <div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                                        <Pill color={typeMeta(activeQuestion.type).color}>{typeMeta(activeQuestion.type).emoji} {typeMeta(activeQuestion.type).label}</Pill>
                                        <Pill color={activeQuestion.isOpen ? "#4ECDC4" : "#64748b"}>{activeQuestion.isOpen ? "Frage offen" : "Frage geschlossen"}</Pill>
                                    </div>
                                    <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.15 }}>{activeQuestion.text || "Untitled question"}</div>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <button onClick={toggleQuestion} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #334155", background: "transparent", color: "#cbd5e1", cursor: "pointer", fontWeight: 700 }}>{activeQuestion.isOpen ? "Schließen" : "Öffnen"}</button>
                                    <button onClick={resetResults} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #334155", background: "transparent", color: "#fbbf24", cursor: "pointer", fontWeight: 700 }}>Ergebnisse zurücksetzen</button>
                                </div>
                            </div>

                            <div style={{ border: "1px solid #1e293b", borderRadius: 24, background: "#0f172a", padding: 20 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                                    <div style={{ fontSize: 15, fontWeight: 800 }}>Live-Ergebnisse</div>
                                    <div style={{ fontSize: 12, color: "#64748b" }}>{activeResponses.length} Antworten insgesamt</div>
                                </div>
                                <ResultsPanel question={activeQuestion} responses={activeResponses} />
                            </div>

                            <div style={{ border: "1px solid #1e293b", borderRadius: 24, background: "#0f172a", padding: 20 }}>
                                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Teilnehmer-Status</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {presence.length === 0 && <div style={{ color: "#64748b", fontSize: 13 }}>Noch niemand online.</div>}
                                    {presence.map((entry: any) => (
                                        <span key={entry.clientId} style={{ padding: "7px 10px", borderRadius: 999, border: `1px solid ${entry.role === "host" ? "#00C9FF55" : "#4ECDC455"}`, background: entry.role === "host" ? "rgba(0,201,255,0.1)" : "rgba(78,205,196,0.1)", color: entry.role === "host" ? "#7dd3fc" : "#5eead4", fontSize: 12, fontWeight: 700 }}>{entry.role === "host" ? "🎤" : "🙋"} {entry.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ borderLeft: "1px solid #1e293b", background: "#0f172a", padding: 16, overflowY: "auto" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#A78BFA", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>Session-Info</div>
                    <div style={{ border: "1px solid #1e293b", borderRadius: 18, padding: 14, background: "#111827", marginBottom: 12 }}>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Raumcode</div>
                        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "0.22em" }}>{room.code}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Mit diesem Code können Teilnehmer in einem zweiten Tab oder Fenster beitreten.</div>
                    </div>
                    <div style={{ border: "1px solid #1e293b", borderRadius: 18, padding: 14, background: "#111827" }}>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>Umsetzung in dieser Demo</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.55 }}>
                            Realtime erfolgt hier browser-lokal über <strong>BroadcastChannel</strong> und <strong>localStorage</strong>. Für echte Geräte-Multiplayer wäre der nächste Schritt ein Backend mit WebSockets.
                        </div>
                    </div>
                </div>
            </div>

            {showPicker && (
                <Backdrop>
                    <div style={{ width: 320, maxWidth: "100%", borderRadius: 22, border: "1px solid #1e293b", background: "#111827", padding: 18 }}>
                        <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>Fragentyp auswählen</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {QTYPES.map((item) => (
                                <button key={item.id} onClick={() => addQuestion(item.id)} style={{ padding: "14px 10px", borderRadius: 14, border: "1px solid #334155", background: "#0f172a", color: "#f8fafc", cursor: "pointer" }}>
                                    <div style={{ fontSize: 22, marginBottom: 6 }}>{item.emoji}</div>
                                    <div style={{ fontSize: 11, color: item.color, fontWeight: 800 }}>{item.label}</div>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowPicker(false)} style={{ ...primaryButton(false, { marginTop: 12 }), background: "#1e293b", color: "#cbd5e1" }}>Abbrechen</button>
                    </div>
                </Backdrop>
            )}

            {editingId && (
                <Backdrop>
                    <div style={{ width: 360, maxWidth: "100%", borderRadius: 22, border: "1px solid #1e293b", background: "#111827", padding: 18 }}>
                        <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 10 }}>Frage bearbeiten</div>
                        <label style={{ fontSize: 12, color: "#64748b" }}>Fragetext</label>
                        <textarea value={questionText} onChange={(event) => setQuestionText(event.target.value)} style={inputStyle({ marginTop: 6, minHeight: 90, resize: "vertical" })} placeholder="Frage eingeben…" />
                        {room.questions.find((question: any) => question.id === editingId)?.type === "multiple_choice" && (
                            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                                {questionOptions.map((option, index) => (
                                    <div key={index} style={{ display: "flex", gap: 8 }}>
                                        <input value={option} onChange={(event) => setQuestionOptions(questionOptions.map((value, innerIndex) => innerIndex === index ? event.target.value : value))} style={inputStyle()} placeholder={`Option ${index + 1}`} />
                                        <button onClick={() => setQuestionOptions(questionOptions.filter((_, innerIndex) => innerIndex !== index))} style={{ width: 42, borderRadius: 12, border: "1px solid #334155", background: "transparent", color: "#f87171", cursor: "pointer", fontWeight: 900 }}>×</button>
                                    </div>
                                ))}
                                <button onClick={() => setQuestionOptions([...questionOptions, ""])} style={{ padding: "10px 12px", borderRadius: 12, border: "1px dashed #334155", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: 700 }}>+ Option</button>
                            </div>
                        )}
                        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                            <button onClick={saveQuestion} style={{ ...primaryButton(false), flex: 1 }}>Speichern</button>
                            <button onClick={() => setEditingId(null)} style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #334155", background: "transparent", color: "#cbd5e1", cursor: "pointer", fontWeight: 700 }}>Abbrechen</button>
                        </div>
                    </div>
                </Backdrop>
            )}
        </div>
    );
}

function ParticipantView({ identity, room, onLeave }: { identity: any, room: any, onLeave: () => void }) {
    const activeQuestion = room?.questions?.find((question: any) => question.id === room?.activeQuestionId) || null;
    const myResponses = activeQuestion ? participantResponses(room, activeQuestion.id, identity.clientId) : [];
    const alreadyAnswered = activeQuestion ? (activeQuestion.type === "word_cloud" ? myResponses.length >= 3 : myResponses.length >= 1) : false;
    const [choice, setChoice] = useState<string | null>(null);
    const [wordInput, setWordInput] = useState("");
    const [openAnswer, setOpenAnswer] = useState("");
    const [rating, setRating] = useState(0);
    const prevQuestionId = useRef<string | null>(null);

    useEffect(() => {
        if (activeQuestion?.id !== prevQuestionId.current) {
            prevQuestionId.current = activeQuestion?.id || null;
            setChoice(null);
            setWordInput("");
            setOpenAnswer("");
            setRating(0);
        }
    }, [activeQuestion?.id]);

    const submitSingleResponse = (value: any) => {
        if (!activeQuestion || alreadyAnswered || !activeQuestion.isOpen) return;
        mutateRoom(room.code, (draft) => {
            const existing = participantResponses(draft, activeQuestion.id, identity.clientId);
            if (existing.length && activeQuestion.type !== "word_cloud") return;
            draft.responses.push({
                id: uid(),
                roomCode: room.code,
                questionId: activeQuestion.id,
                participantId: identity.clientId,
                participantName: identity.name,
                value,
                createdAt: nowIso(),
            });
        });
    };

    const addWord = () => {
        const normalized = normalizeWord(wordInput);
        if (!activeQuestion || activeQuestion.type !== "word_cloud" || !activeQuestion.isOpen) return;
        if (!normalized || myResponses.length >= 3) return;
        if (myResponses.some((response) => normalizeWord(response.value) === normalized)) return;
        mutateRoom(room.code, (draft) => {
            const existing = participantResponses(draft, activeQuestion.id, identity.clientId);
            if (existing.length >= 3) return;
            if (existing.some((response) => normalizeWord(response.value) === normalized)) return;
            draft.responses.push({
                id: uid(),
                roomCode: room.code,
                questionId: activeQuestion.id,
                participantId: identity.clientId,
                participantName: identity.name,
                value: wordInput.trim(),
                createdAt: nowIso(),
            });
        });
        setWordInput("");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#f8fafc" }}>
            <HeaderBar identity={identity} room={room} onLeave={onLeave} />
            <div style={{ minHeight: "calc(100vh - 73px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <div style={{ width: "100%", maxWidth: 540, border: "1px solid #1e293b", background: "#0f172a", borderRadius: 28, padding: 22, boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}>
                    {!activeQuestion ? (
                        <div style={{ textAlign: "center", padding: "30px 0" }}>
                            <div style={{ fontSize: 46, marginBottom: 10 }}>⏳</div>
                            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Warte auf die nächste Frage</div>
                            <div style={{ fontSize: 14, color: "#94a3b8" }}>Der Host hat aktuell keine aktive Frage ausgewählt.</div>
                        </div>
                    ) : !activeQuestion.isOpen ? (
                        <div style={{ textAlign: "center", padding: "30px 0" }}>
                            <div style={{ fontSize: 46, marginBottom: 10 }}>🔒</div>
                            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Diese Frage ist geschlossen</div>
                            <div style={{ fontSize: 14, color: "#94a3b8" }}>Warte, bis der Host sie wieder öffnet oder zur nächsten wechselt.</div>
                        </div>
                    ) : alreadyAnswered && activeQuestion.type !== "word_cloud" ? (
                        <div style={{ textAlign: "center", padding: "30px 0" }}>
                            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
                            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Antwort gesendet</div>
                            <div style={{ fontSize: 14, color: "#94a3b8" }}>Der Host sieht dein Ergebnis bereits live.</div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ textAlign: "center", marginBottom: 18 }}>
                                <Pill color={typeMeta(activeQuestion.type).color}>{typeMeta(activeQuestion.type).emoji} {typeMeta(activeQuestion.type).label}</Pill>
                                <div style={{ fontSize: 28, lineHeight: 1.18, fontWeight: 900, marginTop: 14 }}>{activeQuestion.text || "Frage wird geladen…"}</div>
                                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 10 }}>{identity.name}, du bist mit Raum {room.code} verbunden.</div>
                            </div>

                            {activeQuestion.type === "multiple_choice" && (
                                <>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                                        {(activeQuestion.options || []).filter(Boolean).map((option: string, index: number) => (
                                            <button key={`${option}-${index}`} onClick={() => setChoice(option)} style={{ padding: "14px 14px", borderRadius: 14, border: `2px solid ${choice === option ? "#00C9FF" : "#334155"}`, background: choice === option ? "rgba(0,201,255,0.12)" : "#111827", color: "#f8fafc", display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                                                <div style={{ width: 18, height: 18, borderRadius: 999, border: `2px solid ${choice === option ? "#00C9FF" : "#475569"}`, background: choice === option ? "#00C9FF" : "transparent" }} />
                                                <span>{option}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => choice && submitSingleResponse(choice)} disabled={!choice} style={primaryButton(!choice)}>Antwort senden</button>
                                </>
                            )}

                            {activeQuestion.type === "word_cloud" && (
                                <>
                                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                        <input value={wordInput} onChange={(event) => setWordInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addWord()} placeholder="Stichwort eingeben…" style={inputStyle({ flex: 1 })} maxLength={25} />
                                        <button onClick={addWord} disabled={!wordInput.trim() || myResponses.length >= 3} style={{ ...primaryButton(!wordInput.trim() || myResponses.length >= 3, { width: 60 }) }}>+</button>
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                                        {myResponses.map((response) => (
                                            <span key={response.id} style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(78,205,196,0.14)", border: "1px solid #4ECDC4", color: "#5eead4", fontWeight: 700, fontSize: 12 }}>{response.value}</span>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{myResponses.length >= 3 ? "Maximum von 3 Wörtern erreicht." : `Du kannst noch ${3 - myResponses.length} Wort${3 - myResponses.length === 1 ? "" : "e"} senden.`}</div>
                                </>
                            )}

                            {activeQuestion.type === "open_ended" && (
                                <>
                                    <textarea value={openAnswer} onChange={(event) => setOpenAnswer(event.target.value)} placeholder="Deine Antwort…" style={inputStyle({ minHeight: 110, resize: "vertical", marginBottom: 12 })} />
                                    <button onClick={() => openAnswer.trim() && submitSingleResponse(openAnswer.trim())} disabled={!openAnswer.trim()} style={primaryButton(!openAnswer.trim())}>Antwort senden</button>
                                </>
                            )}

                            {activeQuestion.type === "rating" && (
                                <>
                                    <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                                        {["😞", "😕", "😐", "🙂", "😄"].map((emoji, index) => (
                                            <button key={index} onClick={() => setRating(index + 1)} style={{ border: "none", background: "transparent", fontSize: 40, cursor: "pointer", filter: rating >= index + 1 ? "none" : "grayscale(1)", transform: rating === index + 1 ? "scale(1.18)" : "scale(1)", transition: "all 0.18s ease" }}>{emoji}</button>
                                        ))}
                                    </div>
                                    <button onClick={() => rating && submitSingleResponse(rating)} disabled={!rating} style={primaryButton(!rating)}>Bewertung senden</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
