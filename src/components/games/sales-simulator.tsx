"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

// ── Typen ──────────────────────────────────────────────────────────────────────
type Quality = "perfect" | "okay" | "bad";

interface Option {
    id: string;
    label: string;
    quality: Quality;
    xp: number;
    moodDelta: number;
    feedback: string;
    tip: string;
}

interface Scenario {
    phase: string;
    phaseColor: string;
    phaseEmoji: string;
    situation: string;
    customerText: string;
    options: Option[];
}

// ── Szenarien (Herr Müller, 12 LKWs) ─────────────────────────────────────────
const SCENARIOS: Scenario[] = [
    {
        phase: "Begrüßung",
        phaseColor: "blue",
        phaseEmoji: "👋",
        situation: "Sie betreten das Büro von Herrn Müller, Fuhrparkleiter eines mittelständischen Logistikunternehmens mit 12 LKWs. Er wirkt beschäftigt und schaut kurz von seinem Schreibtisch auf.",
        customerText: `\u201eGuten Tag, ich hatte eigentlich nur 15 Minuten für Sie eingeplant. Was genau wollen Sie mir verkaufen?\u201c`,
        options: [
            {
                id: "a1",
                label: `\u201eIch verstehe Ihre Zeit ist wertvoll. Ich bin Max von THITRONIK \u2013 wir sichern Fuhrparks gegen Diebstahl und reduzieren Ihre Versicherungskosten. 15 Minuten reichen, um zu sehen ob wir passen.\u201c`,
                quality: "perfect",
                xp: 30,
                moodDelta: 2,
                feedback: "Perfekt! Sie respektieren seine Zeit, nennen sofort den konkreten Nutzen und schaffen eine Erwartungshaltung auf Augenhöhe.",
                tip: "Ein starker Einstieg benennt den Nutzen in 10 Sekunden. Nutzen Sie die AIDA-Formel: Attention → Interest direkt im ersten Satz.",
            },
            {
                id: "a2",
                label: `\u201eGuten Tag Herr Müller! Ich bin von THITRONIK und würde Ihnen gerne unser komplettes Produktportfolio vorstellen, das wirklich für jeden Fuhrpark geeignet ist.\u201c`,
                quality: "okay",
                xp: 15,
                moodDelta: 0,
                feedback: "Mittelmäßig. Der Einstieg ist freundlich, aber 'komplettes Portfolio' klingt nach einer langen Präsentation - das macht ihn nervös.",
                tip: "Vermeiden Sie generische Formulierungen. Zeigen Sie von Anfang an, dass Sie seine spezifische Situation kennen.",
            },
            {
                id: "a3",
                label: `\u201eAch, eigentlich alles Mögliche. Wir haben viele Produkte, da ist bestimmt was dabei für Sie!\u201c`,
                quality: "bad",
                xp: 0,
                moodDelta: -2,
                feedback: "Zu vage und wenig professionell. Herr Müller verliert sofort das Interesse, weil kein konkreter Mehrwert erkennbar ist.",
                tip: "Niemals 'alles Mögliche' sagen. Jedes Gespräch braucht ein klares Ziel und eine klare Botschaft.",
            },
        ],
    },
    {
        phase: "Bedarfsanalyse",
        phaseColor: "purple",
        phaseEmoji: "🔎",
        situation: "Herr Müller hat sich etwas entspannt und erzählt: Er hatte letztes Jahr einen LKW-Diebstahl und die Versicherung hat nur teilweise gezahlt. Er wirkt noch skeptisch.",
        customerText: `\u201eDer Diebstahl hat uns 28.000 \u20ac gekostet. Aber ich bin ehrlich gesagt skeptisch, ob solche Sicherheitssysteme wirklich helfen \u2013 oder nur Kosten verursachen.\u201c`,
        options: [
            {
                id: "b1",
                label: `\u201eDas verstehe ich. Darf ich fragen: War das Fahrzeug beim Diebstahl geortet? Und was hätten Sie gebraucht, um schneller zu reagieren?\u201c`,
                quality: "perfect",
                xp: 30,
                moodDelta: 2,
                feedback: "Ausgezeichnet! Sie validieren seinen Skeptizismus, stellen dann gezielte offene Fragen und ermitteln so den konkreten Bedarf.",
                tip: "Bedarfsanalyse ist 70% Zuhören. Nutzen Sie die SPIN-Methode: Situation → Problem → Implikation → Nutzen-Frage.",
            },
            {
                id: "b2",
                label: `\u201e28.000 \u20ac \u2013 das ist wirklich viel. Unsere Systeme hätten das verhindern können! Wir haben GPS-Tracking und Diebstahlalarm.\u201c`,
                quality: "okay",
                xp: 15,
                moodDelta: -1,
                feedback: "Sie springen zu schnell in die Produktpräsentation. Der Kunde fühlt sich nicht wirklich gehört.",
                tip: "Erst verstehen, dann präsentieren. Mindestens 2-3 Folgefragen stellen, bevor Sie irgendwas vorstellen.",
            },
            {
                id: "b3",
                label: `\u201eKlar sind Sie skeptisch, aber glauben Sie mir \u2013 ohne Sicherheitssystem ist das ein Fehler. Das nächste Mal kostet es Sie noch mehr!\u201c`,
                quality: "bad",
                xp: 0,
                moodDelta: -2,
                feedback: "Dieser Druck-Ansatz wirkt manipulativ und respektlos. Angst als Verkaufsargument ohne Fakten zerstört Vertrauen.",
                tip: "Niemals Angst ohne Lösung erzeugen. Wenn Sie Risiken ansprechen, kombinieren Sie das immer sofort mit einer konkreten Lösung.",
            },
        ],
    },
    {
        phase: "Produktpräsentation",
        phaseColor: "green",
        phaseEmoji: "🎯",
        situation: "Sie haben erfahren: Kein GPS war verbaut, der LKW wurde erst nach 2 Tagen gefunden. Herr Müller interessiert sich jetzt für Lösungen, ist aber preisbewusst.",
        customerText: `\u201eAlso \u2013 was genau können Sie mir anbieten? Und bitte kein Technik-Kauderwelsch, ich will wissen was das für mich bedeutet.\u201c`,
        options: [
            {
                id: "c1",
                label: `\u201eFür Ihren Fall empfehle ich den WiPro III: Echtzeit-GPS, stille Alarmierung direkt aufs Handy und Geofencing. Konkret: Wenn ein LKW nachts das Depot verlässt, wissen SIE es in 30 Sekunden \u2013 nicht erst 2 Tage später.\u201c`,
                quality: "perfect",
                xp: 30,
                moodDelta: 2,
                feedback: "Perfekt! Sie benennen das konkrete Produkt, übersetzen Features direkt in seinen Nutzen und knüpfen an sein persönliches Erlebnis an.",
                tip: "Feature → Vorteil → Nutzen (FAB-Methode): Nie nur Features nennen, immer auf den persönlichen Nutzen übersetzen.",
            },
            {
                id: "c2",
                label: `\u201eWir haben den WiPro III mit GPS-Tracking, CAN-Bus-Anbindung, OBD2-Schnittstelle, 128-Bit-Verschlüsselung und Over-the-Air-Updates.\u201c`,
                quality: "okay",
                xp: 15,
                moodDelta: -1,
                feedback: "Genau das wollte er nicht - reines Technik-Kauderwelsch. Er hat explizit darum gebeten, es auf seinen Nutzen zu beziehen.",
                tip: "Hören Sie auf den Kunden! Wenn er sagt 'kein Technik-Kauderwelsch', dann halten Sie sich daran. Nutzen statt Features.",
            },
            {
                id: "c3",
                label: `\u201eWir haben eigentlich alles im Sortiment \u2013 GPS, Alarm, Statusberichte. Am besten schicke ich Ihnen mal unseren Katalog zu.\u201c`,
                quality: "bad",
                xp: 0,
                moodDelta: -2,
                feedback: "Der Katalog-Trick ist ein Rückzug. Sie haben keine Empfehlung gegeben und zeigen, dass Sie seinen Bedarf nicht ernst nehmen.",
                tip: "Ein Katalog ist kein Ersatz für eine persönliche Empfehlung. Zeigen Sie, dass Sie homework gemacht haben.",
            },
        ],
    },
    {
        phase: "Einwandbehandlung",
        phaseColor: "amber",
        phaseEmoji: "🤝",
        situation: "Herr Müller ist angetan vom WiPro III, aber bremst jetzt beim Preis. Er verschränkt die Arme und lehnt sich zurück.",
        customerText: `\u201eDas klingt gut, aber 4.800 \u20ac für 12 Fahrzeuge \u2013 das ist 57.600 \u20ac auf einmal. Das ist viel Geld. Ich weiß nicht...\u201c`,
        options: [
            {
                id: "d1",
                label: `\u201eDas verstehe ich. Sie haben letztes Jahr 28.000 \u20ac verloren \u2013 das war ein einziges Fahrzeug, in einem einzigen Vorfall. Bei 57.600 \u20ac schützen Sie 12 Fahrzeuge dauerhaft. Das ergibt sich schon beim ersten verhinderten Diebstahl.\u201c`,
                quality: "perfect",
                xp: 30,
                moodDelta: 2,
                feedback: "Exzellent! Sie nutzen seine eigenen Zahlen gegen den Preiseinwand. Das ist keine Manipulation - das ist Fakten-basierte Argumentation.",
                tip: "ROI-Rechnung is king: Stellen Sie dem Preis immer den messbaren Gegenwert gegenüber. Nutzen Sie Kundeneigene Zahlen.",
            },
            {
                id: "d2",
                label: `\u201eDa haben Sie recht, das ist viel Geld. Wollen wir mal schauen welche Rabatte ich für Sie rausschlagen kann?\u201c`,
                quality: "okay",
                xp: 15,
                moodDelta: 0,
                feedback: "Rabatte sofort anbieten wertet das Produkt ab und zeigt, dass der Preis nicht wirklich gerechtfertigt ist.",
                tip: "Erst den Wert verteidigen, dann (wenn nötig) über Konditionen sprechen. Rabatt ist das letzte Mittel, nicht das erste.",
            },
            {
                id: "d3",
                label: `\u201eJa, Sicherheit hat halt seinen Preis. Aber billiger geht's nicht.\u201c`,
                quality: "bad",
                xp: 0,
                moodDelta: -2,
                feedback: "Keine Reaktion auf den Einwand, keine Value-Argumentation. Das wirkt gleichgültig und professionell ist das nicht.",
                tip: "Jeder Preiseinwand ist eine versteckte Frage: 'Ist das den Preis wert?' Ihre Aufgabe: Diese Frage eindeutig mit Ja beantworten.",
            },
        ],
    },
    {
        phase: "Abschluss",
        phaseColor: "rose",
        phaseEmoji: "🏁",
        situation: "Herr Müller nickt, wirkt überzeugter - aber zieht nicht von selbst die Reißleine. Er schaut auf seinen Kalender.",
        customerText: `\u201eNa ja, das klingt schon sinnvoll... Ich muss aber noch mal mit der Geschäftsführung sprechen. Ich melde mich dann bei Ihnen.\u201c`,
        options: [
            {
                id: "e1",
                label: `\u201eGerne! Um Ihnen die Abstimmung zu erleichtern \u2013 was wäre das stärkste Argument für Ihre Geschäftsführung? Und darf ich Ihnen eine kurze 1-Pager-Zusammenfassung mit den Zahlen schicken, um 17:00 Uhr heute?\u201c`,
                quality: "perfect",
                xp: 30,
                moodDelta: 2,
                feedback: "Meisterhaft! Sie respektieren den Prozess, helfen ihm beim internen Verkauf und setzen einen konkreten nächsten Schritt mit klarer Uhrzeit.",
                tip: "Der Sale endet nicht mit 'Ich melde mich'. Setzen Sie immer einen konkreten nächsten Schritt mit Datum/Uhrzeit - verbindlich aber nicht drängend.",
            },
            {
                id: "e2",
                label: `\u201eVerständlich. Wann soll ich mich dann melden? Nächste Woche?\u201c`,
                quality: "okay",
                xp: 15,
                moodDelta: 0,
                feedback: "Sie legen den Ball zu sehr in seine Hände. Die Initiative fehlt - nächste Woche ist zu unkonkret.",
                tip: "Konkret schlägt vage. 'Nächste Woche' verliert sich. 'Morgen 10 Uhr' oder 'Donnerstag 14 Uhr' bleiben hängen.",
            },
            {
                id: "e3",
                label: `\u201eIch brauche eigentlich bald eine Antwort \u2013 wir haben ein Angebot laufen das nächste Woche ausläuft. Können Sie bis Freitag zusagen?\u201c`,
                quality: "bad",
                xp: 0,
                moodDelta: -2,
                feedback: "Künstlicher Zeitdruck ist die älteste und durchschaubarste Verkaufstaktik. Das zerstört das aufgebaute Vertrauen im letzten Moment.",
                tip: "Fake-Deadlines funktionieren nicht und schädigen Ihre Glaubwürdigkeit dauerhaft. Echter Mehrwert schlägt immer Druck.",
            },
        ],
    },
];

