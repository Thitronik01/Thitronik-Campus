"use client";

import { useState, useEffect } from "react";

/* ═════════════════════════ DATA ═════════════════════════ */

const ISLANDS = [
    { id: 'vejro', name: 'Vejrø', building: 'Neubau', floor: 'OG', room: 'N-OG-101', color: '#2A9D8F', colorL: '#3AB5A5', topic: 'WiPro III & Unterschiede · Einsatz WiPro III safe.lock · NFC-Modul · Pro-finder · Vernetzungsmodul & App' },
    { id: 'poel', name: 'Poel', building: 'Neubau', floor: 'EG', room: 'N-EG-101', color: '#4AADCE', colorL: '#6EC3DE', topic: 'Was finde ich wo im Händlerbereich' },
    { id: 'hiddensee', name: 'Hiddensee', building: 'Neubau', floor: 'EG', room: 'N-EG-102', color: '#7B5EA7', colorL: '#9570C0', topic: 'Montage der Funk-Magnetkontakte (mit Praxisteil)' },
    { id: 'samso', name: 'Samsø', building: 'Altbau', floor: 'EG', room: 'A-EG-101', color: '#E07B30', colorL: '#F09048', topic: 'Verschiedene Basisfahrzeuge & Besonderheiten · THITRONIK® Gaswarner · Häufige Einbaufehler (Praxis)' },
    { id: 'langeland', name: 'Langeland', building: 'Altbau', floor: 'EG', room: 'A-EG-102', color: '#2E8B57', colorL: '#3EA86A', topic: 'Fahrzeugübergabe und -übernahme leicht gemacht' },
    { id: 'usedom', name: 'Usedom', building: 'Altbau', floor: 'OG', room: 'A-OG-101', color: '#C8202E', colorL: '#E03040', topic: 'Konfigurator verkaufsfördernd einsetzen · THITRONIK® Display im Einsatz am Kunden' },
    { id: 'fehmarn', name: 'Fehmarn', building: 'Altbau', floor: 'OG', room: 'A-OG-102', color: '#1a6fa0', colorL: '#2A88C0', topic: 'Fehleranalyse und -behebung · Häufig gestellte Fragen im Support' },
];

const GROUPS = [
    { id: 'A', range: '1–8', count: 8 },
    { id: 'B', range: '9–15', count: 7 },
    { id: 'C', range: '16–22', count: 7 },
    { id: 'D', range: '23–29', count: 7 },
    { id: 'E', range: '30–36', count: 7 },
    { id: 'F', range: '37–43', count: 7 },
    { id: 'G', range: '44–50', count: 7 },
];

const mn = (h: number, m: number) => h * 60 + m;

const SCHEDULE = [
    { s: mn(8, 30), e: mn(8, 45), type: 'arrive', icon: '🚗', title: 'Eintreffen & Begrüßung', loc: 'Eingang / Empfang', bldg: 'Neubau EG' },
    { s: mn(8, 45), e: mn(9, 30), type: 'island', si: 0 },
    { s: mn(9, 30), e: mn(9, 40), type: 'transfer', icon: '↔', title: 'Transfer', loc: '–', bldg: '→ Nächste Insel' },
    { s: mn(9, 40), e: mn(10, 25), type: 'island', si: 1 },
    { s: mn(10, 25), e: mn(10, 35), type: 'break', icon: '☕', title: 'Kaffeepause', loc: 'Pausenbereich', bldg: 'Neubau EG' },
    { s: mn(10, 35), e: mn(11, 20), type: 'island', si: 2 },
    { s: mn(11, 20), e: mn(11, 30), type: 'transfer', icon: '↔', title: 'Transfer', loc: '–', bldg: '→ Nächste Insel' },
    { s: mn(11, 30), e: mn(12, 15), type: 'island', si: 3 },
    { s: mn(12, 15), e: mn(13, 0), type: 'lunch', icon: '🍽', title: 'Mittagspause', loc: 'Kantine', bldg: 'Altbau EG' },
    { s: mn(13, 0), e: mn(13, 45), type: 'island', si: 4 },
    { s: mn(13, 45), e: mn(13, 55), type: 'transfer', icon: '↔', title: 'Transfer', loc: '–', bldg: '→ Nächste Insel' },
    { s: mn(13, 55), e: mn(14, 40), type: 'island', si: 5 },
    { s: mn(14, 40), e: mn(14, 50), type: 'break', icon: '☕', title: 'Kaffeepause', loc: 'Pausenbereich', bldg: 'Altbau EG' },
    { s: mn(14, 50), e: mn(15, 35), type: 'island', si: 6 },
    { s: mn(15, 35), e: mn(17, 0), type: 'plenum', icon: '🎤', title: 'Abschluss-Plenum & Q&A', loc: 'Hauptsaal', bldg: 'Neubau EG' },
];

