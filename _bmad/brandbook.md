# Thitronik Campus 2.0
## Vollstandiges Design-System & CI-Regelwerk fuer den Coding-Agenten

> **Quellen:** Thitronik Brandbook v1.1 (22.12.2025) - Website HTML (thitronik.de) - GitHub Repo Audit
> **Letzte Aktualisierung:** 2026-03-17
> **PRIORITAET: Brandbook + Website > Repo-Code** _(der Code hat noch CI-Abweichungen die zu korrigieren sind!)_

---

## 0. Markenessenz & Kontext

| Key | Value |
|-----|-------|
| **Essenz** | "Sicher unterwegs, entspannt ankommen." |
| **Produkte** | Sicherheitstechnik fuer Reisemobile - Alarmanlagen, Gaswarner, Ortungssysteme |
| **Betreiber** | THITRONIK GmbH, Finkenweg 9-15, 24340 Eckernfoerde |
| **Campus** | Haendler-Schulungsplattform fuer THITRONIK(R) Einbau- & Premiumpartner |
| **Ton** | Ruhig, technisch praezise, serviceorientiert. KEINE Superlative, KEINE Panikmache. |
| **Ansprache** | Du-Form (DE) \| You-Form (EN) \| tu-Form (FR) - IMMER konsequent |

---

## 1. Tech-Stack (Repo: package.json)

```
Next.js         16.1.6  (App Router, Turbopack)   themeColor: #1D3661
React           19.2.3
TypeScript      5.x
```

**UI / Styling:**
```
shadcn/ui     3.8.5   (style: "new-york", RSC: true)
Tailwind CSS  4.x     + tw-animate-css
Lucide React  0.577.0 (EINZIGE Icon-Library - kein Heroicons, kein FontAwesome)
```

**Animation:** Framer Motion 12.35.0

**State:** Zustand 5.0.11 (persist middleware)

**Backend:**
```
Supabase      2.98.0  (Auth + DB)
next-intl     4.8.3   (DE | EN | FR)
```

**PDF/Zertifikate:** @react-pdf/renderer, jsPDF, html2canvas, QRCode.react

```
AI:    @ai-sdk/openai (THI-Chatbot via /api/chat)
PWA:   next-pwa 5.6.0 + idb (Offline-Queue)
Forms: React Hook Form + Zod
Charts: Recharts
```

---

## 2. THITRONIK CI - Farben (Brandbook v1.1, Kapitel 4)

### 2.1 Offizielle Token-Palette

```css
/* =============================================================
   THITRONIK DESIGN TOKENS - Verbindlich aus Brandbook v1.1
   ============================================================= */

:root {
  /* PRIMAERFARBEN */
  --th-blue-primary:     #1D3661;  /* Navy - Primaere Flaechen, Headlines, Buttons */
  --th-blue-secondary:   #3BA9D3;  /* Sky - Akzente, Badges, Links, Info */
  --th-accent-lime:      #AFCA05;  /* Lime - NUR Marker/Status - REGELN BEACHTEN! */
  --th-red-brand:        #CE132D;  /* Rot - Logo-Segel, SEHR sparsam */
  --th-gray-soft:        #F0F0F0;  /* Grau - Backgrounds, Card-Flaechen */
  --th-white:            #FFFFFF;  /* Ruhigeflaechen */
  --th-ink:              #111111;  /* Text/Icons auf hell - NICHT #1E293B! */

  /* ERWEITERTE TOKENS (aus globals.css) */
  --th-navy-dark:        #142849;  /* Header-BG, Footer */
  --th-navy-light:       #294a7a;  /* Sidebar Active, Hover */
  --th-sky-light:        #6EC3DE;  /* Hover States */
  --th-sky-dark:         #3092B2;  /* Pressed States */
  --th-neon:             #D4FF00;  /* Extremsparsam - nur sehr gezielt */
}
```

### 2.2 Tailwind-Klassen-Mapping

