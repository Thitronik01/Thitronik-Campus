"use client";

import { useState, useEffect } from "react";

/* ═══════════════════ CI THITRONIK ═══════════════════
   Navy:   #003470  (primary dark)
   Blue:   #4AADCE  (accent sky-blue)
   Red:    #C8202E  (logo accent)
   White:  #FFFFFF
   Light:  #EBF4F9  (soft background)
   ═══════════════════════════════════════════════════ */

const CI = {
    navy: '#003470',
    navyD: '#002358',
    navyL: '#0A4080',
    blue: '#4AADCE',
    blueL: '#6EC3DE',
    blueD: '#3092B2',
    red: '#C8202E',
    redL: '#E03040',
    white: '#FFFFFF',
    light: '#EBF4F9',
    light2: '#D6ECF5',
    text: '#001830',
    textM: '#2a4060',
    textL: '#5a7090',
};

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
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', color: CI.text, fontFamily: "'Segoe UI', Arial, sans-serif", backdropFilter: 'blur(10px)' }}>
            <style>{`
        .hov{transition:all .18s ease}
        .hov:hover{filter:brightness(1.07);transform:translateY(-1px)}
        .fade{animation:fd .3s ease both}
        @keyframes fd{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .pulse{animation:pl 1.8s ease-in-out infinite}
        @keyframes pl{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.35)}}
        .glow{animation:gw 3s ease-in-out infinite}
        @keyframes gw{0%,100%{opacity:1}50%{opacity:.8}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:${CI.light}}
        ::-webkit-scrollbar-thumb{background:${CI.blue};border-radius:3px}
        .cell-hover:hover{background:rgba(0,52,112,0.06)!important;transition:background .15s}
      `}</style>

            {/* ── HEADER ── */}
            <div style={{
                background: `linear-gradient(135deg, ${CI.navyD} 0%, ${CI.navy} 60%, ${CI.navyL} 100%)`,
                position: 'relative', overflow: 'hidden', padding: '0 20px',
            }}>
                {/* Diagonal sail shape decoration */}
                <div style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%',
                    background: `linear-gradient(135deg, transparent 40%, ${CI.navyL}55 100%)`,
                    clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
                }} />
                <div style={{
                    position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)',
                    opacity: 0.07, fontSize: '8rem', lineHeight: 1, userSelect: 'none', color: 'white',
                    fontWeight: 900, letterSpacing: -5
                }}>⛵</div>

                <div style={{ maxWidth: 1360, margin: '0 auto', padding: '22px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
                    {/* Logo area */}
                    <div>
                        <div style={{ fontSize: '1.55rem', fontWeight: 800, color: 'white', letterSpacing: 1.5, lineHeight: 1 }}>THITRONIK</div>
                        <div style={{ fontSize: '0.58rem', color: CI.blueL, letterSpacing: 3.5, textTransform: 'uppercase', marginTop: 2, fontWeight: 500 }}>Campus · Eckernförde</div>
                    </div>

                    {/* Clock */}
                    <div style={{
                        background: 'rgba(255,255,255,0.09)', border: `1px solid rgba(74,173,206,0.45)`,
                        borderRadius: 8, padding: '10px 26px', textAlign: 'center', backdropFilter: 'blur(4px)',
                    }}>
                        <div className="glow" style={{ fontFamily: 'monospace', fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', color: 'white', letterSpacing: 4, fontWeight: 300, lineHeight: 1 }}>
                            {clockStr}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: CI.blueL, letterSpacing: 3.5, textTransform: 'uppercase', marginTop: 4 }}>Aktuelle Uhrzeit</div>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {[['50', 'Händler'], ['7', 'Gruppen'], ['7', 'Inseln']].map(([val, lbl]) => (
                            <div key={lbl} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{val}</div>
                                <div style={{ fontSize: '0.55rem', color: CI.blueL, letterSpacing: 2, textTransform: 'uppercase' }}>{lbl}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── BLUE DIVIDER ── */}
            <div style={{ background: CI.blue, height: 4, boxShadow: `0 2px 12px ${CI.blue}60` }} />

            {/* ── CONTENT ── */}
            <div style={{ maxWidth: 1360, margin: '0 auto', padding: '24px 14px 60px' }}>

                {/* ── TABS ── */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 4, border: `1px solid rgba(255,255,255,0.1)`, width: 'fit-content' }}>
                    {[
                        { id: 'guide', label: '🧭 Mein Standort' },
                        { id: 'table', label: '📋 Gesamtplan' },
                        { id: 'legend', label: '🏝 Inseln & Räume' },
                    ].map(t => (
                        <button key={t.id} className="hov" onClick={() => setTab(t.id)} style={{
                            padding: '10px 22px', borderRadius: 6, fontSize: '.88rem', fontWeight: 600,
                            background: tab === t.id ? CI.navy : 'transparent',
                            color: tab === t.id ? 'white' : 'rgba(255,255,255,0.7)',
                            transition: 'all .18s',
                        }}>{t.label}</button>
                    ))}
                </div>

                {/* ── GUIDE ── */}
                {tab === 'guide' && (
                    <div className="fade">
                        {/* Group Selector */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, border: `1px solid rgba(255,255,255,0.1)`, padding: '20px 24px', marginBottom: 20 }}>
                            <div style={{ fontSize: '.7rem', letterSpacing: 3, color: CI.blue, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>
                                ◆ Wähle deine Gruppe
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {GROUPS.map(g => {
                                    const sel = group === g.id;
                                    return (
                                        <button key={g.id} className="hov" onClick={() => setGroup(g.id)} style={{
                                            padding: '12px 16px', borderRadius: 8, minWidth: 90, textAlign: 'center',
                                            background: sel ? CI.navy : 'rgba(255,255,255,0.03)',
                                            border: sel ? `2px solid ${CI.navy}` : `2px solid rgba(255,255,255,0.1)`,
                                            color: sel ? 'white' : 'white',
                                            transition: 'all .18s',
                                        }}>
                                            <div style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1, color: sel ? 'white' : 'white' }}>{g.id}</div>
                                            <div style={{ fontSize: '.62rem', color: sel ? CI.blueL : 'rgba(255,255,255,0.5)', marginTop: 3, letterSpacing: .5 }}>Händler {g.range}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {!group && (
                            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: `1px solid rgba(255,255,255,0.1)` }}>
                                <div style={{ fontSize: '3rem', marginBottom: 14 }}>🧭</div>
                                <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>Wähle deine Gruppe</div>
                                <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>Dann siehst du sofort, wo du jetzt sein musst.</div>
                            </div>
                        )}

                        {group && (
                            <div className="fade">
                                <CurrentCard current={current} next={next} progress={progress} remainingMins={remainingMins} group={group} />
                                <div style={{ marginTop: 24 }}>
                                    <SectionTitle>Tagesablauf · Gruppe {group}</SectionTitle>
                                    <DayTimeline gi={gi} nowMins={nowMins} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── TABLE ── */}
                {tab === 'table' && (
                    <div className="fade">
                        <BuildingLegend />
                        <FullTable nowMins={nowMins} />
                    </div>
                )}

                {/* ── LEGEND ── */}
                {tab === 'legend' && (
                    <div className="fade">
                        <IslandLegend />
                    </div>
                )}
            </div>

            {/* ── FOOTER ── */}
            <div style={{ background: 'rgba(0,0,0,0.2)', color: CI.blueL, textAlign: 'center', padding: '14px 20px', fontSize: '.7rem', letterSpacing: 2, textTransform: 'uppercase' }}>
                THITRONIK® Campus · Eckernförde · Island Hopping Schulungstag
            </div>
        </div>
    );
}

/* ═══════════════ CURRENT CARD ═══════════════ */

function CurrentCard({ current, next, progress, remainingMins, group }: any) {
    if (!current) return (
        <Card style={{ textAlign: 'center', padding: 52 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🌅</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>Außerhalb der Schulungszeiten</div>
            <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>Schulung: 08:30 – 17:00 Uhr</div>
        </Card>
    );

    const isIsland = current.type === 'island';
    const isl = current.isl;
    const accent = isIsland ? isl.color : current.type === 'lunch' || current.type === 'break' ? CI.blue : CI.navy;
    const accentL = isIsland ? isl.colorL : current.type === 'lunch' || current.type === 'break' ? CI.blueL : CI.navyL;

    return (
        <Card style={{ background: 'rgba(255,255,255,0.03)', borderTop: `4px solid ${accent}`, padding: 0, overflow: 'hidden' }}>
            {/* Status bar */}
            <div style={{ background: `${accent}12`, borderBottom: `1px solid ${accent}30`, padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="pulse" style={{ width: 9, height: 9, borderRadius: '50%', background: accent, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '.7rem', letterSpacing: 3, color: accent, textTransform: 'uppercase', fontWeight: 700 }}>
                    Jetzt aktiv · Gruppe {group} · {fmt(current.s)} – {fmt(current.e)}
                </span>
            </div>

            <div style={{ padding: '22px 24px', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Left */}
                <div style={{ flex: '1 1 280px' }}>
                    {isIsland ? (
                        <>
                            <div style={{ display: 'inline-block', background: accent, color: 'white', borderRadius: 4, padding: '2px 10px', fontSize: '.7rem', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
                                Schulungsinsel
                            </div>
                            <div style={{ fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 12 }}>
                                {isl.name}
                            </div>
                            <div style={{ fontSize: '.83rem', color: 'rgba(255,255,255,0.8)', marginBottom: 18, lineHeight: 1.7, maxWidth: 420 }}>
                                {isl.topic}
                            </div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {[{ lbl: 'Raum', val: isl.room, mono: true }, { lbl: 'Gebäude', val: isl.building }, { lbl: 'Etage', val: isl.floor }].map(b => (
                                    <div key={b.lbl} style={{ background: `${accent}12`, border: `2px solid ${accent}30`, borderRadius: 8, padding: '8px 16px', minWidth: 85 }}>
                                        <div style={{ fontSize: '.6rem', letterSpacing: 2, color: accent, textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>{b.lbl}</div>
                                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', fontFamily: b.mono ? 'monospace' : 'inherit' }}>{b.val}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 12 }}>
                                {current.icon} {current.title}
                            </div>
                            {current.loc && current.loc !== '–' && (
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    <InfoBadge label="Ort" val={current.loc} accent={accent} />
                                    <InfoBadge label="Bereich" val={current.bldg} accent={accent} />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Timer */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: `2px solid ${accent}30`, borderRadius: 10, padding: '18px 22px', minWidth: 180, flexShrink: 0, textAlign: 'center' }}>
                    <div style={{ fontSize: '.65rem', letterSpacing: 2.5, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8 }}>Verbleibend</div>
                    <div style={{ fontSize: '3.2rem', fontWeight: 800, color: accent, fontFamily: 'monospace', lineHeight: 1 }}>
                        {remainingMins}<span style={{ fontSize: '1.1rem', marginLeft: 3, fontFamily: 'inherit' }}>min</span>
                    </div>
                    <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.5)', marginTop: 4, marginBottom: 14 }}>bis {fmt(current.e)} Uhr</div>
                    <div style={{ background: `${accent}20`, borderRadius: 4, height: 6, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, background: `linear-gradient(90deg,${accent},${accentL})`, borderRadius: 4, transition: 'width 1s linear' }} />
                    </div>
                </div>
            </div>

            {/* Next up */}
            {next && (
                <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, background: 'rgba(0,0,0,0.1)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '.62rem', letterSpacing: 2.5, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, flexShrink: 0 }}>DANACH</div>
                    <div style={{ fontSize: '.88rem', color: 'white' }}>
                        {next.type === 'island' && next.isl
                            ? <><span style={{ fontWeight: 700, color: next.isl.color }}>{next.isl.name}</span>
                                {' · '}<span style={{ fontFamily: 'monospace', background: `${next.isl.color}15`, padding: '1px 7px', borderRadius: 3, fontSize: '.78rem', color: 'white' }}>{next.isl.room}</span>
                                {' · '}{next.isl.building} {next.isl.floor}
                                {' · ab '}<span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{fmt(next.s)}</span></>
                            : <><span style={{ color: CI.blue, fontWeight: 700 }}>{next.icon} {next.title}</span>
                                {next.loc && next.loc !== '–' && ` · ${next.loc}, ${next.bldg}`}
                                {' · ab '}<span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{fmt(next.s)}</span></>
                        }
                    </div>
                </div>
            )}
        </Card>
    );
}

/* ═══════════════ DAY TIMELINE ═══════════════ */

function DayTimeline({ gi, nowMins }: any) {
    return (
        <Card style={{ padding: 0, overflow: 'hidden', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            {SCHEDULE.map((slot, i) => {
                const isl = slot.type === 'island' ? getIsland(slot.si!, gi) : null;
                const isActive = nowMins >= slot.s && nowMins < slot.e;
                const isPast = nowMins >= slot.e;
                const isTransfer = slot.type === 'transfer';
                const col = isl ? isl.color : slot.type === 'lunch' || slot.type === 'break' ? CI.blue : CI.navy;

                if (isTransfer) return (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '4px 20px', opacity: isPast ? .25 : .45, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '.7rem', color: 'rgba(255,255,255,0.5)', minWidth: 46 }}>{fmt(slot.s)}</div>
                        <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: .5 }}>↔ Transfer · 10 Min</div>
                    </div>
                );

                return (
                    <div key={i} style={{
                        display: 'flex', gap: 14, alignItems: 'center',
                        padding: '12px 20px',
                        background: isActive ? `${col}12` : i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                        borderLeft: isActive ? `4px solid ${col}` : '4px solid transparent',
                        borderBottom: `1px solid rgba(255,255,255,0.05)`,
                        opacity: isPast ? .45 : 1, transition: 'all .3s',
                    }}>
                        <span className={isActive ? 'pulse' : ''} style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? col : isPast ? 'rgba(255,255,255,0.2)' : `${col}55`, flexShrink: 0 }} />
                        <div style={{ fontFamily: 'monospace', fontSize: '.8rem', color: isActive ? col : 'rgba(255,255,255,0.5)', fontWeight: isActive ? 700 : 400, minWidth: 46 }}>{fmt(slot.s)}</div>

                        {isl ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 700, color: isActive ? isl.color : 'white', fontSize: '.95rem' }}>{isl.name}</span>
                                <span style={{ fontFamily: 'monospace', fontSize: '.7rem', background: `${isl.color}15`, border: `1px solid ${isl.color}40`, padding: '2px 8px', borderRadius: 4, color: 'white' }}>{isl.room}</span>
                                <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.5)' }}>{isl.building} · {isl.floor}</span>
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ color: isActive ? col : 'white', fontWeight: isActive ? 700 : 500, fontSize: '.92rem' }}>{slot.icon} {slot.title}</span>
                                {slot.loc && slot.loc !== '–' && <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.5)' }}>{slot.loc} · {slot.bldg}</span>}
                            </div>
                        )}

                        <div style={{ fontFamily: 'monospace', fontSize: '.65rem', color: 'rgba(255,255,255,0.5)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>–{fmt(slot.e)}</div>
                    </div>
                );
            })}
        </Card>
    );
}

/* ═══════════════ FULL TABLE ═══════════════ */

function BuildingLegend() {
    return (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
                { lbl: 'Neubau EG', rooms: 'N-EG-101 · N-EG-102', col: CI.blue },
                { lbl: 'Neubau OG', rooms: 'N-OG-101', col: '#2A9D8F' },
                { lbl: 'Altbau EG', rooms: 'A-EG-101 · A-EG-102', col: '#E07B30' },
                { lbl: 'Altbau OG', rooms: 'A-OG-101 · A-OG-102', col: CI.red },
            ].map(b => (
                <div key={b.lbl} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${b.col}40`, borderLeft: `4px solid ${b.col}`, borderRadius: 7, padding: '7px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'white' }}>{b.lbl}</div>
                        <div style={{ fontSize: '.62rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{b.rooms}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function FullTable({ nowMins }: any) {
    return (
        <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid rgba(255,255,255,0.1)` }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 920, fontSize: '.8rem', background: 'transparent' }}>
                <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'monospace', fontSize: '.68rem', letterSpacing: 2, color: CI.blueL, textTransform: 'uppercase', minWidth: 92 }}>Uhrzeit</th>
                        {GROUPS.map(g => (
                            <th key={g.id} style={{ padding: '10px 8px', textAlign: 'center', fontSize: '.68rem', letterSpacing: 1, color: 'white', textTransform: 'uppercase', fontWeight: 700 }}>
                                {g.id}<br /><span style={{ fontSize: '.58rem', color: CI.blueL, fontWeight: 400 }}>{g.range}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {SCHEDULE.map((slot, i) => {
                        const isActive = nowMins >= slot.s && nowMins < slot.e;
                        const isPast = nowMins >= slot.e;

                        const rowStyle = {
                            background: isActive ? `${CI.blue}12` : 'transparent',
                            opacity: isPast ? .5 : 1,
                        };

                        const timeCell = (
                            <td style={{ padding: '10px 14px', verticalAlign: 'middle', borderRight: `1px solid rgba(255,255,255,0.05)`, whiteSpace: 'nowrap', background: isActive ? `${CI.blue}18` : 'transparent' }}>
                                <div style={{ fontFamily: 'monospace', fontSize: '.85rem', color: isActive ? CI.blueL : 'white', fontWeight: isActive ? 700 : 500 }}>{fmt(slot.s)}</div>
                                <div style={{ fontFamily: 'monospace', fontSize: '.62rem', color: 'rgba(255,255,255,0.5)' }}>–{fmt(slot.e)}</div>
                            </td>
                        );

                        if (slot.type !== 'island') {
                            return (
                                <tr key={i} style={rowStyle}>
                                    {timeCell}
                                    <td colSpan={7} style={{ padding: '11px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                                        <span style={{ fontSize: '.88rem', color: slot.type === 'transfer' ? 'rgba(255,255,255,0.4)' : 'white', fontWeight: slot.type === 'transfer' ? 400 : 600 }}>
                                            {slot.icon} {slot.title}
                                        </span>
                                    </td>
                                </tr>
                            );
                        }

                        return (
                            <tr key={i} style={rowStyle}>
                                {timeCell}
                                {GROUPS.map((g, gi) => {
                                    const isl = getIsland(slot.si!, gi);
                                    return (
                                        <td key={g.id} className="cell-hover" style={{ padding: '7px 8px', textAlign: 'center', verticalAlign: 'middle', background: `${isl.color}12`, borderBottom: `1px solid rgba(255,255,255,0.05)`, borderRight: `1px solid ${isl.color}25` }}>
                                            <div style={{ fontWeight: 700, color: isl.color, fontSize: '.82rem', lineHeight: 1.3 }}>{isl.name}</div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '.62rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{isl.room}</div>
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
        { building: 'Neubau', floor: 'EG', col: CI.blue },
        { building: 'Neubau', floor: 'OG', col: '#2A9D8F' },
        { building: 'Altbau', floor: 'EG', col: '#E07B30' },
        { building: 'Altbau', floor: 'OG', col: CI.red },
    ];

    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 14, marginBottom: 24 }}>
                {sections.map(sec => {
                    const isls = ISLANDS.filter(isl => isl.building === sec.building && isl.floor === sec.floor);
                    return (
                        <Card key={`${sec.building}${sec.floor}`} style={{ padding: 0, overflow: 'hidden', border: `1px solid ${sec.col}30`, background: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ background: sec.col, padding: '10px 18px', display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ color: 'white', fontWeight: 800, fontSize: '.85rem', letterSpacing: .5 }}>{sec.building}</span>
                                <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '.68rem', padding: '1px 8px', borderRadius: 12, fontWeight: 700 }}>{sec.floor}</span>
                            </div>
                            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {isls.map(isl => (
                                    <div key={isl.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 8, background: `${isl.color}0d`, border: `1px solid ${isl.color}35` }}>
                                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: isl.color, flexShrink: 0, marginTop: 4 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5, flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 800, color: isl.color, fontSize: '1rem' }}>{isl.name}</span>
                                                <span style={{ fontFamily: 'monospace', fontSize: '.7rem', background: `${isl.color}18`, border: `1px solid ${isl.color}45`, padding: '2px 8px', borderRadius: 4, color: 'white', fontWeight: 600 }}>{isl.room}</span>
                                            </div>
                                            <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{isl.topic}</div>
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

function Card({ children, style = {} }: any) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, border: `1px solid rgba(255,255,255,0.1)`, ...style }}>
            {children}
        </div>
    );
}

function SectionTitle({ children }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 4, height: 20, background: CI.blue, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: '.72rem', letterSpacing: 3, color: 'white', textTransform: 'uppercase', fontWeight: 700 }}>{children}</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,rgba(255,255,255,0.1),transparent)` }} />
        </div>
    );
}

function InfoBadge({ label, val, accent }: any) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.05)', border: `2px solid ${accent}30`, borderRadius: 8, padding: '8px 16px' }}>
            <div style={{ fontSize: '.6rem', letterSpacing: 2, color: accent, textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>{val}</div>
        </div>
    );
}
