"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Users,
  Shield,
  Briefcase,
  Search,
  Filter,
  MessageCircle,
  MapPin,
  Bell,
  Pin,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Role = "dealer" | "manager" | "admin";
type Region = "Nord" | "Süd" | "West" | "Ost";

type Participant = {
  id: string;
  name: string;
  role: Role;
  region: Region;
  online: boolean;
};

type Messages = {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  region: Region;
  content: string;
  time: string;
};

const TH = {
  th_blue_primary: "#1D3661",
  th_blue_secondary: "#3BA9D3",
  th_accent_lime: "#AFCA05",
  th_red_brand: "#CE132D",
  graySoft: "#F0F0F0",
  white: "#FFFFFF",
  ink: "#111111",
  textStrong: "#18212F",
  textMuted: "#485467",
  textSoft: "#677488",
  borderSoft: "#D7DCE3",
  borderStrong: "#C5CDD8",
  panelBg: "#F7F9FC",
  canvasBg: "#E8EDF5",
};

const currentUser: Participant = {
  id: "u-current",
  name: "Autohaus Kühn GmbH",
  role: "dealer",
  region: "Nord",
  online: true,
};

const participants: Participant[] = [
  currentUser,
  { id: "u-1", name: "Caravan Becker", role: "dealer", region: "West", online: true },
  { id: "u-2", name: "Camping Nord GmbH", role: "dealer", region: "Nord", online: true },
  { id: "u-3", name: "Reisemobile Hansa", role: "dealer", region: "Nord", online: false },
  { id: "u-4", name: "THITRONIK Vertrieb", role: "manager", region: "West", online: true },
  { id: "u-5", name: "Campus Administration", role: "admin", region: "Süd", online: true },
  { id: "u-6", name: "VanTec Leipzig", role: "dealer", region: "Ost", online: true },
  { id: "u-7", name: "Wohnmobil Zentrum Süd", role: "dealer", region: "Süd", online: false },
  { id: "u-8", name: "Servicepartner Köln", role: "dealer", region: "West", online: true },
  { id: "u-9", name: "THITRONIK Support", role: "manager", region: "Nord", online: true },
  { id: "u-10", name: "Caravan Profi Dresden", role: "dealer", region: "Ost", online: true },
].concat(
  Array.from({ length: 40 }, (_, i) => ({
    id: `u-extra-${i + 11}`,
    name: `Händler ${i + 11}`,
    role: "dealer" as Role,
    region: (["Nord", "Süd", "West", "Ost"] as Region[])[i % 4],
    online: i % 3 !== 0,
  }))
);

