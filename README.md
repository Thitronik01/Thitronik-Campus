<p align="center">
  <img src="public/logo.png" alt="THITRONIK Campus Logo" width="80" />
</p>

<h1 align="center">THITRONIK Campus 2.0</h1>

<p align="center">
  🎓 Gamifizierte Händler-Schulungsplattform für den DACH-Raum
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
</p>

---

## Über das Projekt

**THITRONIK Campus 2.0** ist eine moderne, gamifizierte Schulungsplattform für THITRONIK-Händler im DACH-Raum. Die Plattform bietet interaktive Schulungsmodule, Zertifizierungen und Community-Features – alles verpackt in einer Premium-Web-App mit PWA-Support.

### Features

- 🏝️ **Insel-basiertes Lernsystem** – Fortschrittsbasierte Schulungsmodule mit XP und Leveln
- 📱 **QR-Code Check-in** – Event-Teilnahme per QR-Scan
- 🎮 **8 Campus-Spiele** – Memory, Kahoot, Sales Simulator, „Was bin ich?" u.v.m.
- 📜 **Zertifikate** – PDF-Zertifikate nach erfolgreichem Abschluss
- 🌍 **Mehrsprachig** – Deutsch, Englisch, Französisch (next-intl)
- 💬 **Community Chat** – Austausch zwischen Händlern
- 📊 **Manager/Admin-Dashboard** – CMS, Audit-Logs, Nutzerverwaltung
- 🗺️ **Händlerkarte & Lageplan** – Interaktive Kartenansicht
- 📖 **Chronik** – Unternehmensgeschichte und Meilensteine
- 🌙 **Dark Mode** – Premium-Design mit Glassmorphism-Effekten

---

## Tech Stack

| Kategorie | Technologie |
|-----------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com), [shadcn/ui](https://ui.shadcn.com) |
| Animationen | [Framer Motion](https://www.framer.com/motion/) |
| Backend | [Supabase](https://supabase.com) (Auth, DB, Storage) |
| State | [Zustand](https://zustand.docs.pmnd.rs/) |
| i18n | [next-intl](https://next-intl.dev/) |
| PDF | [jsPDF](https://github.com/parallax/jsPDF), [@react-pdf/renderer](https://react-pdf.org/) |
| QR | [html5-qrcode](https://github.com/nicbarker/html5-qrcode), [qrcode.react](https://github.com/zpao/qrcode.react) |
| Charts | [Recharts](https://recharts.org/) |

---

## Schnellstart

### Voraussetzungen

- [Node.js](https://nodejs.org) ≥ 18
- [npm](https://www.npmjs.com/) ≥ 9

### Installation

```bash
# Repository klonen
git clone https://github.com/Thitronik01/Thitronik-Campus.git
cd Thitronik-Campus

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env.local
# → Supabase-URL und Anon-Key eintragen

# Entwicklungsserver starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

---

## Projektstruktur

```
src/
├── actions/        # Server Actions (Chronik, etc.)
├── app/
│   └── [locale]/   # Internationalisierte Routen
│       ├── admin/          # Admin-Dashboard
│       ├── games/          # 8 Campus-Spiele
│       ├── login/          # Authentifizierung
│       ├── modules/        # Schulungsmodule
│       ├── profile/        # Profil & Kalender
│       └── ...
├── components/
│   ├── dashboard/  # Dashboard-Widgets
│   ├── layout/     # App-Shell, Navigation
│   ├── ui/         # shadcn/ui Basiskomponenten
│   └── interactive/ # Interaktive Komponenten
├── i18n/           # Routing & Konfiguration
├── lib/            # Utilities (Supabase-Client, etc.)
├── store/          # Zustand Stores
└── types/          # TypeScript-Typdefinitionen

messages/           # Übersetzungsdateien (de, en, fr)
public/             # Statische Assets
supabase/           # Migrationen & Seed-Daten
```

---

## Verfügbare Scripts

| Script | Beschreibung |
|--------|-------------|
| `npm run dev` | Startet den Entwicklungsserver |
| `npm run build` | Erstellt den Production-Build |
| `npm run start` | Startet den Production-Server |
| `npm run lint` | Prüft auf ESLint-Fehler |

---

## Mitwirken

Wir freuen uns über Beiträge! Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Details.

---

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).