| Klasse | Hex | Verwendung |
|--------|-----|------------|
| `bg-brand-navy` | `#1D3661` | Header, Sidebar, Primary Buttons |
| `bg-brand-sky` | `#3BA9D3` | Secondary Buttons, Badges, Akzente |
| `bg-brand-gray` | `#F0F0F0` | Seiten-BG, Card Hover |
| `bg-brand-red` | `#CE132D` | NUR Logo-Bereich, Notifications-Badge |
| `text-brand-navy` | `#1D3661` | Ueberschriften h1-h3 |
| `text-brand-sky` | `#3BA9D3` | Links, Akzente |
| `text-brand-ink` | `#111111` | Fliesstext auf hellem Grund |
| `bg-brand-lime` | `#AFCA05` | WARNUNG: NUR Aktiver Nav-Link, Status-Dot |
| `text-brand-lime` | `#AFCA05` | VERBOTEN fuer Fliesstext (Kontrast ungenuegend!) |

### 2.3 WCAG-AA Kontrastpaare (Pflicht)

```
OK  #FFFFFF  auf #1D3661  -> Ratio 7.7:1   (Ueberschriften auf Navy)
OK  #FFFFFF  auf #3BA9D3  -> Ratio 2.5:1   (Nur fuer grosse Bold-Texte)
OK  #111111  auf #FFFFFF  -> Ratio 18.1:1  (Body-Text auf Weiss)
OK  #111111  auf #F0F0F0  -> Ratio 15.9:1  (Body-Text auf Grau)
OK  #1D3661  auf #AFCA05  -> Ratio 5.1:1   (Aktiver Nav-Text auf Lime)
NOK #FFFFFF  auf #AFCA05  -> Ratio 1.5:1   (NIEMALS! Schlechter Kontrast)
NOK #111111  auf #CE132D  -> Ratio 3.8:1   (Nur fuer grosse Elemente)
```

### 2.4 Semantische Zustands-Tokens (Gamification Levels)

```css
--xp-color-matrose:         #64748B;  /* Silber-Grau */
--xp-color-steuermann:      #3BA9D3;  /* Sky */
--xp-color-kapitan:         #1D3661;  /* Navy */
--xp-color-kommandant:      #7B5EA7;  /* Violett */
--xp-color-flottenkapitan:  #E07B30;  /* Orange */
--xp-color-kommodore:       #C8202E;  /* Rot */
--xp-color-admiral:         #C9A227;  /* Gold */
```

---

## 3. Typografie (Brandbook Kap. 5 + Website-HTML Audit)

### 3.1 Font-Stack

```
BRANDBOOK-FONT:  Panton (Fontfabric) - lizenzpflichtig via MyFonts
                 Panton-Regular (400), Panton-Bold (700), Panton-ExtraBold (800)
                 Geladen auf thitronik.de via MyFonts Build ID 3886098

CAMPUS APP:      Aktuell Geist Sans (Next.js default, layout.tsx)
                 -> SOLL: Panton via local font (wenn Lizenz vorhanden)
                 -> FALLBACK: Nunito (Google Fonts, Panton-aehnlich) oder Inter

FALLBACK-KETTE:  'Panton', 'Nunito', 'Inter', system-ui, 'Segoe UI', Arial
MONO:            Geist Mono (fuer Code, IDs, Fehlercodes)
```

### 3.2 Typografische Hierarchie (Brandbook Kap. 5.2)

```css
/* GEWICHTE */
--fw-regular:   400;   /* Body-Text */
--fw-semibold:  600;   /* Subheadings, Labels */
--fw-bold:      700;   /* Buttons, Nav, H3 */
--fw-extrabold: 800;   /* H1, Hero-Headlines */

/* SKALIERUNG (Desktop -> Mobile) */
/* H1: weight 800, Desktop: 44-52px, Mobile: 30-36px, line-height: 1.10-1.20 */
/* H2: weight 700, Desktop: 32-40px, Mobile: 24-28px, line-height: 1.15-1.25 */
/* H3: weight 700, Desktop: 24-28px, Mobile: 20-22px, line-height: 1.20-1.30 */
/* Body: weight 400/600, 16-18px, Mobile: 16px, line-height: 1.50-1.65 */
/* Caption: weight 400, 12-14px, Mobile: 12-13px, line-height: 1.40-1.50 */
/* Button: weight 700, 14-16px, line-height: 1.00 */

/* AKTUELLE CSS BASELINE (globals.css) */
/* h1 -> text-3xl font-extrabold tracking-tight text-brand-navy */
/* h2 -> text-2xl font-bold tracking-tight text-brand-navy */
/* h3 -> text-xl font-bold text-brand-navy */
```

