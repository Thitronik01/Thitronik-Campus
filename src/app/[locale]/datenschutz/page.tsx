"use client";

import { legalContent } from "@/lib/content/legalContent";
import Link from "next/link";
import { Copy, Mail, Phone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DatenschutzPage() {
    const content = legalContent.privacy;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in pb-20 flex flex-col lg:flex-row gap-12">

            {/* Sticky Table of Contents */}
            {content.toc && (
                <aside className="hidden lg:block w-64 shrink-0">
                    <div className="sticky top-28 bg-white p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-brand-navy mb-4">Inhalt</h3>
                        <nav className="flex flex-col gap-2 text-sm">
                            {content.sections.map(s => (
                                <a key={s.id} href={`#${s.id}`} className="text-muted-foreground hover:text-brand-sky transition-colors line-clamp-1">
                                    {s.title}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <div className="flex-1">
                <div className="mb-8 border-b pb-6">
                    <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">{content.title}</h1>
                    <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{content.intro}</p>
                    <p className="text-sm text-brand-sky mt-2 font-medium">Stand: {content.lastUpdated}</p>

                    {content.internalNote && (
                        <div className="mt-6 flex items-center gap-3 p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">
                            <ShieldAlert className="w-5 h-5 shrink-0" />
                            <span className="font-semibold text-sm">Review-Hinweis: {content.internalNote}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-12">
                    {content.sections.map((section) => (
                        <section key={section.id} id={section.id} className="scroll-mt-28">
                            <h2 className="text-xl font-bold text-brand-navy mb-4 border-b pb-2">{section.title}</h2>
                            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
                                {section.content}
                            </div>

                            {section.links && (
                                <div className="mt-4 flex flex-col gap-3">
                                    {section.links.map((link, idx) => {
                                        const isMail = link.href.startsWith("mailto:");
                                        const isTel = link.href.startsWith("tel:");
                                        return (
                                            <div key={idx} className="flex items-center gap-3">
                                                <Button variant="outline" className="justify-start gap-2 h-auto py-2 px-4 shadow-sm" asChild>
                                                    <a href={link.href}>
                                                        {isMail && <Mail className="w-4 h-4 text-brand-sky" />}
                                                        {isTel && <Phone className="w-4 h-4 text-brand-sky" />}
                                                        {link.label}
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Kopieren" onClick={() => handleCopy(link.label)}>
                                                    <Copy className="w-4 h-4 text-muted-foreground hover:text-brand-navy" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-border">
                    <div className="flex flex-wrap gap-4 text-sm font-medium">
                        <Link href="/kontakt" className="text-brand-sky hover:underline">Kontakt</Link>
                        <Link href="/impressum" className="text-brand-sky hover:underline">Impressum</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
