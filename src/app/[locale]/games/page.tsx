"use client";

import { useTranslations } from "next-intl";
import { PremiumBackground } from "@/components/layout/premium-background";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Puzzle, ArrowRight, Brain, ListOrdered, Search, MessageSquare, Presentation, BarChart2, Briefcase } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GamesPage() {
    const t = useTranslations("Navigation");

    const games = [
        {
            id: "memory",
            title: "Memory",
            description: "Trainieren Sie Ihr Gedächtnis mit THITRONIK Produkten.",
            icon: <Brain className="w-8 h-8 text-brand-lime" />,
            href: "/games/memory",
        },
        {
            id: "order",
            title: "Reihenfolge-Quiz",
            description: "Bringen Sie die Montageschritte in die richtige Reihenfolge.",
            icon: <ListOrdered className="w-8 h-8 text-brand-lime" />,
            href: "/games/order",
        },
        {
            id: "find-error",
            title: "Fehlersuche",
            description: "Finden Sie die Fehler in der Installation.",
            icon: <Search className="w-8 h-8 text-brand-lime" />,
            href: "/games/find-error",
        },
        {
            id: "kahoot",
            title: "Live Quiz",
            description: "Nehmen Sie an einem Live-Quiz mit anderen Teilnehmern teil.",
            icon: <BarChart2 className="w-8 h-8 text-brand-lime" />,
            href: "/games/kahoot",
        },
        {
            id: "miro",
            title: "Whiteboard",
            description: "Kollaboratives Arbeiten auf dem digitalen Whiteboard.",
            icon: <Presentation className="w-8 h-8 text-brand-lime" />,
            href: "/games/miro",
        },
        {
            id: "mentimeter",
            title: "Live Voting",
            description: "Stimmen Sie live über aktuelle Themen ab.",
            icon: <MessageSquare className="w-8 h-8 text-brand-lime" />,
            href: "/games/mentimeter",
        },
        {
            id: "sales-simulator",
            title: "Sales Simulator",
            description: "Trainieren Sie Ihr Verkaufsgespräch in realistischen Kundensituationen.",
            icon: <Briefcase className="w-8 h-8 text-brand-lime" />,
            href: "/games/sales-simulator",
        }
    ];

    return (
        <PremiumBackground>
            <div className="container mx-auto py-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-4 flex items-center gap-4">
                        <Puzzle className="w-10 h-10 text-brand-lime" />
                        {t("games")}
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl">
                        Interaktive Lernspiele und Tools für eine spielerische Wissensvermittlung.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300 group hover-lift card-glow h-full flex flex-col">
                                <CardHeader>
                                    <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit group-hover:bg-brand-lime/10 transition-colors">
                                        {game.icon}
                                    </div>
                                    <CardTitle className="text-white text-xl">{game.title}</CardTitle>
                                    <CardDescription className="text-white/60">
                                        {game.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto">
                                    <Link href={game.href}>
                                        <Button className="w-full bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold group">
                                            Spielen
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