---

## 4. Layout, Raster & Spacing (Brandbook Kap. 6)

### 4.1 Grid

```
Desktop:   12 Spalten, max-content: 1200-1280px (App: max-w-[1400px])
Tablet:    8 Spalten
Mobile:    4 Spalten
Aussenrand: 48-64px (Desktop), 16-24px (Mobile)
```

### 4.2 Spacing (4px-Basis-Grid)

```css
--space-1:  4px    --space-2:  8px    --space-3: 12px   --space-4:  16px
--space-5: 24px    --space-6: 32px    --space-7: 48px   --space-8:  64px
/* Tailwind: p-1=4px, p-2=8px, p-4=16px, p-6=24px, p-8=32px, p-12=48px, p-16=64px */
```

### 4.3 Border Radius - KORRIGIERT aus Brandbook Kap. 6.3!

```css
/* BRANDBOOK-WERTE (verbindlich!) */
--radius-card:        24px;   /* Cards, Content-Boxen - NICHT 12px! */
--radius-tile:        16px;   /* Kacheln, kleinere Cards */
--radius-button-soft: 16px;   /* Standard-Buttons */
--radius-button-pill: 999px;  /* Pill-Buttons, Badges, Tags */
--radius-icon:        16px;   /* Icon-Container (16-20px je nach Groesse) */
--radius-input:       8px;    /* Form-Inputs */

/* Tailwind: rounded-3xl=24px (Cards!), rounded-2xl=16px (Tiles), rounded-full (Pills) */
/* ACHTUNG: Der aktuelle Code nutzt --radius: 0.75rem (12px) - CI-ABWEICHEND! */
/* Cards MUESSEN rounded-3xl sein, nicht rounded-xl! */
```

---

## 5. Das Hexagon-Motiv (aus Website HTML - WICHTIG)

Das Hexagon ist das ikonischste UI-Element auf thitronik.de.
Jede Ikone, jeder CTA-Pfeil, jeder Service-Button sitzt in einem Hexagon-Hintergrund.

```tsx
/* HEXAGON SVG SYMBOLS (aus website HTML) */
// symbol-hexagon-fill     -> gefuelltes Hexagon (Hintergrund)
// symbol-hexagon-outline  -> Hexagon-Outline (Hover-Zustand)

/* EINSATZ: TeaserLink-Pattern (thitronik.de CTAs) */
// <a class="TeaserLink">
//   <svg use="#symbol-teaser-arrow" />    Pfeil-Icon
//   <svg use="#symbol-hexagon-outline" /> Outline (normal)
//   <svg use="#symbol-hexagon-fill" />    Fill (hover)
//   <span>Zum Produkt</span>
// </a>

/* SERVICE NAVIGATION ICONS: Icon + Hexagon-BG */
// <span class="ServiceNavigation-icon">
//   <svg use="#symbol-gears" />           Zahnrad-Icon
//   <svg use="#symbol-hexagon-fill" />    Hexagon-BG in --th-blue-primary
// </span>

/* Im Campus: Hexagon fuer Badge-Hintergruende, Gamification-Icons verwenden */
/* Level-Badges koennen als Hexagon-Shape designed werden */
```

---

## 6. Der Weiche Bogen - Signature-Keyvisual (Brandbook Kap. 7)

Das praegnanteste visuelle Merkmal der THITRONIK-CI. Erscheint als:
- **Hero-Bogen:** Kurve zwischen Header-BG und Content
- **Footer-Bogen:** Grosser geschwungener SVG-Teiler
- **Card-Rahmen:** Alle Cards mit grosszuegigem Radius (24px)

```tsx
/* HERO-BOGEN (aus thitronik.de HTML) */
// <svg viewBox="0 0 1600 331" preserveAspectRatio="xMidYMin slice">
//   <path d="M0,330 L0.09,0 L1600,0 C1009,28 392,115 0,330 Z" />
// </svg>

/* FOOTER-BOGEN */
// <svg viewBox="0 0 1600 500">
//   <path fill-rule="evenodd"
//     d="M0 500h1600V0C995 79.5 361 225.4 0 492V500z"/>
// </svg>
```

**REGELN (Brandbook 7.2 - VERBINDLICH)**

