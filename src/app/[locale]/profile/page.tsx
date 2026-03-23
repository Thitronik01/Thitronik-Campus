"use client";

import { useUserStore } from "@/store/user-store";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RoleGuard } from "@/components/auth/role-guard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Camera, Linkedin, Instagram, Edit2, Building2, MapPin, Phone, Users, Calendar, UserCheck, Briefcase, FileText, Mail, MessageSquare, Globe, Fingerprint, Receipt, Truck } from "lucide-react";
import { useState, useRef } from "react";
import { PremiumBackground } from "@/components/layout/premium-background";
import Link from "next/link";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const { name: gameName, level, levelName, xp, xpToNext } = useUserStore();

    const displayName = user?.name || gameName || "Gast";
    const initials = displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100));

    const [isEditing, setIsEditing] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [socials, setSocials] = useState({ linkedin: "", instagram: "" });
    const [editData, setEditData] = useState({
        firstName: displayName.split(' ')[0],
        lastName: displayName.split(' ').slice(1).join(' ') || '',
        company: user?.company || "THITRONIK Partner",
        customerId: "",
        street: "",
        city: "",
        deliveryStreet: "",
        deliveryCity: "",
        phone: "",
        communicationChannel: "",
        language: "Deutsch",
        employees: "",
        dealerSince: "",
        contactPerson: "",
        role: "",
        bio: "",
    });

    const [optIns, setOptIns] = useState({
        newsletter: true,
        marketing: false,
    });

    const handleAvatarClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatarUrl(URL.createObjectURL(file));
    };

    const employeeOptions = ["1–9", "10–49", "50–99", "100–249", "250+"];
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1995 + 1 }, (_, i) => String(currentYear - i));

    return (
        <RoleGuard requiredRole="user" fallback={
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Gamification Stats (Left Column) */}
                        <div className="md:col-span-1 border-r border-white/10 pr-0 md:pr-8 space-y-6">
                            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner relative group">
                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <div
                                    onClick={handleAvatarClick}
                                    className="w-24 h-24 rounded-full bg-brand-navy text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ring-4 ring-brand-sky/20 relative overflow-hidden group-hover:ring-brand-sky transition-all cursor-pointer"
                                >
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Profilbild" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{initials}</span>
                                    )}
                                    {/* Hover Overlay for Avatar Upload */}
                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                        <Camera className="w-5 h-5 text-white" />
                                        <span className="text-[10px] text-white font-medium">Hochladen</span>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white">{displayName}</h2>
                                <p className="text-white/60 text-sm font-medium">{user?.email || "thitronik-campus@demo.de"}</p>

                                <Badge variant="outline" className="mt-3 capitalize text-brand-lime border-brand-lime">
                                    Rolle: {user?.role || "Händler"}
                                </Badge>

                                <p className="text-xs text-white/40 mt-3 flex items-center gap-1">
                                    <Camera className="w-3 h-3" /> Auf Avatar klicken zum Hochladen
                                </p>
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
                            {/* ── Persönliche Daten ── */}
                            <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-sm">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div>
                                        <CardTitle className="text-white">Persönliche Daten</CardTitle>
                                        <CardDescription className="text-white/60">Ihr digitales Campus-Profil – Firmendaten &amp; Kontakt.</CardDescription>
                                    </div>

                                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-2 shrink-0 border-white/20 text-white hover:bg-white/10">
                                                <Edit2 className="w-3.5 h-3.5" /> Bearbeiten
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Profil bearbeiten</DialogTitle>
                                                <DialogDescription>
                                                    Passen Sie Ihre persönlichen Daten und Firmendaten an.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-5 py-4">
                                                {/* Name */}
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
                                                {/* Firma & ID */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="company">Firma / Autohaus</Label>
                                                        <Input id="company" value={editData.company} onChange={e => setEditData({ ...editData, company: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="customerId">Kundennummer / ID</Label>
                                                        <Input id="customerId" placeholder="Ihre Thitronik ID" value={editData.customerId} onChange={e => setEditData({ ...editData, customerId: e.target.value })} />
                                                    </div>
                                                </div>
                                                {/* Adresse */}
                                                <div className="space-y-2">
                                                    <Label>Hauptadresse / Rechnungsadresse</Label>
                                                    <div className="grid grid-cols-2 gap-4 mt-1">
                                                        <Input placeholder="Straße & Hausnummer" value={editData.street} onChange={e => setEditData({ ...editData, street: e.target.value })} />
                                                        <Input placeholder="PLZ & Ort" value={editData.city} onChange={e => setEditData({ ...editData, city: e.target.value })} />
                                                    </div>
                                                </div>
                                                {/* Abweichende Lieferadresse */}
                                                <div className="space-y-2 border-l-2 pl-3 border-brand-sky/30">
                                                    <Label>Abweichende Lieferadresse</Label>
                                                    <div className="grid grid-cols-2 gap-4 mt-1">
                                                        <Input placeholder="Straße & Hausnummer" value={editData.deliveryStreet} onChange={e => setEditData({ ...editData, deliveryStreet: e.target.value })} />
                                                        <Input placeholder="PLZ & Ort" value={editData.deliveryCity} onChange={e => setEditData({ ...editData, deliveryCity: e.target.value })} />
                                                    </div>
                                                </div>
                                                {/* Kontakt */}
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone">Telefon / Mobil</Label>
                                                        <Input id="phone" placeholder="+49 151..." value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Bevorzugter Weg</Label>
                                                        <Select value={editData.communicationChannel} onValueChange={v => setEditData({ ...editData, communicationChannel: v })}>
                                                            <SelectTrigger><SelectValue placeholder="Wählen" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="E-Mail">E-Mail</SelectItem>
                                                                <SelectItem value="Telefon">Telefon</SelectItem>
                                                                <SelectItem value="Post">Post</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Sprache</Label>
                                                        <Select value={editData.language} onValueChange={v => setEditData({ ...editData, language: v })}>
                                                            <SelectTrigger><SelectValue placeholder="Sprache" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Deutsch">Deutsch</SelectItem>
                                                                <SelectItem value="English">English</SelectItem>
                                                                <SelectItem value="Français">Français</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                {/* Händler-Infos */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Mitarbeiterzahl</Label>
                                                        <Select value={editData.employees} onValueChange={v => setEditData({ ...editData, employees: v })}>
                                                            <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
                                                            <SelectContent>
                                                                {employeeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Thitronik-Händler seit</Label>
                                                        <Select value={editData.dealerSince} onValueChange={v => setEditData({ ...editData, dealerSince: v })}>
                                                            <SelectTrigger><SelectValue placeholder="Jahr" /></SelectTrigger>
                                                            <SelectContent>
                                                                {yearOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="contactPerson">Ansprechpartner bei Thitronik</Label>
                                                    <Input id="contactPerson" placeholder="Name des Außendienstbetreuers" value={editData.contactPerson} onChange={e => setEditData({ ...editData, contactPerson: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="role">Funktion / Rolle im Betrieb</Label>
                                                    <Input id="role" placeholder="z.B. Werkstattleiter, Verkäufer..." value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })} />
                                                </div>
                                                {/* Social */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="linkedin">LinkedIn Profil URL</Label>
                                                    <Input id="linkedin" placeholder="https://linkedin.com/in/..." value={socials.linkedin} onChange={e => setSocials({ ...socials, linkedin: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="instagram">Instagram Handle</Label>
                                                    <Input id="instagram" placeholder="@autohaus..." value={socials.instagram} onChange={e => setSocials({ ...socials, instagram: e.target.value })} />
                                                </div>
                                                {/* Bio */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="bio">Über mich / Notizen</Label>
                                                    <Textarea id="bio" placeholder="Kurze Beschreibung, Spezialisierungen, besondere Stärken..." value={editData.bio} onChange={e => setEditData({ ...editData, bio: e.target.value })} className="min-h-[80px]" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" onClick={() => setIsEditing(false)}>Speichern</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                                        {/* Name */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <UserCheck className="w-3 h-3" /> Name
                                            </p>
                                            <p className="font-medium text-white">{editData.firstName} {editData.lastName}</p>
                                        </div>
                                        {/* Email */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Mail className="w-3 h-3" /> E-Mail Adresse
                                            </p>
                                            <p className="font-medium text-white text-sm break-all">{user?.email}</p>
                                        </div>
                                        {/* Firma */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Building2 className="w-3 h-3" /> Firma / Autohaus
                                            </p>
                                            <p className="font-medium text-white">{editData.company || <span className="text-white/30 italic">Nicht angegeben</span>}</p>
                                        </div>
                                        {/* Kundennummer */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Fingerprint className="w-3 h-3" /> Kundennummer / ID
                                            </p>
                                            <p className="font-medium text-white">{editData.customerId || <span className="text-white/30 italic">Nicht angegeben</span>}</p>
                                        </div>
                                        {/* Funktion */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Briefcase className="w-3 h-3" /> Funktion im Betrieb
                                            </p>
                                            <p className="font-medium text-white">{editData.role || <span className="text-white/30 italic">Nicht angegeben</span>}</p>
                                        </div>
                                        {/* Mitarbeiterzahl */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Users className="w-3 h-3" /> Mitarbeiterzahl
                                            </p>
                                            <p className="font-medium text-white">{editData.employees || <span className="text-white/30 italic">Nicht angegeben</span>}</p>
                                        </div>
                                        {/* Hauptadresse */}
                                        <div className="sm:col-span-1">
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Receipt className="w-3 h-3" /> Haupt-/Rechnungsadresse
                                            </p>
                                            {editData.street || editData.city ? (
                                                <p className="font-medium text-white">{editData.street}{editData.street && editData.city ? ", " : ""}{editData.city}</p>
                                            ) : (
                                                <p className="text-white/30 italic font-medium">Nicht angegeben</p>
                                            )}
                                        </div>
                                        {/* Lieferadresse */}
                                        <div className="sm:col-span-1">
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Truck className="w-3 h-3" /> Abweichende Lieferadresse
                                            </p>
                                            {editData.deliveryStreet || editData.deliveryCity ? (
                                                <p className="font-medium text-white">{editData.deliveryStreet}{editData.deliveryStreet && editData.deliveryCity ? ", " : ""}{editData.deliveryCity}</p>
                                            ) : (
                                                <p className="text-white/30 italic font-medium text-xs mt-1">Identisch zur Hauptadresse</p>
                                            )}
                                        </div>
                                        {/* Telefon */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Phone className="w-3 h-3" /> Telefon / Mobil
                                            </p>
                                            <p className="font-medium text-white">{editData.phone || <span className="text-white/30 italic">Nicht angegeben</span>}</p>
                                        </div>
                                        {/* Kommunikation & Sprache */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <MessageSquare className="w-3 h-3" /> Kommunikation & Sprache
                                            </p>
                                            <p className="font-medium text-white">
                                                {editData.communicationChannel || <span className="text-white/30 italic text-sm">Offen</span>} · <span className="text-white/70 text-sm">{editData.language || "Deutsch"}</span>
                                            </p>
                                        </div>
                                        {/* Händler seit */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" /> Thitronik-Händler seit
                                            </p>
                                            <p className="font-medium text-white">{editData.dealerSince || <span className="text-white/30 italic">Nicht angegeben</span>}</p>
                                        </div>
                                        {/* Ansprechpartner */}
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <UserCheck className="w-3 h-3" /> Ansprechpartner Thitronik
                                            </p>
                                            <p className="font-medium text-white">{editData.contactPerson || <span className="text-white/30 italic">Nicht angegeben</span>}</p>
                                        </div>
                                        {/* Social Media */}
                                        <div className="sm:col-span-2">
                                            <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                <Globe className="w-3 h-3" /> Social Media
                                            </p>
                                            <div className="flex gap-3 mt-1.5">
                                                {socials.linkedin ? (
                                                    <a href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://${socials.linkedin}`} target="_blank" rel="noreferrer" className="text-brand-sky hover:text-white transition-colors flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                                                        <Linkedin className="w-5 h-5" />
                                                    </a>
                                                ) : <div className="p-2 bg-white/5 rounded-lg border border-white/5 shrink-0"><Linkedin className="w-5 h-5 text-white/20" /></div>}
                                                {socials.instagram ? (
                                                    <a href={`https://instagram.com/${socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-pink-400 hover:text-white transition-colors flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                                                        <Instagram className="w-5 h-5" />
                                                    </a>
                                                ) : <div className="p-2 bg-white/5 rounded-lg border border-white/5 shrink-0"><Instagram className="w-5 h-5 text-white/20" /></div>}
                                            </div>
                                        </div>
                                        {/* Bio */}
                                        {editData.bio && (
                                            <div className="sm:col-span-2">
                                                <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                                                    <FileText className="w-3 h-3" /> Über mich
                                                </p>
                                                <p className="font-medium text-white/80 text-sm leading-relaxed p-3 bg-white/5 border border-white/10 rounded-xl">{editData.bio}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ── Opt-ins / Datenschutz ── */}
                            <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-1 text-white">
                                        <Mail className="w-5 h-5 text-brand-lime" />
                                        <CardTitle className="text-lg">Datenschutz & Mitteilungen</CardTitle>
                                    </div>
                                    <CardDescription className="text-white/60">Ihre Präferenzen für Updates und Marketing.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5 gap-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm text-white">Campus Newsletter</p>
                                            <p className="text-xs text-white/50">Wichtige Neuigkeiten zur Akademie, System-Updates und neuen Kursen erhalten.</p>
                                        </div>
                                        <Switch
                                            checked={optIns.newsletter}
                                            onCheckedChange={(v: boolean) => setOptIns({ ...optIns, newsletter: v })}
                                            className="shrink-0"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5 gap-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm text-white">Marketing & Angebote</p>
                                            <p className="text-xs text-white/50">Ich stimme zu, gelegentlich Informationen zu Thitronik-Produkten und Rabatten zu erhalten.</p>
                                        </div>
                                        <Switch
                                            checked={optIns.marketing}
                                            onCheckedChange={(v: boolean) => setOptIns({ ...optIns, marketing: v })}
                                            className="shrink-0"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ── Sicherheit ── */}
                            <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-white">Sicherheit</CardTitle>
                                    <CardDescription className="text-white/60">Passwort ändern und Account absichern.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
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
                                    <p className="text-xs text-white/40 mt-2">
                                        💡 Einstellungen für Benachrichtigungen und Dark Mode finden Sie unter{" "}
                                        <Link href="/settings" className="text-brand-sky underline hover:text-white transition-colors">Einstellungen</Link>.
                                    </p>
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
