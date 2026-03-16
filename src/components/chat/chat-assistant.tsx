"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatAssistant() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        initialMessages: [
            {
                id: "sys_1",
                role: "assistant",
                content:
                    "Hallo! Ich bin der THITRONIK Support-Assistent. Haben Sie Fragen zu unseren Produkten oder zum Einbau (z.B. WiPro III)?",
            },
        ],
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Card className="flex flex-col h-[500px] border-border bg-background shadow-md overflow-hidden">
            <div className="p-4 border-b border-border bg-brand-navy text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                        🤖
                    </div>
                    <div>
                        <h3 className="font-bold">THITRONIK AI-Support</h3>
                        <p className="text-xs text-white/70">Antwortet sofort auf technische Fragen</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-lime"></span>
                    </span>
                    <span className="text-xs font-bold text-brand-lime uppercase tracking-widest">
                        Online
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user"
                                ? "bg-brand-sky text-white rounded-br-sm shadow-sm"
                                : "bg-white text-foreground border border-border rounded-bl-sm shadow-sm"
                                }`}
                        >
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border flex gap-1 border-border text-muted-foreground rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm items-center">
                            <span className="animate-bounce inline-block w-1.5 h-1.5 bg-current rounded-full"></span>
                            <span className="animate-bounce inline-block w-1.5 h-1.5 bg-current rounded-full" style={{ animationDelay: '0.2s' }}></span>
                            <span className="animate-bounce inline-block w-1.5 h-1.5 bg-current rounded-full" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-border">
                <form
                    onSubmit={handleSubmit}
                    className="flex space-x-2"
                >
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Frag etwas (z.B. Wie finde ich den Massepunkt?)"
                        className="flex-1 bg-muted/50 focus-visible:ring-brand-sky"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-brand-navy hover:bg-brand-navy/90 text-white shadow-sm"
                    >
                        Senden
                    </Button>
                </form>
            </div>
        </Card>
    );
}
