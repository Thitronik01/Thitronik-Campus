"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { RoleGuard } from "@/components/auth/role-guard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { CmsBlock } from "@/types/cms";
import { SalesAvatarSimulator } from "@/components/interactive/sales-avatar-simulator";
import { ConfiguratorSimulator } from "@/components/interactive/configurator-simulator";
import { ArrowLeft, PlayCircle, CheckCircle2 } from "lucide-react";

// Mock data for the modules based on the islands
const MODULE_DATA: Record<string, any> = {
    vejroe: {
        title: "Vejrø: WiPro III Grundlagen",
        icon: "⚓",
        description: "Lernen Sie die Kernargumente für das WiPro III System kennen.",
        xp: 100,
        badgeName: "Produkt-Badge",
    },
    poel: {
        title: "Poel: Onboarding",
        icon: "🏝️",
        description: "Plattform-Tour und Navigation im Händlerbereich.",
        xp: 50,
        badgeName: "Orientierungs-Badge",
    },
    hiddensee: {
        title: "Hiddensee: Einbau Praxis",
        icon: "🌊",
        description: "Einbau-Anleitung für Funk-Magnetkontakte in der Praxis.",
        xp: 150,
        badgeName: "Einbau-Badge",
    },
    samsoe: {
        title: "Samsø: Basisfahrzeuge",
        icon: "⛵",
        description: "Basisfahrzeuge verstehen, Gaswarner richtig platzieren.",
        xp: 150,
        badgeName: "Fahrzeug-Badge",
    },
    langeland: {
        title: "Langeland: Service & Diagnose",
        icon: "🗺️",
        description: "Fahrzeugübergabe/-übernahme und virtueller Kunden-Avatar.",
        xp: 100,
        badgeName: "Service-Badge",
    },
    usedom: {
        title: "Usedom: Erfolgreich Verkaufen",
        icon: "🔭",
        description: "Lernen Sie, wie Sie den THITRONIK Konfigurator optimal im Kundengespräch nutzen und typische Einwände behandeln.",
        xp: 120,
        badgeName: "Verkaufs-Badge",
        hasSimulator: true,
        hasConfigurator: true,
    },
    fehmarn: {
        title: "Fehmarn: Support & Fehleranalyse",
        icon: "🔧",
        description: "Interaktive Fehleranalyse und Support-Troubleshooting.",
        xp: 120,
        badgeName: "Profi-Badge",
    },
};

// Mock CMS Data helper matching the one in the manager
const getMockCmsContent = (islandId: string): CmsBlock[] => {
    return [
        { id: `mock-1-${islandId}`, type: 'h1', content: `Willkommen im CMS der Insel ${islandId.toUpperCase()}` },
        { id: `mock-2-${islandId}`, type: 'text', content: `Dieser Block kommt dynamisch aus der (Mock-)Datenbank. In Zukunft bearbeiten die THITRONIK Mitarbeiter diese Texte über das "Insel bearbeiten" Feature im Manager-Dashboard. So können Schulungsinhalte ohne Programmierung stets aktuell gehalten werden.` },
        { id: `mock-3-${islandId}`, type: 'h2', content: `Kapitel 1: Video-Lektion` },
        { id: `mock-4-${islandId}`, type: 'video', content: `https://example.com/mock-video.mp4` }
    ];
};

