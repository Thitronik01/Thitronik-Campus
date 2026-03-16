"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const QUESTIONS = [
    { question: "In welcher Stadt ist Thitronik ansässig?", answers: ["Kiel", "Eckernförde", "Flensburg", "Schleswig"], correct: 1, time: 20 },
    { question: "In welchem Bundesland liegt der Standort von Thitronik?", answers: ["Niedersachsen", "Hamburg", "Schleswig-Holstein", "Mecklenburg-Vorpommern"], correct: 2, time: 20 },
    { question: "Für welche Branche entwickelt Thitronik hauptsächlich Produkte?", answers: ["Luftfahrt", "Automobilindustrie", "Marine & Freizeitboote", "Bergbau"], correct: 2, time: 20 },
    { question: "Was ist das Kernprodukt von Thitronik?", answers: ["GPS-Navigationssysteme", "Gaswarngeräte", "Motorsteuerungen", "Tauchcomputer"], correct: 1, time: 20 },
    { question: "Welches Gas wird von Thitroniks Geräten NICHT primär erkannt?", answers: ["LPG / Propan", "Benzindämpfe", "CO (Kohlenmonoxid)", "Stickstoff (N₂)"], correct: 3, time: 20 },
    { question: "An welchem Gewässer liegt Eckernförde?", answers: ["Nordsee", "Eckernförder Bucht (Ostsee)", "Kieler Förde", "Schlei"], correct: 1, time: 20 },
    { question: "Wie lautet ein bekanntes Gaswarngerät-Modell von Thitronik?", answers: ["Gas-Max", "Gas-Pro", "Gas-Alert", "Gas-Safe"], correct: 1, time: 20 },
    { question: "Für welche Fahrzeugtypen bietet Thitronik neben Booten Lösungen an?", answers: ["Flugzeuge", "Wohnmobile & Caravans", "Züge", "Motorräder"], correct: 1, time: 20 },
    { question: "Was bedeutet das Warnsignal eines Gaswarngeräts auf einem Boot?", answers: ["Motor läuft heiß", "Gefährliche Gaskonzentration erkannt", "Batterie schwach", "Wassereinbruch"], correct: 1, time: 20 },
    { question: "Welche Zertifizierung ist für Sicherheitsprodukte im Marinebereich wichtig?", answers: ["ISO 9001", "CE-Kennzeichnung", "ATEX", "GS-Zeichen"], correct: 1, time: 20 },
    { question: "Eckernförde ist für welche Bundeswehr-Einheit bekannt?", answers: ["Luftwaffenstützpunkt", "Marine / Kampfschwimmer", "Panzerbrigade", "Fernmeldebataillon"], correct: 1, time: 20 },
    { question: "Was ist beim Gasalarm an Bord die ERSTE Maßnahme?", answers: ["Motor starten & fahren", "Gas abstellen & lüften", "Notruf absetzen", "Luken schließen"], correct: 1, time: 20 },
    { question: "Warum ist LPG auf Booten besonders gefährlich?", answers: ["Schwerer als Luft, sammelt sich im Bilgebereich", "Es brennt nicht", "Geruchlos & leichter als Luft", "Löst sich in Wasser auf"], correct: 0, time: 20 },
    { question: "Welcher Sensor-Typ wird in LPG-Gaswarngeräten genutzt?", answers: ["Infrarot-Sensor", "Katalytischer Sensor (Pellistor)", "Ultraschall-Sensor", "Magnetischer Sensor"], correct: 1, time: 20 },
    { question: "Was verbindet Thitronik mit der Ostseeregion?", answers: ["Nur der Firmenname", "Hauptsitz Eckernförde & maritime Produktausrichtung", "Keine besondere Verbindung", "Fischerei-Zubehör"], correct: 1, time: 20 },
];

const FAKE = ["SegelProfi99", "OstseeFan", "BootsKapitän", "MarineExpert", "GasWatcher", "EckernfördER"];
const ACFG = [
    { color: "#E21B3C", shape: "▲" },
    { color: "#1368CE", shape: "◆" },
    { color: "#FFA602", shape: "●" },
    { color: "#26890C", shape: "■" },
];
const PIN = "847293";