const MAX_XP = SCENARIOS.length * 30; // 150

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
function qualityColor(q: Quality) {
    if (q === "perfect") return "border-brand-lime/60 bg-brand-lime/10";
    if (q === "okay") return "border-amber-400/60 bg-amber-400/10";
    return "border-red-400/60 bg-red-400/10";
}

function qualityLabel(q: Quality) {
    if (q === "perfect") return { text: "Perfekt ✓", cls: "bg-brand-lime/20 text-brand-lime" };
    if (q === "okay") return { text: "Gut –", cls: "bg-amber-400/20 text-amber-400" };
    return { text: "Schwach ✗", cls: "bg-red-400/20 text-red-400" };
}

function phaseStyle(color: string): string {
    const map: Record<string, string> = {
        blue: "border-blue-400 bg-blue-400/10 text-blue-300",
        purple: "border-purple-400 bg-purple-400/10 text-purple-300",
        green: "border-brand-lime bg-brand-lime/10 text-brand-lime",
        amber: "border-amber-400 bg-amber-400/10 text-amber-300",
        rose: "border-rose-400 bg-rose-400/10 text-rose-300",
    };
    return map[color] ?? "border-white/20 bg-white/5 text-white/70";
}

function phaseBorder(color: string): string {
    const map: Record<string, string> = {
        blue: "border-blue-400/60",
        purple: "border-purple-400/60",
        green: "border-brand-lime/60",
        amber: "border-amber-400/60",
        rose: "border-rose-400/60",
    };
    return map[color] ?? "border-white/20";
}