const initialMessages: Messages[] = [
  {
    id: "m-1",
    userId: "u-5",
    userName: "Campus Administration",
    role: "admin",
    region: "Süd",
    content:
      "Willkommen im THITRONIK Community Chat. Dieser Bereich dient dem direkten Austausch zwischen Händlern, Vertrieb und Administration.",
    time: "08:45",
  },
  {
    id: "m-2",
    userId: "u-4",
    userName: "THITRONIK Vertrieb",
    role: "manager",
    region: "West",
    content:
      "Ab heute steht im Campus die aktualisierte Verkaufsunterlage zu WiPro III und Pro-finder bereit. Bitte in den Beratungsteams verteilen.",
    time: "08:49",
  },
  {
    id: "m-3",
    userId: "u-2",
    userName: "Camping Nord GmbH",
    role: "dealer",
    region: "Nord",
    content: "Hat schon jemand das neue Argumentationsblatt aktiv im Kundengespräch getestet? Besonders im Segment Kastenwagen?",
    time: "08:52",
  },
  {
    id: "m-4",
    userId: "u-8",
    userName: "Servicepartner Köln",
    role: "dealer",
    region: "West",
    content: "Ja. Die Kombination aus Diebstahlschutz und App-Bedienung funktioniert bei uns sehr gut in der Erstansprache.",
    time: "08:55",
  },
  {
    id: "m-5",
    userId: currentUser.id,
    userName: currentUser.name,
    role: currentUser.role,
    region: currentUser.region,
    content: "Wir würden uns zusätzlich eine kurze Einwandbehandlung für Preisgespräche wünschen. Zwei bis drei Standardsätze würden reichen.",
    time: "08:57",
  },
  {
    id: "m-6",
    userId: "u-9",
    userName: "THITRONIK Support",
    role: "manager",
    region: "Nord",
    content: "Gute Rückmeldung. Wir nehmen das mit in den Sales-Bereich und prüfen zusätzlich ein kurzes Argumentations-PDF für den Thekeneinsatz.",
    time: "09:01",
  },
];

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const value = parseInt(full, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function mix(hex: string, otherHex: string, weight = 0.5) {
  const a = hexToRgb(hex);
  const b = hexToRgb(otherHex);
  const t = Math.max(0, Math.min(1, weight));
  const r = Math.round(a.r * (1 - t) + b.r * t);
  const g = Math.round(a.g * (1 - t) + b.g * t);
  const bChannel = Math.round(a.b * (1 - t) + b.b * t);
  return `rgb(${r}, ${g}, ${bChannel})`;
}

function relativeLuminanceFromRgb(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(bgHex: string, fgHex: string) {
  const bg = hexToRgb(bgHex);
  const fg = hexToRgb(fgHex);
  const bgLum = relativeLuminanceFromRgb(bg.r, bg.g, bg.b);
  const fgLum = relativeLuminanceFromRgb(fg.r, fg.g, fg.b);
  const lighter = Math.max(bgLum, fgLum);
  const darker = Math.min(bgLum, fgLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function pickReadableText(bgHex: string, dark = TH.textStrong, light = TH.white) {
  return contrastRatio(bgHex, dark) >= contrastRatio(bgHex, light) ? dark : light;
}

function roleLabel(role: Role) {
  if (role === "admin") return "Admin";
  if (role === "manager") return "Manager";
  return "Händler";
}

function roleIcon(role: Role) {
  if (role === "admin") return <Shield className="h-3.5 w-3.5" />;
  if (role === "manager") return <Briefcase className="h-3.5 w-3.5" />;
  return <Users className="h-3.5 w-3.5" />;
}

function roleStyle(role: Role) {
  if (role === "admin") {
    const background = mix(TH.th_red_brand, TH.white, 0.9);
    return {
      backgroundColor: background,
      borderColor: mix(TH.th_red_brand, TH.white, 0.72),
      color: pickReadableText("#FBEDEF", TH.textStrong, TH.white),
    };
  }

  if (role === "manager") {
    const background = mix(TH.th_blue_secondary, TH.white, 0.84);
    return {
      backgroundColor: background,
      borderColor: mix(TH.th_blue_secondary, TH.white, 0.64),
      color: pickReadableText("#DDF2FA", TH.textStrong, TH.white),
    };
  }

  const background = mix(TH.th_accent_lime, TH.white, 0.82);
  return {
    backgroundColor: background,
    borderColor: mix(TH.th_accent_lime, TH.white, 0.58),
    color: TH.textStrong,
  };
}

function regionPillStyle(active: boolean) {
  return active
    ? {
        backgroundColor: TH.th_blue_primary,
        color: pickReadableText(TH.th_blue_primary),
        borderColor: TH.th_blue_primary,
      }
    : {
        backgroundColor: TH.white,
        color: TH.th_blue_primary,
        borderColor: TH.borderSoft,
      };
}

export function CommunityChat() {
  const [messages, setMessages] = useState<Messages[]>(initialMessages);
  const [input, setInput] = useState("");
  const [regionFilter, setRegionFilter] = useState<"Alle" | Region>("Alle");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesRegion = regionFilter === "Alle" || p.region === regionFilter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [regionFilter, search]);

  const visibleMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesRegion = regionFilter === "Alle" || m.region === regionFilter;
      const matchesSearch =
        m.userName.toLowerCase().includes(search.toLowerCase()) ||
        m.content.toLowerCase().includes(search.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [messages, regionFilter, search]);

  const onlineCount = participants.filter((p) => p.online).length;
  const dealerCount = participants.filter((p) => p.role === "dealer").length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages.length]);

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = new Date();
    const time = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        role: currentUser.role,
        region: currentUser.region,
        content: trimmed,
        time,
      },
    ]);
    setInput("");
  }

  return (
    <div
      className="max-h-[85vh] overflow-hidden flex flex-col"
      style={{
        color: TH.textStrong,
      }}
    >
      <div className="mb-6 overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(29,54,97,0.12)]">
        <div
          className="px-6 pt-10 pb-16 md:px-12 md:pt-12 md:pb-20"
          style={{ background: `linear-gradient(90deg, ${TH.th_blue_primary} 0%, #27467B 100%)` }}
        >
          <div className="flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/12 ring-1 ring-white/20">
                <div
                  className="absolute right-0 top-0 h-4 w-4 rounded-bl-xl"
                  style={{ backgroundColor: TH.th_red_brand }}
                />
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.88)" }}>
                  THITRONIK Händler Campus
                </div>
                <h1 className="text-xl font-semibold leading-tight text-white md:text-2xl">Community Chat</h1>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.88)" }}>
                  Zentraler Austausch für Händler, Manager und Admins im Campus
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="rounded-2xl px-8 py-5 ring-1 backdrop-blur" style={{ backgroundColor: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.18)", color: TH.white }}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.82)" }}>Kapazität</div>
                <div className="mt-1 text-2xl font-semibold">50 aktive Händler</div>
              </div>
              <div className="rounded-2xl px-8 py-5 ring-1 backdrop-blur" style={{ backgroundColor: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.18)", color: TH.white }}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.82)" }}>Live</div>
                <div className="mt-1 text-2xl font-semibold">{onlineCount} online</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)_340px] flex-1 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="hidden lg:block overflow-auto">
          <Card className="rounded-[28px] border-0 shadow-sm sticky top-0" style={{ backgroundColor: TH.white }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: mix(TH.th_blue_secondary, TH.white, 0.82), color: TH.th_blue_primary }}
                >
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg" style={{ color: TH.th_blue_primary }}>
                    Überblick
                  </CardTitle>
                  <p className="text-sm" style={{ color: TH.textMuted }}>
                    Relevante Kennzahlen und Hinweise
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl p-4" style={{ backgroundColor: TH.graySoft }}>
                  <div className="text-sm" style={{ color: TH.textMuted }}>Online</div>
                  <div className="mt-1 text-2xl font-semibold" style={{ color: TH.th_blue_primary }}>{onlineCount}</div>
                </div>
                <div className="rounded-3xl p-4" style={{ backgroundColor: TH.graySoft }}>
                  <div className="text-sm" style={{ color: TH.textMuted }}>Händler</div>
                  <div className="mt-1 text-2xl font-semibold" style={{ color: TH.th_blue_primary }}>{dealerCount}</div>
                </div>
              </div>

              <div
                className="rounded-3xl p-4 ring-1"
                style={{
                  backgroundColor: mix(TH.th_blue_secondary, TH.white, 0.9),
                  borderColor: mix(TH.th_blue_secondary, TH.white, 0.72),
                }}
              >
                <div className="mb-2 flex items-center gap-2" style={{ color: TH.th_blue_primary }}>
                  <Pin className="h-4 w-4" />
                  <span className="text-sm font-medium">Angepinnter Hinweis</span>
                </div>
                <p className="text-sm leading-6" style={{ color: TH.textStrong }}>
                  Produkt- und Verkaufsunterlagen bitte ausschließlich über die aktuelle Campus-Version teilen, damit alle Händler mit demselben Stand arbeiten.
                </p>
              </div>

              <div
                className="rounded-3xl p-4"
                style={{ backgroundColor: TH.th_blue_primary, color: TH.white }}
              >
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>Dein Profil</div>
                <div className="mt-1 text-lg font-semibold">{currentUser.name}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge
                    className="rounded-full border px-3 py-1 hover:bg-transparent"
                    style={{
                      backgroundColor: mix(TH.th_blue_secondary, TH.th_blue_primary, 0.18),
                      color: TH.white,
                      borderColor: "rgba(255,255,255,0.18)",
                    }}
                  >
                    {roleLabel(currentUser.role)}
                  </Badge>
                  <Badge
                    className="rounded-full border px-3 py-1 hover:bg-transparent"
                    style={{
                      backgroundColor: mix(TH.th_accent_lime, TH.white, 0.18),
                      color: TH.textStrong,
                      borderColor: "rgba(255,255,255,0.14)",
                    }}
                  >
                    {currentUser.region}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col overflow-hidden">
          <Card
            className="flex flex-col overflow-hidden rounded-[28px] border-0 shadow-sm flex-1"
            style={{ backgroundColor: TH.white }}
          >
            <CardHeader className="border-b pb-4" style={{ borderColor: TH.borderSoft }}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-xl" style={{ color: TH.th_blue_primary }}>
                      Dealer Community
                    </CardTitle>
                    <p className="text-sm" style={{ color: TH.textMuted }}>
                      Schneller Austausch zu Vertrieb, Service und Produktfragen
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["Alle", "Nord", "Süd", "West", "Ost"] as const).map((region) => (
                      <Button
                        key={region}
                        variant="outline"
                        size="sm"
                        className="rounded-2xl border px-4"
                        style={regionPillStyle(regionFilter === region)}
                        onClick={() => setRegionFilter(region)}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {region}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <div
              className="flex-1 overflow-y-auto p-4 md:p-6 min-h-[400px]"
              style={{ background: `linear-gradient(180deg, ${TH.graySoft} 0%, ${TH.panelBg} 100%)` }}
            >
              <div className="mx-auto flex max-w-3xl flex-col gap-4 font-sans">
                {visibleMessages.map((message) => {
                  const own = message.userId === currentUser.id;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${own ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[84%] rounded-[26px] px-4 py-3 shadow-sm ring-1 md:max-w-[72%]"
                        style={
                          own
                            ? {
                                backgroundColor: TH.th_blue_primary,
                                color: TH.white,
                                borderColor: mix(TH.th_blue_primary, TH.white, 0.2),
                              }
                            : {
                                backgroundColor: TH.white,
                                color: TH.textStrong,
                                borderColor: "#E0E5EC",
                              }
                        }
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">{message.userName}</span>
                          <span
                            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]"
                            style={roleStyle(message.role)}
                          >
                            {roleIcon(message.role)}
                            {roleLabel(message.role)}
                          </span>
                          <span className="text-[11px]" style={{ color: own ? "rgba(255,255,255,0.88)" : TH.textSoft }}>
                            {message.region}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-6" style={{ color: own ? TH.white : TH.textStrong }}>
                          {message.content}
                        </p>
                        <div className="mt-2 text-right text-[11px]" style={{ color: own ? "rgba(255,255,255,0.9)" : TH.textSoft }}>
                          {message.time}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="border-t p-4" style={{ borderColor: TH.borderSoft, backgroundColor: TH.white }}>
              <div className="mx-auto flex max-w-3xl items-end gap-3">
                <div className="flex-1">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Nachricht an die Community schreiben ..."
                    className="h-12 rounded-2xl border bg-white"
                    style={{ borderColor: TH.borderStrong, color: TH.textStrong }}
                  />
                </div>
                <Button
                  className="h-12 rounded-2xl px-5"
                  style={{ backgroundColor: TH.th_blue_primary, color: TH.white }}
                  onClick={sendMessage}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Senden
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hidden lg:block overflow-auto">
          <Card className="rounded-[28px] border-0 shadow-sm" style={{ backgroundColor: TH.white }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg" style={{ color: TH.th_blue_primary }}>
                <Users className="h-5 w-5" />
                Teilnehmer
              </CardTitle>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: TH.textSoft }} />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Händler suchen"
                  className="rounded-2xl pl-9 border bg-white"
                  style={{ borderColor: TH.borderStrong, color: TH.textStrong }}
                />
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[60vh]">
              <div className="mb-3 flex items-center gap-2 text-sm" style={{ color: TH.textMuted }}>
                <Filter className="h-4 w-4" />
                {filteredParticipants.length} sichtbare Kontakte
              </div>

              <div className="space-y-3">
                {filteredParticipants.map((participant) => (
                  <div key={participant.id} className="rounded-3xl p-3" style={{ backgroundColor: TH.graySoft }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-sm" style={{ color: TH.th_blue_primary }}>{participant.name}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge
                            className="rounded-full border px-2.5 py-1 hover:bg-transparent text-[10px]"
                            style={roleStyle(participant.role)}
                          >
                            {roleLabel(participant.role)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-1 text-[10px] bg-white border-none"
                            style={{ color: TH.textMuted }}
                          >
                            {participant.region}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-1 h-3 w-3 rounded-full ring-2" style={{ backgroundColor: participant.online ? TH.th_accent_lime : "#B8C0CC", boxShadow: `0 0 0 2px ${TH.white}` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
