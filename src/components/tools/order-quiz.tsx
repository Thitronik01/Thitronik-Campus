"use client";

import { useMemo, useState, useEffect } from "react";
import {
    CheckCircle2,
    GripVertical,
    RotateCcw,
    Shuffle,
    Trophy,
    ArrowUp,
    ArrowDown,
    Eye,
    EyeOff,
    RefreshCw,
    ChevronRight,
    Target,
    Sparkles,
} from "lucide-react";

type Step = {
    id: string;
    label: string;
    hint: string;
};

type Scenario = {
    id: string;
    title: string;
    subtitle: string;
    difficulty: "Leicht" | "Mittel" | "Anspruchsvoll";
    steps: Step[];
};

type CheckResult = {
    correctPositions: number[];
    isSolved: boolean;
};

const scenarios: Scenario[] = [
    {
        id: "sirene-basics",
        title: "Sirenen-Einbau",
        subtitle: "Bringe die Montageschritte in die richtige Reihenfolge.",
        difficulty: "Leicht",
        steps: [
            { id: "s1", label: "Montageort festlegen und Fahrzeug prüfen", hint: "Erst planen, dann bohren oder kleben." },
            { id: "s2", label: "Material und Werkzeug vorbereiten", hint: "Kabel, Halter, Befestigung und Werkzeug bereitlegen." },
            { id: "s3", label: "Bauteil sicher montieren", hint: "Mechanisch zuerst sauber befestigen." },
            { id: "s4", label: "Elektrisch anschließen", hint: "Erst nach der Montage verdrahten." },
            { id: "s5", label: "Funktionstest durchführen", hint: "Am Ende prüfen, ob alles korrekt arbeitet." },
            { id: "s6", label: "Einbau dokumentieren", hint: "Zum Schluss sauber festhalten und übergeben." },
        ],
    },
    {
        id: "zentrale-setup",
        title: "Zentrale in Betrieb nehmen",
        subtitle: "Ordne die Schritte vom Einbau bis zur Übergabe.",
        difficulty: "Mittel",
        steps: [
            { id: "z1", label: "Einbauposition der Zentrale festlegen", hint: "Der Platz entscheidet über Kabelführung und Schutz." },
            { id: "z2", label: "Zentrale befestigen", hint: "Bevor Kabel final angeschlossen werden." },
            { id: "z3", label: "Versorgung und Eingänge verkabeln", hint: "Strom und Signale sauber anschließen." },
            { id: "z4", label: "Sensoren und Aktoren verbinden", hint: "Peripherie nach der Grundverkabelung." },
            { id: "z5", label: "System konfigurieren", hint: "Parameter erst nach vollständigem Anschluss setzen." },
            { id: "z6", label: "Gesamtsystem testen", hint: "Alle Funktionen und Fehlerfälle prüfen." },
            { id: "z7", label: "Kundenübergabe vorbereiten", hint: "Einweisung und Dokumentation kommen zuletzt." },
        ],
    },
    {
        id: "komplett-abnahme",
        title: "Komplette Abnahme",
        subtitle: "Hier zählt die saubere Reihenfolge über den ganzen Ablauf.",
        difficulty: "Anspruchsvoll",
        steps: [
            { id: "k1", label: "Anforderung und Fahrzeugzustand aufnehmen", hint: "Der Auftrag beginnt mit der Aufnahme." },
            { id: "k2", label: "Montagekonzept festlegen", hint: "Wo sitzt was, wie laufen Kabel, wie wird geschützt?" },
            { id: "k3", label: "Bauteile vormontieren und positionieren", hint: "Mechanische Vorbereitung zuerst." },
            { id: "k4", label: "Kabelwege herstellen und sichern", hint: "Saubere Führung vor dem finalen Anschluss." },
            { id: "k5", label: "Elektrische Anbindung durchführen", hint: "Jetzt werden die Komponenten verbunden." },
            { id: "k6", label: "Software / Parameter einrichten", hint: "Nach dem Hardware-Stand folgt die Konfiguration." },
            { id: "k7", label: "Praxis- und Fehlertest durchführen", hint: "Normale Nutzung und Störfälle prüfen." },
            { id: "k8", label: "Dokumentation und Übergabe abschließen", hint: "Der letzte Schritt vor Freigabe." },
        ],
    },
];