function moodColor(level: number): string {
    if (level >= 4) return "bg-brand-lime";
    if (level >= 3) return "bg-green-400";
    if (level >= 2) return "bg-amber-400";
    if (level >= 1) return "bg-orange-400";
    return "bg-red-500";
}

// ── Komponente ─────────────────────────────────────────────────────────────────
export function SalesSimulator() {
    const { addXp } = useUserStore();

    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const [totalXp, setTotalXp] = useState(0);
    const [moodLevel, setMoodLevel] = useState(2);
    const [answers, setAnswers] = useState<Quality[]>([]);
    const [done, setDone] = useState(false);

    const scenario = SCENARIOS[step];
    const progress = answers.length / SCENARIOS.length;
    const selectedOption = scenario.options.find((o) => o.id === selected);

    const handleSelect = (opt: Option) => {
        if (selected) return;
        setSelected(opt.id);
        setShowFeedback(true);
        setShowTip(false);
        setTotalXp((prev) => prev + opt.xp);
        setMoodLevel((prev) => Math.min(5, Math.max(0, prev + opt.moodDelta)));
        setAnswers((prev) => [...prev, opt.quality]);
    };

    const handleNext = () => {
        if (step + 1 >= SCENARIOS.length) {
            setDone(true);
            addXp(totalXp);
        } else {
            setStep((s) => s + 1);
            setSelected(null);
            setShowFeedback(false);
            setShowTip(false);
        }
    };

    const handleReset = () => {
        setStep(0);
        setSelected(null);
        setShowFeedback(false);
        setShowTip(false);
        setTotalXp(0);
        setMoodLevel(2);
        setAnswers([]);
        setDone(false);
    };

    // ── Ergebnis-Screen ──────────────────────────────────────────────────────
    if (done) {
        const perfectCount = answers.filter((q) => q === "perfect").length;
        const okayCount = answers.filter((q) => q === "okay").length;
        const badCount = answers.filter((q) => q === "bad").length;
        const scorePercent = (totalXp / MAX_XP) * 100;

        const resultEmoji = scorePercent >= 90 ? "🏆" : scorePercent >= 60 ? "⭐" : "💪";
        const resultTitle = scorePercent >= 90 ? "Vertriebsprofi!" : scorePercent >= 60 ? "Solider Auftritt!" : "Noch Potenzial!";
        const resultText =
            scorePercent >= 90
                ? "Herr Müller hat den Vertrag unterschrieben. Exzellentes Verkaufsgespräch von Anfang bis Ende!"
                : scorePercent >= 60
                ? "Guter Auftritt – mit etwas Feinschliff wird aus Ihnen ein Top-Verkäufer."
                : "Das war ein harter Tag. Analysieren Sie die Tipps und probieren Sie es nochmal!";

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-6xl mb-3">{resultEmoji}</div>
                    <h2 className="text-3xl font-extrabold text-white mb-2">{resultTitle}</h2>
                    <p className="text-white/60 max-w-md mx-auto">{resultText}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Perfekt", count: perfectCount, cls: "text-brand-lime border-brand-lime/30 bg-brand-lime/5" },
                        { label: "Gut", count: okayCount, cls: "text-amber-400 border-amber-400/30 bg-amber-400/5" },
                        { label: "Schwach", count: badCount, cls: "text-red-400 border-red-400/30 bg-red-400/5" },
                    ].map((s) => (
                        <div key={s.label} className={`rounded-xl border p-5 text-center ${s.cls}`}>
                            <div className="text-3xl font-bold">{s.count}</div>
                            <div className="text-sm mt-1 opacity-80">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-semibold">Gesamt XP</span>
                        <span className="text-brand-lime font-bold text-xl">+{totalXp} XP</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalXp / MAX_XP) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-3 rounded-full bg-brand-lime"
                        />
                    </div>
                    <div className="text-white/40 text-xs mt-1 text-right">{totalXp} / {MAX_XP} XP</div>
                </div>

                <Button onClick={handleReset} className="w-full bg-brand-lime text-[#0a1628] hover:bg-brand-lime/90 font-bold py-6 text-lg rounded-xl">
                    🔄 Nochmal spielen
                </Button>
            </motion.div>
        );
    }

    // ── Spiel-Screen ─────────────────────────────────────────────────────────
    return (
        <div className="space-y-5">
            {/* XP + Fortschrittsbalken */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-brand-lime" />
                    <span className="text-white/60 text-sm">XP</span>
                    <Badge className="bg-brand-lime/20 text-brand-lime border-brand-lime/30 font-bold">+{totalXp}</Badge>
                </div>
                <div className="flex-1">
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.4 }} className="h-2 rounded-full bg-brand-lime" />
                    </div>
                </div>
                <span className="text-white/40 text-xs shrink-0">{answers.length}/{SCENARIOS.length}</span>
            </div>

            {/* Kunden-Stimmung */}
            <div className="flex items-center gap-2">
                <span className="text-white/50 text-xs">Stimmung:</span>
                <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-6 h-3 rounded-sm transition-colors duration-500 ${i < moodLevel ? moodColor(moodLevel) : "bg-white/10"}`}
                        />
                    ))}
                </div>
                <span className="text-white/40 text-xs">
                    {moodLevel >= 4 ? "😊" : moodLevel >= 2 ? "😐" : "😠"} Herr Müller
                </span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    {/* Phasen-Badge */}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${phaseStyle(scenario.phaseColor)}`}>
                        {scenario.phaseEmoji} Phase {step + 1}: {scenario.phase}
                    </span>

                    {/* Situationskarte */}
                    <div className={`border-l-4 pl-4 py-2 ${phaseBorder(scenario.phaseColor)}`}>
                        <p className="text-white/60 text-sm leading-relaxed">{scenario.situation}</p>
                    </div>

                    {/* Kunden-Chat-Bubble */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg shrink-0">
                            👨‍💼
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-white leading-relaxed max-w-lg">
                            {scenario.customerText}
                        </div>
                    </div>

                    {/* Antwort-Optionen */}
                    <div className="space-y-3 pt-1">
                        {scenario.options.map((opt, idx) => {
                            const isSelected = selected === opt.id;
                            const isOther = selected && selected !== opt.id;
                            const ql = qualityLabel(opt.quality);

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleSelect(opt)}
                                    disabled={!!selected}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                                        isSelected
                                            ? qualityColor(opt.quality) + " scale-[1.01]"
                                            : isOther
                                            ? "border-white/5 bg-white/2 opacity-40 cursor-not-allowed"
                                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 mt-0.5">
                                            {["A", "B", "C"][idx]}
                                        </span>
                                        <span className="text-sm text-white/80 leading-relaxed flex-1">{opt.label}</span>
                                        {isSelected && (
                                            <Badge className={`shrink-0 text-xs ${ql.cls}`}>{ql.text}</Badge>
                                        )}
                                    </div>
                                    {isSelected && (
                                        <div className="text-xs text-white/50 mt-2 ml-9">+{opt.xp} XP</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback-Block */}
                    <AnimatePresence>
                        {showFeedback && selectedOption && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`rounded-xl border p-4 space-y-3 ${qualityColor(selectedOption.quality)}`}
                            >
                                <p className="text-sm text-white/90 leading-relaxed">
                                    <span className="font-semibold text-white">Feedback: </span>
                                    {selectedOption.feedback}
                                </p>

                                <button
                                    onClick={() => setShowTip((s) => !s)}
                                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
                                >
                                    {showTip ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    Profi-Tipp {showTip ? "ausblenden" : "anzeigen"}
                                </button>

                                <AnimatePresence>
                                    {showTip && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-white/5 rounded-lg p-3 text-xs text-white/70 leading-relaxed border border-white/10">
                                                💡 <strong className="text-white/90">Profi-Tipp:</strong> {selectedOption.tip}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button
                                    onClick={handleNext}
                                    className="w-full bg-brand-lime text-[#0a1628] hover:bg-brand-lime/90 font-bold rounded-xl mt-2"
                                >
                                    {step + 1 >= SCENARIOS.length ? "🏁 Ergebnis anzeigen" : "Nächste Situation →"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