const fmt = (m: number) => `${String(~~(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const getIsland = (si: number, gi: number) => ISLANDS[(si + gi) % 7];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveSlot = (slot: any, gi: number) => slot.type !== 'island' ? slot : { ...slot, isl: getIsland(slot.si, gi) };

/* ═════════════════════════ APP ═══════════════════════════ */

export function EventSchedule() {
    const [now, setNow] = useState(new Date());
    const [group, setGroup] = useState<string | null>(null);
    const [tab, setTab] = useState('guide');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!mounted) return null;

    const nowMins = now.getHours() * 60 + now.getMinutes();
    const nowSecs = now.getSeconds();
    const gi = group ? GROUPS.findIndex(g => g.id === group) : -1;

    const rawCurrent = SCHEDULE.find(s => nowMins >= s.s && nowMins < s.e) || null;
    const rawNext = SCHEDULE.find(s => s.s > nowMins) || null;
    const current = rawCurrent && gi >= 0 ? resolveSlot(rawCurrent, gi) : rawCurrent;
    const next = rawNext && gi >= 0 ? resolveSlot(rawNext, gi) : rawNext;

    const progress = rawCurrent ? ((nowMins * 60 + nowSecs - rawCurrent.s * 60) / ((rawCurrent.e - rawCurrent.s) * 60)) * 100 : 0;
    const remainingSecs = rawCurrent ? rawCurrent.e * 60 - (nowMins * 60 + nowSecs) : 0;
    const remainingMins = Math.ceil(remainingSecs / 60);
    const clockStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return (
        <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 text-brand-ink font-sans backdrop-blur-md">

            {/* ── HEADER ── */}
            <div className="bg-gradient-to-br from-brand-navy-dark via-brand-navy to-brand-navy-light relative overflow-hidden px-5">
                {/* Diagonal sail shape decoration */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-[35%] bg-gradient-to-br from-transparent to-brand-navy-light/35"
                    style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
                    aria-hidden="true"
                />
                <div className="absolute right-[8%] top-1/2 -translate-y-1/2 opacity-[0.07] text-[8rem] leading-none select-none text-white font-black tracking-tighter" aria-hidden="true">
                    ⛵
                </div>

                <div className="max-w-[1360px] mx-auto py-[22px] pb-5 flex items-center justify-between flex-wrap gap-4 relative">
                    {/* Logo area */}
                    <div>
                        <div className="text-[1.55rem] font-extrabold text-white tracking-[1.5px] leading-none">THITRONIK</div>
                        <div className="text-[0.58rem] text-brand-sky-light tracking-[3.5px] uppercase mt-0.5 font-medium">Campus · Eckernförde</div>
                    </div>

                    {/* Clock */}
                    <div className="bg-white/[0.09] border border-brand-sky/45 rounded-lg px-[26px] py-2.5 text-center backdrop-blur-sm">
                        <div className="schedule-glow font-mono text-[clamp(1.2rem,2.5vw,1.8rem)] text-white tracking-[4px] font-light leading-none">
                            {clockStr}
                        </div>
                        <div className="text-[0.6rem] text-brand-sky-light tracking-[3.5px] uppercase mt-1">Aktuelle Uhrzeit</div>
                    </div>

                    {/* Meta */}
                    <div className="flex gap-5 flex-wrap">
                        {[['50', 'Händler'], ['7', 'Gruppen'], ['7', 'Inseln']].map(([val, lbl]) => (
                            <div key={lbl} className="text-center">
                                <div className="text-2xl font-extrabold text-white leading-none">{val}</div>
                                <div className="text-[0.55rem] text-brand-sky-light tracking-[2px] uppercase">{lbl}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── BLUE DIVIDER ── */}
            <div className="bg-brand-sky h-1 shadow-[0_2px_12px_rgba(59,169,211,0.38)]" />

            {/* ── CONTENT ── */}
            <div className="max-w-[1360px] mx-auto px-3.5 pt-6 pb-[60px]">

                {/* ── TABS ── */}
                <div className="flex gap-1 mb-6 bg-white/10 rounded-lg p-1 border border-white/10 w-fit">
                    {[
                        { id: 'guide', label: '🧭 Mein Standort' },
                        { id: 'table', label: '📋 Gesamtplan' },
                        { id: 'legend', label: '🏝 Inseln & Räume' },
                    ].map(t => (
                        <button
                            key={t.id}
                            className={`schedule-hover px-[22px] py-2.5 rounded-md text-[0.88rem] font-semibold transition-all ${
                                tab === t.id
                                    ? 'bg-brand-navy text-white'
                                    : 'bg-transparent text-white/70'
                            }`}
                            onClick={() => setTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── GUIDE ── */}
                {tab === 'guide' && (
                    <div className="animate-fade-in">
                        {/* Group Selector */}
                        <div className="bg-white/5 rounded-[10px] border border-white/10 px-6 py-5 mb-5">
                            <div className="text-[0.7rem] tracking-[3px] text-brand-sky uppercase font-semibold mb-3.5">
                                ◆ Wähle deine Gruppe
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {GROUPS.map(g => {
                                    const sel = group === g.id;
                                    return (
                                        <button
                                            key={g.id}
                                            className={`schedule-hover px-4 py-3 rounded-lg min-w-[90px] text-center transition-all border-2 ${
                                                sel
                                                    ? 'bg-brand-navy border-brand-navy text-white'
                                                    : 'bg-white/[0.03] border-white/10 text-white'
                                            }`}
                                            onClick={() => setGroup(g.id)}
                                        >
                                            <div className="text-[1.9rem] font-extrabold leading-none text-white">{g.id}</div>
                                            <div className={`text-[0.62rem] mt-[3px] tracking-[0.5px] ${sel ? 'text-brand-sky-light' : 'text-white/50'}`}>
                                                Händler {g.range}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {!group && (
                            <div className="text-center px-5 py-[60px] bg-white/[0.03] rounded-[10px] border border-white/10">
                                <div className="text-5xl mb-3.5">🧭</div>
                                <div className="text-[1.1rem] text-white font-semibold">Wähle deine Gruppe</div>
                                <div className="text-[0.85rem] text-white/60 mt-1.5">Dann siehst du sofort, wo du jetzt sein musst.</div>
                            </div>
                        )}

                        {group && (
                            <div className="animate-fade-in">
                                <CurrentCard current={current} next={next} progress={progress} remainingMins={remainingMins} group={group} />
                                <div className="mt-6">
                                    <SectionTitle>Tagesablauf · Gruppe {group}</SectionTitle>
                                    <DayTimeline gi={gi} nowMins={nowMins} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── TABLE ── */}
                {tab === 'table' && (
                    <div className="animate-fade-in">
                        <BuildingLegend />
                        <FullTable nowMins={nowMins} />
                    </div>
                )}

                {/* ── LEGEND ── */}
                {tab === 'legend' && (
                    <div className="animate-fade-in">
                        <IslandLegend />
                    </div>
                )}
            </div>

            {/* ── FOOTER ── */}
            <div className="bg-black/20 text-brand-sky-light text-center px-5 py-3.5 text-[0.7rem] tracking-[2px] uppercase">
                THITRONIK® Campus · Eckernförde · Island Hopping Schulungstag
            </div>
        </div>
    );
}

/* ═══════════════ CURRENT CARD ═══════════════ */

interface CurrentCardProps {
    current: ReturnType<typeof resolveSlot> | null;
    next: ReturnType<typeof resolveSlot> | null;
    progress: number;
    remainingMins: number;
    group: string;
}

function CurrentCard({ current, next, progress, remainingMins, group }: CurrentCardProps) {
    if (!current) return (
        <Card className="text-center p-[52px]">
            <div className="text-[2.5rem] mb-2.5">🌅</div>
            <div className="text-[1.15rem] font-bold text-white">Außerhalb der Schulungszeiten</div>
            <div className="text-[0.85rem] text-white/60 mt-1.5">Schulung: 08:30 – 17:00 Uhr</div>
        </Card>
    );

    const isIsland = current.type === 'island';
    const isl = current.isl;
    const accent = isIsland ? isl.color : current.type === 'lunch' || current.type === 'break' ? 'var(--color-brand-sky)' : 'var(--color-brand-navy)';
    const accentL = isIsland ? isl.colorL : current.type === 'lunch' || current.type === 'break' ? 'var(--color-brand-sky-light)' : 'var(--color-brand-navy-light)';

    return (
        <Card
            className="bg-white/[0.03] p-0 overflow-hidden"
            style={{ borderTop: `4px solid ${accent}` }}
        >
            {/* Status bar */}
            <div
                className="border-b px-[22px] py-2.5 flex items-center gap-2.5 flex-wrap"
                style={{ background: `${accent}12`, borderBottomColor: `${accent}30` }}
            >
                <span
                    className="schedule-pulse w-[9px] h-[9px] rounded-full inline-block shrink-0"
                    style={{ background: accent }}
                />
                <span
                    className="text-[0.7rem] tracking-[3px] uppercase font-bold"
                    style={{ color: accent }}
                >
                    Jetzt aktiv · Gruppe {group} · {fmt(current.s)} – {fmt(current.e)}
                </span>
            </div>

            <div className="px-6 py-[22px] flex gap-6 flex-wrap items-start">
                {/* Left */}
                <div className="flex-[1_1_280px]">
                    {isIsland ? (
                        <>
                            <div
                                className="inline-block text-white rounded px-2.5 py-0.5 text-[0.7rem] tracking-[2px] uppercase font-bold mb-2.5"
                                style={{ background: accent }}
                            >
                                Schulungsinsel
                            </div>
                            <div
                                className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold leading-none mb-3"
                                style={{ color: accent }}
                            >
                                {isl.name}
                            </div>
                            <div className="text-[0.83rem] text-white/80 mb-[18px] leading-[1.7] max-w-[420px]">
                                {isl.topic}
                            </div>
                            <div className="flex gap-2.5 flex-wrap">
                                {[{ lbl: 'Raum', val: isl.room, mono: true }, { lbl: 'Gebäude', val: isl.building }, { lbl: 'Etage', val: isl.floor }].map(b => (
                                    <div
                                        key={b.lbl}
                                        className="rounded-lg px-4 py-2 min-w-[85px]"
                                        style={{ background: `${accent}12`, border: `2px solid ${accent}30` }}
                                    >
                                        <div
                                            className="text-[0.6rem] tracking-[2px] uppercase font-bold mb-[3px]"
                                            style={{ color: accent }}
                                        >
                                            {b.lbl}
                                        </div>
                                        <div className={`text-[1.05rem] font-extrabold text-white ${b.mono ? 'font-mono' : ''}`}>
                                            {b.val}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold text-white leading-[1.2] mb-3">
                                {current.icon} {current.title}
                            </div>
                            {current.loc && current.loc !== '–' && (
                                <div className="flex gap-2.5 flex-wrap">
                                    <InfoBadge label="Ort" val={current.loc} accent={accent} />
                                    <InfoBadge label="Bereich" val={current.bldg} accent={accent} />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Timer */}
                <div
                    className="bg-black/20 rounded-[10px] px-[22px] py-[18px] min-w-[180px] shrink-0 text-center"
                    style={{ border: `2px solid ${accent}30` }}
                >
                    <div className="text-[0.65rem] tracking-[2.5px] text-white/50 uppercase mb-2">Verbleibend</div>
                    <div className="text-[3.2rem] font-extrabold font-mono leading-none" style={{ color: accent }}>
                        {remainingMins}<span className="text-[1.1rem] ml-[3px] font-sans">min</span>
                    </div>
                    <div className="text-[0.72rem] text-white/50 mt-1 mb-3.5">bis {fmt(current.e)} Uhr</div>
                    <div className="rounded h-1.5 overflow-hidden" style={{ background: `${accent}20` }}>
                        <div
                            className="h-full rounded transition-[width] duration-1000 ease-linear"
                            style={{
                                width: `${Math.min(progress, 100)}%`,
                                background: `linear-gradient(90deg,${accent},${accentL})`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Next up */}
            {next && (
                <div className="border-t border-white/10 bg-black/10 px-6 py-3 flex items-center gap-3.5 flex-wrap">
                    <div className="text-[0.62rem] tracking-[2.5px] text-white/50 uppercase font-bold shrink-0">DANACH</div>
                    <div className="text-[0.88rem] text-white">
                        {next.type === 'island' && next.isl
                            ? <><span className="font-bold" style={{ color: next.isl.color }}>{next.isl.name}</span>
                                {' · '}<span className="font-mono text-[0.78rem] rounded-[3px] px-[7px] py-px text-white" style={{ background: `${next.isl.color}15` }}>{next.isl.room}</span>
                                {' · '}{next.isl.building} {next.isl.floor}
                                {' · ab '}<span className="font-mono font-bold">{fmt(next.s)}</span></>
                            : <><span className="text-brand-sky font-bold">{next.icon} {next.title}</span>
                                {next.loc && next.loc !== '–' && ` · ${next.loc}, ${next.bldg}`}
                                {' · ab '}<span className="font-mono font-bold">{fmt(next.s)}</span></>
                        }
                    </div>
                </div>
            )}
        </Card>
    );
}

/* ═══════════════ DAY TIMELINE ═══════════════ */

interface DayTimelineProps {
    gi: number;
    nowMins: number;
}

function DayTimeline({ gi, nowMins }: DayTimelineProps) {
    return (
        <Card className="p-0 overflow-hidden bg-transparent border-none shadow-none">
            {SCHEDULE.map((slot, i) => {
                const isl = slot.type === 'island' ? getIsland(slot.si!, gi) : null;
                const isActive = nowMins >= slot.s && nowMins < slot.e;
                const isPast = nowMins >= slot.e;
                const isTransfer = slot.type === 'transfer';
                const col = isl ? isl.color : slot.type === 'lunch' || slot.type === 'break' ? 'var(--color-brand-sky)' : 'var(--color-brand-navy)';

                if (isTransfer) return (
                    <div
                        key={i}
                        className={`flex gap-3 items-center px-5 py-1 border-b border-white/5 ${isPast ? 'opacity-25' : 'opacity-45'}`}
                    >
                        <div className="font-mono text-[0.7rem] text-white/50 min-w-[46px]">{fmt(slot.s)}</div>
                        <div className="text-[0.7rem] text-white/50 tracking-[0.5px]">↔ Transfer · 10 Min</div>
                    </div>
                );

                return (
                    <div
                        key={i}
                        className={`flex gap-3.5 items-center px-5 py-3 border-b border-white/5 transition-all duration-300 ${isPast ? 'opacity-45' : ''}`}
                        style={{
                            background: isActive ? `${col}12` : i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                            borderLeft: isActive ? `4px solid ${col}` : '4px solid transparent',
                        }}
                    >
                        <span
                            className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'schedule-pulse' : ''}`}
                            style={{ background: isActive ? col : isPast ? 'rgba(255,255,255,0.2)' : `${col}55` }}
                        />
                        <div
                            className={`font-mono text-[0.8rem] min-w-[46px] ${isActive ? 'font-bold' : 'font-normal'}`}
                            style={{ color: isActive ? col : 'rgba(255,255,255,0.5)' }}
                        >
                            {fmt(slot.s)}
                        </div>

                        {isl ? (
                            <div className="flex items-center gap-2.5 flex-1 flex-wrap">
                                <span className={`font-bold text-[0.95rem] ${isActive ? '' : 'text-white'}`} style={isActive ? { color: isl.color } : undefined}>
                                    {isl.name}
                                </span>
                                <span
                                    className="font-mono text-[0.7rem] px-2 py-px rounded text-white"
                                    style={{ background: `${isl.color}15`, border: `1px solid ${isl.color}40` }}
                                >
                                    {isl.room}
                                </span>
                                <span className="text-[0.72rem] text-white/50">{isl.building} · {isl.floor}</span>
                            </div>
                        ) : (
                            <div className="flex-1 flex gap-2.5 flex-wrap items-center">
                                <span
                                    className={`text-[0.92rem] ${isActive ? 'font-bold' : 'font-medium'}`}
                                    style={{ color: isActive ? col : 'white' }}
                                >
                                    {slot.icon} {slot.title}
                                </span>
                                {slot.loc && slot.loc !== '–' && <span className="text-[0.72rem] text-white/50">{slot.loc} · {slot.bldg}</span>}
                            </div>
                        )}

                        <div className="font-mono text-[0.65rem] text-white/50 ml-auto whitespace-nowrap">–{fmt(slot.e)}</div>
                    </div>
                );
            })}
        </Card>
    );
}

