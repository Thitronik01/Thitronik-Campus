"use client";

import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Upload, Plus, Type, Palette, ArrowLeft, Trash2, Maximize } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid"; // We can just use a simple counter or Math.random since MVP

interface BoxNode {
    id: string;
    text: string;
    color: string;
    x: number;
    y: number;
}

const DraggableBox = ({ box, onDelete }: { box: BoxNode, onDelete: (id: string) => void }) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    return (
        <Draggable
            nodeRef={nodeRef}
            defaultPosition={{ x: box.x, y: box.y }}
            bounds="parent"
        >
            <div ref={nodeRef} className="absolute pointer-events-auto group">
                <div className={`p-4 rounded-lg shadow-lg flex flex-col gap-2 min-w-[200px] max-w-[300px] ${box.color}`}>
                    <div className="cursor-grab active:cursor-grabbing w-full h-4 bg-black/10 hover:bg-black/20 rounded flex items-center justify-center">
                        <div className="w-8 h-1 rounded-full bg-black/20" />
                    </div>
                    <div className="font-semibold break-words leading-tight">{box.text}</div>
                    <button
                        onClick={() => onDelete(box.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </Draggable>
    );
};

const COLORS = [
    { name: "Navy", value: "bg-brand-navy text-white" },
    { name: "Hellblau", value: "bg-brand-sky text-white" },
    { name: "Grün", value: "bg-brand-lime text-brand-navy" },
    { name: "Rot", value: "bg-brand-red text-white" },
    { name: "Grau", value: "bg-muted text-foreground" },
    { name: "Weiß", value: "bg-white text-brand-navy border border-border" }
];

export function MiroBoard() {
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [boxes, setBoxes] = useState<BoxNode[]>([]);

    // For the "Add Box" Popover
    const [newBoxText, setNewBoxText] = useState("");
    const [newBoxColor, setNewBoxColor] = useState(COLORS[0].value);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setBgImage(url);
        }
    };

    const handleAddBox = () => {
        if (!newBoxText.trim()) return;

        const newBox: BoxNode = {
            id: `box-${Date.now()}-${Math.random()}`,
            text: newBoxText,
            color: newBoxColor,
            x: window.innerWidth / 2 - 100, // Center roughly
            y: window.innerHeight / 2 - 50
        };

        setBoxes([...boxes, newBox]);
        setNewBoxText("");
        setIsPopoverOpen(false);
    };

    const handleDeleteBox = (id: string) => {
        setBoxes(boxes.filter(b => b.id !== id));
    };

    const handleRemoveBg = () => {
        setBgImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-screen h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 relative">

            {/* Background Layer */}
            {bgImage ? (
                <div
                    className="absolute inset-0 z-0 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
            ) : (
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="text-center">
                        <Maximize className="w-32 h-32 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-4xl font-bold text-muted-foreground">Leeres Canvas</h2>
                    </div>
                </div>
            )}

            {/* Draggable Boxes Render Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {boxes.map((box) => (
                    <DraggableBox key={box.id} box={box} onDelete={handleDeleteBox} />
                ))}
            </div>

            {/* Floating Top Menu (Z-20) */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">

                {/* Back Button */}
                <Link href="/tools" className="pointer-events-auto">
                    <Button variant="default" className="shadow-lg gap-2 bg-brand-red hover:bg-brand-red/90 text-white border-none">
                        <ArrowLeft className="w-4 h-4" /> Beenden
                    </Button>
                </Link>

                {/* Toolbar */}
                <div className="flex gap-2 pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-border">

                    {/* Background Upload */}
                    <div className="relative flex items-center border-r border-border pr-2 mr-1">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4" />
                            {bgImage ? "Hintergrund ändern" : "Bild hochladen"}
                        </Button>
                        {bgImage && (
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 ml-1 h-8 w-8" onClick={handleRemoveBg}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Add Box Popover */}
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button className="gap-2 bg-brand-sky hover:bg-brand-sky/90 text-white shadow-sm">
                                <Plus className="w-4 h-4" /> Neue Box
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 shadow-xl border-border">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Type className="w-4 h-4 text-brand-sky" /> Box Inhalt
                                </h4>
                                <Input
                                    placeholder="Thema oder Systemname..."
                                    value={newBoxText}
                                    onChange={(e) => setNewBoxText(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddBox();
                                    }}
                                />

                                <h4 className="font-semibold text-sm flex items-center gap-2 mt-4">
                                    <Palette className="w-4 h-4 text-brand-lime" /> Farbe
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {COLORS.map((c) => (
                                        <button
                                            key={c.name}
                                            onClick={() => setNewBoxColor(c.value)}
                                            className={`h-8 rounded-md border text-xs font-semibold
                                                ${c.value}
                                                ${newBoxColor === c.value ? 'ring-2 ring-brand-sky ring-offset-1' : ''}
                                            `}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>

                                <Button className="w-full mt-2" onClick={handleAddBox} disabled={!newBoxText.trim()}>
                                    Hinzufügen
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                </div>
            </div>

        </div>
    );
}
