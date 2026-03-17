"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumBackground } from "@/components/layout/premium-background";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useKalenderStore, CalendarEvent, EventType } from "@/store/kalender-store";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    List,
    Clock,
    MapPin,
    X,
    ExternalLink,
} from "lucide-react";

/* ───────────────────── Helpers ───────────────────── */

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_NAMES = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const TYPE_COLORS: Record<EventType, { bg: string; text: string; badge: string; dot: string; glow: string }> = {
    "Campus-Event": {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        badge: "bg-blue-500/30 text-blue-300 border-blue-500/40",
        dot: "bg-blue-500",
        glow: "shadow-blue-500/20",
    },
    "Weiterbildung": {
        bg: "bg-emerald-500/20",
        text: "text-emerald-400",
        badge: "bg-emerald-500/30 text-emerald-300 border-emerald-500/40",
        dot: "bg-emerald-500",
        glow: "shadow-emerald-500/20",
    },
    "Webinar": {
        bg: "bg-violet-500/20",
        text: "text-violet-400",
        badge: "bg-violet-500/30 text-violet-300 border-violet-500/40",
        dot: "bg-violet-500",
        glow: "shadow-violet-500/20",
    },
    "Sonstige": {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        badge: "bg-amber-500/30 text-amber-300 border-amber-500/40",
        dot: "bg-amber-500",
        glow: "shadow-amber-500/20",
    },
};

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