/* ═══════════════ FULL TABLE ═══════════════ */

function BuildingLegend() {
    return (
        <div className="flex gap-2.5 mb-4 flex-wrap">
            {[
                { lbl: 'Neubau EG', rooms: 'N-EG-101 · N-EG-102', col: 'var(--color-brand-sky)' },
                { lbl: 'Neubau OG', rooms: 'N-OG-101', col: '#2A9D8F' },
                { lbl: 'Altbau EG', rooms: 'A-EG-101 · A-EG-102', col: '#E07B30' },
                { lbl: 'Altbau OG', rooms: 'A-OG-101 · A-OG-102', col: 'var(--color-brand-red)' },
            ].map(b => (
                <div
                    key={b.lbl}
                    className="bg-white/5 rounded-[7px] px-3.5 py-[7px] flex gap-2.5 items-center"
                    style={{ border: `1px solid ${b.col}40`, borderLeft: `4px solid ${b.col}` }}
                >
                    <div>
                        <div className="text-[0.78rem] font-bold text-white">{b.lbl}</div>
                        <div className="text-[0.62rem] text-white/50 font-mono">{b.rooms}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface FullTableProps {
    nowMins: number;
}

function FullTable({ nowMins }: FullTableProps) {
    return (
        <div className="overflow-x-auto rounded-[10px] border border-white/10 thin-scrollbar">
            <table className="border-collapse w-full min-w-[920px] text-[0.8rem] bg-transparent">
                <thead>
                    <tr className="bg-black/30">
                        <th className="px-4 py-3 text-left font-mono text-[0.68rem] tracking-[2px] text-brand-sky-light uppercase min-w-[92px]">Uhrzeit</th>
                        {GROUPS.map(g => (
                            <th key={g.id} className="px-2 py-2.5 text-center text-[0.68rem] tracking-[1px] text-white uppercase font-bold">
                                {g.id}<br /><span className="text-[0.58rem] text-brand-sky-light font-normal">{g.range}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {SCHEDULE.map((slot, i) => {
                        const isActive = nowMins >= slot.s && nowMins < slot.e;
                        const isPast = nowMins >= slot.e;

                        const timeCell = (
                            <td
                                className={`px-3.5 py-2.5 align-middle border-r border-white/5 whitespace-nowrap ${isActive ? 'bg-brand-sky/[0.09]' : ''}`}
                            >
                                <div className={`font-mono text-[0.85rem] ${isActive ? 'text-brand-sky-light font-bold' : 'text-white font-medium'}`}>{fmt(slot.s)}</div>
                                <div className="font-mono text-[0.62rem] text-white/50">–{fmt(slot.e)}</div>
                            </td>
                        );

                        if (slot.type !== 'island') {
                            return (
                                <tr key={i} className={isActive ? 'bg-brand-sky/[0.07]' : ''} style={{ opacity: isPast ? 0.5 : 1 }}>
                                    {timeCell}
                                    <td colSpan={7} className="px-5 py-[11px] text-center bg-white/[0.02] border-b border-white/5">
                                        <span className={`text-[0.88rem] ${slot.type === 'transfer' ? 'text-white/40 font-normal' : 'text-white font-semibold'}`}>
                                            {slot.icon} {slot.title}
                                        </span>
                                    </td>
                                </tr>
                            );
                        }

                        return (
                            <tr key={i} className={isActive ? 'bg-brand-sky/[0.07]' : ''} style={{ opacity: isPast ? 0.5 : 1 }}>
                                {timeCell}
                                {GROUPS.map((g, gi) => {
                                    const isl = getIsland(slot.si!, gi);
                                    return (
                                        <td
                                            key={g.id}
                                            className="cell-hover px-2 py-[7px] text-center align-middle border-b border-white/5"
                                            style={{ background: `${isl.color}12`, borderRight: `1px solid ${isl.color}25` }}
                                        >
                                            <div className="font-bold text-[0.82rem] leading-[1.3]" style={{ color: isl.color }}>{isl.name}</div>
                                            <div className="font-mono text-[0.62rem] text-white/60 mt-0.5">{isl.room}</div>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

/* ═══════════════ ISLAND LEGEND ═══════════════ */

function IslandLegend() {
    const sections = [
        { building: 'Neubau', floor: 'EG', col: 'var(--color-brand-sky)' },
        { building: 'Neubau', floor: 'OG', col: '#2A9D8F' },
        { building: 'Altbau', floor: 'EG', col: '#E07B30' },
        { building: 'Altbau', floor: 'OG', col: 'var(--color-brand-red)' },
    ];

    return (
        <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-3.5 mb-6">
                {sections.map(sec => {
                    const isls = ISLANDS.filter(isl => isl.building === sec.building && isl.floor === sec.floor);
                    return (
                        <Card
                            key={`${sec.building}${sec.floor}`}
                            className="p-0 overflow-hidden bg-white/[0.03]"
                            style={{ border: `1px solid ${sec.col}30` }}
                        >
                            <div className="px-[18px] py-2.5 flex gap-2 items-center" style={{ background: sec.col }}>
                                <span className="text-white font-extrabold text-[0.85rem] tracking-[0.5px]">{sec.building}</span>
                                <span className="bg-white/25 text-white text-[0.68rem] px-2 py-px rounded-xl font-bold">{sec.floor}</span>
                            </div>
                            <div className="p-3.5 flex flex-col gap-2.5">
                                {isls.map(isl => (
                                    <div
                                        key={isl.id}
                                        className="flex gap-3 items-start px-3.5 py-3 rounded-lg"
                                        style={{ background: `${isl.color}0d`, border: `1px solid ${isl.color}35` }}
                                    >
                                        <span className="w-[9px] h-[9px] rounded-full shrink-0 mt-1" style={{ background: isl.color }} />
                                        <div className="flex-1">
                                            <div className="flex gap-2 items-center mb-[5px] flex-wrap">
                                                <span className="font-extrabold text-base" style={{ color: isl.color }}>{isl.name}</span>
                                                <span
                                                    className="font-mono text-[0.7rem] px-2 py-px rounded text-white font-semibold"
                                                    style={{ background: `${isl.color}18`, border: `1px solid ${isl.color}45` }}
                                                >
                                                    {isl.room}
                                                </span>
                                            </div>
                                            <div className="text-[0.75rem] text-white/70 leading-[1.6]">{isl.topic}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}

/* ═══════════════ UTILS ═══════════════ */

interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

function Card({ children, className = '', style }: CardProps) {
    return (
        <div className={`bg-white/5 rounded-[10px] border border-white/10 ${className}`} style={style}>
            {children}
        </div>
    );
}

interface SectionTitleProps {
    children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
    return (
        <div className="flex items-center gap-3 mb-3.5">
            <div className="w-1 h-5 bg-brand-sky rounded-sm shrink-0" />
            <span className="text-[0.72rem] tracking-[3px] text-white uppercase font-bold">{children}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        </div>
    );
}

interface InfoBadgeProps {
    label: string;
    val: string;
    accent: string;
}

function InfoBadge({ label, val, accent }: InfoBadgeProps) {
    return (
        <div className="bg-white/5 rounded-lg px-4 py-2" style={{ border: `2px solid ${accent}30` }}>
            <div className="text-[0.6rem] tracking-[2px] uppercase font-bold mb-[3px]" style={{ color: accent }}>{label}</div>
            <div className="text-base font-extrabold text-white">{val}</div>
        </div>
    );
}
