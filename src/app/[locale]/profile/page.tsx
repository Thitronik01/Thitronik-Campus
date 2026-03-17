"use client";

import { useUserStore } from "@/store/user-store";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleGuard } from "@/components/auth/role-guard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Camera, Linkedin, Instagram, Edit2, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { PremiumBackground } from "@/components/layout/premium-background";
import Link from "next/link";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const { name: gameName, level, levelName, xp, xpToNext } = useUserStore();

    const displayName = user?.name || gameName || "Gast";
    const initials = displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100));

    const { theme, setTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [socials, setSocials] = useState({ linkedin: "", instagram: "" });
    const [editData, setEditData] = useState({
        firstName: displayName.split(' ')[0],
        lastName: displayName.split(' ').slice(1).join(' ') || '',
        company: "THITRONIK Partner"
    });

    return (
        <RoleGuard requiredRole="user" fallback={
            // Ggf wird man auf login weitergeleitet, wenn man nicht eingeloggt ist
            <div className="flex h-[50vh] items-center justify-center p-8">
                <Card className="w-full max-w-md p-6 text-center">
                    <h2 className="mb-4">Bitte Anmelden</h2>
                    <Button onClick={() => window.location.href = '/login'}>Zum Login</Button>
                </Card>
            </div>
        }>
            <PremiumBackground>
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in p-4 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end border-b border-border pb-6 justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                                <span className="text-4xl shadow-sm rounded-full bg-white flex w-12 h-12 items-center justify-center text-brand-navy">👤</span>
                                Mein Profil
                            </h1>
                            <p className="text-white/70 text-lg mt-2">
                                Verwalten Sie Ihre Akademie-Daten und verfolgen Sie Ihren Karriere-Fortschritt.
                            </p>
                        </div>
                        {user?.role === "admin" && (
                            <Badge className="bg-brand-red text-white py-1 px-3">ADMINISTRATOR</Badge>
                        )}
                    </div>

                    {/* Profile Tab Navigation */}
                    <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 mb-6">
                        <div className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white border border-white/10">
                            👤 Mein Profil
                        </div>
                        <Link
                            href="/profile/kalender"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            📅 Mein Kalender
                        </Link>
                        <Link
                            href="/certificates"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            🎓 Zertifikate
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Gamification Stats (Left Column) */}
                        <div className="md:col-span-1 border-r border-white/10 pr-0 md:pr-8 space-y-6">
                            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner relative group">

                                <div className="w-24 h-24 rounded-full bg-brand-navy text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ring-4 ring-brand-sky/20 relative overflow-hidden group-hover:ring-brand-sky transition-all cursor-pointer">
                                    <span>{initials}</span>
                                    {/* Hover Overlay for Avatar Upload */}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white">{displayName}</h2>
                                <p className="text-white/60 text-sm font-medium">{user?.email || "thitronik-campus@demo.de"}</p>

                                <Badge variant="outline" className="mt-3 capitalize text-brand-lime border-brand-lime">
                                    Rolle: {user?.role || "Händler"}
                                </Badge>
                            </div>

                            <Card className="bg-white/10 border-brand-navy shadow-sm overflow-hidden backdrop-blur-md border-white/20">
                                <div className="h-2 w-full bg-brand-navy"></div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex justify-between items-center text-white">
                                        Aktueller Rang
                                        <span className="font-extrabold text-2xl text-brand-lime">{level}</span>
                                    </CardTitle>
                                    <CardDescription className="text-sm font-bold uppercase tracking-wider text-white/70">
                                        {levelName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs mb-1.5 font-medium">
                                            <span className="text-white/60">Fortschritt</span>
                                            <span className="text-brand-lime font-bold">{xp} / {xpToNext} XP</span>
                                        </div>
                                        <Progress value={xpPct} className="h-2.5 bg-white/10" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Profile Settings (Right Column) */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-sm">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div>
                                        <CardTitle className="text-white">Persönliche Daten</CardTitle>
                                        <CardDescription className="text-white/60">Ihr digitales Campus-Profil ("CV").</CardDescription>
                                    </div>

                                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-2 shrink-0 border-white/20 text-white hover:bg-white/10">
                                                <Edit2 className="w-3.5 h-3.5" /> Bearbeiten
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Profil bearbeiten</DialogTitle>
                                                <DialogDescription>
                                                    Passen Sie Ihre persönlichen Daten und Social Links an.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="firstName">Vorname</Label>
                                                        <Input id="firstName" value={editData.firstName} onChange={e => setEditData({ ...editData, firstName: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="lastName">Nachname</Label>
                                                        <Input id="lastName" value={editData.lastName} onChange={e => setEditData({ ...editData, lastName: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="company">Firma / Autohaus</Label>
                                                    <Input id="company" value={editData.company} onChange={e => setEditData({ ...editData, company: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="linkedin">LinkedIn Profil URL</Label>
                                                    <Input id="linkedin" placeholder="https://linkedin.com/in/..." value={socials.linkedin} onChange={e => setSocials({ ...socials, linkedin: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="instagram">Instagram Handle</Label>
                                                    <Input id="instagram" placeholder="@autohaus..." value={socials.instagram} onChange={e => setSocials({ ...socials, instagram: e.target.value })} />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" onClick={() => setIsEditing(false)}>Speichern</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                </CardHeader>
                                <CardContent className="space-y-6 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Name</p>
                                            <p className="font-medium text-white">{editData.firstName} {editData.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">E-Mail Adresse</p>
                                            <p className="font-medium text-white">{user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Firma / Autohaus</p>
                                            <p className="font-medium text-white">{editData.company}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Social Media</p>
                                            <div className="flex gap-3 mt-1.5">
                                                {socials.linkedin ? (
                                                    <a href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://${socials.linkedin}`} target="_blank" rel="noreferrer" className="text-brand-sky hover:text-white transition-colors">
                                                        <Linkedin className="w-5 h-5" />
                                                    </a>
                                                ) : <Linkedin className="w-5 h-5 text-white/20" />}

                                                {socials.instagram ? (
                                                    <a href={`https://instagram.com/${socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-pink-400 hover:text-white transition-colors">
                                                        <Instagram className="w-5 h-5" />
                                                    </a>
                                                ) : <Instagram className="w-5 h-5 text-white/20" />}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-white">Benachrichtigungen & System</CardTitle>
                                    <CardDescription className="text-white/60">Einstellungen für lokale Push-Nachrichten während eines Events.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/5">
                                        <div>
                                            <p className="font-medium text-sm text-white">Event & Check-in Reminder</p>
                                            <p className="text-xs text-white/50">Infos zu anstehenden Workshops auf dem Campus.</p>
                                        </div>
                                        <div className="w-11 h-6 bg-brand-lime rounded-full relative cursor-pointer">
                                            <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/5">
                                        <div>
                                            <p className="font-medium text-sm text-white">XP & Level Updates</p>
                                            <p className="text-xs text-white/50">Visuelle Effekte bei Gamification-Fortschritten.</p>
                                        </div>
                                        <div className="w-11 h-6 bg-brand-lime rounded-full relative cursor-pointer">
                                            <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-white">Sicherheit & Darstellung</CardTitle>
                                    <CardDescription className="text-white/60">Passwort ändern und visuelles Theme anpassen.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3 text-white">Erscheinungsbild</h3>
                                        <div className="flex gap-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setTheme("light")}
                                                className={`flex-1 flex gap-2 border-white/10 text-white hover:bg-white/10 ${theme === 'light' ? 'border-brand-sky text-brand-sky bg-brand-sky/5 ring-1 ring-brand-sky/30' : ''}`}
                                            >
                                                <span>☀️</span> Light
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setTheme("dark")}
                                                className={`flex-1 flex gap-2 border-white/10 text-white hover:bg-white/10 ${theme === 'dark' ? 'border-brand-sky text-brand-sky bg-brand-sky/5 ring-1 ring-brand-sky/30' : ''}`}
                                            >
                                                <span>🌙</span> Dark
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setTheme("system")}
                                                className={`flex-1 flex gap-2 border-white/10 text-white hover:bg-white/10 ${theme === 'system' ? 'border-brand-sky text-brand-sky bg-brand-sky/5 ring-1 ring-brand-sky/30' : ''}`}
                                            >
                                                <span>⚙️</span> System
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="border-t border-white/10 pt-4">
                                        <h3 className="text-sm font-semibold mb-3 text-white">Passwort ändern</h3>
                                        <form className="space-y-4 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                                            <div className="space-y-2">
                                                <Label htmlFor="old-pw" className="text-white">Aktuelles Passwort</Label>
                                                <Input id="old-pw" type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-pw" className="text-white">Neues Passwort</Label>
                                                <Input id="new-pw" type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-pw-confirm" className="text-white">Neues Passwort bestätigen</Label>
                                                <Input id="new-pw-confirm" type="password" />
                                            </div>
                                            <Button type="button" className="w-full bg-brand-sky hover:bg-brand-sky/90 text-white border-none">Passwort speichern</Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Danger Zone */}
                            <div className="pt-4 border-t border-destructive/20 mt-8">
                                <Button variant="destructive" className="w-full sm:w-auto shadow-sm bg-brand-red hover:bg-brand-red/90" onClick={() => logout()}>
                                    Abmelden (Sitzung beenden)
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