```
VERBOTEN: 90-Grad-Ecken in Cards oder Illustrationen
VERBOTEN: Zickzack-Kanten, harte Diagonalen
VERBOTEN: Neon-Glows, harte Farbverlaeufe
VERBOTEN: "wellige" Verlaeufe (max. 1 Haupt-Kurve pro Achse)
PFLICHT:  Alle Kanten gerundet (radius 24px fuer Cards)
PFLICHT:  Kurven "gezogen", nicht "geknautscht"
PFLICHT:  Mindestens 30-40% Negative Space
PFLICHT:  Ein klarer Fokuspunkt pro Komposition
PFLICHT:  Linien immer mit Round Caps + Round Joins
```

---

## 7. UI-Komponenten (Brandbook Kap. 7.1 + repo Code)

### 7.1 Buttons

```tsx
/* PRIMARY (1x pro Screen/Modul!) */
// bg: --th-blue-primary (#1D3661), text: white
// border-radius: 16px (button-soft) oder 999px (pill)
// font-weight: 700, font-size: 14-16px
// hover: leicht aufhellen (navy-light #294a7a)
<Button className="bg-brand-navy text-white font-bold rounded-2xl px-6 py-3 hover:bg-[#294a7a] transition-colors">
  Kurs starten
</Button>

/* SECONDARY (Outline) */
// border: 2px solid --th-blue-secondary, text: secondary
<Button variant="outline" className="border-2 border-brand-sky text-brand-sky rounded-2xl font-bold">
  Mehr erfahren
</Button>

/* GHOST (in dunklen Bereichen - Header, Sidebar) */
<Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl" />

/* TERTIARY (Link) */
// text: --th-blue-primary, underline NUR on-hover
<button className="text-brand-navy font-medium hover:underline" />

/* accent-bar-left PATTERN (aus App-Shell) */
/* Gradient-Balken links: linear-gradient(180deg, #3BA9D3, #AFCA05) */
/* Klasse: .accent-bar-left - fuer Action-Buttons auf dunklem BG */
```

### 7.2 Cards (KORRIGIERT - Radius 24px!)

```tsx
/* STANDARD CARD */
<Card className="bg-white border border-[#E2E8F0] rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:border-[rgba(175,202,5,0.3)] transition-all hover:-translate-y-1 hover:scale-[1.015]" />

/* DARK CARD (auf Navy-BG) */
<Card className="bg-[#294a7a]/60 border border-white/10 rounded-3xl backdrop-blur-sm" />

/* INSEL-CARD (Island Hopping) */
/* Border-left: 4px solid [island.color] */
/* Rounded: 12px (kleinere Panels) */

/* HERO-CARD */
/* border-radius: 32px (uebergrosse Karten) */
```

### 7.3 Forms

```
- Label ueber Feld (NIEMALS placeholder als Ersatz)
- Helper-Text kurz, handlungsorientiert
- Fehlertexte sachlich: "Bitte E-Mail eingeben." - kein Schuldigweise
- Touch Targets: min. 44px Hoehe (WCAG)
- Fokus: sichtbare Outline (ring-brand-sky), nicht nur Farbwechsel
- rounded-xl fuer alle Inputs (8px Radius aus Base-input Pattern)
```

---

## 8. Icon-System (Brandbook Kap. 8)

```
STIL:         Outline, 2px Stroke, einfarbig (ink #111111 oder --th-blue-primary)
LIBRARY:      Lucide React (im App-Code) - EINZIGE erlaubte Icon-Library
WEBSITE:      Inline SVG Symbols (hexagon-fill, hexagon-outline, area-alarm etc.)
HEXAGON-BG:   Fuer Service-Icons, Level-Badges, Feature-Cards
VERBOTEN:     Neon-Glow-Effekte, farbige Multi-Tone Icons, ueberladene Deko
ICON-CONTAINER-RADIUS: 16-20px (je nach Groesse)
```

---

## 9. Animation & Motion (Brandbook Kap. 10 + lib/motion.ts)