/** Monday = 0, Sunday = 6 (ISO week) */
function getStartDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const weekday = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][d.getDay()];
    return `${weekday}. ${d.getDate()}. ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function toDateStr(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/* ───────────────── Tab Navigation ───────────────── */

function ProfileTabNav() {
    return (
        <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 mb-6">
            <Link
                href="/profile"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
                👤 Mein Profil
            </Link>
            <div className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white border border-white/10">
                📅 Mein Kalender
            </div>
            <Link
                href="/certificates"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
                🎓 Zertifikate
            </Link>
        </div>
    );
}

/* ───────────────── Event Detail Modal ───────────── */

function EventDetailModal({
    event,
    onClose,
}: {
    event: CalendarEvent;
    onClose: () => void;
}) {
    const colors = TYPE_COLORS[event.type];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-lg bg-brand-navy/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Color accent bar */}
                <div className={`h-1.5 w-full ${colors.dot}`} />

                <div className="p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-white leading-tight">
                                {event.title}
                            </h2>
                            <Badge
                                className={`${colors.badge} border text-xs font-semibold px-2.5 py-0.5`}
                            >
                                {event.type}
                            </Badge>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5 text-white/70">
                            <CalendarIcon className="w-4 h-4 text-brand-sky" />
                            <span className="text-sm font-medium">
                                {formatDate(event.date)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-white/70">
                            <Clock className="w-4 h-4 text-brand-sky" />
                            <span className="text-sm font-medium">{event.time} Uhr</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-white/80 leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <Button
                            className="flex-1 bg-brand-sky hover:bg-brand-sky/90 text-white gap-2"
                            onClick={() => {}}
                        >
                            <ExternalLink className="w-4 h-4" />
                            Zum Termin
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-white/20 text-white hover:bg-white/10"
                            onClick={onClose}
                        >
                            Schließen
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ───────────────── Month View ───────────────────── */

function MonthView({
    year,
    month,
    events,
    onSelectEvent,
}: {
    year: number;
    month: number;
    events: CalendarEvent[];
    onSelectEvent: (e: CalendarEvent) => void;
}) {
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getStartDayOfMonth(year, month);
    const today = new Date();
    const todayStr =
        today.getFullYear() === year && today.getMonth() === month
            ? toDateStr(year, month, today.getDate())
            : null;

    // Build event map: dateStr -> events[]
    const eventMap = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {};
        events.forEach((e) => {
            if (!map[e.date]) map[e.date] = [];
            map[e.date].push(e);
        });
        return map;
    }, [events]);

    // Previous month trailing days
    const prevMonthDays = getDaysInMonth(
        month === 0 ? year - 1 : year,
        month === 0 ? 11 : month - 1
    );

    const cells: {
        day: number;
        dateStr: string;
        isCurrentMonth: boolean;
        isToday: boolean;
        events: CalendarEvent[];
    }[] = [];

    // Trailing days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        const m = month === 0 ? 11 : month - 1;
        const y = month === 0 ? year - 1 : year;
        const ds = toDateStr(y, m, d);
        cells.push({ day: d, dateStr: ds, isCurrentMonth: false, isToday: false, events: eventMap[ds] || [] });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        const ds = toDateStr(year, month, d);
        cells.push({
            day: d,
            dateStr: ds,
            isCurrentMonth: true,
            isToday: ds === todayStr,
            events: eventMap[ds] || [],
        });
    }

    // Fill remaining cells
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        for (let d = 1; d <= remaining; d++) {
            const ds = toDateStr(nextYear, nextMonth, d);
            cells.push({ day: d, dateStr: ds, isCurrentMonth: false, isToday: false, events: eventMap[ds] || [] });
        }
    }

    return (
        <div className="space-y-1">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((wd) => (
                    <div
                        key={wd}
                        className="text-center text-xs font-bold text-white/40 uppercase tracking-wider py-2"
                    >
                        {wd}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, idx) => (
                    <div
                        key={idx}
                        className={`
                            min-h-[80px] md:min-h-[100px] rounded-xl p-1.5 md:p-2 transition-colors border
                            ${cell.isCurrentMonth
                                ? "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07]"
                                : "bg-transparent border-transparent opacity-30"
                            }
                            ${cell.isToday
                                ? "!bg-brand-sky/10 !border-brand-sky/30 ring-1 ring-brand-sky/20"
                                : ""
                            }
                        `}
                    >
                        <div
                            className={`text-xs font-bold mb-1 ${
                                cell.isToday
                                    ? "text-brand-sky"
                                    : cell.isCurrentMonth
                                    ? "text-white/70"
                                    : "text-white/30"
                            }`}
                        >
                            {cell.day}
                        </div>

                        {/* Event chips */}
                        <div className="space-y-0.5">
                            {cell.events.slice(0, 3).map((evt) => {
                                const colors = TYPE_COLORS[evt.type];
                                return (
                                    <button
                                        key={evt.id}
                                        onClick={() => onSelectEvent(evt)}
                                        className={`
                                            w-full text-left text-[10px] md:text-xs font-medium
                                            px-1.5 py-0.5 rounded-md truncate cursor-pointer
                                            transition-all hover:shadow-lg
                                            ${colors.bg} ${colors.text} hover:${colors.glow}
                                        `}
                                        title={evt.title}
                                    >
                                        <span className="hidden md:inline">{evt.time} </span>
                                        {evt.title}
                                    </button>
                                );
                            })}
                            {cell.events.length > 3 && (
                                <div className="text-[10px] text-white/40 font-medium pl-1">
                                    +{cell.events.length - 3} weitere
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ───────────────── List View ────────────────────── */

function ListView({
    events,
    onSelectEvent,
}: {
    events: CalendarEvent[];
    onSelectEvent: (e: CalendarEvent) => void;
}) {
    const sorted = useMemo(
        () =>
            [...events].sort((a, b) => {
                const dateCompare = a.date.localeCompare(b.date);
                if (dateCompare !== 0) return dateCompare;
                return a.time.localeCompare(b.time);
            }),
        [events]
    );

    if (sorted.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-white/50 text-sm">Keine Termine in diesem Monat.</p>
            </div>
        );
    }

    // Group by date
    const grouped: Record<string, CalendarEvent[]> = {};
    sorted.forEach((e) => {
        if (!grouped[e.date]) grouped[e.date] = [];
        grouped[e.date].push(e);
    });

    return (
        <div className="space-y-4">
            {Object.entries(grouped).map(([dateStr, dayEvents]) => (
                <div key={dateStr}>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-1">
                        {formatDate(dateStr)}
                    </div>
                    <div className="space-y-2">
                        {dayEvents.map((evt) => {
                            const colors = TYPE_COLORS[evt.type];
                            return (
                                <motion.button
                                    key={evt.id}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => onSelectEvent(evt)}
                                    className={`
                                        w-full text-left flex items-center gap-4 p-4
                                        bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm
                                        border border-white/10 rounded-xl transition-all
                                        cursor-pointer group
                                    `}
                                >
                                    {/* Color dot */}
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors.dot}`} />

                                    {/* Time */}
                                    <div className="text-sm font-bold text-white/60 w-14 shrink-0">
                                        {evt.time}
                                    </div>

                                    {/* Title + Type */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate group-hover:text-brand-sky transition-colors">
                                            {evt.title}
                                        </p>
                                    </div>

                                    {/* Badge */}
                                    <Badge
                                        className={`${colors.badge} border text-[10px] font-semibold shrink-0 hidden sm:flex`}
                                    >
                                        {evt.type}
                                    </Badge>

                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ───────────────── Main Kalender Page ────────────── */

export default function KalenderPage() {
    const [currentDate, setCurrentDate] = useState(() => new Date(2026, 2, 1)); // March 2026
    const [view, setView] = useState<"month" | "list">("month");
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [direction, setDirection] = useState(0); // -1 = left, 1 = right

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const { events } = useKalenderStore();

    const monthEvents = useMemo(
        () =>
            events.filter((e) => {
                const d = new Date(e.date);
                return d.getFullYear() === year && d.getMonth() === month;
            }),
        [events, year, month]
    );

    const goToPrevMonth = useCallback(() => {
        setDirection(-1);
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }, []);

    const goToNextMonth = useCallback(() => {
        setDirection(1);
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }, []);

    const goToToday = useCallback(() => {
        setDirection(0);
        setCurrentDate(new Date());
    }, []);

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 60 : -60,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -60 : 60,
            opacity: 0,
        }),
    };

    return (
        <RoleGuard
            requiredRole="user"
            fallback={
                <div className="flex h-[50vh] items-center justify-center p-8">
                    <Card className="w-full max-w-md p-6 text-center">
                        <h2 className="mb-4">Bitte Anmelden</h2>
                        <Button onClick={() => (window.location.href = "/login")}>
                            Zum Login
                        </Button>
                    </Card>
                </div>
            }
        >
            <PremiumBackground>
                <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
                    {/* Tab Navigation */}
                    <ProfileTabNav />

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                                <span className="text-4xl">📅</span>
                                Mein Kalender
                            </h1>
                            <p className="text-white/60 text-sm mt-1.5">
                                Alle Ihre Campus-Termine auf einen Blick.
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
                            <button
                                onClick={() => setView("month")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    view === "month"
                                        ? "bg-white/10 text-white border border-white/10"
                                        : "text-white/50 hover:text-white"
                                }`}
                            >
                                <CalendarIcon className="w-3.5 h-3.5" />
                                Monat
                            </button>
                            <button
                                onClick={() => setView("list")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    view === "list"
                                        ? "bg-white/10 text-white border border-white/10"
                                        : "text-white/50 hover:text-white"
                                }`}
                            >
                                <List className="w-3.5 h-3.5" />
                                Liste
                            </button>
                        </div>
                    </div>

                    {/* Calendar Card */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl">
                        {/* Month navigation */}
                        <div className="flex items-center justify-between mb-5">
                            <button
                                onClick={goToPrevMonth}
                                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3">
                                <h2 className="text-lg md:text-xl font-bold text-white">
                                    {MONTH_NAMES[month]} {year}
                                </h2>
                                <button
                                    onClick={goToToday}
                                    className="text-[10px] font-bold text-brand-sky border border-brand-sky/30 rounded-md px-2 py-0.5 hover:bg-brand-sky/10 transition-colors"
                                >
                                    Heute
                                </button>
                            </div>

                            <button
                                onClick={goToNextMonth}
                                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Event count summary */}
                        <div className="flex items-center gap-4 mb-4 px-1">
                            <span className="text-xs text-white/40">
                                {monthEvents.length} Termin{monthEvents.length !== 1 ? "e" : ""}
                            </span>
                            <div className="flex items-center gap-3">
                                {(["Campus-Event", "Weiterbildung", "Webinar"] as EventType[]).map((type) => {
                                    const count = monthEvents.filter((e) => e.type === type).length;
                                    if (count === 0) return null;
                                    const colors = TYPE_COLORS[type];
                                    return (
                                        <div key={type} className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                            <span className="text-[10px] text-white/40">{type} ({count})</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Animated content area */}
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={`${year}-${month}-${view}`}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                                {view === "month" ? (
                                    <MonthView
                                        year={year}
                                        month={month}
                                        events={monthEvents}
                                        onSelectEvent={setSelectedEvent}
                                    />
                                ) : (
                                    <ListView
                                        events={monthEvents}
                                        onSelectEvent={setSelectedEvent}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Legend */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 px-1">
                        {(Object.entries(TYPE_COLORS) as [EventType, typeof TYPE_COLORS[EventType]][]).map(
                            ([type, colors]) => (
                                <div key={type} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                                    <span className="text-xs text-white/50">{type}</span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </PremiumBackground>

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <EventDetailModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </AnimatePresence>
        </RoleGuard>
    );
}
