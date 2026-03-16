"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Upload, Video, Save, PlusCircle, CheckCircle2, Edit3 } from "lucide-react";

// Mock Data für Inseln (aus dem Dashboard synchronisiert)
const INITIAL_ISLANDS = [
    { id: "poel", name: "Poel", icon: "🏝️", xp: 50, status: "completed", desc: "Onboarding & Plattform-Tour", active: true },
    { id: "vejroe", name: "Vejrø", icon: "⚓", xp: 100, status: "completed", desc: "Produktschulung WiPro III", active: true },
    { id: "hiddensee", name: "Hiddensee", icon: "🌊", xp: 150, status: "active", desc: "Einbau-Praxis", active: true },
    { id: "samsoe", name: "Samsø", icon: "⛵", xp: 150, status: "locked", desc: "Basisfahrzeuge", active: false },
    { id: "langeland", name: "Langeland", icon: "🗺️", xp: 100, status: "locked", desc: "Beratung & Service", active: false },
    { id: "usedom", name: "Usedom", icon: "🔭", xp: 120, status: "locked", desc: "Konfigurator-Training", active: false },
    { id: "fehmarn", name: "Fehmarn", icon: "🔧", xp: 120, status: "locked", desc: "Support", active: false },
];

const getMockBlocksForIsland = (islandId: string) => {
    return [
        { id: `mock-1-${islandId}`, type: 'h1' as const, content: `Willkommen auf ${INITIAL_ISLANDS.find(i => i.id === islandId)?.name}` },
        { id: `mock-2-${islandId}`, type: 'text' as const, content: `Dies ist ein automatisch generierter Demo-Text aus dem CMS für die Insel ${islandId}. Hier lernen Händler alle wichtigen Zusammenhänge.` },
        { id: `mock-3-${islandId}`, type: 'h2' as const, content: `Kapitel 1: Grundlagen` },
        { id: `mock-4-${islandId}`, type: 'video' as const, content: `https://www.youtube.com/watch?v=dQw4w9WgXcQ` }
    ];
};

