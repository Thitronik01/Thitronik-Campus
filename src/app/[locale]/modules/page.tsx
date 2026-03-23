"use client";

import { useState, useEffect, useRef } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ══════════════════ CI ══════════════════ */
const CI = {
    navy: '#003470', navyD: '#001f50', navyL: '#0a4a90',
    blue: '#4AADCE', blueL: '#7ECFE0', blueXL: '#c8eaf5', blueOcean: '#b8dff0',
    oceanBg: '#cce8f4', oceanDeep: '#a8d4e8',
    red: '#C8202E', redL: '#e83040',
    white: '#ffffff', light: '#f0f7fb', light2: '#ddeef6',
    green: '#4CAF50', greenL: '#81C784',
    text: '#001830', textM: '#2a4060', textL: '#5a7090',
};

/* ══════════════════ ISLAND POSITIONS (% of map) ══════════════════ */
const ISLANDS = [
    {
        id: 'vejro', name: 'Vejrø', room: 'N-OG-101', building: 'Neubau OG',
        color: '#4AADCE', emoji: '⚓', x: 52, y: 12,
        tagline: 'WiPro III – Das intelligente Alarmsystem',
        sections: [
            {
                type: 'compare', title: 'WiPro III vs. Herkömmliche Systeme',
                rows: [
                    { feature: 'Alarmübertragung', wip: 'Funk + App-Push in Echtzeit', old: 'Sirene lokal / SMS-Modem' },
                    { feature: 'Fremdstartschutz', wip: 'Digital via safe.lock®', old: 'Relais / manuell' },
                    { feature: 'Konfiguration', wip: 'NFC & App, keine Kabel', old: 'Jumper / DIP-Schalter' },
                    { feature: 'Fahrzeugortung', wip: 'Pro-finder® GPS integriert', old: 'Separat nachrüsten' },
                    { feature: 'Gaswarner-Integration', wip: 'Nativ, automatische Abschaltung', old: 'Nicht möglich' },
                    { feature: 'OTA-Updates', wip: 'Over-the-Air direkt per App', old: 'Werkstatt erforderlich' },
                    { feature: 'Remote-Diagnose', wip: 'Händler sieht Systemstatus live', old: 'Vor-Ort-Termin nötig' },
                ],
            },
            {
                type: 'cards', title: 'Die vier Module im Überblick',
                items: [
                    { icon: '🔒', title: 'WiPro III Basis', desc: 'Vollalarm mit Sirene, Innensensor, 4 Zonenkreisen und Sabotageschutz.' },
                    { icon: '🛡️', title: 'WiPro III safe.lock®', desc: 'Digitaler Fremdstartschutz – verhindert unbefugtes Starten zuverlässig.' },
                    { icon: '📶', title: 'NFC-Modul', desc: 'Scharf-/Entschärfen per NFC-Chip oder Smartphone – ohne Code.' },
                    { icon: '📍', title: 'Pro-finder® GPS', desc: 'Ortung, Geofencing, Fahrzeugstilllegung – alles in der App.' },
                ],
            },
            {
                type: 'appfeatures', title: 'THITRONIK® App – Funktionen',
                features: [
                    { label: 'Alarmstatus', desc: 'Weltweit wissen ob das Fahrzeug gesichert ist.' },
                    { label: 'Push-Benachrichtigung', desc: 'Sofortiger Alarm auf dem Smartphone bei Einbruchversuch.' },
                    { label: 'GPS-Tracking', desc: 'Echtzeit-Position und Fahrtenhistorie.' },
                    { label: 'Fernstilllegung', desc: 'Motor per App sperren – bei Diebstahl oder Verdacht.' },
                    { label: 'Mehrere Nutzer', desc: 'Bis zu 5 Benutzer pro Fahrzeug (z. B. Familie).' },
                    { label: 'OTA-Updates', desc: 'Firmware-Updates direkt über die App einspielen.' },
                    { label: 'Remote-Diagnose', desc: 'Systemstatus für Händler einsehbar.' },
                ],
            },
        ],
    },
    {
        id: 'poel', name: 'Poel', room: 'N-EG-101', building: 'Neubau EG',
        color: '#1a6fa0', emoji: '🗂️', x: 18, y: 30,
        tagline: 'Händlerbereich – Alles auf einen Blick',
        sections: [
            {
                type: 'portal', title: 'Was finde ich wo? – Händlerportal',
                areas: [
                    {
                        area: '📦 Produktbereich', items: [
                            { path: 'Produkte → Aktuelles Sortiment', desc: 'Vollständige Produktliste mit EAN, Artikelnummer und Lieferstatus.' },
                            { path: 'Produkte → Neuheiten', desc: 'Alle Neuvorstellungen mit Launch-Datum.' },
                            { path: 'Produkte → Auslaufmodelle', desc: 'Ersatzteilversorgung und empfohlene Nachfolgemodelle.' },
                        ]
                    },
                    {
                        area: '💶 Preise & Konditionen', items: [
                            { path: 'Mein Konto → Preisliste', desc: 'Individuelle Händlerpreise als PDF oder Excel.' },
                            { path: 'Mein Konto → Sonderkonditionen', desc: 'Aktive Rabattaktionen und Staffelpreise.' },
                            { path: 'Mein Konto → Abrechnungen', desc: 'Alle Rechnungen der letzten 3 Jahre.' },
                        ]
                    },
                    {
                        area: '📄 Marketing', items: [
                            { path: 'Downloads → Prospekte', desc: 'Druckfertige PDFs in DE/EN nach Produktlinie.' },
                            { path: 'Downloads → Bilder & Logos', desc: 'Hochauflösende Produktbilder und CI-konforme Logos.' },
                            { path: 'Downloads → POS-Material', desc: 'Aufsteller, Flyer und Display-Materialien.' },
                        ]
                    },
                    {
                        area: '🛠️ Technik & Support', items: [
                            { path: 'Service → Montageanleitungen', desc: 'Alle Anleitungen als PDF, sortiert nach Produkt.' },
                            { path: 'Service → Firmware', desc: 'Aktuelle Firmware-Versionen und Release Notes.' },
                            { path: 'Service → Garantieabwicklung', desc: 'Online-Formular für Garantiefälle und RMA.' },
                        ]
                    },
                ],
            },
            {
                type: 'tips', title: '5 Tipps für den Händlerbereich',
                tips: [
                    { n: 1, tip: 'Merkliste nutzen – häufig benötigte Dokumente als Favoriten speichern.' },
                    { n: 2, tip: 'Preisliste quartalsweise herunterladen und im Team teilen.' },
                    { n: 3, tip: 'Garantieformular direkt nach dem Kundentermin ausfüllen.' },
                    { n: 4, tip: 'Newsletter abonnieren – Neuheiten kommen zuerst per Mail.' },
                    { n: 5, tip: 'Produktbilder immer aus dem Portal laden – stets aktuell und CI-konform.' },
                ],
            },
        ],
    },
    {
        id: 'hiddensee', name: 'Hiddensee', room: 'N-EG-102', building: 'Neubau EG',
        color: '#7B5EA7', emoji: '🔧', x: 30, y: 52,
        tagline: 'Montage Funk-Magnetkontakte – Schritt für Schritt',
        sections: [
            {
                type: 'steps', title: 'Montageanleitung Funk-Magnetkontakte', subtitle: 'WiPro III – Türen, Fenster, Dachluken',
                steps: [
                    { n: 1, title: 'Werkzeug & Material prüfen', desc: 'Funk-Magnetkontakt (Sender + Gegenmagnet), CR2032-Batterie, Reinigungsmittel, 3M-Klebeband, ggf. Bohrmaschine.', warn: null },
                    { n: 2, title: 'Montagepunkt wählen', desc: 'Magnet und Sensor max. 8 mm Abstand im geschlossenen Zustand. Ebene, fettfreie Fläche. Scharnierseite meiden.', warn: 'Nicht direkt auf Metall – Abstandshalter verwenden!' },
                    { n: 3, title: 'Oberfläche reinigen', desc: 'Mit Isopropanol entfetten, mind. 60 Sek. trocknen. Staub und Silikon vollständig entfernen.', warn: null },
                    { n: 4, title: 'Sender anbringen', desc: 'Schutzfolie entfernen. Sender (Teil mit Antenne) an den festen Rahmen kleben – nicht ans bewegliche Element.', warn: null },
                    { n: 5, title: 'Gegenmagnet positionieren', desc: 'Gegenmagnet ≤ 8 mm zum Sender anbringen. Auf aufgedruckte Pfeil-Markierung achten.', warn: 'Falsche Ausrichtung = Daueralarm!' },
                    { n: 6, title: 'Batterie einlegen & anlernen', desc: 'CR2032 polrichtig einlegen. LED blinkt 3× = Betrieb. Anlernmodus am WiPro III starten, Kontakt öffnen.', warn: null },
                    { n: 7, title: 'Funktion testen', desc: 'Tür öffnen und schließen – Zentrale muss jede Änderung korrekt anzeigen. Im Alarmtest verifizieren.', warn: null },
                    { n: 8, title: 'Dokumentieren', desc: 'Montagepunkt, Zonenbezeichnung und Seriennummer im Übergabeprotokoll vermerken.', warn: null },
                ],
            },
            {
                type: 'mistakes', title: 'Häufige Montagefehler',
                items: [
                    { icon: '❌', err: 'Zu großer Abstand', fix: '> 8 mm → Kontakt wird nicht erkannt. Immer nachmessen!' },
                    { icon: '❌', err: 'Auf Metall geklebt', fix: 'Metall dämpft Funksignal. Immer Kunststoff-Abstandshalter verwenden.' },
                    { icon: '❌', err: 'Seiten vertauscht', fix: 'Sender (Antenne) = Festrahmen. Magnet = bewegliche Seite.' },
                    { icon: '❌', err: 'Schwache Batterie', fix: 'Alte Batterien → Fehlauslösungen. Immer frische CR2032 verwenden.' },
                    { icon: '❌', err: 'Nicht angelernt', fix: 'Kontakt klebt, aber nicht angelernt → Zone reagiert nicht.' },
                ],
            },
        ],
    },
    {
        id: 'samso', name: 'Samsø', room: 'A-EG-101', building: 'Altbau EG',
        color: '#E07B30', emoji: '🚐', x: 72, y: 38,
        tagline: 'Basisfahrzeuge & Gaswarner – Praxiswissen',
        sections: [
            {
                type: 'vehicles', title: 'Fahrzeugklassen & Besonderheiten',
                items: [
                    {
                        type: 'Wohnmobil (Alkoven)', code: 'A-MOB', alarm: 'WiPro III + safe.lock®',
                        traits: ['Große Fahrzeughöhe → Innenraumsensor hoch platzieren', 'Hubbett über Fahrerkabine → Zusatzzone empfehlen', 'Dieselheizung → Gaswarner trotzdem Pflicht']
                    },
                    {
                        type: 'Kastenwagen (Van)', code: 'K-VAN', alarm: 'WiPro III Basis + NFC',
                        traits: ['Kompaktbauweise → WiPro III passt platzsparend', 'Schiebetür = Haupteinstieg → Magnetkontakt Zone 1', 'Wenig Einbauspace → NFC-Modul statt Bedienteil']
                    },
                    {
                        type: 'Caravan (gezogen)', code: 'C-CAR', alarm: 'WiPro III + Neigungssensor',
                        traits: ['Kein Bordnetz ständig → Alarmanlage mit Akku-Backup', 'Deichselangriff absichern → Neigungsalarm aktivieren', 'Keine Fahrsperre nötig (kein eigener Antrieb)']
                    },
                    {
                        type: 'Teilintegrierter', code: 'T-INT', alarm: 'WiPro III + Gaswarner DG-GA',
                        traits: ['Fahrerhaus oft separat gesichert', 'Wohnraumtür = kritische Zone → Magnetkontakt Zone 1', 'Gasanlage im Heck → Gaswarner unter Boden prüfen']
                    },
                ],
            },
            {
                type: 'gasdetectors', title: 'THITRONIK® Gaswarner – Welcher für wen?',
                products: [
                    { name: 'GS Basis', gas: 'LPG / Flüssiggas', mount: 'Bodennahe Montage ≤30cm', feature: 'Alarmsirene integriert', einsatz: 'Einstiegsmodell' },
                    { name: 'GS-Carbon', gas: 'CO + LPG kombiniert', mount: 'Mittig in Wandhöhe', feature: 'Zwei-Kanal-Sensor, LED-Anzeige', einsatz: 'Dieselheizung + Gaskocher' },
                    { name: 'DG-GA', gas: 'LPG / Propan / Butan', mount: 'Bodennahe Montage', feature: 'Gasventil-Ausgang, WiPro-kompatibel', einsatz: 'Integration WiPro III' },
                    { name: 'DG-CO', gas: 'CO / Kohlenmonoxid', mount: 'Atemhöhe 1,5 m', feature: 'Gasventil-Ausgang, WiPro-kompatibel', einsatz: 'Benzin-Standheizung / Kamin' },
                ],
            },
            {
                type: 'mistakes', title: 'Häufige Einbaufehler Gaswarner',
                items: [
                    { icon: '❌', err: 'Falsche Montagehöhe', fix: 'LPG schwerer → bodennah ≤30cm. CO leichter → Atemhöhe 1,5m.' },
                    { icon: '❌', err: 'Im Staufach eingebaut', fix: 'Kein Luftaustausch → Sensor reagiert zu langsam.' },
                    { icon: '❌', err: 'Kein Gasventil', fix: 'Alarm ertönt, aber Gas fließt weiter. DG-GA mit Magnetventil verbinden.' },
                    { icon: '❌', err: 'Zu nah am Herd', fix: 'Dampf/Hitze = Fehlalarm. Mindestabstand 1,5m zum Kochfeld.' },
                ],
            },
        ],
    },
    {
        id: 'langeland', name: 'Langeland', room: 'A-EG-102', building: 'Altbau EG',
        color: '#2E8B57', emoji: '🤝', x: 20, y: 72,
        tagline: 'Fahrzeugübergabe – Professionell & Lückenlos',
        sections: [
            {
                type: 'checklist', title: 'Übergabe-Checkliste WiPro III', subtitle: 'Punkt für Punkt am Fahrzeug',
                groups: [
                    { group: '🔌 Systemfunktion', items: ['Alarmanlage scharf schalten – LED blinkt grün', 'Alarmanlage entschärfen mit NFC-Tag oder App', 'Sirene kurz testen (Testmodus)', 'Push-Benachrichtigung auf Kunden-Smartphone testen', 'Alle Zonen einzeln auslösen und in App prüfen'] },
                    { group: '📍 Pro-finder GPS', items: ['GPS-Position in App anzeigen lassen', 'Fahrtenprotokoll aktiviert?', 'Geofencing eingerichtet? (optional)', 'Remote-Stilllegung erklären und demonstrieren'] },
                    { group: '🔑 NFC & Benutzer', items: ['Haupt-NFC-Tag übergeben und Funktion gezeigt', 'Ersatz-NFC-Tag übergeben (immer 2 Stück)', 'Kunden als Admin in App eingetragen', 'Optional: Familienmitglied als Zweitnutzer angelegt'] },
                    { group: '📋 Dokumentation', items: ['Seriennummer der Zentrale dokumentiert', 'Aktivierungscode sicher übergeben', 'Garantiekarte ausgefüllt und übergeben', 'Zonenplan im Fahrzeugordner hinterlegt'] },
                ],
            },
            {
                type: 'tips', title: '5 Tipps für die perfekte Übergabe',
                tips: [
                    { n: 1, tip: 'Übergabe immer mit geladenem Fahrzeug-Akku – Spannungsprobleme täuschen Systemfehler vor.' },
                    { n: 2, tip: 'App vor Ort installieren und einrichten – nicht per Anleitung nach Hause schicken.' },
                    { n: 3, tip: 'Beide NFC-Tags benennen (z. B. "Schlüsselbund" und "Ersatz im Handschuhfach").' },
                    { n: 4, tip: 'Foto von Zonenplan und Seriennummer in Servicedatenbank hinterlegen.' },
                    { n: 5, tip: 'Kunden nach 7 Tagen kurz anrufen – schnell geklärt, bevor es ein Garantiefall wird.' },
                ],
            },
        ],
    },
    {
        id: 'usedom', name: 'Usedom', room: 'A-OG-101', building: 'Altbau OG',
        color: '#C8202E', emoji: '💼', x: 78, y: 65,
        tagline: 'Konfigurator & Display – Mehr Umsatz im Gespräch',
        sections: [
            {
                type: 'configurator', title: 'Den Konfigurator verkaufsfördernd einsetzen',
                steps: [
                    { phase: '1. Bedarfsanalyse', icon: '🎯', content: '3 Fragen: Fahrzeugtyp? Reiseverhalten? Diebstahlrisiko? → Konfigurator sofort zuschneiden.' },
                    { phase: '2. Live-Demo', icon: '🖥️', content: 'Konfigurator auf Tablet gemeinsam öffnen. Kunden selbst klicken lassen – Eigenentscheidung = höhere Kaufbereitschaft.' },
                    { phase: '3. Pakete vergleichen', icon: '📊', content: 'Basis vs. Pro vs. Komplett. Preisdifferenz als Tageskosten darstellen: "2 Euro mehr pro Tag."' },
                    { phase: '4. Zusatzmodule', icon: '➕', content: 'NFC: "Kein Suchen nach Schlüsseln." Pro-finder: "Immer wissen wo das Fahrzeug steht." Gaswarner als Sicherheitspaket bündeln.' },
                    { phase: '5. Angebot senden', icon: '📄', content: 'PDF-Angebot am Ende generieren und direkt per Mail senden – mit Deiner Händler-Kontaktadresse.' },
                ],
            },
            {
                type: 'display', title: 'THITRONIK® Display – Einsatz am Kunden',
                scenarios: [
                    { title: 'Neukauf', icon: '🆕', desc: 'Display zeigt Alarmstatus visuell. Ideal für Kunden die "etwas sehen wollen". Zeigen: Scharf/Entschärfen, Zonenstatus, Akkuanzeige.' },
                    { title: 'Nachrüstung', icon: '🔄', desc: '"Endlich sehen Sie auf einen Blick ob alles sicher ist." Einbauzeit ca. 30 Minuten.' },
                    { title: 'Übergabe', icon: '🤝', desc: 'Display als Teachingtool – Kunde versteht Zonenstatus sofort visuell.' },
                    { title: 'Messe / POS', icon: '🏪', desc: 'Display-Demo am Tablet per Simulator. Aufmerksamkeitsmagnet am POS.' },
                ],
            },
        ],
    },
    {
        id: 'fehmarn', name: 'Fehmarn', room: 'A-OG-102', building: 'Altbau OG',
        color: '#1a6fa0', emoji: '🛠️', x: 55, y: 78,
        tagline: 'Fehleranalyse & FAQ – Schnelle Hilfe im Support',
        sections: [
            {
                type: 'faq', title: 'Häufig gestellte Fragen im Kundensupport',
                items: [
                    { q: 'Alarmanlage schlägt ständig Alarm ohne Grund.', a: '1. Innenraumsensor-Empfindlichkeit prüfen (P1–P3). 2. Neigungssensor – Fahrzeug auf ebenem Untergrund? 3. Fenster vollständig geschlossen? Zone im Protokoll prüfen. 4. Batteriestand Funk-Kontakte prüfen.' },
                    { q: 'App zeigt "Keine Verbindung".', a: '1. SIM-Karte aktiv und mit Datentarif? 2. Fahrzeug in Funkloch (Tiefgarage, Halle)? 3. App-Benachrichtigungen im Smartphone aktiviert? 4. Modul neustarten: Zündung aus, 30 Sek. warten.' },
                    { q: 'NFC-Tag funktioniert nicht mehr.', a: '1. Tag beschädigt? Ersatz-Tag nutzen. 2. Smartphone-NFC aktiviert? 3. Tag neu anlernen: App → NFC-Verwaltung → Tag löschen und neu einrichten.' },
                    { q: 'Gaswarner piept kurz und geht wieder aus.', a: 'Kurzes Piepen beim Einschalten = Selbsttest (normal). Dauerpfiff + rote LED = Gasalarm → Fenster öffnen, Gas absperren, Fahrzeug verlassen. Piepen alle 30 Sek = schwacher Akku.' },
                    { q: 'Pro-finder zeigt falschen Standort.', a: '1. Fahrzeug unter Dach? Kurz ins Freie (2–3 Min). 2. Zeitstempel prüfen – letzter bekannter Standort? 3. Datenkontingent verbraucht? Im Händlerportal prüfen.' },
                    { q: 'safe.lock Stilllegung lässt sich nicht aufheben.', a: '1. App-Verbindung stabil? 2. Aktivierungscode zur manuellen Freigabe (in Fahrzeugmappe). 3. Händler kann Remote-Freigabe anstoßen. Notfall: 0431 / 979 620.' },
                    { q: 'Wie oft sollte die Alarmanlage gewartet werden?', a: '1× jährlich bei der Inspektion. Checkliste: Batterien aller Funk-Kontakte, Sirene testen, App-Verbindung, Firmware-Update, Gaswarner-Funktion.' },
                ],
            },
            {
                type: 'errors', title: 'Fehlercodes WiPro III – Schnellreferenz',
                codes: [
                    { code: 'E01', name: 'Sabotagealarm', cause: 'Gehäuse geöffnet / Leitung unterbrochen', fix: 'Zentrale auf Manipulation prüfen, Leitungen kontrollieren' },
                    { code: 'E02', name: 'Zonenfehler', cause: 'Funk-Kontakt meldet sich nicht', fix: 'Batterie prüfen, ggf. neu anlernen' },
                    { code: 'E04', name: 'Netzspannungsausfall', cause: '12V-Versorgung unterbrochen', fix: 'Sicherung prüfen, Verkabelung kontrollieren' },
                    { code: 'E07', name: 'Akku schwach', cause: 'Interne Backup-Batterie < 20%', fix: 'Akku tauschen (Typ CR123A)' },
                    { code: 'E09', name: 'GSM-Fehler', cause: 'SIM nicht erkannt / kein Netz', fix: 'SIM entnehmen/einsetzen, Tarif prüfen' },
                    { code: 'E12', name: 'GPS kein Fix', cause: 'Kein Satellitensignal > 5 Min', fix: 'Fahrzeug ins Freie, Antenne prüfen' },
                ],
            },
        ],
    },
];