export default function ModulePage() {
    const params = useParams();
    const router = useRouter();
    const moduleId = params.id as string;
    const moduleInfo = MODULE_DATA[moduleId];

    const [activeTab, setActiveTab] = useState("theory");
    const [videoWatched, setVideoWatched] = useState(false);
    const { addXp } = useUserStore();

    // Load dynamic CMS mock content
    const cmsBlocks = getMockCmsContent(moduleId);

    if (!moduleInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold text-destructive">Modul nicht gefunden</h1>
                <p className="text-muted-foreground">Das angefragte Lernmodul existiert nicht.</p>
                <Button onClick={() => router.push("/")} variant="outline">Zurück zum Dashboard</Button>
            </div>
        );
    }

    const handleVideoComplete = () => {
        if (!videoWatched) {
            setVideoWatched(true);
            addXp(25); // Kleiner XP Bonus für das Video
        }
        // Proceed to next logical tab if available
        if (moduleInfo.hasSimulator) setActiveTab("simulator");
    };

    return (
        <RoleGuard requiredRole="user">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">

                {/* Breadcrumb & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <span className="hover:text-brand-sky cursor-pointer transition-colors" onClick={() => router.push("/")}>Campus</span>
                            <span>/</span>
                            <span className="hover:text-brand-sky cursor-pointer transition-colors" onClick={() => router.push("/")}>Inseln</span>
                            <span>/</span>
                            <span className="text-foreground font-bold">{moduleInfo.title.split(":")[0]}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" onClick={() => router.push("/")} className="h-10 w-10 shrink-0 hidden sm:flex">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-3xl font-bold flex items-center gap-3 text-brand-navy">
                                <span className="text-4xl drop-shadow-sm">{moduleInfo.icon}</span> {moduleInfo.title}
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-lg mt-3 max-w-3xl">
                            {moduleInfo.description}
                        </p>
                    </div>

                    <div className="text-right flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
                        <Badge className="bg-brand-lime text-brand-navy border-none shadow-sm text-sm py-1.5 px-3">
                            +{moduleInfo.xp} XP möglich
                        </Badge>
                        <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold">
                            Belohnung: {moduleInfo.badgeName}
                        </Badge>
                    </div>
                </div>

                {/* Dynamic Tabs based on Module Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b rounded-none p-0 h-auto pb-0 gap-6">
                        <TabsTrigger
                            value="theory"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-sky data-[state=active]:text-brand-navy data-[state=active]:bg-transparent px-2 py-3 text-base shadow-none data-[state=active]:shadow-none font-bold"
                        >
                            1. Theorie (CMS Inhalte)
                        </TabsTrigger>

                        {moduleInfo.hasSimulator && (
                            <TabsTrigger
                                value="simulator"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-sky data-[state=active]:text-brand-navy data-[state=active]:bg-transparent px-2 py-3 text-base shadow-none data-[state=active]:shadow-none font-bold"
                            >
                                2. Verkaufs-Gespräch
                            </TabsTrigger>
                        )}

                        {moduleInfo.hasConfigurator && (
                            <TabsTrigger
                                value="configurator"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-sky data-[state=active]:text-brand-navy data-[state=active]:bg-transparent px-2 py-3 text-base shadow-none data-[state=active]:shadow-none font-bold"
                            >
                                3. Konfigurator
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <div className="mt-8">
                        {/* Tab 1: CMS Theory Content */}
                        <TabsContent value="theory" className="mt-0 outline-none space-y-6">

                            {/* Dynamisches Rendern der CMS-Blöcke */}
                            <div className="space-y-6 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                                {cmsBlocks.map((block) => {
                                    switch (block.type) {
                                        case 'h1':
                                            return <h1 key={block.id} className="text-3xl font-extrabold text-brand-navy mt-4 mb-2">{block.content}</h1>;
                                        case 'h2':
                                            return <h2 key={block.id} className="text-2xl font-bold text-foreground mt-8 mb-3">{block.content}</h2>;
                                        case 'h3':
                                            return <h3 key={block.id} className="text-xl font-semibold text-foreground mt-6 mb-2">{block.content}</h3>;
                                        case 'text':
                                            return <p key={block.id} className="text-lg text-muted-foreground leading-relaxed">{block.content}</p>;
                                        case 'image':
                                            return (
                                                <div key={block.id} className="w-full bg-muted/30 rounded-xl aspect-video flex items-center justify-center border border-border/50 text-muted-foreground my-6">
                                                    [Dynamisches Bild: {block.content}]
                                                </div>
                                            );
                                        case 'video':
                                            return (
                                                <div key={block.id} className="w-full bg-brand-navy rounded-xl aspect-video relative group flex items-center justify-center overflow-hidden my-6 shadow-md">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                                    <div
                                                        className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-20 shadow-xl"
                                                        onClick={handleVideoComplete}
                                                    >
                                                        <PlayCircle className="text-white w-12 h-12 ml-1" />
                                                    </div>
                                                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 z-20">
                                                        <Badge variant="secondary" className="bg-black/50 text-white border-none backdrop-blur-sm">Dies ist ein Platzhalter-Video aus dem CMS</Badge>
                                                    </div>
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })}
                            </div>

                            <Card className="border-border shadow-sm bg-muted/10 border-brand-sky/20">
                                <CardContent className="p-4 md:p-6">
                                    <div className={`flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl border transition-colors ${videoWatched ? 'bg-brand-lime/10 border-brand-lime/30' : 'bg-muted/50 border-border'}`}>
                                        <div className="flex items-center gap-3 mb-4 sm:mb-0">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${videoWatched ? 'bg-brand-lime text-brand-navy' : 'bg-muted-foreground text-white'}`}>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className={`block font-bold ${videoWatched ? 'text-brand-lime' : 'text-foreground'}`}>Lektion abgeschlossen?</span>
                                                <span className="text-sm text-muted-foreground">{videoWatched ? 'Sie haben das CMS-Video gesehen (+25 XP)' : 'Schauen Sie sich das Video oben an oder klicken Sie darauf.'}</span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleVideoComplete}
                                            className={videoWatched ? 'bg-brand-navy hover:bg-brand-navy/90 text-white w-full sm:w-auto' : 'w-full sm:w-auto'}
                                            variant={videoWatched ? "default" : "secondary"}
                                        >
                                            {moduleInfo.hasSimulator ? 'Weiter zur Praxis' : 'Modul abschließen'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab 2: Sales Simulator */}
                        {moduleInfo.hasSimulator && (
                            <TabsContent value="simulator" className="mt-0 outline-none">
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-brand-sky/10 p-4 rounded-xl border border-brand-sky/20">
                                        <div>
                                            <Badge className="bg-brand-sky hover:bg-brand-sky text-white mb-2">Aufgabe 1</Badge>
                                            <p className="text-foreground font-medium">
                                                Führen Sie das Verkaufsgespräch mit dem Kunden zu Ende. Wählen Sie die besten Argumente, um die maximalen XP zu erhalten.
                                            </p>
                                        </div>
                                    </div>
                                    <SalesAvatarSimulator />
                                </div>
                            </TabsContent>
                        )}

                        {/* Tab 3: Configurator */}
                        {moduleInfo.hasConfigurator && (
                            <TabsContent value="configurator" className="mt-0 outline-none">
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-brand-navy/5 p-4 rounded-xl border border-brand-navy/10">
                                        <div>
                                            <Badge className="bg-brand-navy hover:bg-brand-navy text-white mb-2">Aufgabe 2</Badge>
                                            <p className="text-foreground font-medium">
                                                Erstellen Sie nun ein passendes Angebot für den Kunden, basierend auf dem Gespräch.
                                            </p>
                                        </div>
                                    </div>
                                    <ConfiguratorSimulator />
                                </div>
                            </TabsContent>
                        )}
                    </div>
                </Tabs>

            </div>
        </RoleGuard>
    );
}