export default function ManagerDashboard() {
    const [islands, setIslands] = useState(INITIAL_ISLANDS);
    const [selectedIsland, setSelectedIsland] = useState(INITIAL_ISLANDS[0]);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isEditorMode, setIsEditorMode] = useState(false);

    // Mock Content State für CMS Editor
    const [cmsBlocks, setCmsBlocks] = useState<{ id: string, type: 'h1' | 'h2' | 'text' | 'image' | 'video', content: string }[]>([]);

    const handleSave = () => {
        setIsSaving(true);
        setSaved(false);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1000);
    };

    const handleIslandUpdate = (field: string, value: any) => {
        const updated = { ...selectedIsland, [field]: value };
        setSelectedIsland(updated);
        setIslands(islands.map(i => i.id === updated.id ? updated : i));
    };

    return (
        <RoleGuard requiredRole="manager">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-6 gap-4">
                    <div>
                        <Badge variant="outline" className="mb-3 text-brand-sky border-brand-sky/30 bg-brand-sky/10">Inhalte-Verwaltung</Badge>
                        <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">Manager Dashboard</h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            Willkommen im CMS. Hier können Sie Lern-Inseln verwalten, Videos hochladen, Zertifizierungs-Logik anpassen und XP-Belohnungen definieren.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={isEditorMode ? "default" : "outline"}
                            className={`gap-2 ${isEditorMode ? 'bg-brand-lime text-brand-navy hover:bg-brand-lime/80' : ''}`}
                            onClick={() => {
                                setIsEditorMode(true);
                                setSelectedIsland({ id: 'new', name: 'Neue Insel', icon: '📝', xp: 0, status: 'locked', desc: '', active: false });
                                setCmsBlocks([]);
                            }}
                        >
                            <PlusCircle className="w-4 h-4" /> {isEditorMode ? "Editor aktiv" : "Neue Insel"}
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-brand-navy hover:bg-brand-navy/90">
                            {isSaving ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="w-4 h-4" />}
                            {saved ? "Gespeichert" : "Speichern"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Left Sidebar (Island List) */}
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Map className="w-5 h-5 text-brand-sky" /> Die 7 Inseln
                        </h3>
                        <div className="flex flex-col gap-2">
                            {islands.map((island) => (
                                <div
                                    key={island.id}
                                    onClick={() => {
                                        setSelectedIsland(island);
                                        setIsEditorMode(false);
                                    }}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between
                                        ${selectedIsland.id === island.id
                                            ? 'bg-white text-black border-white shadow-md'
                                            : 'bg-brand-lime text-brand-navy hover:bg-brand-lime/80 border-brand-lime shadow-sm'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{island.icon}</span>
                                        <div>
                                            <p className="font-semibold text-sm">{island.name}</p>
                                            <p className="text-[10px] opacity-80 uppercase tracking-wider">{island.xp} XP</p>
                                        </div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${island.active ? 'bg-brand-lime' : 'bg-muted-foreground/30'}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        {isEditorMode ? (
                            <Card className="border-border shadow-md bg-card">
                                <CardHeader className="border-b bg-brand-navy text-white pb-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-2xl text-brand-lime flex items-center gap-2">📝 CMS Content Builder</CardTitle>
                                            <CardDescription className="text-white/70">Wird für: {selectedIsland.name}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex gap-2 mb-6 p-4 border rounded-xl bg-muted/20">
                                        <Button variant="outline" size="sm" onClick={() => setCmsBlocks([...cmsBlocks, { id: Date.now().toString(), type: 'h1', content: '' }])}>+ H1 Titel</Button>
                                        <Button variant="outline" size="sm" onClick={() => setCmsBlocks([...cmsBlocks, { id: Date.now().toString(), type: 'h2', content: '' }])}>+ H2 Titel</Button>
                                        <Button variant="outline" size="sm" onClick={() => setCmsBlocks([...cmsBlocks, { id: Date.now().toString(), type: 'text', content: '' }])}>+ Text-Block</Button>
                                        <Button variant="outline" size="sm" onClick={() => setCmsBlocks([...cmsBlocks, { id: Date.now().toString(), type: 'image', content: '' }])}>+ Bild / Media</Button>
                                        <Button variant="outline" size="sm" onClick={() => setCmsBlocks([...cmsBlocks, { id: Date.now().toString(), type: 'video', content: '' }])}>+ Video Link</Button>
                                    </div>

                                    {cmsBlocks.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                            Noch keine Inhalte für diese Insel. Klicken Sie oben, um Blöcke hinzuzufügen.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cmsBlocks.map((block, idx) => (
                                                <div key={block.id} className="p-4 border border-brand-sky/20 rounded-xl bg-background flex gap-4 items-start relative group">
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="sm" className="h-6 text-brand-red flex" onClick={() => setCmsBlocks(cmsBlocks.filter(b => b.id !== block.id))}>&times; Block entfernen</Button>
                                                    </div>
                                                    <div className="mt-2 text-xl font-bold text-muted-foreground w-12 text-center">#{idx + 1}</div>
                                                    <div className="flex-1 space-y-2">
                                                        <Label className="uppercase text-[10px] font-bold text-brand-sky tracking-wider">{block.type} BLOCK</Label>
                                                        {block.type === 'text' ? (
                                                            <Textarea
                                                                placeholder="Inhalt des Textblocks..."
                                                                rows={3}
                                                                value={block.content}
                                                                onChange={(e) => setCmsBlocks(cmsBlocks.map(b => b.id === block.id ? { ...b, content: e.target.value } : b))}
                                                            />
                                                        ) : (
                                                            <Input
                                                                placeholder={block.type === 'video' || block.type === 'image' ? "URL oder Dateipfad eingeben..." : "Textinhalt eingeben..."}
                                                                value={block.content}
                                                                onChange={(e) => setCmsBlocks(cmsBlocks.map(b => b.id === block.id ? { ...b, content: e.target.value } : b))}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-border shadow-md">
                                <CardHeader className="border-b bg-muted/20 pb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{selectedIsland.icon}</span>
                                            <div>
                                                <CardTitle className="text-2xl text-brand-navy">{selectedIsland.name}</CardTitle>
                                                <CardDescription>ID: {selectedIsland.id} • Modul-Konfiguration</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="bg-brand-sky hover:bg-brand-sky/80 flex gap-2"
                                                onClick={() => {
                                                    setIsEditorMode(true);
                                                    setCmsBlocks(getMockBlocksForIsland(selectedIsland.id));
                                                }}
                                            >
                                                <Edit3 className="w-4 h-4" /> Inhalte im CMS bearbeiten
                                            </Button>
                                            <div className="flex items-center space-x-2 border-l pl-4 border-border">
                                                <Label htmlFor="island-active" className="text-sm font-semibold cursor-pointer">
                                                    Modul aktiv
                                                </Label>
                                                <Switch
                                                    id="island-active"
                                                    checked={selectedIsland.active}
                                                    onCheckedChange={(c) => handleIslandUpdate('active', c)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <Tabs defaultValue="general" className="w-full">
                                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                        <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-sky data-[state=active]:bg-transparent px-6 py-3 shadow-none">Allgemein</TabsTrigger>
                                        <TabsTrigger value="content" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-sky data-[state=active]:bg-transparent px-6 py-3 shadow-none">Inhalte (Video/Doc)</TabsTrigger>
                                        <TabsTrigger value="tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-sky data-[state=active]:bg-transparent px-6 py-3 shadow-none">Simulatoren & Aufgaben</TabsTrigger>
                                    </TabsList>

                                    <CardContent className="p-6">
                                        {/* Tab: General */}
                                        <TabsContent value="general" className="space-y-6 mt-0">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="island-name">Name der Insel</Label>
                                                    <Input
                                                        id="island-name"
                                                        value={selectedIsland.name}
                                                        onChange={(e) => handleIslandUpdate('name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="island-xp">XP Belohnung (Basis)</Label>
                                                    <Input
                                                        id="island-xp"
                                                        type="number"
                                                        value={selectedIsland.xp}
                                                        onChange={(e) => handleIslandUpdate('xp', parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="island-desc">Kurzbeschreibung (Tooltip)</Label>
                                                <Input
                                                    id="island-desc"
                                                    value={selectedIsland.desc}
                                                    onChange={(e) => handleIslandUpdate('desc', e.target.value)}
                                                    placeholder="z.B. Produktschulung WiPro III"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="island-longdesc">Detaillierte Kurs-Inhalte (Lobby)</Label>
                                                <Textarea
                                                    id="island-longdesc"
                                                    rows={4}
                                                    placeholder="Lernen Sie die Kernargumente für das System kennen..."
                                                    defaultValue="Nach Abschluss dieser Insel wird das Badge für Produkt-Kenntnisse verliehen."
                                                />
                                            </div>
                                        </TabsContent>

                                        {/* Tab: Content */}
                                        <TabsContent value="content" className="space-y-6 mt-0">
                                            <div className="p-6 border-2 border-dashed border-border rounded-xl bg-muted/30 text-center space-y-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                                                    <Upload className="w-8 h-8 text-brand-sky" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-brand-navy">Video-Lektion hochladen</h4>
                                                    <p className="text-sm text-muted-foreground mt-1">MP4 oder WebM, max. 500MB</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="mt-2 text-xs">Datei auswählen</Button>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <Video className="w-4 h-4 text-muted-foreground" />
                                                    Aktuelles Modul-Video
                                                </h4>
                                                <div className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-8 bg-brand-navy rounded flex items-center justify-center">
                                                            <span className="text-[8px] text-white font-bold">THITRONIK</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">Lektion_1_Grundlagen.mp4</p>
                                                            <p className="text-xs text-muted-foreground">12:45 Min • 1080p</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-destructive h-8 px-2 text-xs">Entfernen</Button>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* Tab: Tasks */}
                                        <TabsContent value="tasks" className="space-y-6 mt-0">
                                            <div className="p-4 border rounded-xl bg-brand-sky/5 border-brand-sky/20">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <Badge className="bg-brand-sky mb-2">Simulator (Praxis)</Badge>
                                                        <h4 className="font-bold text-brand-navy">Verkaufs-Avatar aktivieren</h4>
                                                        <p className="text-sm text-muted-foreground">Teilnehmer müssen ein interaktives Verkaufsgespräch führen, um diese Insel abzuschließen.</p>
                                                    </div>
                                                    <Switch defaultChecked />
                                                </div>
                                                <div className="space-y-2 bg-white p-4 rounded-lg border">
                                                    <Label>Szenario des Kunden (Kontext für AI)</Label>
                                                    <Textarea
                                                        rows={3}
                                                        defaultValue="Kunde besitzt einen Fiat Ducato und möchte eine einfache Alarmanlage."
                                                        className="text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-4 border rounded-xl bg-muted/40">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <Badge variant="secondary" className="mb-2">Konfigurator</Badge>
                                                        <h4 className="font-bold text-foreground">Preis-Kalkulation aktivieren</h4>
                                                        <p className="text-sm text-muted-foreground">Teilnehmer müssen ein Angebot erstellen, das den Vorgaben entspricht.</p>
                                                    </div>
                                                    <Switch />
                                                </div>
                                            </div>

                                            {saved && (
                                                <div className="flex items-center gap-2 text-brand-lime font-medium mt-4 p-3 bg-brand-lime/10 rounded-lg justify-center">
                                                    <CheckCircle2 className="w-5 h-5" /> Änderungen an "{selectedIsland.name}" gespeichert.
                                                </div>
                                            )}
                                        </TabsContent>

                                    </CardContent>
                                </Tabs>
                            </Card>
                        )}
                    </div>
                </div>

            </div>
        </RoleGuard>
    );
}