/* ══════════════════ PATH connecting islands ══════════════════ */
// Build SVG path through islands in order
const PATH_ORDER = ['vejro', 'poel', 'hiddensee', 'samso', 'langeland', 'usedom', 'fehmarn'];

/* ══════════════════ CONTENT RENDERERS ══════════════════ */

function CompareTable({ data }: { data: any }) {
    return (
        <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${CI.light2}` }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520, fontSize: '.82rem', background: CI.white }}>
                <thead>
                    <tr style={{ background: CI.navy }}>
                        {['Merkmal', '✅ WiPro III', 'Herkömmlich'].map((h, i) => (
                            <th key={i} style={{ padding: '10px 14px', textAlign: 'left', color: i === 0 ? 'rgba(255,255,255,0.6)' : i === 1 ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '.67rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((r: any, i: number) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${CI.light2}`, background: i % 2 === 0 ? CI.white : CI.light }}>
                            <td style={{ padding: '9px 14px', fontWeight: 600, color: CI.textM, fontSize: '.8rem' }}>{r.feature}</td>
                            <td style={{ padding: '9px 14px', color: '#1a6a30', fontWeight: 500 }}>{r.wip}</td>
                            <td style={{ padding: '9px 14px', color: CI.textL }}>{r.old}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CardGrid({ data }: { data: any }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10 }}>
            {data.items.map((item: any, i: number) => (
                <div key={i} style={{ background: CI.white, border: `1px solid ${CI.light2}`, borderRadius: 10, padding: '16px', borderTop: `3px solid ${CI.blue}` }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontWeight: 700, color: CI.navy, fontSize: '.9rem', marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: '.77rem', color: CI.textM, lineHeight: 1.65 }}>{item.desc}</div>
                </div>
            ))}
        </div>
    );
}