```css
/* CSS TOKENS (globals.css) */
--duration-instant: 100ms;  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast:    150ms;  --ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);
--duration-normal:  200ms;  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-slow:    300ms;
--duration-slower:  500ms;

/* BRANDBOOK VORGABEN */
/* UI-Interaktionen:   150-250ms (kein Sprung, kein Bounce) */
/* Modul-Transitions:  300-500ms (weich, easing) */
/* Loading:            mit Status-Kontext (kein endloser Spinner) */
/* Reduced Motion:     @media (prefers-reduced-motion: reduce) -> Variante reducedMotion */
```

```typescript
// FRAMER MOTION (lib/motion.ts + lib/variants.ts)
import { duration, ease, spring } from '@/lib/motion';
import { fadeIn, slideUp, scaleIn, staggerContainer } from '@/lib/variants';

// Standard Page Transition:
// initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
// transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}

// Stagger Children:
// { staggerChildren: 0.05 }  // NIEMALS mehr als 0.1!

// Spring Presets:
// spring.snappy = { type: "spring", stiffness: 300, damping: 25 }
// spring.gentle = { type: "spring", stiffness: 200, damping: 20 }
```

---

## 10. CSS Utility Classes (globals.css)

```css
/* STATUS-DOT (EINZIGE erlaubte Lime-Flaeche!) */
.status-dot { width:8px; height:8px; border-radius:50%; background:#AFCA05; }

/* CARD HOVER */
.hover-lift:hover { transform: translateY(-3px) scale(1.015);
                    box-shadow: 0 8px 25px rgba(175,202,5,0.08); }
.card-glow:hover  { border-color: rgba(175,202,5,0.3) !important; }

/* ACCENT BAR (linker Gradient-Balken fuer Action-Buttons auf Dark-BG) */
.accent-bar-left::before {
  content:''; position:absolute; left:0; top:15%; bottom:15%; width:4px;
  background: linear-gradient(180deg, #3BA9D3, #AFCA05); border-radius:0 4px 4px 0;
}

/* ANIMATIONEN */
.animate-fade-in  { animation: fade-in 0.4s ease-out both; }
.animate-slide-up { animation: slide-up 0.5s ease-out both; }
.thin-scrollbar::-webkit-scrollbar       { width:5px; }
.thin-scrollbar::-webkit-scrollbar-thumb { background: #3BA9D3; border-radius:3px; }

/* SCHEDULE (Event-Termine Komponente) */
.schedule-pulse { animation: schedule-pulse 1.8s ease-in-out infinite; }
.schedule-glow  { animation: schedule-glow 3s ease-in-out infinite; }

/* THEATER/FULLSCREEN (html[data-fullscreen="true"]) */
/* versteckt header, nav, footer, aside, .app-shell-sidebar */
```

---

## 11. CTA-System (Brandbook Kap. 2.5 - Verbindlich)

**PRIMARY CTAs (je 1x pro Screen/Modul!):**
- "Kurs starten"
- "Einbaupartner finden"
- "System konfigurieren"
- "Zertifikat herunterladen"
- "Kompatibilitaet pruefen"

**SECONDARY CTAs:**
- "Mehr erfahren"
- "Technische Daten"
- "Anleitung oeffnen"
- "Ratgeber lesen"
- "Zum Produkt"

**MICROCOPY (App-Zustaende):**
```
"Verbunden" | "Getrennt" | "Aktiv" | "Inaktiv"
"Batterie niedrig" | "Update verfuegbar"
```

**FEHLERTEXTE (sachlich, handlungsorientiert):**
```
"Keine Verbindung. Bitte Bluetooth aktivieren."
"Modul nicht gefunden. Pruefe die Stromversorgung."
"Zugriff nicht moeglich. Berechtigung in Einstellungen pruefen."
```

---

## 12. Projektstruktur (Repo-Audit)