function hashSeed(input: string): number {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash) || 1;
}

function seededShuffle<T>(items: T[], seedKey: string): T[] {
    const result = [...items];
    let seed = hashSeed(seedKey);

    for (let i = result.length - 1; i > 0; i -= 1) {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        const j = seed % (i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }

    if (result.every((item, index) => item === items[index]) && result.length > 1) {
        [result[0], result[1]] = [result[1], result[0]];
    }

    return result;
}

function createRound(scenario: Scenario, roundSeed: number): Step[] {
    return seededShuffle(scenario.steps, `${scenario.id}-${roundSeed}`);
}

function evaluateOrder(current: Step[], target: Step[]): CheckResult {
    const correctPositions = current
        .map((step, index) => (step.id === target[index]?.id ? index : -1))
        .filter((index) => index >= 0);

    return {
        correctPositions,
        isSolved: correctPositions.length === target.length,
    };
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
}

function swapItems<T>(list: T[], first: number, second: number): T[] {
    const next = [...list];
    [next[first], next[second]] = [next[second], next[first]];
    return next;
}

function getDifficultyTone(level: Scenario["difficulty"]) {
    if (level === "Leicht") {
        return "bg-[#AFCA05]/15 text-[#1D3661] border-[#AFCA05]/30";
    }

    if (level === "Mittel") {
        return "bg-[#3BA9D3]/12 text-[#1D3661] border-[#3BA9D3]/30";
    }

    return "bg-[#1D3661]/10 text-[#1D3661] border-[#1D3661]/20";
}

export function OrderQuiz() {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const scenario = scenarios[scenarioIndex];

    const [roundSeed, setRoundSeed] = useState(1);
    const [items, setItems] = useState<Step[]>(() => createRound(scenarios[0], 1));
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [solvedRounds, setSolvedRounds] = useState<string[]>([]);
    const [lastCheck, setLastCheck] = useState<CheckResult | null>(null);

    const solved = lastCheck?.isSolved ?? false;
    const correctCount = lastCheck?.correctPositions.length ?? 0;
    const progressPercent = Math.round((correctCount / scenario.steps.length) * 100);
    const courseProgressPercent = Math.round((solvedRounds.length / scenarios.length) * 100);
    const solvedSet = useMemo(() => new Set(solvedRounds), [solvedRounds]);

    function startScenario(nextIndex: number) {
        const nextScenario = scenarios[nextIndex];
        const nextSeed = 1;
        setScenarioIndex(nextIndex);
        setRoundSeed(nextSeed);
        setItems(createRound(nextScenario, nextSeed));
        setDraggedId(null);
        setSelectedId(null);
        setShowSolution(false);
        setAttempts(0);
        setLastCheck(null);
    }

    function reshuffle() {
        const nextSeed = roundSeed + 1;
        setRoundSeed(nextSeed);
        setItems(createRound(scenario, nextSeed));
        setDraggedId(null);
        setSelectedId(null);
        setLastCheck(null);
        setShowSolution(false);
    }

    function resetCurrentRound() {
        setItems(createRound(scenario, 1));
        setRoundSeed(1);
        setDraggedId(null);
        setSelectedId(null);
        setLastCheck(null);
        setShowSolution(false);
        setAttempts(0);
    }

    function moveUp(index: number) {
        if (index === 0) return;
        setItems((current) => moveItem(current, index, index - 1));
        setLastCheck(null);
    }

    function moveDown(index: number) {
        if (index === items.length - 1) return;
        setItems((current) => moveItem(current, index, index + 1));
        setLastCheck(null);
    }

    function handleSelectCard(stepId: string) {
        if (selectedId === stepId) {
            setSelectedId(null);
            return;
        }

        if (!selectedId) {
            setSelectedId(stepId);
            return;
        }

        setItems((current) => {
            const firstIndex = current.findIndex((item) => item.id === selectedId);
            const secondIndex = current.findIndex((item) => item.id === stepId);

            if (firstIndex < 0 || secondIndex < 0) {
                return current;
            }

            return swapItems(current, firstIndex, secondIndex);
        });

        setSelectedId(null);
        setLastCheck(null);
    }

    function handleCheck() {
        const result = evaluateOrder(items, scenario.steps);
        setAttempts((value) => value + 1);
        setLastCheck(result);

        if (result.isSolved && !solvedSet.has(scenario.id)) {
            setSolvedRounds((current) => [...current, scenario.id]);
        }
    }

    function goToNextScenario() {
        const nextIndex = (scenarioIndex + 1) % scenarios.length;
        startScenario(nextIndex);
    }

    return (
        <div className="mx-auto grid max-w-[1400px] gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="space-y-6 rounded-[28px] border border-white/10 bg-[#1D3661] p-6 text-white shadow-[0_24px_60px_rgba(29,54,97,0.18)] xl:sticky xl:top-6 xl:h-fit">
                <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3BA9D3]/30 bg-[#3BA9D3]/12 px-3 py-1.5 text-xs font-semibold text-[#3BA9D3]">
                        <Target className="h-3.5 w-3.5" />
                        THITRONIK Lernspiel
                    </div>
                    <h1 className="text-[28px] font-bold leading-tight text-white">Einbauschritte korrekt sortieren</h1>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                        Ruhiges CI, klare Interaktion und sofort spielbar: Karten ziehen, verschieben oder gezielt tauschen.
                    </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">Aktives Szenario</p>
                            <h2 className="mt-2 text-lg font-semibold text-white">{scenario.title}</h2>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyTone(scenario.difficulty)}`}>
                            {scenario.difficulty}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-white/68">{scenario.subtitle}</p>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl bg-white/6 p-3">
                            <div className="text-white/55">Versuche</div>
                            <div className="mt-1 text-xl font-semibold text-white">{attempts}</div>
                        </div>
                        <div className="rounded-2xl bg-white/6 p-3">
                            <div className="text-white/55">Treffer</div>
                            <div className="mt-1 text-xl font-semibold text-white">{correctCount}/{scenario.steps.length}</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                            <span>Szenario-Fortschritt</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-[#AFCA05] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                            <span>Campus-Fortschritt</span>
                            <span>{courseProgressPercent}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-[#3BA9D3] transition-all duration-300" style={{ width: `${courseProgressPercent}%` }} />
                        </div>
                    </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                        <Sparkles className="h-4 w-4 text-[#AFCA05]" />
                        So spielst du
                    </div>
                    <div className="space-y-2 text-sm leading-6 text-white/72">
                        <p>1. Karten per Drag-and-Drop an die gewünschte Position ziehen.</p>
                        <p>2. Alternativ mit den Pfeilen verschieben oder zwei Karten nacheinander auf „Tauschen“ setzen.</p>
                        <p>3. Danach prüfen und direkt Feedback erhalten.</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Szenarien</p>
                    <div className="space-y-2">
                        {scenarios.map((entry, index) => {
                            const isActive = index === scenarioIndex;
                            const isDone = solvedSet.has(entry.id);

                            return (
                                <button
                                    key={entry.id}
                                    type="button"
                                    onClick={() => startScenario(index)}
                                    className={`w-full rounded-[22px] border px-4 py-3 text-left transition-all duration-200 ${isActive
                                            ? "border-white/40 bg-[#E3000F] shadow-[0_10px_30px_rgba(227,0,15,0.30)]"
                                            : "border-transparent bg-[#E3000F]/70 hover:bg-[#E3000F]/90"
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 font-semibold text-white">
                                                {entry.title}
                                                {isActive && (
                                                    <span className="relative flex h-2.5 w-2.5">
                                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#AFCA05] opacity-75"></span>
                                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#AFCA05]"></span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1 text-xs text-white/80">{entry.difficulty}</div>
                                        </div>
                                        {isDone ? <CheckCircle2 className="h-5 w-5 text-white" /> : <div className="h-2.5 w-2.5 rounded-full bg-white/30" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            <main className="space-y-6">
                <section className="overflow-hidden rounded-[28px] border border-[#1D3661]/8 bg-white shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
                    <div className="border-b border-[#1D3661]/8 bg-gradient-to-r from-[#1D3661] to-[#24457C] px-6 py-6 text-white">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-[#3BA9D3]">
                                    <span>🎯</span>
                                    Interaktives Reihenfolge-Spiel
                                </div>
                                <h2 className="mt-3 text-3xl font-bold tracking-tight">{scenario.title}</h2>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">
                                    Ordne die Einbauschritte in eine fachlich saubere Reihenfolge. Die Bedienung ist bewusst direkt, ruhig und für Desktop wie Mobile nutzbar.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={reshuffle}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/16"
                                >
                                    <Shuffle className="h-4 w-4" />
                                    Neu mischen
                                </button>
                                <button
                                    type="button"
                                    onClick={resetCurrentRound}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/16"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Zurücksetzen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowSolution((value) => !value)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/16"
                                >
                                    {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    {showSolution ? "Lösung ausblenden" : "Lösung anzeigen"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCheck}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[#3BA9D3] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(59,169,211,0.28)] transition hover:translate-y-[-1px] hover:bg-[#349bc3]"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Reihenfolge prüfen
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white px-6 py-5">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#111111]/70">
                            <span className="rounded-full bg-[#F0F0F0] px-3 py-1">Ziehen</span>
                            <span className="rounded-full bg-[#F0F0F0] px-3 py-1">Pfeile nutzen</span>
                            <span className="rounded-full bg-[#F0F0F0] px-3 py-1">Zwei Karten tauschen</span>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="rounded-[28px] border border-[#1D3661]/8 bg-white p-6 shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
                        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-[#111111]">Deine Reihenfolge</h3>
                                <p className="mt-1 text-sm text-[#111111]/62">Nutze die Interaktion, die für dich am schnellsten ist.</p>
                            </div>
                            <div className="text-sm text-[#3BA9D3]">Aktive Auswahl: {selectedId ? "1 Karte markiert" : "keine"}</div>
                        </div>

                        <div className="space-y-3">
                            {items.map((step, index) => {
                                const isCorrect = lastCheck?.correctPositions.includes(index) ?? false;
                                const isDragged = draggedId === step.id;
                                const isSelected = selectedId === step.id;

                                return (
                                    <div
                                        key={step.id}
                                        draggable
                                        onDragStart={() => setDraggedId(step.id)}
                                        onDragEnd={() => setDraggedId(null)}
                                        onDragOver={(event) => event.preventDefault()}
                                        onDrop={() => {
                                            if (!draggedId || draggedId === step.id) return;
                                            const fromIndex = items.findIndex((item) => item.id === draggedId);
                                            const toIndex = items.findIndex((item) => item.id === step.id);
                                            setItems((current) => moveItem(current, fromIndex, toIndex));
                                            setDraggedId(null);
                                            setSelectedId(null);
                                            setLastCheck(null);
                                        }}
                                        className={`group rounded-[24px] border p-4 transition-all duration-200 ${isCorrect
                                                ? "border-[#AFCA05]/45 bg-[#AFCA05]/10"
                                                : isSelected
                                                    ? "border-[#1D3661]/30 bg-[#1D3661]/5 ring-2 ring-[#1D3661]/8"
                                                    : isDragged
                                                        ? "border-[#3BA9D3]/35 bg-[#3BA9D3]/8 shadow-[0_12px_28px_rgba(59,169,211,0.10)]"
                                                        : "border-[#1D3661]/10 bg-white hover:border-[#3BA9D3]/22 hover:shadow-[0_12px_30px_rgba(17,17,17,0.05)]"
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${isCorrect ? "bg-[#AFCA05] text-[#1D3661]" : "bg-[#F0F0F0] text-[#1D3661]"
                                                }`}>
                                                {index + 1}
                                            </div>

                                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                                <div className="mt-1 text-[#3BA9D3]">
                                                    <GripVertical className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-[#111111]">{step.label}</div>
                                                    <div className="mt-1 text-sm leading-6 text-[#111111]/60">{step.hint}</div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectCard(step.id)}
                                                    aria-pressed={isSelected}
                                                    className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition ${isSelected
                                                            ? "border-[#1D3661] bg-[#1D3661] text-white"
                                                            : "border-[#1D3661]/12 bg-[#F0F0F0] text-[#1D3661] hover:border-[#3BA9D3]/30 hover:bg-[#3BA9D3]/10"
                                                        }`}
                                                    aria-label={isSelected ? `${step.label} Auswahl aufheben` : `${step.label} zum Tauschen auswählen`}
                                                >
                                                    {isSelected ? "Ausgewählt" : "Tauschen"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveUp(index)}
                                                    className="rounded-2xl border border-[#1D3661]/12 bg-[#F0F0F0] p-2 text-[#1D3661] transition hover:border-[#3BA9D3]/30 hover:bg-[#3BA9D3]/10 disabled:cursor-not-allowed disabled:opacity-35"
                                                    disabled={index === 0}
                                                    aria-label={`${step.label} nach oben verschieben`}
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveDown(index)}
                                                    className="rounded-2xl border border-[#1D3661]/12 bg-[#F0F0F0] p-2 text-[#1D3661] transition hover:border-[#3BA9D3]/30 hover:bg-[#3BA9D3]/10 disabled:cursor-not-allowed disabled:opacity-35"
                                                    disabled={index === items.length - 1}
                                                    aria-label={`${step.label} nach unten verschieben`}
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section className="rounded-[28px] border border-[#1D3661]/8 bg-white p-6 shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
                            <h3 className="text-xl font-semibold text-[#111111]">Feedback</h3>
                            <div className="mt-4 rounded-[22px] bg-[#F0F0F0] p-4 text-sm leading-6 text-[#111111]/75">
                                {!lastCheck ? (
                                    <p>Noch nicht geprüft. Sortiere die Karten und prüfe dann deine Reihenfolge.</p>
                                ) : solved ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 font-semibold text-[#1D3661]">
                                            <Trophy className="h-5 w-5 text-[#AFCA05]" />
                                            Perfekt – alle Schritte sind korrekt sortiert.
                                        </div>
                                        <p>Die Reihenfolge stimmt vollständig. Du kannst direkt mit dem nächsten Szenario weitermachen.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 font-semibold text-[#1D3661]">
                                            <RefreshCw className="h-5 w-5 text-[#3BA9D3]" />
                                            Noch nicht ganz.
                                        </div>
                                        <p>
                                            {correctCount} von {scenario.steps.length} Positionen stimmen bereits. Nutze die Hinweise auf den Karten oder blende die Referenzlösung ein.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {solved ? (
                                <button
                                    type="button"
                                    onClick={goToNextScenario}
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#AFCA05] px-4 py-3 font-semibold text-[#1D3661] shadow-[0_12px_28px_rgba(175,202,5,0.22)] transition hover:translate-y-[-1px]"
                                >
                                    Nächstes Szenario
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : null}
                        </section>

                        <section className="rounded-[28px] border border-[#1D3661]/8 bg-white p-6 shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
                            <h3 className="text-xl font-semibold text-[#111111]">Referenzlösung</h3>
                            <div className="mt-4 space-y-3">
                                {showSolution ? (
                                    scenario.steps.map((step, index) => (
                                        <div key={step.id} className="rounded-[22px] border border-[#1D3661]/10 bg-[#F0F0F0] p-4">
                                            <div className="text-sm font-semibold text-[#111111]">
                                                {index + 1}. {step.label}
                                            </div>
                                            <div className="mt-1 text-sm leading-6 text-[#111111]/60">{step.hint}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-[22px] border border-dashed border-[#1D3661]/18 bg-[#F0F0F0] p-4 text-sm leading-6 text-[#111111]/65">
                                        Die Lösung ist ausgeblendet. Nutze „Lösung anzeigen“, wenn du eine Hilfestellung brauchst.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </section>
            </main>
        </div>
    );
}