function AppFeatures({ data }: { data: any }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 7 }}>
            {data.features.map((f: any, i: number) => (
                <div key={i} style={{ background: CI.white, border: `1px solid ${CI.light2}`, borderRadius: 7, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: CI.blue, flexShrink: 0, marginTop: 5 }} />
                    <div>
                        <div style={{ fontWeight: 700, color: CI.navy, fontSize: '.83rem' }}>{f.label}</div>
                        <div style={{ fontSize: '.75rem', color: CI.textM, marginTop: 2, lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function PortalGuide({ data }: { data: any }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 12 }}>
            {data.areas.map((area: any, i: number) => (
                <div key={i} style={{ background: CI.white, border: `1px solid ${CI.light2}`, borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ background: CI.navy, padding: '9px 14px', fontWeight: 700, color: 'white', fontSize: '.83rem' }}>{area.area}</div>
                    <div style={{ padding: '12px 14px' }}>
                        {area.items.map((item: any, j: number) => (
                            <div key={j} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: j < area.items.length - 1 ? `1px solid ${CI.light2}` : 'none' }}>
                                <div style={{ fontFamily: 'monospace', fontSize: '.68rem', color: CI.blue, fontWeight: 600, marginBottom: 2 }}>{item.path}</div>
                                <div style={{ fontSize: '.76rem', color: CI.textM, lineHeight: 1.5 }}>{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function StepGuide({ data }: { data: any }) {
    const [done, setDone] = useState<Record<number, boolean>>({});
    const toggle = (i: number) => setDone(d => ({ ...d, [i]: !d[i] }));
    const count = Object.values(done).filter(Boolean).length;
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <div style={{ background: CI.light, border: `1px solid ${CI.light2}`, borderRadius: 20, padding: '3px 12px', fontSize: '.73rem', color: CI.textM }}>{count}/{data.steps.length} erledigt</div>
                {count === data.steps.length && <div style={{ background: '#d4edda', border: '1px solid #28a745', borderRadius: 20, padding: '3px 12px', fontSize: '.73rem', color: '#155724', fontWeight: 600 }}>✅ Fertig!</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {data.steps.map((s: any, i: number) => (
                    <div key={i} onClick={() => toggle(i)} style={{ background: done[i] ? '#f0faf4' : CI.white, border: `1px solid ${done[i] ? '#28a74540' : CI.light2}`, borderLeft: `4px solid ${done[i] ? '#28a745' : CI.blue}`, borderRadius: 8, padding: '12px 14px', cursor: 'pointer', transition: 'all .2s' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.8rem', background: done[i] ? '#28a745' : CI.navy, color: 'white' }}>{done[i] ? '✓' : s.n}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, color: done[i] ? '#155724' : CI.navy, fontSize: '.86rem', marginBottom: 3, textDecoration: done[i] ? 'line-through' : '' }}>{s.title}</div>
                                <div style={{ fontSize: '.77rem', color: CI.textM, lineHeight: 1.6 }}>{s.desc}</div>
                                {s.warn && <div style={{ marginTop: 7, background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 4, padding: '5px 9px', fontSize: '.72rem', color: '#856404', fontWeight: 500 }}>⚠️ {s.warn}</div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MistakeList({ data }: { data: any }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {data.items.map((item: any, i: number) => (
                <div key={i} style={{ background: CI.white, border: `1px solid ${CI.light2}`, borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 12 }}>
                    <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                        <div style={{ fontWeight: 700, color: CI.red, fontSize: '.85rem', marginBottom: 3 }}>{item.err}</div>
                        <div style={{ fontSize: '.77rem', color: CI.textM, lineHeight: 1.55 }}>✅ {item.fix}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function VehicleCards({ data }: { data: any }) {
    const [sel, setSel] = useState(0);
    const v = data.items[sel];
    return (
        <div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
                {data.items.map((item: any, i: number) => (
                    <button key={i} onClick={() => setSel(i)} style={{ padding: '7px 14px', borderRadius: 20, fontSize: '.77rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: sel === i ? CI.navy : CI.light, color: sel === i ? 'white' : CI.textM, transition: 'all .18s' } as React.CSSProperties}>{item.type}</button>
                ))}
            </div>
            <div style={{ background: CI.white, border: `1px solid ${CI.light2}`, borderRadius: 10, padding: '18px', borderTop: `3px solid ${CI.blue}` }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontWeight: 800, color: CI.navy, fontSize: '1rem' }}>{v.type}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '.68rem', background: CI.light, border: `1px solid ${CI.light2}`, borderRadius: 3, padding: '1px 7px', color: CI.textL }}>{v.code}</div>
                </div>
                {v.traits.map((t: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
                        <span style={{ color: CI.blue, flexShrink: 0 }}>›</span>
                        <span style={{ fontSize: '.8rem', color: CI.textM, lineHeight: 1.5 }}>{t}</span>
                    </div>
                ))}
                <div style={{ background: `${CI.navy}10`, border: `1px solid ${CI.navy}25`, borderRadius: 5, padding: '7px 12px', fontSize: '.78rem', marginTop: 10 }}>
                    <span style={{ fontWeight: 700, color: CI.navy }}>Empfehlung: </span><span style={{ color: CI.textM }}>{v.alarm}</span>
                </div>
            </div>
        </div>
    );
}

function GasDetectorTable({ data }: { data: any }) {
    return (
        <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${CI.light2}` }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560, fontSize: '.79rem', background: CI.white }}>
                <thead>
                    <tr style={{ background: CI.navy }}>
                        {['Modell', 'Gastyp', 'Montage', 'Besonderheit', 'Ideal für'].map(h => (
                            <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.8)', fontSize: '.65rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.products.map((p: any, i: number) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${CI.light2}`, background: i % 2 === 0 ? CI.white : CI.light }}>
                            <td style={{ padding: '9px 12px', fontWeight: 800, color: CI.navy }}>{p.name}</td>
                            <td style={{ padding: '9px 12px', color: CI.textM }}>{p.gas}</td>
                            <td style={{ padding: '9px 12px', color: CI.textM }}>{p.mount}</td>
                            <td style={{ padding: '9px 12px', color: CI.textM }}>{p.feature}</td>
                            <td style={{ padding: '9px 12px', color: CI.textM }}>{p.einsatz}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ChecklistComp({ data }: { data: any }) {
    const [done, setDone] = useState<Record<string, boolean>>({});
    const total = data.groups.reduce((a: number, g: any) => a + g.items.length, 0);
    const checked = Object.values(done).filter(Boolean).length;
    const pct = total > 0 ? Math.round(checked / total * 100) : 0;
    return (
        <div>
            <div style={{ background: CI.white, border: `1px solid ${CI.light2}`, borderRadius: 10, padding: '14px 18px', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ background: CI.light, borderRadius: 5, height: 8, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${CI.blue},${CI.blueL})`, borderRadius: 5, transition: 'width .4s' }} />
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: pct === 100 ? '#28a745' : CI.navy, fontFamily: 'monospace' }}>{pct}%</div>
                        <div style={{ fontSize: '.6rem', color: CI.textL }}>{checked}/{total}</div>
                    </div>
                </div>
            </div>
            {data.groups.map((g: any, gi: number) => (
                <div key={gi} style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, color: CI.navy, fontSize: '.85rem', marginBottom: 7, paddingBottom: 6, borderBottom: `2px solid ${CI.light2}` }}>{g.group}</div>
                    {g.items.map((item: string, ii: number) => {
                        const key = `${gi}-${ii}`;
                        return (
                            <div key={ii} onClick={() => setDone(d => ({ ...d, [key]: !d[key] }))} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 10px', borderRadius: 6, background: done[key] ? '#f0faf4' : CI.white, border: `1px solid ${done[key] ? '#28a74540' : CI.light2}`, marginBottom: 5, cursor: 'pointer', transition: 'all .2s' }}>
                                <div style={{ width: 18, height: 18, borderRadius: 3, border: `2px solid ${done[key] ? '#28a745' : CI.blue}`, background: done[key] ? '#28a745' : CI.white, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.68rem', color: 'white', fontWeight: 800 }}>{done[key] ? '✓' : ''}</div>
                                <div style={{ fontSize: '.79rem', color: done[key] ? '#155724' : CI.textM, textDecoration: done[key] ? 'line-through' : 'none', lineHeight: 1.5 }}>{item}</div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

function TipsList({ data }: { data: any }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {data.tips.map((t: any, i: number) => (
                <div key={i} style={{ background: CI.white, border: `1px solid ${CI.light2}`, borderRadius: 7, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: CI.blue, color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.83rem' }}>{t.n}</div>
                    <div style={{ fontSize: '.8rem', color: CI.textM, lineHeight: 1.6, paddingTop: 3 }}>{t.tip}</div>
                </div>
            ))}
        </div>
    );
}

function ConfiguratorSteps({ data }: { data: any }) {
    const [active, setActive] = useState<number | null>(null);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.steps.map((s: any, i: number) => (
                <div key={i} onClick={() => setActive(active === i ? null : i)} style={{ background: CI.white, border: `1px solid ${active === i ? CI.blue : CI.light2}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border .2s' }}>
                    <div style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ fontSize: '1.3rem', flexShrink: 0 }}>{s.icon}</div>
                        <div style={{ fontWeight: 700, color: CI.navy, flex: 1, fontSize: '.88rem' }}>{s.phase}</div>
                        <div style={{ color: CI.textL, fontSize: '1.1rem', transform: active === i ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>›</div>
                    </div>
                    {active === i && <div style={{ padding: '0 16px 14px 52px', fontSize: '.79rem', color: CI.textM, lineHeight: 1.7, borderTop: `1px solid ${CI.light2}`, paddingTop: 12 }}>{s.content}</div>}
                </div>
            ))}
        </div>
    );
}

function DisplayScenarios({ data }: { data: any }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10 }}>
            {data.scenarios.map((s: any, i: number) => (
                <div key={i} style={{ background: CI.white, border: `1px solid ${CI.light2}`, borderRadius: 10, padding: '16px', borderLeft: `4px solid ${CI.red}` }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: 7 }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, color: CI.navy, fontSize: '.87rem', marginBottom: 7 }}>{s.title}</div>
                    <div style={{ fontSize: '.77rem', color: CI.textM, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
            ))}
        </div>
    );
}

function FaqList({ data }: { data: any }) {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {data.items.map((item: any, i: number) => (
                <div key={i} style={{ background: CI.white, border: `1px solid ${open === i ? CI.blue : CI.light2}`, borderRadius: 10, overflow: 'hidden', transition: 'border .2s' }}>
                    <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: CI.blue, color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.68rem' }}>?</div>
                        <div style={{ fontWeight: 600, color: CI.navy, flex: 1, fontSize: '.84rem' }}>{item.q}</div>
                        <div style={{ color: CI.textL, fontSize: '1.1rem', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>›</div>
                    </div>
                    {open === i && <div style={{ padding: '0 16px 14px 46px', fontSize: '.79rem', color: CI.textM, lineHeight: 1.75, borderTop: `1px solid ${CI.light2}`, paddingTop: 11 }}>{item.a}</div>}
                </div>
            ))}
        </div>
    );
}

function ErrorTable({ data }: { data: any }) {
    return (
        <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${CI.light2}` }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 460, fontSize: '.79rem', background: CI.white }}>
                <thead>
                    <tr style={{ background: CI.navy }}>
                        {['Code', 'Name', 'Ursache', 'Maßnahme'].map(h => (
                            <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.8)', fontSize: '.65rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.codes.map((c: any, i: number) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${CI.light2}`, background: i % 2 === 0 ? CI.white : CI.light }}>
                            <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontWeight: 800, color: CI.red }}>{c.code}</td>
                            <td style={{ padding: '9px 12px', fontWeight: 700, color: CI.navy }}>{c.name}</td>
                            <td style={{ padding: '9px 12px', color: CI.textM }}>{c.cause}</td>
                            <td style={{ padding: '9px 12px', color: CI.textM }}>{c.fix}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function renderSection(sec: any, idx: number) {
    const map: Record<string, React.JSX.Element> = {
        compare: <CompareTable key={idx} data={sec} />,
        cards: <CardGrid key={idx} data={sec} />,
        appfeatures: <AppFeatures key={idx} data={sec} />,
        portal: <PortalGuide key={idx} data={sec} />,
        steps: <StepGuide key={idx} data={sec} />,
        mistakes: <MistakeList key={idx} data={sec} />,
        vehicles: <VehicleCards key={idx} data={sec} />,
        gasdetectors: <GasDetectorTable key={idx} data={sec} />,
        checklist: <ChecklistComp key={idx} data={sec} />,
        tips: <TipsList key={idx} data={sec} />,
        configurator: <ConfiguratorSteps key={idx} data={sec} />,
        display: <DisplayScenarios key={idx} data={sec} />,
        faq: <FaqList key={idx} data={sec} />,
        errors: <ErrorTable key={idx} data={sec} />,
    };
    return map[sec.type] || null;
}

/* ══════════════════ MAIN APP ══════════════════ */

export default function IslandsHeadPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [visited, setVisited] = useState<Set<string>>(new Set());
    const [mapSize, setMapSize] = useState({ w: 800, h: 480 });
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            if (mapRef.current) {
                const r = mapRef.current.getBoundingClientRect();
                setMapSize({ w: r.width, h: r.height });
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const openIsland = (id: string) => {
        setSelected(id);
        setVisited(v => new Set([...Array.from(v), id]));
    };
    const closePanel = () => setSelected(null);
    const island = ISLANDS.find(i => i.id === selected);

    // Build SVG curved path through all islands in order
    const pathPoints = PATH_ORDER.map(id => {
        const isl = ISLANDS.find(i => i.id === id)!;
        return { x: (isl.x / 100) * mapSize.w, y: (isl.y / 100) * mapSize.h };
    });

    const buildPath = (pts: { x: number, y: number }[]) => {
        if (pts.length < 2) return '';
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i], p1 = pts[i + 1];
            const mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2;
            const ox = (p1.y - p0.y) * 0.25, oy = -(p1.x - p0.x) * 0.25;
            d += ` Q ${mx + ox} ${my + oy} ${p1.x} ${p1.y}`;
        }
        return d;
    };

    return (
        <RoleGuard requiredRole="user">
            <div className="flex-1 flex flex-col w-full" style={{ background: CI.navyD, fontFamily: "'Segoe UI',Arial,sans-serif" }}>
                <style>{`
        button{cursor:pointer;font-family:inherit;border:none;outline:none}
        .island-btn{transition:transform .2s,filter .2s}
        .island-btn:hover{transform:scale(1.13)!important;filter:brightness(1.08)}
        .panel-in{animation:pIn .3s cubic-bezier(.16,1,.3,1) both}
        @keyframes pIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        .fade{animation:fd .3s ease both}
        @keyframes fd{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${CI.light}}
        ::-webkit-scrollbar-thumb{background:${CI.blue};border-radius:3px}
        .wave-animate{animation:wavePan 18s linear infinite}
        @keyframes wavePan{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      `}</style>

                {/* ── TOP BAR ── */}
                <div style={{ background: CI.blue, height: 5 }} />
                <div style={{ background: `linear-gradient(135deg,${CI.navyD},${CI.navy})`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, flexShrink: 0 }}>
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button aria-label="Zurück" variant="ghost" size="icon" className="shrink-0 rounded-full h-8 w-8 text-white hover:bg-white/10">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', letterSpacing: 1.5 }}>THITRONIK®</div>
                            <div style={{ fontSize: '.58rem', color: CI.blueL, letterSpacing: 3.5, textTransform: 'uppercase', marginTop: 1 }}>Campus · Island Hopping · Eckernförde</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '.72rem', color: CI.blueL }}>
                            Besucht: <span style={{ color: 'white', fontWeight: 700 }}>{visited.size}</span> / {ISLANDS.length} Inseln
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {ISLANDS.map(isl => (
                                <div key={isl.id} title={isl.name} style={{ width: 12, height: 12, borderRadius: '50%', background: visited.has(isl.id) ? isl.color : `rgba(255,255,255,0.2)`, border: `1px solid ${visited.has(isl.id) ? isl.color : 'rgba(255,255,255,0.3)'}`, transition: 'all .3s' }} />
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ background: CI.blue, height: 4 }} />

                {/* ── MAIN AREA ── */}
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

                    {/* ── MAP ── */}
                    <div ref={mapRef} style={{
                        flex: 1, position: 'relative', overflow: 'hidden',
                        background: `linear-gradient(160deg, #c5e8f7 0%, #a8d8ee 30%, #b8e0f5 60%, #95cde5 100%)`,
                        minHeight: 460,
                    }}>

                        {/* Ocean texture / waves */}
                        <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: 80, opacity: .18, pointerEvents: 'none' }} className="wave-animate" viewBox="0 0 1600 80" preserveAspectRatio="none">
                            <path d="M0,40 C200,10 400,70 600,40 C800,10 1000,70 1200,40 C1400,10 1600,70 1800,40 L1800,80 L0,80Z" fill={CI.navy} />
                        </svg>
                        <svg style={{ position: 'absolute', bottom: 10, left: 0, width: '200%', height: 50, opacity: .1, pointerEvents: 'none', animationDelay: '-9s' } as React.CSSProperties} className="wave-animate" viewBox="0 0 1600 50" preserveAspectRatio="none">
                            <path d="M0,25 C300,5 600,45 900,25 C1200,5 1500,45 1800,25 L1800,50 L0,50Z" fill={CI.blue} />
                        </svg>

                        {/* subtle dot grid */}
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .07, pointerEvents: 'none' }}>
                            <defs>
                                <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                                    <circle cx="16" cy="16" r="1.5" fill={CI.navy} />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dots)" />
                        </svg>

                        {/* SVG Path + islands */}
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
                            {/* dashed connecting path */}
                            <path d={buildPath(pathPoints)} fill="none" stroke={CI.navy} strokeWidth="2.5" strokeDasharray="10 8" strokeOpacity="0.25" />
                            <path d={buildPath(pathPoints)} fill="none" stroke={CI.white} strokeWidth="1" strokeDasharray="10 8" strokeOpacity="0.15" />
                        </svg>

                        {/* Island Nodes */}
                        {ISLANDS.map(isl => {
                            const px = (isl.x / 100) * mapSize.w;
                            const py = (isl.y / 100) * mapSize.h;
                            const isVis = visited.has(isl.id);
                            const isSel = selected === isl.id;
                            const NODE = 56;

                            return (
                                <div key={isl.id} className="island-btn" onClick={() => openIsland(isl.id)} style={{
                                    position: 'absolute',
                                    left: px - NODE / 2,
                                    top: py - NODE / 2,
                                    width: NODE, height: NODE,
                                    cursor: 'pointer', zIndex: 10,
                                    transform: isSel ? 'scale(1.15)' : 'scale(1)',
                                }}>
                                    {/* Completed badge */}
                                    {isVis && !isSel && (
                                        <div style={{ position: 'absolute', top: -5, right: -5, width: 18, height: 18, borderRadius: '50%', background: CI.green, border: `2px solid white`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', color: 'white', fontWeight: 800, zIndex: 2 }}>✓</div>
                                    )}

                                    {/* Ring */}
                                    <div style={{
                                        width: '100%', height: '100%', borderRadius: '50%',
                                        background: isSel ? isl.color : 'white',
                                        border: `3px solid ${isSel ? isl.color : CI.navy}`,
                                        boxShadow: isSel
                                            ? `0 0 0 6px ${isl.color}35, 0 8px 28px ${CI.navy}40`
                                            : `0 4px 18px rgba(0,52,112,0.25), 0 1px 4px rgba(0,52,112,0.15)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all .25s', position: 'relative',
                                    }}>
                                        <span style={{ fontSize: '1.55rem', lineHeight: 1, filter: isSel ? 'brightness(0) invert(1)' : 'none', transition: 'filter .25s' }}>{isl.emoji}</span>
                                    </div>

                                    {/* Label */}
                                    <div style={{
                                        position: 'absolute', top: 'calc(100% + 7px)', left: '50%', transform: 'translateX(-50%)',
                                        whiteSpace: 'nowrap', pointerEvents: 'none',
                                    }}>
                                        <div style={{
                                            background: isSel ? isl.color : 'rgba(255,255,255,0.95)',
                                            border: `1px solid ${isSel ? isl.color : 'rgba(0,52,112,0.18)'}`,
                                            borderRadius: 7, padding: '4px 11px',
                                            boxShadow: '0 2px 10px rgba(0,52,112,0.18)',
                                            backdropFilter: 'blur(4px)',
                                        }}>
                                            <div style={{ fontWeight: 700, fontSize: '.72rem', color: isSel ? 'white' : CI.navy, letterSpacing: .5, textAlign: 'center' }}>{isl.name.toUpperCase()}</div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '.58rem', color: isSel ? 'rgba(255,255,255,0.8)' : CI.textL, textAlign: 'center' }}>{isl.room}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}



                        {/* Building legend */}
                        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', border: `1px solid rgba(0,52,112,0.12)`, borderRadius: 9, padding: '10px 14px', fontSize: '.68rem', backdropFilter: 'blur(6px)', boxShadow: '0 2px 12px rgba(0,52,112,0.12)' }}>
                            <div style={{ fontWeight: 700, color: CI.navy, marginBottom: 7, fontSize: '.7rem', letterSpacing: 1, textTransform: 'uppercase' }}>Gebäude</div>
                            {[{ l: 'Neubau EG', c: '#1a6fa0' }, { l: 'Neubau OG', c: CI.blue }, { l: 'Altbau EG', c: '#E07B30' }, { l: 'Altbau OG', c: '#C8202E' }].map(b => (
                                <div key={b.l} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.c, flexShrink: 0 }} />
                                    <span style={{ color: CI.textM }}>{b.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── SIDE PANEL ── */}
                    {island && (
                        <div className="panel-in" style={{
                            width: 480, flexShrink: 0, background: CI.light, borderLeft: `4px solid ${island.color}`,
                            display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
                            boxShadow: '-8px 0 40px rgba(0,52,112,0.18)',
                        }}>
                            {/* Panel header */}
                            <div style={{ background: `linear-gradient(135deg,${island.color}22,${island.color}08)`, borderBottom: `1px solid ${island.color}30`, padding: '18px 20px', flexShrink: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <div style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{island.emoji}</div>
                                        <div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: island.color, lineHeight: 1 }}>{island.name}</div>
                                            <div style={{ display: 'flex', gap: 7, marginTop: 5, flexWrap: 'wrap' }}>
                                                <span style={{ fontFamily: 'monospace', fontSize: '.68rem', background: 'white', border: `1px solid ${island.color}45`, borderRadius: 4, padding: '2px 9px', color: CI.navy, fontWeight: 600 }}>{island.room}</span>
                                                <span style={{ fontSize: '.68rem', background: CI.light2, border: `1px solid ${CI.light2}`, borderRadius: 4, padding: '2px 9px', color: CI.textL }}>{island.building}</span>
                                            </div>
                                            <div style={{ fontSize: '.8rem', color: CI.textM, marginTop: 6, fontWeight: 500 }}>{island.tagline}</div>
                                        </div>
                                    </div>
                                    <button onClick={closePanel} style={{ background: 'rgba(0,52,112,0.1)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: CI.textM, fontSize: '1.1rem', flexShrink: 0, cursor: 'pointer', transition: 'background .18s' }}>✕</button>
                                </div>

                                {/* Navigate between islands */}
                                <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                                    {ISLANDS.map(isl => (
                                        <button key={isl.id} onClick={() => openIsland(isl.id)} style={{
                                            padding: '4px 10px', borderRadius: 12, fontSize: '.68rem', fontWeight: 600, cursor: 'pointer',
                                            background: selected === isl.id ? isl.color : 'white',
                                            color: selected === isl.id ? 'white' : CI.textM,
                                            border: selected === isl.id ? `1px solid ${isl.color}` : `1px solid ${CI.light2}`,
                                            transition: 'all .18s',
                                        } as React.CSSProperties}>{visited.has(isl.id) && selected !== isl.id ? '✓ ' : ''}{isl.name}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Panel content */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                                <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                                    {island.sections.map((sec: any, i: number) => (
                                        <div key={i} style={{ background: 'white', border: `1px solid ${CI.light2}`, borderRadius: 12, padding: '18px', boxShadow: '0 1px 8px rgba(0,52,112,0.07)' }}>
                                            {sec.title && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                                    <div style={{ width: 4, height: 20, background: island.color, borderRadius: 2, flexShrink: 0 }} />
                                                    <div style={{ fontWeight: 800, color: CI.navy, fontSize: '.97rem' }}>{sec.title}</div>
                                                </div>
                                            )}
                                            {renderSection(sec, i)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ background: CI.navy, color: CI.blueL, textAlign: 'center', padding: '10px', fontSize: '.65rem', letterSpacing: 2, textTransform: 'uppercase', flexShrink: 0 }}>
                    THITRONIK® Campus · Eckernförde · Island Hopping Schulungstag
                </div>
                <div style={{ background: CI.blue, height: 4 }} />
            </div>
        </RoleGuard>
    );
}