```
src/
+-- app/[locale]/
|   +-- globals.css           <- ALLE CI-Tokens (hier wird korrigiert)
|   +-- layout.tsx            <- Font-Loading (aktuell Geist, SOLL Panton/Nunito)
|   +-- page.tsx              <- Dashboard (EventSchedule + Quick Actions)
|   +-- modules/              <- "Die 7 Inseln" (Island Hopping Map)
|   +-- module/[id]/          <- Insel-Detail
|   +-- games/                <- Spiele (Kahoot, Mentimeter, Miro, Memory, etc.)
|   |   +-- was-bin-ich/      <- Produkt-Ratespiel + XP
|   +-- tools/                <- Arbeitskarte, Notizen, Feedback, Kundenbogen
|   +-- certificates/         <- Zertifikate (PremiumBackground)
|   +-- community/            <- Chat
|   +-- ansprechpartner/      <- Kontakte
|   +-- profile/              <- User-Profil
|   +-- admin/                <- Nur role: 'admin'
|   +-- manager/              <- CMS Editor, role: 'manager'+'admin'
|   +-- thi/                  <- THI AI Chatbot
|   +-- qr-checkin/           <- QR-Scanner Check-in
+-- components/
|   +-- ui/                   <- shadcn/ui (NUR hier importieren!)
|   |   +-- logo.tsx          <- THITRONIK(R) SVG Logo
|   +-- layout/
|   |   +-- app-shell.tsx     <- Header + Nav + Footer
|   |   +-- premium-background.tsx
|   |   +-- fullscreen-toggle.tsx
|   +-- auth/role-guard.tsx
|   +-- dashboard/
|   |   +-- event-schedule.tsx
|   |   +-- qr-scanner-card.tsx
|   +-- gamification/
|   |   +-- xp-popup.tsx
|   |   +-- level-badge.tsx
|   |   +-- leaderboard.tsx
|   |   +-- treasure-map.tsx
|   |   +-- daily-challenge.tsx
|   +-- interactive/          <- Drag-Drop-Quiz, Hotspot, Kahoot, Mentimeter, Miro
|   +-- tools/                <- Find-Error, Memory, Order-Quiz, Handwriting-Canvas
+-- store/
|   +-- auth-store.ts         <- AuthUser + Demo-Accounts + Supabase
|   +-- user-store.ts         <- XP/Level (Matrose->Admiral) + Zustand
+-- lib/
|   +-- motion.ts             <- duration/ease/spring Tokens
|   +-- variants.ts           <- fadeIn, slideUp, scaleIn, staggerContainer
|   +-- utils.ts              <- cn() (clsx + tailwind-merge)
+-- types/cms.ts              <- CmsBlock, CmsBlockType, IslandContent
```

---

## 13. Auth, Rollen & Demo-Accounts

```typescript
type UserRole = 'admin' | 'manager' | 'user';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  company: string;
  dealerId: string;
  role: UserRole;
  region: string;
  avatar?: string;
}

// DEMO ACCOUNTS (NEXT_PUBLIC_DEMO_MODE=true):
// admin@thitronik.de   / admin   -> Admin, THITRONIK GmbH, DACH
// manager@autohaus.de  / manager -> Manager, Caravan Center Kiel
// max@autohaus.de      / demo    -> User, Autohaus Mustermann GmbH

// HELPERS:
// import { isAdmin, isManager, hasRole } from '@/store/auth-store';

// SEITENSCHUTZ:
// <RoleGuard requiredRole="user">   // user | manager | admin
```

---

## 14. Gamification (Nautisches Thema)

```typescript
// LEVEL-SYSTEM (Zustand Store, user-store.ts):
const LEVELS = [
  { name: 'Matrose',        min: 0    },
  { name: 'Steuermann',     min: 200  },
  { name: 'Kapitaen',       min: 700  },
  { name: 'Kommandant',     min: 1500 },
  { name: 'Flottenkapitaen',min: 3000 },
  { name: 'Kommodore',      min: 5000 },
  { name: 'Admiral',        min: 8000 },
];

// XP vergeben (loest automatisch Offline-Queue + XP-Popup aus):
// useUserStore.getState().addXp(50);

// PERSIST: localStorage 'thitronik-user-storage'
```

---

## 15. Die 7 Inseln - Island Hopping Konzept

Jede Insel = Schulungsraum im THITRONIK-Gebaeude Eckernfoerde.
Reihenfolge: vejro -> poel -> hiddensee -> samso -> langeland -> usedom -> fehmarn