function QRSvg() {
    const pat = [
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1],
        [1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1],
        [0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0],
        [1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1],
    ];
    const cs = 108 / 21;
    return (
        <svg width={108} height={108} style={{ background: "#fff", padding: 6, borderRadius: 10, display: "block" }}>
            {pat.map((row, r) => row.map((cell, c) =>
                cell ? <rect key={`${r}-${c}`} x={c * cs} y={r * cs} width={cs} height={cs} fill="#222" /> : null
            ))}
        </svg>
    );
}

const CSS = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
  .kahoot-btn:hover { filter: brightness(1.08); transform: scale(1.01); }
  .kahoot-btn:active { transform: scale(0.97); }
  .ans-btn:hover:not(:disabled) { filter: brightness(1.1); transform: scale(1.02); }
  .ans-btn:active:not(:disabled) { transform: scale(0.97); }
`;

export function KahootQuiz() {
    const [screen, setScreen] = useState("home");
    const [pin, setPin] = useState("");
    const [pinErr, setPinErr] = useState("");
    const [nick, setNick] = useState("");
    const [nickErr, setNickErr] = useState("");
    const [qIdx, setQIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [lb, setLb] = useState<[string, number][]>([]);
    const [qVis, setQVis] = useState(false);
    const [aVis, setAVis] = useState(false);
    const [totalOk, setTotalOk] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const q = QUESTIONS[Math.min(qIdx, QUESTIONS.length - 1)];
    const calcPts = (t: number, tot: number) => 1000 + Math.round((t / tot) * 500);

    useEffect(() => {
        const i: Record<string, number> = {};
        FAKE.forEach(p => i[p] = 0);
        setScores(i);
    }, []);

    const buildLb = useCallback((myName: string, myScore: number, cur: Record<string, number>) => {
        const upd = { ...cur };
        FAKE.forEach(p => {
            if (Math.random() > 0.25) upd[p] = (upd[p] || 0) + Math.floor(Math.random() * 1300 + 150);
        });
        upd[myName] = myScore;
        const sorted = Object.entries(upd).sort((a, b) => b[1] - a[1]);
        setScores(upd);
        setLb(sorted);
        return sorted;
    }, []);

    const startQ = useCallback((idx: number) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setSelected(null);
        setQVis(false);
        setAVis(false);
        setTimeLeft(QUESTIONS[idx].time);
        setScreen("question");
        setTimeout(() => setQVis(true), 300);
        setTimeout(() => setAVis(true), 800);
    }, []);

    useEffect(() => {
        if (screen === "question" && aVis) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setScreen("feedback");
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [screen, aVis]);

    const handleAnswer = (idx: number) => {
        if (selected !== null || screen !== "question") return;
        if (timerRef.current) clearInterval(timerRef.current);
        setSelected(idx);
        if (idx === q.correct) {
            setScore(s => s + calcPts(timeLeft, q.time));
            setStreak(s => s + 1);
            setTotalOk(c => c + 1);
        } else {
            setStreak(0);
        }
        setTimeout(() => setScreen("feedback"), 1400);
    };

    const afterFeedback = () => {
        const newScore = score;
        buildLb(nick, newScore, scores);
        if (qIdx + 1 >= QUESTIONS.length) setScreen("podium");
        else setScreen("leaderboard");
    };

    const nextQ = () => {
        const next = qIdx + 1;
        setQIdx(next);
        startQ(next);
    };

    const reset = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setScreen("home"); setPin(""); setNick(""); setQIdx(0);
        setScore(0); setStreak(0); setTotalOk(0); setLb([]);
        const i: Record<string, number> = {}; FAKE.forEach(p => i[p] = 0); setScores(i);
    };

    const launchGame = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setQIdx(0); setScore(0); setStreak(0); setTotalOk(0);
        const i: Record<string, number> = {}; FAKE.forEach(p => i[p] = 0); setScores(i);
        setScreen("lobby");
        setTimeout(() => startQ(0), 3000);
    };

    const tPct = (timeLeft / q.time) * 100;
    const tColor = tPct > 50 ? "#26890C" : tPct > 25 ? "#FFA602" : "#E21B3C";
    const myRank = lb.findIndex(([n]) => n === nick);

    const wrap: React.CSSProperties = {
        minHeight: "100vh", width: "100%",
        background: "linear-gradient(160deg,#46178f 0%,#2a0a6b 100%)",
        fontFamily: "var(--font-geist-sans),sans-serif",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "16px",
        position: "relative",
        overflowX: "hidden"
    };
    const logo: React.CSSProperties = {
        fontSize: 44, fontWeight: 900, color: "#fff",
        fontStyle: "italic", letterSpacing: -1,
        textShadow: "0 3px 14px rgba(0,0,0,0.45)",
        marginBottom: 18,
    };
    const card: React.CSSProperties = {
        background: "#fff", borderRadius: 20, padding: "28px 22px",
        width: "100%", maxWidth: 420,
        boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
        display: "flex", flexDirection: "column", gap: 12,
    };
    const btnStyle = (bg = "#46178f", col = "#fff", extra: React.CSSProperties = {}): React.CSSProperties => ({
        background: bg, color: col, border: "none", borderRadius: 12,
        padding: "14px 18px", fontSize: 16, fontWeight: 800,
        cursor: "pointer", width: "100%",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        transition: "filter 0.15s, transform 0.1s",
        ...extra,
    });
    const inp: React.CSSProperties = {
        background: "#f3f0fa", border: "3px solid #ddd6f5",
        borderRadius: 12, padding: "13px", fontSize: 24, fontWeight: 900,
        textAlign: "center", width: "100%", color: "#3d2477",
        outline: "none", letterSpacing: 6,
    };

    if (screen === "home") return (
        <div style={wrap}>
            <style>{CSS}</style>
            <div className="absolute top-4 left-4 z-20">
                <Link href="/tools">
                    <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
                        <ArrowLeft className="w-4 h-4" /> Beenden
                    </Button>
                </Link>
            </div>
            <div style={logo}>kahoot!</div>
            <p style={{ color: "rgba(255,255,255,0.85)", fontWeight: 800, fontSize: 15, marginBottom: 20, textAlign: "center" }}>
                🌊 Thitronik Eckernförde – Edition
            </p>
            <div style={card}>
                <p style={{ color: "#3d2477", fontWeight: 700, textAlign: "center", fontSize: 15 }}>
                    Wie möchtest du beitreten?
                </p>
                <button className="kahoot-btn" style={btnStyle()} onClick={() => setScreen("join")}>
                    📱 Mit Game-PIN beitreten
                </button>
                <button className="kahoot-btn" style={btnStyle("#fff", "#46178f", { border: "2.5px solid #46178f" })} onClick={() => setScreen("qr")}>
                    📷 Per QR-Code beitreten
                </button>
                <p style={{ textAlign: "center", color: "#bbb", fontSize: 12 }}>
                    PIN: <strong style={{ color: "#46178f", letterSpacing: 5 }}>{PIN}</strong>
                </p>
            </div>
        </div>
    );

    if (screen === "qr") return (
        <div style={wrap}>
            <style>{CSS}</style>
            <div style={logo}>kahoot!</div>
            <div style={card}>
                <p style={{ color: "#3d2477", fontWeight: 800, fontSize: 18, textAlign: "center" }}>
                    Scanne den QR-Code
                </p>
                <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
                    <QRSvg />
                </div>
                <p style={{ textAlign: "center", color: "#aaa", fontSize: 12 }}>oder gib die PIN manuell ein:</p>
                <p style={{ textAlign: "center", fontSize: 34, fontWeight: 900, letterSpacing: 12, color: "#46178f" }}>{PIN}</p>
                <button className="kahoot-btn" style={btnStyle()} onClick={() => setScreen("nickname")}>Weiter →</button>
                <button className="kahoot-btn" style={btnStyle("transparent", "#46178f", { boxShadow: "none" })} onClick={() => setScreen("home")}>← Zurück</button>
            </div>
        </div>
    );

    if (screen === "join") return (
        <div style={wrap}>
            <style>{CSS}</style>
            <div style={logo}>kahoot!</div>
            <div style={card}>
                <p style={{ color: "#3d2477", fontWeight: 800, fontSize: 18, textAlign: "center" }}>
                    Game-PIN eingeben
                </p>
                <input
                    style={inp} type="tel" placeholder="_ _ _ _ _ _"
                    value={pin} maxLength={6}
                    onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setPinErr(""); }}
                    onKeyDown={e => { if (e.key === "Enter") { if (pin === PIN) setScreen("nickname"); else setPinErr(`Falsch! Hinweis: ${PIN}`); } }}
                    autoFocus
                />
                {pinErr && <p style={{ color: "#E21B3C", fontWeight: 700, textAlign: "center", fontSize: 13 }}>{pinErr}</p>}
                <button className="kahoot-btn" style={btnStyle(pin.length === 6 ? "#46178f" : "#ccc")}
                    onClick={() => { if (pin === PIN) setScreen("nickname"); else setPinErr(`Falsch! Hinweis: ${PIN}`); }}>
                    Eintreten!
                </button>
                <button className="kahoot-btn" style={btnStyle("transparent", "#46178f", { boxShadow: "none" })} onClick={() => setScreen("home")}>← Zurück</button>
            </div>
        </div>
    );

    if (screen === "nickname") return (
        <div style={wrap}>
            <style>{CSS}</style>
            <div style={logo}>kahoot!</div>
            <div style={card}>
                <p style={{ color: "#3d2477", fontWeight: 800, fontSize: 18, textAlign: "center" }}>Wähle deinen Spitznamen</p>
                <p style={{ color: "#aaa", fontSize: 13, textAlign: "center" }}>So wirst du im Spiel angezeigt</p>
                <input
                    style={{ ...inp, letterSpacing: 2, fontSize: 20 }}
                    type="text" placeholder="Dein Spitzname"
                    value={nick} maxLength={15}
                    onChange={e => { setNick(e.target.value.slice(0, 15)); setNickErr(""); }}
                    onKeyDown={e => { if (e.key === "Enter") { if (nick.trim().length < 2) { setNickErr("Mindestens 2 Zeichen!"); return; } launchGame(); } }}
                    autoFocus
                />
                {nickErr && <p style={{ color: "#E21B3C", fontWeight: 700, textAlign: "center", fontSize: 13 }}>{nickErr}</p>}
                <button className="kahoot-btn"
                    style={btnStyle(nick.trim().length >= 2 ? "#46178f" : "#ccc")}
                    onClick={() => { if (nick.trim().length < 2) { setNickErr("Mindestens 2 Zeichen!"); return; } launchGame(); }}>
                    Los geht's! 🚀
                </button>
            </div>
        </div>
    );

    if (screen === "lobby") return (
        <div style={{ ...wrap }}>
            <style>{CSS}</style>
            <div style={logo}>kahoot!</div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "14px 36px", textAlign: "center", marginBottom: 22, backdropFilter: "blur(8px)" }}>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Game-PIN:</p>
                <p style={{ color: "#fff", fontSize: 42, fontWeight: 900, letterSpacing: 14 }}>{PIN}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500, marginBottom: 28 }}>
                {[nick, ...FAKE].map((p, i) => (
                    <span key={i} style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 999, padding: "6px 14px", fontWeight: 700, fontSize: 13, animation: `popIn 0.3s ease ${i * 0.08}s both` }}>{p}</span>
                ))}
            </div>
            <div style={{ width: 44, height: 44, border: "5px solid rgba(255,255,255,0.2)", borderTop: "5px solid #fff", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
            <p style={{ color: "rgba(255,255,255,0.75)", marginTop: 12, fontSize: 14 }}>Spiel startet gleich…</p>
        </div>
    );

    if (screen === "question") return (
        <div style={{ ...wrap, justifyContent: "flex-start", alignItems: "stretch", padding: "0 0 16px" }}>
            <style>{CSS}</style>
            <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 10, width: "100%", maxWidth: 760, margin: "0 auto" }}>
                <div style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderRadius: 8, padding: "3px 10px", fontWeight: 800, fontSize: 12 }}>
                    {qIdx + 1}/{QUESTIONS.length}
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ position: "relative", width: 56, height: 56 }}>
                    <svg viewBox="0 0 56 56" style={{ position: "absolute", transform: "rotate(-90deg)", width: 56, height: 56 }}>
                        <circle cx="28" cy="28" r="23" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
                        <circle cx="28" cy="28" r="23" fill="none" stroke={tColor} strokeWidth="5"
                            strokeDasharray={`${2 * Math.PI * 23}`}
                            strokeDashoffset={`${2 * Math.PI * 23 * (1 - tPct / 100)}`}
                            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
                    </svg>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontWeight: 900, fontSize: 17 }}>{timeLeft}</div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ color: "#FFD700", fontWeight: 900, fontSize: 13, whiteSpace: "nowrap" }}>🏆 {score.toLocaleString()}</div>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.15)", width: "calc(100% - 28px)", maxWidth: 732, margin: "0 auto", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", background: tColor, width: `${tPct}%`, transition: "width 1s linear, background 0.5s", borderRadius: 3 }} />
            </div>
            <div style={{
                background: "rgba(255,255,255,0.95)", width: "calc(100% - 24px)", maxWidth: 736, margin: "10px auto 0", borderRadius: 16,
                padding: "20px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center", minHeight: 88,
                opacity: qVis ? 1 : 0, transform: qVis ? "scale(1)" : "scale(0.95)",
                transition: "all 0.4s ease",
            }}>
                <p style={{ color: "#1a0533", fontWeight: 800, fontSize: 17, textAlign: "center", lineHeight: 1.45 }}>{q.question}</p>
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10,
                width: "calc(100% - 24px)", maxWidth: 736, margin: "8px auto 0",
                opacity: aVis ? 1 : 0, transform: aVis ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.4s ease 0.2s",
                alignContent: "start",
            }}>
                {q.answers.map((ans, idx) => {
                    const cfg = ACFG[idx];
                    let bg = cfg.color, op = 1;
                    if (selected !== null) {
                        if (idx === q.correct) bg = "#26890C";
                        else if (idx === selected) bg = "#E21B3C";
                        else op = 0.38;
                    }
                    return (
                        <button key={idx} className="ans-btn"
                            style={{ width: "100%", border: "none", borderRadius: 13, padding: "14px 12px", cursor: selected !== null ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 8, minHeight: 92, background: bg, opacity: op, boxShadow: "0 4px 14px rgba(0,0,0,0.22)", transition: "transform 0.15s, opacity 0.3s, background 0.3s" }}
                            onClick={() => handleAnswer(idx)} disabled={selected !== null}>
                            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.9)", flexShrink: 0 }}>{cfg.shape}</span>
                            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, textAlign: "left", lineHeight: 1.3 }}>{ans}</span>
                        </button>
                    );
                })}
            </div>
            {streak >= 2 && (
                <div style={{ position: "fixed", bottom: 16, right: 16, background: "#FFA602", color: "#fff", borderRadius: 999, padding: "7px 16px", fontWeight: 900, fontSize: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.3)", zIndex: 99, animation: "pulse 0.6s ease" }}>
                    🔥 {streak}er Streak!
                </div>
            )}
        </div>
    );

    if (screen === "feedback") {
        const correct = selected === q.correct, noAns = selected === null;
        const pts = correct ? calcPts(timeLeft, q.time) : 0;
        return (
            <div style={{ ...wrap, background: correct ? "linear-gradient(160deg,#1a7a10,#0e5209)" : noAns ? "linear-gradient(160deg,#555,#333)" : "linear-gradient(160deg,#c0142d,#8a0e20)" }}>
                <style>{CSS}</style>
                <div style={{ fontSize: 74, marginBottom: 12, animation: "popIn 0.4s ease" }}>{correct ? "✅" : noAns ? "⏱️" : "❌"}</div>
                <h2 style={{ color: "#fff", fontSize: 30, fontWeight: 900, marginBottom: 6 }}>
                    {correct ? "Richtig!" : noAns ? "Zeit abgelaufen!" : "Falsch!"}
                </h2>
                {correct && <p style={{ color: "rgba(255,255,255,0.92)", fontSize: 20 }}>+{pts.toLocaleString()} Punkte</p>}
                {streak >= 2 && correct && <p style={{ color: "#FFD700", fontSize: 15, marginTop: 4 }}>🔥 Streak x{streak}!</p>}
                {!correct && !noAns && (
                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, marginTop: 10, textAlign: "center", maxWidth: 320 }}>
                        ✅ Richtige Antwort: <strong>{q.answers[q.correct]}</strong>
                    </p>
                )}
                <div style={{ marginTop: 18, background: "rgba(0,0,0,0.2)", borderRadius: 14, padding: "12px 32px", textAlign: "center" }}>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>Dein Punktestand</p>
                    <p style={{ color: "#fff", fontSize: 28, fontWeight: 900 }}>{score.toLocaleString()}</p>
                </div>
                <button className="kahoot-btn"
                    style={{ ...btnStyle("rgba(255,255,255,0.2)", "#fff", { border: "2px solid rgba(255,255,255,0.4)", marginTop: 24, maxWidth: 280 }) }}
                    onClick={afterFeedback}>
                    Weiter →
                </button>
            </div>
        );
    }

    if (screen === "leaderboard") {
        const top5 = lb.slice(0, 5);
        const medals = ["🥇", "🥈", "🥉", "4.", "5."];
        return (
            <div style={{ ...wrap, justifyContent: "flex-start", paddingTop: 24 }}>
                <style>{CSS}</style>
                <div style={logo}>kahoot!</div>
                <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginBottom: 16 }}>🏆 Rangliste</h2>
                <div style={{ width: "100%", maxWidth: 460 }}>
                    {top5.map(([name, pts], i) => {
                        const isMe = name === nick;
                        return (
                            <div key={name} style={{ borderRadius: 12, padding: "12px 14px", marginBottom: 7, display: "flex", alignItems: "center", gap: 10, background: isMe ? "rgba(255,215,0,0.25)" : "rgba(255,255,255,0.12)", border: isMe ? "2px solid #FFD700" : "2px solid transparent", animation: `slideUp 0.3s ease ${i * 0.07}s both` }}>
                                <span style={{ fontSize: 20, width: 28 }}>{medals[i]}</span>
                                <span style={{ color: "#fff", fontWeight: 700, flex: 1, fontSize: 14 }}>{name}{isMe ? " (Du)" : ""}</span>
                                <span style={{ color: "#FFD700", fontWeight: 900, fontSize: 16 }}>{pts.toLocaleString()}</span>
                            </div>
                        );
                    })}
                    {myRank >= 5 && (
                        <>
                            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "4px 0" }}>· · ·</div>
                            <div style={{ borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,215,0,0.25)", border: "2px solid #FFD700" }}>
                                <span style={{ width: 28, color: "#fff" }}>{myRank + 1}.</span>
                                <span style={{ color: "#fff", fontWeight: 700, flex: 1 }}>{nick} (Du)</span>
                                <span style={{ color: "#FFD700", fontWeight: 900 }}>{score.toLocaleString()}</span>
                            </div>
                        </>
                    )}
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 14, fontSize: 12 }}>
                    Frage {qIdx + 1} von {QUESTIONS.length}
                </p>
                <button className="kahoot-btn" style={{ ...btnStyle(), maxWidth: 280, marginTop: 8 }} onClick={nextQ}>
                    Nächste Frage →
                </button>
            </div>
        );
    }

    if (screen === "podium") {
        const top3 = lb.slice(0, 3);
        const pod = [top3[1], top3[0], top3[2]];
        const hs = [145, 185, 115];
        const cols = ["#C0C0C0", "#FFD700", "#CD7F32"];
        const ms = ["🥈", "🥇", "🥉"];
        return (
            <div style={{ ...wrap, justifyContent: "flex-start", paddingTop: 20 }}>
                <style>{CSS}</style>
                <div style={logo}>kahoot!</div>
                <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>🎉 Spiel beendet!</h1>
                <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 22, textAlign: "center", fontSize: 14 }}>
                    {nick}: {totalOk}/{QUESTIONS.length} Fragen richtig beantwortet
                </p>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, marginBottom: 22, width: "100%", maxWidth: 380 }}>
                    {pod.map((player, i) => player ? (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                            <div style={{ fontSize: 22 }}>{player[0] === nick ? "😊" : "👤"}</div>
                            <p style={{ color: "#fff", fontWeight: 700, fontSize: 10, textAlign: "center", margin: "3px 0", wordBreak: "break-all" }}>{player[0]}</p>
                            <p style={{ color: cols[i], fontWeight: 900, fontSize: 12, margin: "0 0 3px" }}>{player[1].toLocaleString()}</p>
                            <div style={{ width: "100%", height: hs[i], background: cols[i], borderRadius: "8px 8px 0 0", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 10, fontSize: 26 }}>
                                {ms[i]}
                            </div>
                        </div>
                    ) : <div key={i} style={{ flex: 1 }} />)}
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "18px 28px", textAlign: "center", maxWidth: 300, width: "100%", marginBottom: 18 }}>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 6 }}>Dein Ergebnis</p>
                    <p style={{ color: "#FFD700", fontSize: 42, fontWeight: 900 }}>{score.toLocaleString()}</p>
                    <p style={{ color: "#fff", fontSize: 13, marginTop: 6 }}>Platz {myRank + 1} von {lb.length}</p>
                </div>
                <button className="kahoot-btn" style={{ ...btnStyle("#fff", "#46178f"), maxWidth: 280 }} onClick={reset}>
                    🔄 Nochmal spielen
                </button>
            </div>
        );
    }

    return null;
}
