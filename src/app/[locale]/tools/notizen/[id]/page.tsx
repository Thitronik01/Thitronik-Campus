"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PremiumBackground } from "@/components/layout/premium-background";
import { Button } from "@/components/ui/button";
import { useNotesStore } from "@/store/notes-store";
import { exportNotePdf } from "@/lib/notes-pdf";
import { HandwritingCanvas } from "@/components/tools/handwriting-canvas";
import { motion } from "framer-motion";
import {
    ArrowLeft, Save, Download, Type, PenTool, Check,
    Calendar, Clock, StickyNote
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function NoteEditorPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;
    const noteId = params.id as string;

    const { getNote, updateNote, addNote } = useNotesStore();
    const [mounted, setMounted] = useState(false);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [handwritingImage, setHandwritingImage] = useState<string | undefined>();
    const [mode, setMode] = useState<"type" | "draw">("type");
    const [saved, setSaved] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setMounted(true);
        const note = getNote(noteId);
        if (note) {
            setTitle(note.title);
            setText(note.text);
            setHandwritingImage(note.handwritingImage);
        } else {
            setIsNew(true);
        }
    }, [noteId, getNote]);

    const doSave = useCallback(() => {
        if (isNew) {
            // Already created — just update
        }
        updateNote(noteId, { title, text, handwritingImage });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }, [noteId, title, text, handwritingImage, updateNote, isNew]);

    // Auto-save after 3 seconds of inactivity
    const triggerAutoSave = useCallback(() => {
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => {
            doSave();
        }, 3000);
    }, [doSave]);

    const onTitleChange = (val: string) => {
        setTitle(val);
        triggerAutoSave();
    };

    const onTextChange = (val: string) => {
        setText(val);
        triggerAutoSave();
    };

    const onTextRecognized = (ocrText: string) => {
        setText((prev) => (prev ? prev + "\n\n--- OCR ---\n" + ocrText : ocrText));
        triggerAutoSave();
    };

    const onImageSaved = (dataUrl: string) => {
        setHandwritingImage(dataUrl);
        triggerAutoSave();
    };

    const handleExport = () => {
        doSave();
        exportNotePdf({ title, text, createdAt: getNote(noteId)?.createdAt || new Date().toISOString(), handwritingImage });
    };

    if (!mounted) return null;

    const note = getNote(noteId);
    const dateStr = note
        ? new Date(note.updatedAt).toLocaleString("de-DE", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        })
        : "Jetzt";

    return (
        <PremiumBackground>
            <div className="container mx-auto py-8 max-w-4xl">
                {/* Header */}
                <header className="mb-6">
                    <Link
                        href={`/${locale}/tools/notizen`}
                        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Alle Notizen
                    </Link>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3 text-xs text-white/40">
                            <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {dateStr}
                            </span>
                            {saved && (
                                <motion.span
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-1 text-brand-lime font-medium"
                                >
                                    <Check className="w-3 h-3" />
                                    Gespeichert
                                </motion.span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Als PDF
                            </Button>
                            <Button
                                size="sm"
                                onClick={doSave}
                                className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Speichern
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Editor Card */}
                <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl overflow-hidden">
                    {/* Title */}
                    <div className="px-6 pt-6 pb-4 border-b border-white/10">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="Titel der Notiz…"
                            className="w-full bg-transparent text-white text-2xl font-extrabold placeholder:text-white/30 outline-none"
                        />
                    </div>

                    {/* Mode Tabs */}
                    <div className="px-6 pt-4 pb-2 flex gap-2">
                        <button
                            onClick={() => setMode("type")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                mode === "type"
                                    ? "bg-brand-navy text-white"
                                    : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                        >
                            <Type className="w-4 h-4" />
                            Tippen
                        </button>
                        <button
                            onClick={() => setMode("draw")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                mode === "draw"
                                    ? "bg-brand-navy text-white"
                                    : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                        >
                            <PenTool className="w-4 h-4" />
                            Handschrift
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="px-6 pb-6 pt-2">
                        {mode === "type" ? (
                            <textarea
                                value={text}
                                onChange={(e) => onTextChange(e.target.value)}
                                placeholder="Deine Notiz hier eingeben…"
                                className="w-full min-h-[320px] bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 outline-none resize-y focus:border-brand-sky/30 focus:ring-2 focus:ring-brand-sky/10 transition text-[0.95rem] leading-relaxed"
                            />
                        ) : (
                            <HandwritingCanvas
                                onTextRecognized={onTextRecognized}
                                onImageSaved={onImageSaved}
                                existingImage={handwritingImage}
                            />
                        )}

                        {/* Show recognized text below canvas if in draw mode and there's text */}
                        {mode === "draw" && text && (
                            <div className="mt-4">
                                <div className="text-xs tracking-widest text-white/40 uppercase font-bold mb-2">
                                    Erkannter Text (editierbar)
                                </div>
                                <textarea
                                    value={text}
                                    onChange={(e) => onTextChange(e.target.value)}
                                    className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 outline-none resize-y focus:border-brand-sky/30 transition text-sm leading-relaxed"
                                />
                            </div>
                        )}

                        {/* Handwriting thumbnail if in type mode */}
                        {mode === "type" && handwritingImage && (
                            <div className="mt-4">
                                <div className="text-xs tracking-widest text-white/40 uppercase font-bold mb-2">
                                    Gespeicherte Handschrift
                                </div>
                                <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 max-w-sm">
                                    <img
                                        src={handwritingImage}
                                        alt="Handschrift"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PremiumBackground>
    );
}