```typescript
const ISLANDS = [
  { id:'vejro',    name:'Vejroe',    room:'N-OG-101', building:'Neubau OG',
    color:'#4AADCE', x:52, y:12,
    tagline:'WiPro III - Das intelligente Alarmsystem' },
  { id:'poel',     name:'Poel',      room:'N-EG-101', building:'Neubau EG',
    color:'#1a6fa0', x:18, y:30,
    tagline:'Haendlerbereich - Alles auf einen Blick' },
  { id:'hiddensee',name:'Hiddensee', room:'N-EG-102', building:'Neubau EG',
    color:'#7B5EA7', x:30, y:52,
    tagline:'Montage Funk-Magnetkontakte' },
  { id:'samso',    name:'Samso',     room:'A-EG-101', building:'Altbau EG',
    color:'#E07B30', x:72, y:38,
    tagline:'Basisfahrzeuge & Gaswarner' },
  { id:'langeland',name:'Langeland', room:'A-EG-102', building:'Altbau EG',
    color:'#2E8B57', x:20, y:72,
    tagline:'Fahrzeuguebergabe - Professionell & Lueckenlos' },
  { id:'usedom',   name:'Usedom',    room:'A-OG-101', building:'Altbau OG',
    color:'#C8202E', x:78, y:65,
    tagline:'Konfigurator & Display - Mehr Umsatz' },
  { id:'fehmarn',  name:'Fehmarn',   room:'A-OG-102', building:'Altbau OG',
    color:'#1a6fa0', x:55, y:78,
    tagline:'Fehleranalyse & FAQ - Schnelle Hilfe im Support' },
];

// INSEL-MAP: Ocean-Gradient BG + animierte SVG-Wellen + Dot-Grid
// SIDE-PANEL: oeffnet sich bei Klick, 480px breit, border-left: 4px solid [island.color]

type SectionType =
  'compare' | 'cards' | 'appfeatures' | 'portal' | 'steps' |
  'mistakes' | 'vehicles' | 'gasdetectors' | 'checklist' |
  'tips' | 'configurator' | 'display' | 'faq' | 'errors';
```

---

## 16. i18n (next-intl 4.8.3)

```typescript
// SPRACHEN: DE, EN, FR | Routen: /de/... /en/... /fr/...
// ALLE Strings in messages/de.json + en.json + fr.json
// Navigation-Keys: campus | islands | games | tools | certificates | profile | logout

// MEHRSPRACHIGKEIT BRANDBOOK (verbindlich):
// Produktnamen NIEMALS uebersetzen: WiPro III, Pro-finder(R), G.A.S.-pro III
// FR: konsequent "tu"-Form (nicht "vous")
// CZ wird in Campus nicht aktiv unterstuetzt (nur DE/EN/FR)

// LOCALE WECHSEL:
// router.replace(pathname, { locale: 'en' });
```

---

## 17. DSGVO & PWA

```
HOSTING:     Deutschland (Vercel EU oder Hetzner)
ANALYTICS:   Matomo self-hosted (KEIN Google Analytics)
VIDEOS:      Vimeo (DSGVO-konform) mit 2-Klick-Loesung (wie thitronik.de)
COOKIES:     Nur technisch notwendige ohne Einwilligung
PWA:         manifest.json + next-pwa + idb (Offline-Queue)
QR-SCANNER:  html5-qrcode (Camera API)
```

---

## 18. KRITISCHE CI-KORREKTUREN (Abweichungen vom aktuellen Code)

```
FARBEN (globals.css):
  VORHER: --foreground: #1E293B
  NACHHER: --foreground: #111111   <- Brandbook: ink = #111111

  VORHER: --radius: 0.75rem        <- 12px - zu klein fuer CI
  NACHHER: --radius: 1.5rem        <- 24px - Brandbook: Card-Radius = 24px

TYPOGRAFIE (layout.tsx):
  VORHER: Geist Sans (Google Font Standard)
  NACHHER: Panton (licensed) ODER Nunito (Google, Panton-aehnlich) als Fallback

CARDS (Components):
  VORHER: rounded-xl (12px)        <- bisherige Nutzung
  NACHHER: rounded-3xl (24px)      <- Brandbook: "Cards: 24px" - verbindlich!

LIME-NUTZUNG:
  VORHER: bg-brand-lime als CTA-Highlight
  NACHHER: bg-brand-lime NUR fuer Aktiv-State  <- Brandbook: sehr sparsam

BUTTONS:
  VORHER: rounded-lg (12px Radius)
  NACHHER: rounded-2xl (16px = button-soft) oder rounded-full (pill)
```

---

## 19. Agenten-Regeln - Zusammenfassung

