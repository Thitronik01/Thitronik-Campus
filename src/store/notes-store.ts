"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Note {
    id: string;
    title: string;
    text: string;
    handwritingImage?: string; // base64 PNG
    createdAt: string;         // ISO
    updatedAt: string;         // ISO
}

interface NotesState {
    notes: Note[];
    draft: { title: string; text: string } | null;

    addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => string;
    updateNote: (id: string, patch: Partial<Pick<Note, "title" | "text" | "handwritingImage">>) => void;
    deleteNote: (id: string) => void;
    getNote: (id: string) => Note | undefined;
    setDraft: (draft: { title: string; text: string } | null) => void;
}

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}

export const useNotesStore = create<NotesState>()(
    persist(
        (set, get) => ({
            notes: [],
            draft: null,

            addNote: (data) => {
                const id = uuid();
                const now = new Date().toISOString();
                const note: Note = { id, ...data, createdAt: now, updatedAt: now };
                set((s) => ({ notes: [note, ...s.notes] }));
                return id;
            },

            updateNote: (id, patch) =>
                set((s) => ({
                    notes: s.notes.map((n) =>
                        n.id === id
                            ? { ...n, ...patch, updatedAt: new Date().toISOString() }
                            : n
                    ),
                })),

            deleteNote: (id) =>
                set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

            getNote: (id) => get().notes.find((n) => n.id === id),

            setDraft: (draft) => set({ draft }),
        }),
        {
            name: "thitronik-notes",
        }
    )
);
