"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatAssistant } from "@/components/chat/chat-assistant";
import { RoleGuard } from "@/components/auth/role-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SupportPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <RoleGuard requiredRole="user">
            <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-navy mb-2 flex items-center gap-3">
                            <span className="text-4xl">💬</span> Support & Academy Forum
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Haben Sie fachliche Fragen zu einem Schulungsmodul oder benötigen schnelle Hilfe beim Einbau?
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="ai" className="w-full">
                    <TabsList className="w-full sm:w-auto bg-muted/50 p-1 rounded-xl mb-8">
                        <TabsTrigger value="ai" className="rounded-lg sm:px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            🤖 AI Assistent (Schnellhilfe)
                        </TabsTrigger>
                        <TabsTrigger value="ticket" className="rounded-lg sm:px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            🎫 Manuelles Ticket
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ai" className="focus-visible:outline-none focus-visible:ring-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <ChatAssistant />
                            </div>
                            <div className="space-y-4">
                                <Card className="p-5 border-border shadow-sm">
                                    <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                        <span>💡</span> Tipp
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Der KI-Assistent hat Zugriff auf alle technischen Handbücher und Schulungsmaterialien des Campus.
                                        Er kann z.B. bei der Fehlersuche, Verkabelung oder der App-Konfiguration helfen.
                                    </p>
                                </Card>
                                <Card className="p-5 border-brand-lime/30 bg-brand-lime/5 shadow-sm">
                                    <h3 className="font-bold text-brand-navy mb-2 flex items-center gap-2">
                                        <span>📞</span> Level-2 Support
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Unser technischer Support für Händler ist Werktags von 08:00 - 17:00 Uhr erreichbar.
                                    </p>
                                    <div className="font-bold text-brand-sky text-xl">0431 / 66 66 8 11</div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="ticket" className="focus-visible:outline-none focus-visible:ring-0">
                        <div className="max-w-3xl">
                            <Card className="p-6 md:p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-brand-navy mb-6 border-b border-border pb-3">
                                    Neues Ticket erstellen
                                </h2>

                                {isSubmitted ? (
                                    <div className="py-12 text-center text-brand-navy animate-fade-in">
                                        <div className="text-6xl mb-4">✅</div>
                                        <h3 className="text-2xl font-bold mb-2">Ticket erfolgreich gesendet</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Unser Support-Team wird sich zeitnah bei Ihnen melden. Ticket-ID: #TK-8422
                                        </p>
                                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                                            Weiteres Ticket erstellen
                                        </Button>
                                    </div>
                                ) : (
                                    <form className="space-y-5" onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-foreground mb-2">
                                                    Kategorie
                                                </label>
                                                <select className="w-full p-2.5 border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-brand-sky">
                                                    <option>Technischer Support (Einbau)</option>
                                                    <option>Vertrieb / Konfigurator</option>
                                                    <option>Plattform & Login (Campus)</option>
                                                    <option>Zertifikats-Fragen</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-foreground mb-2">
                                                    Bezieht sich auf Lern-Insel
                                                </label>
                                                <select className="w-full p-2.5 border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-brand-sky">
                                                    <option>Allgemein</option>
                                                    <option>Poel (Onboarding)</option>
                                                    <option>Vejrø (Grundlagen)</option>
                                                    <option>Hiddensee (Einbau)</option>
                                                    <option>Samsø (Basisfahrzeuge)</option>
                                                    <option>Langeland (Service)</option>
                                                    <option>Usedom (Verkauf)</option>
                                                    <option>Fehmarn (Diagnose)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-foreground mb-2">
                                                Betreff
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Kurze Zusammenfassung"
                                                required
                                                className="rounded-xl"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-foreground mb-2">
                                                Nachricht
                                            </label>
                                            <Textarea
                                                placeholder="Beschreiben Sie Ihr Anliegen detailliert..."
                                                required
                                                className="min-h-[150px] rounded-xl"
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <Button type="submit" size="lg" className="w-full sm:w-auto">
                                                Ticket absenden
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    );
}