### DO (Pflicht)

- `cn()` aus `'@/lib/utils'` fuer ALLE Tailwind-Klassen
- `rounded-3xl` fuer Cards (24px - Brandbook!)
- `rounded-2xl` oder `rounded-full` fuer Buttons (16px oder Pill)
- `text-[#111111]` fuer Fliesstext (nicht `#1E293B`!)
- Hexagon-Motiv fuer Service-Icons, Level-Badges einsetzen
- `PremiumBackground` fuer Haupt-Seiten (Dashboard, Certificates, Games)
- `<RoleGuard requiredRole="...">` fuer alle geschuetzten Seiten
- Alle Texte in `messages/de.json` (keine hardcodierten DE-Strings)
- Framer Motion Variants aus `'@/lib/variants'` wiederverwenden
- Lucide React als einzige Icon-Library
- Panton/Nunito Font fuer neue UI-Elemente (nicht Inter/Geist!)
- `addXp()` nach abgeschlossenen Lerneinheiten/Quiz

### DON'T (Verboten)

- NIEMALS `#CE132D` (Rot) als allgemeine Akzentfarbe - NUR Logo-Segel!
- NIEMALS `#AFCA05` (Lime) als Fliesstext oder Flaechen-BG
- NIEMALS 90-Grad-Ecken in Cards oder Illustrations (weicher Bogen!)
- NIEMALS `rounded-xl` fuer Cards (zu klein - 12px ist falsch)
- NIEMALS Inline-Styles fuer statische CSS-Werte
- NIEMALS andere Icon-Libraries als Lucide React
- NIEMALS direkte Radix-UI-Imports (immer via shadcn/ui)
- NIEMALS hardcodierte deutsche Strings in JSX
- NIEMALS "Kiel" als Standort (IMMER "Eckernfoerde"!)
- NIEMALS Produktnamen uebersetzen oder veraendern
- NIEMALS "100% sicher", "garantiert", "einzigartig" schreiben
- NIEMALS mehr als 1 Primary CTA pro Screen/Modul

---

## Produktnamen - Exakte Schreibweise (verbindlich!)

| Produktname | Regel |
|-------------|-------|
| `THITRONIK(R)` | Grossbuchstaben + (R) |
| `WiPro III safe.lock(R)` | CamelCase + (R) |
| `WiPro III` | ohne safe.lock wenn allgemein |
| `Pro-finder(R)` | Bindestrich + (R) |
| `G.A.S.-pro III` | mit Punkten und Bindestrich |
| `G.A.S.-pro III CO` | CO-Variante |
| `NFC Modul` | NFC Grossbuchstaben, Modul normal |
| `Campus 2.0` | mit Leerzeichen + Punkt |
| `Island Hopping` | Gross, beide Woerter |

---

## 20. Figma Token-Mapping (MCP Integration)

| Figma Variable | CSS Custom Property | Tailwind Klasse |
|----------------|---------------------|-----------------|
| Brand/Navy/Primary | `--th-blue-primary` (`#1D3661`) | `bg-brand-navy` |
| Brand/Sky/Secondary | `--th-blue-secondary` (`#3BA9D3`) | `bg-brand-sky` |
| Brand/Lime/Accent | `--th-accent-lime` (`#AFCA05`) | `bg-brand-lime` |
| Brand/Red/Brand | `--th-red-brand` (`#CE132D`) | `bg-brand-red` |
| Brand/Gray/Soft | `--th-gray-soft` (`#F0F0F0`) | `bg-brand-gray` |
| Brand/Ink | `--th-ink` (`#111111`) | `text-brand-ink` |
| Radius/Card | `24px` | `rounded-3xl` |
| Radius/Tile | `16px` | `rounded-2xl` |
| Radius/Button | `16px oder 999px` | `rounded-2xl / rounded-full` |
| Spacing/4px | `4px base grid` | `Tailwind p-1...p-16` |
| Shadow/Card | `0 4px 24px rgba(0,0,0,0.08)` | `shadow-[var(--shadow-card)]` |
| Font/Display | `Panton ExtraBold 800` | `font-extrabold` |
| Font/Heading | `Panton Bold 700` | `font-bold` |
| Font/Body | `Panton Regular 400` | `font-normal` |
