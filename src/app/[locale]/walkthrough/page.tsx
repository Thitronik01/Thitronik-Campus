"use client";

import WalkableEnvironment from "@/components/interactive/walkable-environment";
import { useTranslations } from "next-intl";

export default function WalkthroughPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-brand-navy mb-2 tracking-tight">
                    Interaktiver Walkthrough
                </h1>
                <p className="text-muted-foreground text-lg">
                    Erleben Sie thitronik Produkte in einer virtuellen Umgebung.
                </p>
            </header>

            <main className="space-y-8">
                <WalkableEnvironment />
                
                <section className="bg-muted/30 p-8 rounded-3xl border border-border">
                    <h2 className="text-2xl font-bold mb-4">Steuerung & Anleitung</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <span className="bg-brand-sky/10 p-2 rounded-lg">🏃</span> Bewegung
                            </h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><kbd className="bg-background border border-border rounded px-2 py-1 text-foreground font-mono">W</kbd> oder <kbd className="bg-background border border-border rounded px-2 py-1 text-foreground font-mono">↑</kbd> - Vorwärts gehen</li>
                                <li><kbd className="bg-background border border-border rounded px-2 py-1 text-foreground font-mono">S</kbd> oder <kbd className="bg-background border border-border rounded px-2 py-1 text-foreground font-mono">↓</kbd> - Rückwärts gehen</li>
                                <li><kbd className="bg-background border border-border rounded px-2 py-1 text-foreground font-mono">A</kbd> oder <kbd className="bg-background border border-border rounded px-2 py-1 text-foreground font-mono">←</kbd> - Links gehen</li>
                                <li><kbd className="bg-background border border-border rounded px-2 py-1 text-foreground font-mono">D</kbd> oder <kbd className="bg-background border border-border rounded px-2 py-1 text-foreground font-mono">→</kbd> - Rechts gehen</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <span className="bg-brand-sky/10 p-2 rounded-lg">👁️</span> Umsehen
                            </h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>Bewege die <strong className="text-foreground">Maus</strong>, um deine Blickrichtung zu ändern.</li>
                                <li>Drücke <kbd className="bg-background border border-border rounded px-2 py-1 text-foreground font-mono">ESC</kbd>, um die Maus wieder freizugeben.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
