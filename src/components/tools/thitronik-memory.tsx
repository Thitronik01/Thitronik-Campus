"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Caravan,
    Building2,
    MapPin,
    Smartphone,
    LocateFixed,
    Flame,
    Wrench,
    RotateCcw,
    Trophy,
    Brain,
    CheckCircle2,
    XCircle,
} from "lucide-react";

const PAIRS = [
    {
        id: "freizeitfahrzeuge",
        title: "Freizeitfahrzeuge",
        icon: Caravan,
        accent: "from-sky-500/20 to-cyan-500/20",
        question: "Für wen entwickelt THITRONIK professionelle Sicherheitstechnik?",
        choices: [
            "Für Freizeitfahrzeuge wie Reisemobile",
            "Für Hochsee-Yachten",
            "Nur für Einfamilienhäuser",
            "Nur für Lastwagenflotten",
        ],
        correctIndex: 0,
        explanation:
            "THITRONIK positioniert sich als Spezialist für Sicherheitstechnik in Freizeitfahrzeugen und mobilen Zuhause.",
    },
    {
        id: "gruendung",
        title: "2010",
        icon: ShieldCheck,
        accent: "from-emerald-500/20 to-teal-500/20",
        question: "In welchem Jahr wurde THITRONIK gegründet?",
        choices: ["2005", "2010", "2014", "2019"],
        correctIndex: 1,
        explanation:
            "Laut Unternehmensdarstellung wurde THITRONIK im Jahr 2010 gegründet.",
    },
    {
        id: "umzug",
        title: "Seit 2019 in Eckernförde",
        icon: Building2,
        accent: "from-violet-500/20 to-fuchsia-500/20",
        question: "Wann zog THITRONIK von Kiel nach Eckernförde um?",
        choices: ["2016", "2017", "2019", "2021"],
        correctIndex: 2,
        explanation:
            "Das Unternehmen beschreibt, dass es 2019 von Kiel nach Eckernförde in größere Produktionsstätten umzog.",
    },
    {
        id: "adresse",
        title: "Finkenweg 9–15",
        icon: MapPin,
        accent: "from-amber-500/20 to-orange-500/20",
        question: "Wie lautet die Adresse des Unternehmenssitzes in Eckernförde?",
        choices: [
            "Hafenstraße 3, 24340 Eckernförde",
            "Finkenweg 9–15, 24340 Eckernförde",
            "Ostseering 21, 24103 Kiel",
            "Schulweg 8, 24340 Eckernförde",
        ],
        correctIndex: 1,
        explanation:
            "Im Kontaktbereich nennt THITRONIK den Sitz am Finkenweg 9–15 in 24340 Eckernförde.",
    },
    {
        id: "wipro",
        title: "WiPro III safe.lock",
        icon: Smartphone,
        accent: "from-blue-500/20 to-indigo-500/20",
        question: "Wie heißt ein zentrales THITRONIK Alarmsystem?",
        choices: ["SafeCam One", "WiPro III safe.lock", "TrackBox 360", "GatePro Home"],
        correctIndex: 1,
        explanation:
            "Die WiPro III safe.lock ist eines der bekanntesten THITRONIK Systeme für Reisemobile.",
    },
    {
        id: "profinder",
        title: "Pro-finder",
        icon: LocateFixed,
        accent: "from-rose-500/20 to-pink-500/20",
        question: "Wofür steht der THITRONIK Pro-finder hauptsächlich?",
        choices: [
            "Für die Fahrzeugortung und Vernetzung",
            "Für die Klimasteuerung im Fahrzeug",
            "Für Solarladung auf dem Dach",
            "Für Rangierhilfe beim Einparken",
        ],
        correctIndex: 0,
        explanation:
            "Der Pro-finder wird bei THITRONIK für Ortung, Alarmmeldungen und App-/SMS-Funktionen eingesetzt.",
    },
    {
        id: "gas",
        title: "G.A.S.-connect",
        icon: Flame,
        accent: "from-red-500/20 to-amber-500/20",
        question: "Welche Gase erkennt der Funk-Gaswarner G.A.S.-connect laut Produktseite?",
        choices: [
            "Nur Sauerstoff und Stickstoff",
            "Nur CO₂",
            "Propan, Butan und KO-/Narkosegase",
            "Nur Wasserdampf",
        ],
        correctIndex: 2,
        explanation:
            "THITRONIK nennt für den G.A.S.-connect Propan, Butan und KO-/Narkosegase.",
    },
    {
        id: "werkseinbau",
        title: "Werkseinbauservice",
        icon: Wrench,
        accent: "from-lime-500/20 to-green-500/20",
        question: "Was bietet THITRONIK beim Werkseinbauservice in Eckernförde an?",
        choices: [
            "Nur einen Ersatzreifen",
            "Kostenlosen Leihwagen oder E-Bikes während des Einbaus",
            "Eine Hotelübernachtung in Hamburg",
            "Ausschließlich Online-Support",
        ],
        correctIndex: 1,
        explanation:
            "Der Werkseinbauservice wirbt damit, dass während des Einbaus ein kostenloser Leihwagen oder E-Bikes verfügbar sind.",
    },
];

