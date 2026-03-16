"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RoleGuard } from "@/components/auth/role-guard";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Trash2, Shield, MoreHorizontal, UserCog } from "lucide-react";

// Mock User Data
const MOCK_USERS = [
    { id: "u1", name: "Max Mustermann", email: "max@autohaus.de", company: "Autohaus Mustermann", role: "user", xp: 1250, status: "active" },
    { id: "u2", name: "Frank Weber", email: "manager@autohaus.de", company: "Caravan Center Kiel", role: "manager", xp: 4500, status: "active" },
    { id: "u3", name: "Anna Thitronik", email: "admin@thitronik.de", company: "THITRONIK GmbH", role: "admin", xp: 8000, status: "active" },
    { id: "u4", name: "Julia Schmidt", email: "j.schmidt@camper-service.com", company: "Camper Service Süd", role: "user", xp: 350, status: "inactive" },
    { id: "u5", name: "Tom Bauer", email: "t.bauer@wohnmobile-bauer.de", company: "Wohnmobile Bauer", role: "user", xp: 2100, status: "active" },
];

export default function AdminDashboardPage() {
    const [eventCode, setEventCode] = useState("TH-2026-A");
    const [qrValue, setQrValue] = useState("TH-2026-A");
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState(MOCK_USERS);

    const generateCode = () => {
        setQrValue(eventCode.toUpperCase());
    };

    return (
        <RoleGuard requiredRole="admin">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Verwaltung von Events, QR-Codes und User-Rollen für die THITRONIK Akademie.
                    </p>
                </div>

                <Tabs defaultValue="events" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="events">📅 Live-Events</TabsTrigger>
                        <TabsTrigger value="users">👥 Benutzer</TabsTrigger>
                    </TabsList>

                    <TabsContent value="events" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Generator UI */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>QR-Code Generator</CardTitle>
                                    <CardDescription>
                                        Erstellen Sie einen Event-Code, den die Teilnehmer scannen können.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="eventCode">Event/Raum-Code</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="eventCode"
                                                value={eventCode}
                                                onChange={(e) => setEventCode(e.target.value)}
                                                placeholder="z.B. TH-2026-A"
                                                className="font-mono uppercase"
                                                maxLength={12}
                                            />
                                            <Button onClick={generateCode}>Generieren</Button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-muted rounded-xl text-sm text-muted-foreground">
                                        <p>💡 <b>Tipp:</b> Projizieren Sie diesen QR-Code über den Beamer im Schulungsraum.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* QR Code Display */}
                            <Card className="flex flex-col items-center justify-center p-8 bg-white border-2 border-brand-sky/20">
                                <motion.div
                                    key={qrValue}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-border"
                                >
                                    <QRCodeSVG
                                        value={qrValue}
                                        size={200}
                                        level={"H"}
                                        includeMargin={false}
                                        fgColor="#1D3661" // THITRONIK Navy
                                    />
                                </motion.div>
                                <div className="mt-6 text-center">
                                    <Badge variant="outline" className="text-lg px-4 py-1 font-mono bg-muted/50 border-brand-navy/20">
                                        {qrValue}
                                    </Badge>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Teilnehmer können diesen Code am Handy eingeben oder scannen.
                                    </p>
                                </div>
                            </Card>

                        </div>
                    </TabsContent>

                    <TabsContent value="users" className="mt-6">
                        <Card>
                            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Benutzerverwaltung</CardTitle>
                                    <CardDescription>Accounts, Rollen und XP-Stände aller Campus-Teilnehmer verwalten.</CardDescription>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Suchen (Name, Firma...)"
                                        className="w-full pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Benutzer</TableHead>
                                                <TableHead>Firma</TableHead>
                                                <TableHead>XP</TableHead>
                                                <TableHead>Rolle</TableHead>
                                                <TableHead className="text-right">Aktionen</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.company.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </TableCell>
                                                    <TableCell>{user.company}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="font-mono bg-brand-sky/5 border-brand-sky/20">{user.xp}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select value={user.role} onValueChange={(val) => {
                                                            setUsers(users.map(u => u.id === user.id ? { ...u, role: val } : u));
                                                        }}>
                                                            <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold
                                                                ${user.role === 'admin' ? 'text-destructive border-destructive/50' :
                                                                    user.role === 'manager' ? 'text-brand-sky border-brand-sky/50' : ''}
                                                            `}>
                                                                <SelectValue placeholder="Rolle" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="user"><span className="flex items-center gap-2"><UserCog className="w-3 h-3" /> Händler</span></SelectItem>
                                                                <SelectItem value="manager"><span className="flex items-center gap-2 text-brand-sky"><Shield className="w-3 h-3" /> Manager</span></SelectItem>
                                                                <SelectItem value="admin"><span className="flex items-center gap-2 text-destructive"><Shield className="w-3 h-3" /> Admin</span></SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand-navy">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {users.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center">Keine Benutzer gefunden.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </RoleGuard>
    );
}
