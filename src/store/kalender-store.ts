"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EventType = "Campus-Event" | "Weiterbildung" | "Webinar" | "Sonstige";

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;      // ISO date string, e.g. "2026-03-18"
    time: string;       // e.g. "09:00"
    type: EventType;
    color: string;      // Tailwind color class prefix, e.g. "blue", "emerald", "violet", "amber"
    description: string;
}

const DEFAULT_EVENTS: CalendarEvent[] = [
    {
        id: "evt-001",
        title: "Thitronik Campus Kick-off",
        date: "2026-03-18",
        time: "09:00",
        type: "Campus-Event",
        color: "blue",
        description: "Eröffnungsveranstaltung des Thitronik Händler-Campus. Begrüßung durch die Geschäftsführung, Vorstellung der Agenda.",
    },
    {
        id: "evt-002",
        title: "WiPro Schulung: Hybridantriebe",
        date: "2026-03-19",
        time: "10:30",
        type: "Weiterbildung",
        color: "emerald",
        description: "Technische Weiterbildung zu Hybridantrieben und Ladeinfrastruktur. Durchgeführt vom WiPro-Team.",
    },
    {
        id: "evt-003",
        title: "ProFinder Sprechstunde",
        date: "2026-03-19",
        time: "14:00",
        type: "Weiterbildung",
        color: "emerald",
        description: "Offene Sprechstunde mit dem ProFinder-Berater. Individuelle Fragen zu Förderungen und Vertriebsstrategie.",
    },
    {
        id: "evt-004",
        title: "Live-Webinar: Neuheiten Modellreihe 2026",
        date: "2026-03-20",
        time: "11:00",
        type: "Webinar",
        color: "violet",
        description: "Exklusives Live-Webinar zu den neuen Fahrzeugmodellen. Fragen können live gestellt werden.",
    },
    {
        id: "evt-005",
        title: "WiPro Zertifizierungsprüfung – Elektromobilität",
        date: "2026-03-24",
        time: "09:00",
        type: "Weiterbildung",
        color: "emerald",
        description: "Abschlussprüfung der WiPro Zertifizierung Elektromobilität. Bitte Ausweis mitbringen.",
    },
    {
        id: "evt-006",
        title: "Netzwerk-Workshop: Händler-Community",
        date: "2026-03-25",
        time: "15:00",
        type: "Campus-Event",
        color: "blue",
        description: "Gemeinsamer Workshop-Nachmittag für den Erfahrungsaustausch zwischen Thitronik-Händlern.",
    },
    {
        id: "evt-007",
        title: "ProFinder: Vertriebsstrategie 2026",
        date: "2026-03-27",
        time: "10:00",
        type: "Weiterbildung",
        color: "emerald",
        description: "Strategiesession zur Absatzoptimierung mit dem ProFinder-System. Praxisbeispiele und Best Practices.",
    },
    {
        id: "evt-008",
        title: "Campus Abschluss & Zertifikatsübergabe",
        date: "2026-03-31",
        time: "16:00",
        type: "Campus-Event",
        color: "blue",
        description: "Feierlicher Abschluss des Thitronik Campus. Übergabe der Zertifikate und Ausblick auf die nächste Saison.",
    },
];

interface KalenderState {
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, "id">) => string;
    removeEvent: (id: string) => void;
    getEventsForDate: (dateStr: string) => CalendarEvent[];
    getEventsForMonth: (year: number, month: number) => CalendarEvent[];
}

function uuid() {
    return "evt-" + "xxxxxxxx".replace(/x/g, () =>
        ((Math.random() * 16) | 0).toString(16)
    );
}

export const useKalenderStore = create<KalenderState>()(
    persist(
        (set, get) => ({
            events: DEFAULT_EVENTS,

            addEvent: (data) => {
                const id = uuid();
                const event: CalendarEvent = { id, ...data };
                set((s) => ({ events: [...s.events, event] }));
                return id;
            },

            removeEvent: (id) =>
                set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

            getEventsForDate: (dateStr) =>
                get().events.filter((e) => e.date === dateStr),

            getEventsForMonth: (year, month) =>
                get().events.filter((e) => {
                    const d = new Date(e.date);
                    return d.getFullYear() === year && d.getMonth() === month;
                }),
        }),
        {
            name: "thitronik-kalender",
        }
    )
);