function shuffle(array: any[]) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildDeck() {
    return shuffle(
        PAIRS.flatMap((pair) => [
            {
                uid: `${pair.id}-a`,
                pairId: pair.id,
                matched: false,
                faceUp: false,
            },
            {
                uid: `${pair.id}-b`,
                pairId: pair.id,
                matched: false,
                faceUp: false,
            },
        ])
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.18em] text-white/50">{label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
        </div>
    );
}

export function ThitronikMemory() {
    const [cards, setCards] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [locked, setLocked] = useState(false);
    const [quiz, setQuiz] = useState<any>(null);
    const [quizStage, setQuizStage] = useState("question");
    const [quizResult, setQuizResult] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [turns, setTurns] = useState(0);
    const [knowledgePoints, setKnowledgePoints] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCards(buildDeck());
    }, []);

    const completedPairs = useMemo(
        () => cards.filter((card) => card.matched).length / 2,
        [cards]
    );

    const totalPairs = PAIRS.length;
    const gameWon = isClient && completedPairs === totalPairs;

    const resetGame = () => {
        setCards(buildDeck());
        setSelected([]);
        setLocked(false);
        setQuiz(null);
        setQuizStage("question");
        setQuizResult(null);
        setScore(0);
        setTurns(0);
        setKnowledgePoints(0);
    };

    const flipCard = (uid: string) => {
        if (locked || quiz || gameWon) return;

        const current = cards.find((card) => card.uid === uid);
        if (!current || current.faceUp || current.matched) return;

        const nextCards = cards.map((card) =>
            card.uid === uid ? { ...card, faceUp: true } : card
        );
        const nextSelected = [...selected, uid];

        setCards(nextCards);
        setSelected(nextSelected);

        if (nextSelected.length === 2) {
            setLocked(true);
            setTurns((value) => value + 1);

            const [firstId, secondId] = nextSelected;
            const first = nextCards.find((card) => card.uid === firstId);
            const second = nextCards.find((card) => card.uid === secondId);

            window.setTimeout(() => {
                if (first.pairId === second.pairId) {
                    const pairData = PAIRS.find((pair) => pair.id === first.pairId);
                    setQuiz({ pair: pairData, cardIds: [firstId, secondId] });
                    setQuizStage("question");
                    setQuizResult(null);
                    setScore((value) => value + 10);
                } else {
                    setCards((prev) =>
                        prev.map((card) =>
                            card.uid === firstId || card.uid === secondId
                                ? { ...card, faceUp: false }
                                : card
                        )
                    );
                    setSelected([]);
                    setLocked(false);
                }
            }, 550);
        }
    };

    const answerQuiz = (choiceIndex: number) => {
        if (!quiz) return;
        const isCorrect = choiceIndex === quiz.pair.correctIndex;
        setQuizResult({ isCorrect, selectedIndex: choiceIndex });
        setQuizStage("feedback");

        if (isCorrect) {
            setCards((prev) =>
                prev.map((card) =>
                    quiz.cardIds.includes(card.uid) ? { ...card, matched: true } : card
                )
            );
            setScore((value) => value + 20);
            setKnowledgePoints((value) => value + 1);
        } else {
            setScore((value) => Math.max(0, value - 5));
        }
    };

    const continueAfterQuiz = () => {
        if (!quiz) return;

        if (quizResult && !quizResult.isCorrect) {
            setCards((prev) =>
                prev.map((card) =>
                    quiz.cardIds.includes(card.uid) ? { ...card, faceUp: false } : card
                )
            );
        }

        setSelected([]);
        setLocked(false);
        setQuiz(null);
        setQuizStage("question");
        setQuizResult(null);
    };

    if (!isClient) return null;

    return (
        <div className="text-white">
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
                        <div className="border-b border-white/10 p-6 md:p-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                                <Brain className="h-4 w-4" />
                                Spielbares Konzept für THITRONIK aus Eckernförde
                            </div>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                                THITRONIK Memory Quiz
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 md:text-base">
                                Finde Paare, beantworte die Firmenfrage richtig und sichere das Match dauerhaft.
                                So wird aus einem klassischen Memory ein Marken- und Wissensspiel.
                            </p>
                        </div>

                        <div className="grid gap-4 p-6 md:grid-cols-4">
                            <StatCard label="Punkte" value={score} />
                            <StatCard label="Züge" value={turns} />
                            <StatCard label="Wissenspunkte" value={`${knowledgePoints}/${totalPairs}`} />
                            <StatCard label="Fortschritt" value={`${completedPairs}/${totalPairs}`} />
                        </div>

                        <div className="px-6 pb-6">
                            <div className="mb-4 h-3 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                    className="h-full rounded-full bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(completedPairs / totalPairs) * 100}%` }}
                                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {cards.map((card) => {
                                    const pair = PAIRS.find((item) => item.id === card.pairId);
                                    if (!pair) return null;
                                    const Icon = pair.icon;
                                    const isActive = card.faceUp || card.matched;

                                    return (
                                        <motion.button
                                            key={card.uid}
                                            whileHover={!isActive ? { scale: 1.02 } : { scale: 1 }}
                                            whileTap={!isActive ? { scale: 0.98 } : { scale: 1 }}
                                            onClick={() => flipCard(card.uid)}
                                            className="group relative aspect-[4/5] rounded-[24px] text-left outline-none"
                                        >
                                            <AnimatePresence mode="wait" initial={false}>
                                                {isActive ? (
                                                    <motion.div
                                                        key="front"
                                                        initial={{ rotateY: -90, opacity: 0.35 }}
                                                        animate={{ rotateY: 0, opacity: 1 }}
                                                        exit={{ rotateY: 90, opacity: 0.35 }}
                                                        transition={{ duration: 0.22 }}
                                                        className={`absolute inset-0 rounded-[24px] border ${card.matched ? "border-emerald-400/40" : "border-white/10"
                                                            } bg-gradient-to-br ${pair.accent} p-4 shadow-lg backdrop-blur`}
                                                        style={{ transformStyle: "preserve-3d" }}
                                                    >
                                                        <div className="flex h-full flex-col justify-between">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                                                    <Icon className="h-6 w-6" />
                                                                </div>
                                                                {card.matched ? (
                                                                    <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[11px] font-medium text-emerald-200 text-center flex items-center">
                                                                        gesichert
                                                                    </span>
                                                                ) : (
                                                                    <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-medium text-white/70">
                                                                        prüfen
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-lg font-semibold leading-tight">{pair.title}</div>
                                                                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-white/55">
                                                                    THITRONIK Wissen
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="back"
                                                        initial={{ rotateY: 90, opacity: 0.35 }}
                                                        animate={{ rotateY: 0, opacity: 1 }}
                                                        exit={{ rotateY: -90, opacity: 0.35 }}
                                                        transition={{ duration: 0.22 }}
                                                        className="absolute inset-0 overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-lg"
                                                    >
                                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.10),transparent_30%)]" />
                                                        <div className="relative flex h-full flex-col justify-between">
                                                            <div className="text-xs uppercase tracking-[0.2em] text-white/40">Eckernförde</div>
                                                            <div className="flex items-center justify-center">
                                                                <div className="rounded-full border border-white/10 bg-white/5 p-5 shadow-inner">
                                                                    <ShieldCheck className="h-10 w-10 text-white/80" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-white/85">THITRONIK</div>
                                                                <div className="text-xs text-white/45">Memory Card</div>
                                                            </div>
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
                </div>

                <div className="space-y-6">
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur text-white">
                        <h2 className="text-xl font-semibold">So funktioniert der Entwurf</h2>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-white/70">
                            <p>
                                1. Zwei Karten aufdecken und ein Paar finden.
                            </p>
                            <p>
                                2. Nach jedem Treffer erscheint direkt eine Frage über THITRONIK.
                            </p>
                            <p>
                                3. Nur mit richtiger Antwort wird das Paar dauerhaft gesichert.
                            </p>
                            <p>
                                4. Damit eignet sich das Spiel für Messe, Onboarding, Vertrieb oder Schulung.
                            </p>
                        </div>
                        <button
                            onClick={resetGame}
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01]"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Neu mischen
                        </button>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 p-6 text-white">
                        <h3 className="text-lg font-semibold">Warum das für THITRONIK passt</h3>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                            <p>Der Memory-Teil sorgt für niedrige Einstiegshürde und hohe Interaktion.</p>
                            <p>Die Wissensfragen verankern Markenfakten statt nur Logos oder Produktnamen zu zeigen.</p>
                            <p>Das Spiel lässt sich später leicht mit echten Produktbildern, Messestand-Branding oder Lead-Erfassung erweitern.</p>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {quiz && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 24, scale: 0.98, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 16, scale: 0.98, opacity: 0 }}
                            className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 text-cyan-200">
                                <Brain className="h-5 w-5" />
                                <span className="text-sm font-medium">Frage zum Treffer</span>
                            </div>

                            <h3 className="mt-4 text-2xl font-semibold leading-tight">{quiz.pair.question}</h3>

                            {quizStage === "question" ? (
                                <div className="mt-6 grid gap-3">
                                    {quiz.pair.choices.map((choice: string, index: number) => (
                                        <button
                                            key={choice}
                                            onClick={() => answerQuiz(index)}
                                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white/85 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                                        >
                                            <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold">
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <div className="flex items-start gap-3">
                                        {quizResult?.isCorrect ? (
                                            <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-300" />
                                        ) : (
                                            <XCircle className="mt-0.5 h-6 w-6 text-rose-300" />
                                        )}
                                        <div>
                                            <div className="text-lg font-semibold">
                                                {quizResult?.isCorrect ? "Richtig – Paar gesichert!" : "Noch nicht – das Paar dreht sich wieder um."}
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-white/70">{quiz.pair.explanation}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={continueAfterQuiz}
                                        className="mt-5 inline-flex items-center rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01]"
                                    >
                                        Weiter
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {gameWon && !quiz && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 24, scale: 0.98, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 16, scale: 0.98, opacity: 0 }}
                            className="w-full max-w-xl rounded-[28px] border border-white/10 bg-slate-900 p-8 text-center shadow-2xl"
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/15 text-amber-200">
                                <Trophy className="h-8 w-8" />
                            </div>
                            <h3 className="mt-5 text-3xl font-semibold">Mission abgeschlossen</h3>
                            <p className="mt-3 text-sm leading-6 text-white/70">
                                Du hast alle THITRONIK-Paare gefunden und alle Wissensfragen gemeistert.
                            </p>
                            <div className="mt-6 grid grid-cols-3 gap-3 text-left">
                                <StatCard label="Punkte" value={score} />
                                <StatCard label="Züge" value={turns} />
                                <StatCard label="Quiz" value={`${knowledgePoints}/${totalPairs}`} />
                            </div>
                            <button
                                onClick={resetGame}
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01]"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Nochmal spielen
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
