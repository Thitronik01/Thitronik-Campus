"use client";

import { useTranslations } from "next-intl";
import { PremiumBackground } from "@/components/layout/premium-background";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Users, ClipboardCheck, Wrench, StickyNote } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ToolsPage() {
    const t = useTranslations("Navigation");

    const tools = [
        {
            id: "working-card",
            title: "Digitale Arbeitskarte",
            description: "Erstellung und Verwaltung digitaler Werkstatt-Arbeitskarten für effiziente Prozesse.",
            icon: <FileText className="w-8 h-8 text-brand-lime" />,
            href: "/tools/working-card",
        },
        {
            id: "customer-sheet",
            title: "Kundenstammblatt",
            description: "Digitales Formular zur Erfassung von Kundendaten und Einverständniserklärungen.",
            icon: <Users className="w-8 h-8 text-brand-lime" />,
            href: "/tools/customer-sheet",
        },
        {
            id: "feedback",
            title: "Veranstaltungs-Feedback",
            description: "Digitaler Feedbackbogen zur Bewertung der Campus-Schulung.",
            icon: <ClipboardCheck className="w-8 h-8 text-brand-lime" />,
            href: "/tools/feedback",
        },
        {
            id: "notizen",
            title: "Meine Notizen",
            description: "Notizen tippen oder handschriftlich erfassen – mit Texterkennung und PDF-Export.",
            icon: <StickyNote className="w-8 h-8 text-brand-lime" />,
            href: "/tools/notizen",
        },
    ];

    return (
        <PremiumBackground>
            <div className="container mx-auto py-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-4 flex items-center gap-4">
                        <Wrench className="w-10 h-10 text-brand-lime" />
                        {t("tools")}
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl">
                        Hier finden Sie professionelle Werkzeuge und Hilfsmittel für Ihren Werkstatt-Alltag.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300 group hover-lift card-glow h-full flex flex-col">
                                <CardHeader>
                                    <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit group-hover:bg-brand-lime/10 transition-colors">
                                        {tool.icon}
                                    </div>
                                    <CardTitle className="text-white text-xl">{tool.title}</CardTitle>
                                    <CardDescription className="text-white/60">
                                        {tool.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto">
                                    <Link href={tool.href}>
                                        <Button className="w-full bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold group">
                                            Öffnen
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PremiumBackground>
    );
}
