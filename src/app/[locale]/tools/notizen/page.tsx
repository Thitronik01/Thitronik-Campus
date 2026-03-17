"use client";

import { useState, useEffect } from "react";
import { PremiumBackground } from "@/components/layout/premium-background";
import { Button } from "@/components/ui/button";
import { useNotesStore, Note } from "@/store/notes-store";
import { exportNotePdf, exportAllNotesPdf } from "@/lib/notes-pdf";
import { motion } from "framer-motion";
import {
    StickyNote, Plus, Search, Trash2, Pencil, Download, FileDown,
    ArrowLeft, Calendar, Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function NotizenPage() {
    const { notes, deleteNote } = useNotesStore();
    const [search, setSearch] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const filtered = notes
        .filter(
            (n) =>
                n.title.toLowerCase().includes(search.toLowerCase()) ||
                n.text.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const handleDelete = (id: string) => {
        deleteNote(id);
        setConfirmDelete(null);
    };

    const handleNewNote = () => {
        const { addNote } = useNotesStore.getState();
        const id = addNote({ title: "", text: "" });
        router.push(`/${locale}/tools/notizen/${id}`);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    };

    const truncateText = (text: string, maxLen = 120) =>
        text.length > maxLen ? text.slice(0, maxLen) + "…" : text;

    return (
        <PremiumBackground>
            <div className="container mx-auto py-8">
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href={`/${locale}/tools`}
                        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zu Tools
                    </Link>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white flex items-center gap-4">
                                <StickyNote className="w-10 h-10 text-brand-lime" />
                                Meine Notizen
                            </h1>
                            <p className="text-white/60 mt-2">
                                {notes.length} {notes.length === 1 ? "Notiz" : "Notizen"} gespeichert
                            </p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {notes.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={() => exportAllNotesPdf(notes)}
                                    className="border-white/20 text-white hover:bg-white/10"
                                >
                                    <FileDown className="w-4 h-4 mr-2" />
                                    Alle exportieren
                                </Button>
                            )}
                            <Button
                                onClick={handleNewNote}
                                className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Neue Notiz
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Search */}
                {notes.length > 0 && (
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Notiz suchen…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-brand-sky/50 focus:ring-2 focus:ring-brand-sky/20 transition"
                            />
                        </div>
                    </div>
                )}

                {/* Notes List */}
                {filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white/5 rounded-2xl border border-white/10"
                    >
                        <StickyNote className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <div className="text-xl font-bold text-white mb-2">
                            {search ? "Keine Ergebnisse" : "Noch keine Notizen"}
                        </div>
                        <p className="text-white/50 mb-6">
                            {search
                                ? `Keine Notiz enthält "${search}".`
                                : "Erstelle deine erste Notiz — tippen oder handschriftlich."}
                        </p>
                        {!search && (
                            <Button
                                onClick={handleNewNote}
                                className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Erste Notiz erstellen
                            </Button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid gap-3">
                        {filtered.map((note, idx) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                index={idx}
                                locale={locale}
                                formatDate={formatDate}
                                formatTime={formatTime}
                                truncateText={truncateText}
                                onDelete={() => setConfirmDelete(note.id)}
                                onExport={() => exportNotePdf(note)}
                            />
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-brand-navy border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-6 h-6 text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Notiz löschen?</h3>
                                <p className="text-sm text-white/60 mb-6">
                                    Diese Aktion kann nicht rückgängig gemacht werden.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setConfirmDelete(null)}
                                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                                    >
                                        Abbrechen
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(confirmDelete)}
                                        className="flex-1 bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Löschen
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </PremiumBackground>
    );
}

/* ── Note Card ── */

interface NoteCardProps {
    note: Note;
    index: number;
    locale: string;
    formatDate: (iso: string) => string;
    formatTime: (iso: string) => string;
    truncateText: (text: string, maxLen?: number) => string;
    onDelete: () => void;
    onExport: () => void;
}

function NoteCard({ note, index, locale, formatDate, formatTime, truncateText, onDelete, onExport }: NoteCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
        >
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-5 hover:bg-white/15 transition-all duration-300 hover-lift card-glow group">
                <div className="flex gap-4 items-start">
                    {/* Handwriting thumbnail */}
                    {note.handwritingImage && (
                        <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                            <img
                                src={note.handwritingImage}
                                alt="Handschrift"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <Link href={`/${locale}/tools/notizen/${note.id}`}>
                            <h3 className="text-white font-bold text-lg leading-tight hover:text-brand-sky transition truncate">
                                {note.title || "Ohne Titel"}
                            </h3>
                        </Link>
                        {note.text && (
                            <p className="text-white/50 text-sm mt-1 line-clamp-2">
                                {truncateText(note.text)}
                            </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                            <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(note.updatedAt)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(note.updatedAt)}
                            </span>
                            {note.handwritingImage && (
                                <span className="bg-brand-sky/20 text-brand-sky px-2 py-0.5 rounded-full text-[0.65rem] font-medium">
                                    ✍️ Handschrift
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/${locale}/tools/notizen/${note.id}`}>
                            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0">
                                <Pencil className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                        <Button size="sm" variant="ghost" onClick={onExport} className="text-white/60 hover:text-brand-sky hover:bg-white/10 h-8 w-8 p-0">
                            <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete} className="text-white/60 hover:text-red-400 hover:bg-white/10 h-8 w-8 p-0">
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
