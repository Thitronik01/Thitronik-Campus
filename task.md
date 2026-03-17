# THITRONIK Campus 2.0 PWA – Aufgaben

... [Inhalt der vorherigen Phasen gekürzt für Übersicht] ...

## AE. Insel-Overhaul (High-Fidelity Map)
- [x] Implementierung der neuen interaktiven Karte mit Side-Panel.
- [x] Implement BroadcastChannel sync and storage logic <!-- id: 21 -->
- [x] Add multiple question types (Choice, Cloud, Open, Rating) <!-- id: 22 -->
- [x] Integration der detaillierten Schulungsinhalte (WiPro III, Händlerportal, etc.) pro Insel.
- [x] Anpassung an das Projekt-Layout (RoleGuard, Navigation).
- [x] Verifizierung der Responsivität und Interaktivität (Pfade, Panels).

## AF. UI Refinement: Header Navigation Size
- [x] Vergrößerung der Schriftart für die Hauptnavigation im Header (`app-shell.tsx`).
- [x] Anpassung sowohl für Desktop- als auch für Mobile-Ansicht.
- [x] Verifizierung der visuellen Balance im Header.

## AG. UI Refinement: Navigation Active Highlight
- [x] Ändern der Hintergrundfarbe für aktive Navigationslinks von Grau/Weiß auf Neon-Grün (`brand-lime`).
- [x] Anpassung der Textfarbe im aktiven Zustand für optimalen Kontrast (Dunkelblau).
- [x] Konsistente Umsetzung für Desktop (Links) und Mobile (Drawer).

## AH. New Section: Tools & Digital Work Card
- [x] Rename der bestehenden `/tools` Route zu `/games`.
- [x] Erstellung der neuen `/tools` Seite für Produktivitäts-Werkzeuge.
- [x] Implementierung der "Digitalen Arbeitskarte" (Subpage/Komponente).
- [x] Update der `AppShell` Header-Navigation (Campus, Inseln, Games, Tools, Zertifikate, THI).
- [x] Dokumentation und Verifizierung.

## AI. High-Fidelity Digital Work Card (Gestaffelt)
- [x] Stufe 1: Imports und Fahrzeug-Konstanten (`VEHICLE_IMGS`).
- [x] Stufe 2: Sub-Komponenten (`AuditLog`, `VehicleCanvas`, `TaskSection`).
- [x] Stufe 3: Haupt-Komponente und State-Management.
- [x] Stufe 4: UI-Feinschliff und Validierung.

## AJ. Fix Games Route 404
- [x] Analyse der Verzeichnisstruktur und Planung der Migration.
- [x] Verschieben der Spiel-Directories (`memory`, `order`, etc.) von `/tools` nach `/games`.
- [x] Build Host and Participant views <!-- id: 23 -->
- [x] Verify real-time sync in browser <!-- id: 24 -->
- [x] Aktualisierung interner Links in den Spiel-Komponenten.
- [x] Verifizierung der `/games` Route.

## AK. Restore Games Functionality
- [x] Erfolgreiche Migration aller Spiel-Verzeichnisse mittels `robocopy`.
- [x] Aktualisierung der `page.tsx` Dateien (Back-Links, i18n, Dark-Theme).
- [x] Anpassung der `AppShell` für Fullscreen-Routen (`/games/miro` etc.).
- [x] Bereinigung des `/tools` Verzeichnisses.

## AL. Login Page Fixes
- [x] Implementierung der "Passwort vergessen"-Funktion (UI Feedback).
- [x] Styling-Fix für "User" Badge (Neon-Grün).
- [x] Verifizierung der Änderungen.

## AM. Was bin ich? – Produkt-Quiz Game
- [x] Produktdaten (`products.ts`) mit 8 Thitronik-Produkten, je 5 Hinweisen, Fun Facts.
- [x] Zustand-Store (`wasBinIchStore.ts`) mit Runden-/XP-/Versuchs-Logik.
- [x] 6 Client-Komponenten: HinweisCard, GuessInput, XPBurst, ProductReveal, ResultScreen, WasBinIchGame.
- [x] Neue Route `app/[locale]/games/was-bin-ich/page.tsx`.
- [x] Game-Card in Games-Übersicht eingefügt.
- [x] i18n-Strings für DE/EN/FR hinzugefügt (`games.wasBinIch.*`).
- [x] Build-Kompilierung erfolgreich, Browser-Test bestanden.
