"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Eraser, Type, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HandwritingCanvasProps {
    onTextRecognized: (text: string) => void;
    onImageSaved: (dataUrl: string) => void;
    existingImage?: string;
}

export function HandwritingCanvas({ onTextRecognized, onImageSaved, existingImage }: HandwritingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const drawing = useRef(false);
    const hasStrokes = useRef(false);
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = wrapper.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 280 * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = "280px";

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(dpr, dpr);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, rect.width, 280);

        // Subtle ruled lines
        ctx.strokeStyle = "rgba(59, 169, 211, 0.08)";
        ctx.lineWidth = 1;
        for (let ly = 40; ly < 280; ly += 32) {
            ctx.beginPath();
            ctx.moveTo(20, ly);
            ctx.lineTo(rect.width - 20, ly);
            ctx.stroke();
        }

        ctx.strokeStyle = "#3BA9D3";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (existingImage) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, 280);
                hasStrokes.current = true;
            };
            img.src = existingImage;
        }
    }, [existingImage]);

    useEffect(() => {
        initCanvas();
    }, [initCanvas]);

    const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const pos = getPos(e);
        drawing.current = true;
        hasStrokes.current = true;
        ctx.strokeStyle = "#3BA9D3";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawing.current) return;
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const onUp = () => {
        drawing.current = false;
        saveImage();
    };

    const saveImage = () => {
        if (canvasRef.current && hasStrokes.current) {
            onImageSaved(canvasRef.current.toDataURL("image/png"));
        }
    };

    const clearCanvas = () => {
        hasStrokes.current = false;
        initCanvas();
    };

    const recognizeText = async () => {
        if (!canvasRef.current || !hasStrokes.current) return;
        setIsRecognizing(true);
        setOcrProgress(0);

        try {
            const { createWorker } = await import("tesseract.js");
            const worker = await createWorker("deu", 1, {
                logger: (m: { progress?: number }) => {
                    if (m.progress) setOcrProgress(Math.round(m.progress * 100));
                },
            });

            const dataUrl = canvasRef.current.toDataURL("image/png");
            const { data: { text } } = await worker.recognize(dataUrl);
            await worker.terminate();

            const cleaned = text.trim();
            if (cleaned) {
                onTextRecognized(cleaned);
            }
        } catch (err) {
            console.error("OCR error:", err);
        } finally {
            setIsRecognizing(false);
            setOcrProgress(0);
        }
    };

    return (
        <div className="space-y-3">
            <div ref={wrapperRef} className="relative">
                <canvas
                    ref={canvasRef}
                    className="w-full rounded-xl border-2 border-dashed border-brand-sky/30 touch-none cursor-crosshair"
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerLeave={onUp}
                />

                {isRecognizing && (
                    <div className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-brand-sky animate-spin" />
                        <div className="text-white text-sm font-medium">Texterkennung läuft… {ocrProgress}%</div>
                        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-sky rounded-full transition-all duration-300"
                                style={{ width: `${ocrProgress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2 flex-wrap">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCanvas}
                    className="border-white/20 text-white hover:bg-white/10"
                    disabled={isRecognizing}
                >
                    <Eraser className="w-4 h-4 mr-2" />
                    Leeren
                </Button>
                <Button
                    size="sm"
                    onClick={recognizeText}
                    className="bg-brand-sky text-white hover:bg-brand-sky-dark"
                    disabled={isRecognizing}
                >
                    <Type className="w-4 h-4 mr-2" />
                    {isRecognizing ? "Erkennung läuft…" : "In Text umwandeln"}
                </Button>
            </div>
        </div>
    );
}
