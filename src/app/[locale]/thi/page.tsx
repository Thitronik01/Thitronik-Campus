"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "ai/react";

import { PremiumBackground } from "@/components/layout/premium-background";

export default function ThiChatPage() {
    const [loaded, setLoaded] = useState(false);
    const [initialMessages, setInitialMessages] = useState<Message[]>([]);

    // 1. Lade alten Chatverlauf (Memory) beim ersten Mount
    useEffect(() => {
        const savedMemory = localStorage.getItem("thi_chat_memory");
        if (savedMemory) {
            try {
                const parsed = JSON.parse(savedMemory);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setInitialMessages(parsed);
                }
            } catch (e) {
                console.error("Failed to parse chat memory:", e);
            }
        }
        setLoaded(true);
    }, []);

    // 2. Chat-Hook erst aufrufen, wenn Memory geladen ist
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
        api: "/api/chat",
        initialMessages: initialMessages.length > 0 ? initialMessages : [
            {
                id: "sys_welcome",
                role: "assistant",
                content: "Hallo! Ich bin THI, Ihr intelligenter KI-Assistent für THITRONIK Produkte und die Händler Akademie. Wie kann ich heute helfen?"
            }
        ],
    });

    // 3. Speichere neue Nachrichten im Memory
    useEffect(() => {
        if (loaded && messages.length > 0) {
            localStorage.setItem("thi_chat_memory", JSON.stringify(messages));
        }
    }, [messages, loaded]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-Scroll nach unten
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const resetChat = () => {
        localStorage.removeItem("thi_chat_memory");
        setMessages([
            {
                id: "sys_welcome",
                role: "assistant",
                content: "Hallo! Ich bin THI, Ihr intelligenter KI-Assistent für THITRONIK Produkte und die Händler Akademie. Wie kann ich heute helfen?",
                createdAt: new Date()
            }
        ]);
    };

    if (!loaded) return null; // Verhindert Hydration Mismatch & leeres Flackern

    return (
        <PremiumBackground>
            <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in flex flex-col h-[calc(100vh-120px)] relative z-10">
                <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-white">
                    <span className="text-brand-lime">🤖</span> THI Assistent
                </h1>

                <Card className="flex-1 flex flex-col border-border overflow-hidden shadow-md bg-card">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border bg-brand-navy text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner border border-white/20">
                                🤖
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-0 pb-0">THI</h3>
                                <p className="text-[11px] text-brand-sky font-bold uppercase tracking-wider mt-0 pt-0">Online - Level 1 Support</p>
                            </div>
                        </div>
                        {messages.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={resetChat}
                                className="text-white/60 hover:text-white hover:bg-white/10 text-xs"
                            >
                                Chat leeren
                            </Button>
                        )}
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${m.role === "user"
                                        ? "bg-brand-sky text-white rounded-br-sm"
                                        : "bg-background text-foreground border border-border rounded-bl-sm"
                                        }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-background border flex gap-1.5 border-border text-muted-foreground rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm items-center">
                                    <span className="animate-bounce inline-block w-2 h-2 bg-brand-sky rounded-full"></span>
                                    <span className="animate-bounce inline-block w-2 h-2 bg-brand-sky rounded-full" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="animate-bounce inline-block w-2 h-2 bg-brand-sky rounded-full" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="pb-2" />
                    </div>

                    {/* Chat Footer */}
                    <div className="p-4 bg-background border-t border-border">
                        <form
                            onSubmit={handleSubmit}
                            className="flex space-x-3 items-center"
                        >
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ihre Frage an THI..."
                                className="flex-1 h-12 bg-muted/50 focus-visible:ring-brand-sky rounded-xl"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-brand-navy hover:bg-brand-navy/90 text-white shadow-sm h-12 px-6 rounded-xl font-bold transition-transform active:scale-95"
                            >
                                Senden
                            </Button>
                        </form>
                        <p className="text-center text-[10px] text-muted-foreground mt-3">
                            THI ist eine KI und kann Fehler machen. Bei komplexen Einbaufragen verifizieren Sie die Angaben bitte im gedruckten Handbuch.
                        </p>
                    </div>
                </Card>
            </div>
        </PremiumBackground>
    );
}
