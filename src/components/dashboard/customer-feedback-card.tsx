"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, MessageSquareQuote, TrendingUp } from "lucide-react";

/* ═════════════════════════ DATA ═════════════════════════ */

interface Review {
    name: string;
    date: string;
    stars: number;
    text: string;
}

const REVIEWS: Review[] = [
    { name: "Jörg Hansen", date: "vor 6 Monaten", stars: 5, text: "Einbau im Kastenwagen, Übernachtung vor Ort, Leihwagen, sehr freundlich." },
    { name: "Linda N.", date: "vor 1 Monat", stars: 5, text: "\"Eigentlich 10 Sterne\", Übernachtung, Leihwagen, authentische Herzlichkeit. Lob an Herrn Reimers." },
    { name: "Roberto & Wiebke", date: "vor 1 Jahr", stars: 5, text: "Problembehebung einer Fremdinstallation. Kostenloser Leihwagen, super kompetent." },
    { name: "Neville B. Passagne", date: "vor 3 Monaten", stars: 5, text: "Kostenlose Überprüfung und Einweisung nach Problemen mit Händlereinbau." },
    { name: "Fridolin Zellkutur", date: "vor 2 Monaten", stars: 5, text: "Kostenloses Software-Update und Überprüfung nach Jahren." },
    { name: "Martin", date: "vor 4 Monaten", stars: 5, text: "Flexibel, freundlich, leckerer Cappuccino, gute Erklärung." },
    { name: "Mario Ernst", date: "vor 2 Monaten", stars: 5, text: "Kulanz bei defekten Platinen nach 6 Jahren." },
    { name: "Lothar Jansen", date: "vor 4 Monaten", stars: 5, text: "Kompetent, gute Einweisung, man fühlt sich gut aufgehoben." },
    { name: "Roland Bay", date: "vor 1 Jahr", stars: 5, text: "Ausführliches Lob für WiPro III, App-Funktionen und Kundenorientierung." },
    { name: "Gerhard H.", date: "vor 4 Monaten", stars: 5, text: "Überprüfung und Update. Begeistert von Produkten und Angestellten." },
    { name: "J G", date: "vor 5 Monaten", stars: 5, text: "Restlos begeistert, netter Service, kostenloses Leihauto." },
    { name: "Renate Niens", date: "vor 5 Monaten", stars: 5, text: "Defekter Schlüssel: Neue Platine und Batterien, super Service." },
    { name: "Burghard Puse", date: "vor 2 Jahren", stars: 5, text: "Sofortige, kostenlose Fehlerbehebung. Stellplatz mit Strom genutzt." },
    { name: "Timo Wendland", date: "vor 6 Monaten", stars: 5, text: "Schnelle Hilfe bei Wegfahrsperren-Problem, Updates & Batterien getauscht." },
    { name: "Gunnar Kolleth", date: "vor 3 Jahren", stars: 5, text: "Einbau, Firmenfahrzeug zur Nutzung, ausführliche Einweisung." },
    { name: "Daddel Du", date: "vor 4 Monaten", stars: 5, text: "Funkschlüssel repariert, Batterien getauscht für kleines Geld." },
    { name: "Martin Wagle", date: "vor 5 Monaten", stars: 1, text: "Negativ: Fehlalarme, Kritik an Technik-Logik, \"minderwertig\"." },
    { name: "Klaus Roth", date: "vor 7 Monaten", stars: 5, text: "Update durchgeführt. Freundlicher Empfang, schönes Ambiente." },
    { name: "Sascha Große", date: "vor 5 Monaten", stars: 5, text: "Hotline-Hilfe (iPhone Einstellungen), extrem freundlich und kompetent." },
    { name: "Henri Pietrek", date: "vor 4 Monaten", stars: 5, text: "Systemcheck nach 4,5 Jahren. Fremdzugriff geprüft, alles perfekt." },
    { name: "Carsten v. Freiherr", date: "vor 1 Jahr", stars: 5, text: "Lob für Premium Händler Schulung." },
    { name: "Axel Frey", date: "vor 3 Jahren", stars: 5, text: "Hilfe bei selbst eingebauter Anlage (Magnetkontakte korrigiert)." },
    { name: "Bruno F.", date: "vor 5 Monaten", stars: 5, text: "Nach 6 Jahren immer noch sehr zufrieden." },
    { name: "H. Preuß", date: "vor 4 Monaten", stars: 5, text: "Schnelle Hilfe bei abgefallenem Magneten (innerhalb 2 Tagen)." },
    { name: "Bernd Griff", date: "vor 8 Monaten", stars: 5, text: "Korrektur eines fehlerhaften Fremdeinbaus (\"Fachwerkstatt\")." },
    { name: "Ray Müller", date: "vor 1 Jahr", stars: 5, text: "Upgrade auf 4G, Führung durchs Unternehmen, tolle Firmenkultur." },
    { name: "Gerd Vogel", date: "vor 11 Monaten", stars: 5, text: "Mustergültige Ferndiagnose bei Händler-Fehler." },
    { name: "Martinus Maximus", date: "vor 8 Monaten", stars: 5, text: "Einbau WiPro, Leihwagen, alles Top." },
    { name: "Andreas Utt", date: "vor 10 Monaten", stars: 5, text: "Aufrüstung, da Werkstatt keine Kapazität hatte. Freundlichkeit beeindruckend." },
    { name: "René Schäffer", date: "vor 3 Monaten", stars: 5, text: "Empfiehlt Einbau direkt bei Thitronik." },
    { name: "Viola R.", date: "vor 2 Jahren", stars: 5, text: "Leckerchen für den Hund, Leihwagen, kompetente Beratung." },
    { name: "Peter Lehnhardt", date: "vor 11 Monaten", stars: 5, text: "Kostenloser Austausch defekter Platinen + Neuinstallation. Beeindruckt." },
    { name: "Martin Gäßler", date: "vor 1 Jahr", stars: 5, text: "Super Kontakt und persönliche Beratung." },
    { name: "Melittahh Hamburg", date: "vor 1 Jahr", stars: 5, text: "Fehlerbehebung, Kulanz, Übernachtung auf Stellplatz." },
    { name: "Martin K.", date: "vor 1 Jahr", stars: 5, text: "Defektes Neugerät (Gas Pro III) per Express ausgetauscht." },
    { name: "Henry Männecke", date: "vor 1 Jahr", stars: 5, text: "Einbau, E-Auto mit Hundebox (!) zur Verfügung gestellt." },
    { name: "Thomas Risters", date: "vor 2 Jahren", stars: 5, text: "Saubere Arbeit, kostenloses Fahrzeug." },
    { name: "Susanne Balzer", date: "vor 3 Jahren", stars: 5, text: "Fehlerbehebung nach Händlereinbau. Kostenlos, nur 2 Std." },
    { name: "Jens&Manu", date: "vor 5 Jahren", stars: 5, text: "Erste Adresse für Sicherheitstechnik." },
    { name: "Thomas Dewitz", date: "vor 8 Monaten", stars: 5, text: "Platinentausch (Kulanz) und Hilfe bei SIM-Karten Problem." },
    { name: "Sven Schöne", date: "vor 4 Monaten", stars: 5, text: "Umgehende Hilfe, Anlage funktioniert nun." },
    { name: "Wilfried Ledig", date: "vor 1 Jahr", stars: 5, text: "Komplettpaket Einbau, uneingeschränkt empfehlenswert." },
    { name: "Stefan Eis", date: "vor 1 Jahr", stars: 5, text: "Support (auch Freitags) hervorragend bei Störung." },
    { name: "Michael Peifer", date: "vor 3 Jahren", stars: 5, text: "\"Fehlen die Superlativen\", rundum sicheres Gefühl." },
    { name: "Patrick ST", date: "vor 1 Jahr", stars: 5, text: "Schlüsselplatine auf Kulanz gewechselt (nach 4 Jahren)." },
    { name: "Marion Riess", date: "vor 2 Jahren", stars: 5, text: "Einbau WiPro III, E-Leihauto. Reklamation später gut gelöst." },
    { name: "Lothar Gehlhaar", date: "vor 1 Jahr", stars: 5, text: "Massive Korrektur von Einbaufehlern (Händler), sehr kulant." },
    { name: "Lockla", date: "vor 1 Jahr", stars: 5, text: "Kostenloser Stellplatz mit Strom, Service klasse." },
    { name: "Andreas Dalhoff", date: "vor 2 Jahren", stars: 5, text: "Korrektur Händler-Fehler durch Herrn Hoffmann." },
    { name: "Patrick H", date: "vor 1 Jahr", stars: 2, text: "Negativ: Abschalteinrichtung vergessen, keine Reaktion auf Mails." },
    { name: "Jörg Hitschke", date: "vor 1 Jahr", stars: 5, text: "Von Messekontakt bis Einbau alles perfekt." },
    { name: "Ralf T.", date: "vor 1 Jahr", stars: 5, text: "Platine nach 6 Jahren kostenlos getauscht." },
    { name: "Ulrich Pracht", date: "vor 1 Jahr", stars: 5, text: "Selbsteinbau, defekter Handsender sofort ersetzt." },
    { name: "Stephan Haase", date: "vor 1 Jahr", stars: 5, text: "5 Jahre alte Schlüsselplatine auf Vertrauen vorab getauscht." },
    { name: "Ralf Peters", date: "vor 1 Jahr", stars: 5, text: "Probleme behoben, Erweiterungen durchgeführt, Hund verwöhnt." },
    { name: "Rolf", date: "vor 3 Monaten", stars: 5, text: "Korrektur falschen Einbaus, Tausch Steuergerät kostenlos." },
    { name: "Sylvia Buchholz", date: "vor 2 Jahren", stars: 5, text: "Einbau WiPro III + Gaswarner. 100% Weiterempfehlung." },
    { name: "M. N.", date: "vor 3 Jahren", stars: 5, text: "Händlerfehler korrigiert, Zusatzwünsche erfüllt." },
    { name: "Gabriele Eberhard", date: "vor 2 Jahren", stars: 5, text: "Shopping in Kiel mit Leihauto während Einbau." },
    { name: "Christine Mayer", date: "vor 1 Jahr", stars: 5, text: "Anreise aus BW hat sich gelohnt." },
    { name: "Jo La", date: "vor 1 Jahr", stars: 5, text: "\"10 Sterne\", Leihfahrzeug mit Hundebox." },
    { name: "J B (Jojo)", date: "vor 2 Jahren", stars: 5, text: "Kostenlose neue Platine ohne Termin vor Ort." },
    { name: "Beta 350RRR", date: "vor 2 Jahren", stars: 5, text: "Sonderwünsche kurzfristig erledigt." },
    { name: "Thomas Gomm", date: "vor 4 Jahren", stars: 5, text: "Kinderleichter Einbau, super Support." },
    { name: "Manfred Westerhove", date: "vor 1 Jahr", stars: 5, text: "Reparatur auf Kulanz (alte Anlage), eigenen Fehler behoben." },
    { name: "ste pa", date: "vor 1 Jahr", stars: 5, text: "Einbau Pro Finder, unglaubliche Freundlichkeit." },
    { name: "Calle Rohlff", date: "vor 1 Jahr", stars: 5, text: "Ankerbucht genutzt, Leihwagen, Top Arbeitsausführung." },
    { name: "Jürgen Bau", date: "vor 2 Jahren", stars: 5, text: "Einbau im Sprinter, sehr professionell." },
    { name: "P-C. M.", date: "vor 3 Jahren", stars: 5, text: "Gaswarner geprüft (0€ Kosten), lag am Anschlusskabel." },
    { name: "Peter J.", date: "vor 2 Jahren", stars: 5, text: "Händlerpfusch kostenlos behoben, E-Auto für Ausflug." },
    { name: "J. S.", date: "vor 3 Jahren", stars: 5, text: "Magnetkontakt Problem per Telefon in 2 Std gelöst." },
    { name: "Regina Rathmann", date: "vor 3 Jahren", stars: 5, text: "Störung behoben & Batterien getauscht - alles kostenlos." },
    { name: "Steffen W", date: "vor 4 Jahren", stars: 5, text: "Attraktiver Arbeitgeber, Professionalität macht Spaß." },
    { name: "Michael Egemann", date: "vor 4 Jahren", stars: 5, text: "Einbau in 3 Std, Leihfahrzeug zum Frühstücken." },
    { name: "Carmen Eipper", date: "vor 4 Jahren", stars: 5, text: "E-Golf kostenlos genutzt, Wikingerdorf besucht." },
    { name: "Rainer Machelett", date: "vor 2 Jahren", stars: 5, text: "Mega begeistert vom Einbau und Support." },
    { name: "André Frenzel", date: "vor 4 Jahren", stars: 5, text: "Händlerfehler korrigiert, Freundlichkeit einzigartig." },
    { name: "Mark Nellessen", date: "vor 5 Jahren", stars: 5, text: "Fahrräder/Leihfahrzeug, Anlage funktioniert einfach." },
    { name: "Kurt Schuster", date: "vor 3 Jahren", stars: 5, text: "Kabelschleife 2x selbst abgerissen, 2x kostenlos repariert." },
    { name: "Rainer Kosog", date: "vor 2 Jahren", stars: 5, text: "Beratung per Chat/Telefon, Volvo X4 Leihwagen, Lunchpaket!" },
    { name: "Frank Gerkens", date: "vor 1 Jahr", stars: 5, text: "Problem fachkompetent und kostenfrei behoben." },
    { name: "Sven Cornelius", date: "vor 3 Jahren", stars: 5, text: "Extra angereist, absolut glücklich." },
    { name: "Tobias Franke", date: "vor 3 Jahren", stars: 5, text: "Spontanbesuch, 1 Std Erklärung erhalten." },
    { name: "Stefan Martin", date: "vor 2 Jahren", stars: 5, text: "Profinder Problem (Charge), kulant behoben." },
    { name: "Gudu Mutz", date: "vor 3 Jahren", stars: 5, text: "Notfalltermin am nächsten Tag, Urlaub gerettet." },
    { name: "Wolfgang Zinecker", date: "vor 2 Jahren", stars: 5, text: "Funkschlüssel-Problem in 5 Min am Telefon gefixt." },
    { name: "Volker Witt", date: "vor 3 Jahren", stars: 5, text: "Sehr professionell, keine Fragen offen geblieben." },
    { name: "Ralf Jäschke", date: "vor 4 Jahren", stars: 5, text: "Spontanbesuch, Platine sofort getauscht." },
    { name: "Anja Teschke", date: "vor 2 Jahren", stars: 5, text: "Übernachtung inkl., Volvo genutzt, sicher gefühlt." },
    { name: "Thomas Metzler", date: "vor 3 Jahren", stars: 5, text: "Kundenservice wirklich perfekt." },
    { name: "Horst Lütje", date: "vor 2 Jahren", stars: 5, text: "Handywechsel-Problem (Eigenverschulden) gelöst." },
    { name: "Sarah Russ", date: "vor 3 Jahren", stars: 5, text: "Sicher & Happy nach Einbau." },
    { name: "Rainer Schicker", date: "vor 3 Jahren", stars: 5, text: "Spontanbesuch, Pro Finder getauscht." },
    { name: "Ralf Hasbargen", date: "vor 3 Jahren", stars: 5, text: "Software-Problem am Profinder vor Ort gelöst." },
    { name: "Matthias Bartels", date: "vor 2 Jahren", stars: 5, text: "Kostenloses Upgrade Pro-finder (Postweg)." },
    { name: "Christian", date: "vor 3 Jahren", stars: 5, text: "\"Ein Graus\" (Händlereinbau) in Eckernförde behoben." },
    { name: "Manu V-I.", date: "vor 2 Jahren", stars: 5, text: "Spontan angenommen, Händlerpfusch behoben." },
    { name: "Stephan Grunow", date: "vor 3 Jahren", stars: 5, text: "Löschen von Fensterkontakten per Telefon erklärt." },
    { name: "Paul Powell", date: "vor 3 Jahren", stars: 5, text: "Defekte Sensoren auf Kulanz getauscht (keine Rechnung)." },
    { name: "Walter Heuser", date: "vor 2 Jahren", stars: 5, text: "Exzellentes Produkt, Einbau beim Hersteller empfohlen." },
    { name: "Thomas V", date: "vor 2 Jahren", stars: 5, text: "Umfassende Korrektur Händlereinbau + kostenl. Leihwagen." },
    { name: "Silke Hauser", date: "vor 3 Jahren", stars: 5, text: "Telefonischer Service (Herr Buckley) sehr hilfreich." },
    { name: "Carsten Schuetz", date: "vor 2 Jahren", stars: 5, text: "Unglaublicher Service, ganzes Team hilfsbereit." },
    { name: "Mathias Lewinski", date: "vor 3 Jahren", stars: 5, text: "E-Auto genutzt, Frühstück am Hafen, Top Einweisung." },
    { name: "Michael Schrapp", date: "vor 3 Jahren", stars: 5, text: "Einbruch erlebt -> Thitronik überzeugt durch Konzept." },
    { name: "Ivo Schob", date: "vor 3 Jahren", stars: 5, text: "Updates & Batterien kostenlos (\"Das ist unser Service\")." },
    { name: "Gerhard B.", date: "vor 2 Jahren", stars: 5, text: "Snack-Paket, technisches Update, Herr Kunz gelobt." },
    { name: "Thomas S", date: "vor 1 Jahr", stars: 5, text: "Spontaner Termin auf Rückreise aus Norwegen." },
    { name: "Migusch", date: "vor 2 Jahren", stars: 5, text: "Spitzenklasse Service, Einweisung App." },
    { name: "Sebastian Seck", date: "vor 3 Jahren", stars: 5, text: "Lieber 500km fahren als zum Kooperationspartner." },
    { name: "WLS", date: "vor 2 Jahren", stars: 5, text: "Spontanbesuch, Profinder Problem bei Kaffee gelöst." },
    { name: "Wolf Eggert", date: "vor 3 Jahren", stars: 5, text: "\"Made in Germany\", Eigenentwicklung gelobt." },
    { name: "Dirk Alex", date: "vor 1 Jahr", stars: 5, text: "Neues Womo, neue Anlage. Alles Spitze." },
    { name: "Armin Tschannen", date: "vor 4 Jahren", stars: 5, text: "Defekte Teile sofort getauscht/repariert." },
    { name: "Uwe Wondraczek", date: "vor 2 Jahren", stars: 5, text: "Ohne Anmeldung: Anlage kostenlos getauscht/korrigiert." },
    { name: "Stefan Regnu", date: "vor 4 Jahren", stars: 5, text: "Ersatzwagen, perfekte Kommunikation." },
    { name: "Oliver Marcus", date: "vor 3 Jahren", stars: 5, text: "E-Bike Nutzung, detaillierte Erklärung." },
    { name: "Gabriele Kassner-Klein", date: "vor 3 Jahren", stars: 5, text: "Gewinnspiel-Wochenende, Werksbesichtigung, sehr sauber." },
    { name: "Leuchtturm Travel", date: "vor 2 Jahren", stars: 5, text: "Service Oase. Fehler anderer Fachbetriebe beseitigt." },
    { name: "Harald Rembold", date: "vor 2 Jahren", stars: 5, text: "Platine nach 3 Jahren kostenlos per Post getauscht." },
    { name: "Verena Bastian", date: "vor 3 Jahren", stars: 5, text: "Kurzfristiger Termin vor Spanien-Reise." },
    { name: "Mattis Fangmeier", date: "vor 3 Jahren", stars: 5, text: "Spontaner Termin, professionell eingebaut." },
    { name: "Ute Fischer", date: "vor 3 Jahren", stars: 5, text: "Alles erneuert/getauscht (1 Std) - kostenlos! + Snackbüddel." },
    { name: "Andre Sauerland", date: "vor 1 Jahr", stars: 5, text: "Menschliche Stimme am Telefon, App Problem gelöst." },
    { name: "Gerhard", date: "vor 1 Jahr", stars: 5, text: "Einen Tag zu früh -> trotzdem sofort bedient." },
    { name: "Ralf Oremek", date: "vor 3 Jahren", stars: 5, text: "Platine auf Messe reklamiert, per Post neu erhalten." },
    { name: "Michael Keunecke", date: "vor 2 Jahren", stars: 5, text: "Hilfe beim Einrichten am Telefon." },
    { name: "Jörg Sakowski", date: "vor 3 Jahren", stars: 5, text: "Telefonisch Schritt für Schritt Profinder in Betrieb genommen." },
    { name: "Michael Kienzle", date: "vor 2 Jahren", stars: 5, text: "Kurz vor Urlaub unkomplizierte Lösung gefunden." },
    { name: "Andree Skau", date: "vor 3 Jahren", stars: 5, text: "Telefonische Anleitung durch Fahrzeugtechnik." },
    { name: "Michael Graf", date: "vor 5 Jahren", stars: 5, text: "3 Stunden Telefonat mit Herrn Fehlau zur Fehlerbehebung." },
    { name: "Joerg Korff", date: "vor 5 Jahren", stars: 5, text: "\"Pfusch\" vom Händler beseitigt (geklebte Magnete)." },
    { name: "Mike Stumpf", date: "vor 4 Jahren", stars: 5, text: "Dienstleistungsorientiertes Unternehmen." },
    { name: "Wischami", date: "vor 3 Jahren", stars: 5, text: "Nach 3 Jahren Probleme kostenlos behoben + E-Auto." },
    { name: "Mel J.", date: "vor 5 Jahren", stars: 5, text: "E-Bikes während Wartezeit, Topnote mit Sternchen." },
    { name: "Alexander Roland", date: "vor 2 Jahren", stars: 5, text: "\"Kundenparadis\" statt Servicewüste." },
    { name: "Martin Kliesow", date: "vor 3 Jahren", stars: 5, text: "Handsender vor Ort sofort getauscht." },
    { name: "Ralf Gronau", date: "vor 3 Jahren", stars: 5, text: "Ein Ansprechpartner für alles, E-Golf mobil." },
    { name: "Olaf Krohn", date: "vor 10 Monaten", stars: 5, text: "Ohne Termin am Freitag sofort geholfen." },
    { name: "Wolfgang Weil", date: "vor 3 Jahren", stars: 5, text: "Übernachtung vor Ort möglich, E-Auto kostenlos." },
    { name: "Helmut Grawe", date: "vor 1 Jahr", stars: 5, text: "Selbstgemachtes Problem schnellstens gelöst." },
    { name: "Andreas Stellbogen", date: "vor 3 Jahren", stars: 5, text: "Seit 10 Jahren Kunde, Ersatzteilservice top." },
    { name: "Jörg Hempel", date: "vor 3 Jahren", stars: 5, text: "Rundumsorglospaket inkl. Gaswarner (KO-Gase)." },
    { name: "Rainer Czech", date: "vor 2 Jahren", stars: 5, text: "Professionell, freundlich, kompetent." },
    { name: "Nicole Leifeld", date: "vor 3 Jahren", stars: 5, text: "Händlerfehler kostenlos behoben." },
    { name: "Detlef Sager", date: "vor 3 Jahren", stars: 5, text: "Hof ist eine Augenweide, Preis-Leistung perfekt." },
    { name: "Alfred Jquaak", date: "vor 3 Jahren", stars: 5, text: "Herzlicher Empfang, professioneller Einbau." },
    { name: "Harald Kelsch", date: "vor 1 Jahr", stars: 5, text: "Probleme mit Funkschlüssel schnell gelöst." },
    { name: "Bernd Rochelt", date: "vor 2 Jahren", stars: 5, text: "Werkseinbau sehr zu empfehlen." },
    { name: "Volker Wehnen", date: "vor 4 Jahren", stars: 5, text: "Bester Service seit 20 Jahren." },
    { name: "Friedrich Lammermann", date: "vor 2 Jahren", stars: 5, text: "Neue Platine + frankierter Rückumschlag kostenlos." },
    { name: "Thorsten Dossow", date: "vor 3 Jahren", stars: 5, text: "Gaswarner kurz vor Urlaub defekt, direkt geregelt." },
    { name: "Barry Hiller", date: "vor 3 Jahren", stars: 5, text: "Herr Fehlau (Support) besonders gelobt." },
    { name: "Roland Wagner", date: "vor 3 Jahren", stars: 5, text: "Gerät umsonst getauscht, Fehler lag an SIM Karte." },
    { name: "Martin Crynen", date: "vor 3 Jahren", stars: 5, text: "Schnelle Antwortzeit, Reparatur in 3 Tagen." },
    { name: "Dieter Schotte", date: "vor 2 Jahren", stars: 5, text: "Fehler der Einbaufirma (ADRIA) behoben." },
    { name: "Claus Brier", date: "vor 2 Jahren", stars: 5, text: "Einweisung und Testung übertraf Erwartungen." },
    { name: "Oliver Pettke", date: "vor 2 Jahren", stars: 5, text: "Unfassbar guter Kundenservice." },
    { name: "Ju We", date: "vor 2 Jahren", stars: 1, text: "Negativ: App schwach, Fehlfunktionen nach 1.5 Jahren." },
    { name: "Elmar Rose", date: "vor 3 Jahren", stars: 5, text: "Spontan auf dem Weg in Urlaub Problem gelöst." },
    { name: "Sandra Heinicke", date: "vor 3 Jahren", stars: 5, text: "Perfekt versorgt während Wartezeit." },
    { name: "Michael Kurtz", date: "vor 3 Jahren", stars: 5, text: "Händlerfehler beseitigt + Lunchpaket." },
    { name: "Matthias Münch", date: "vor 2 Jahren", stars: 5, text: "Kunde ist wirklich König. Würde 10 Sterne geben." },
    { name: "Helmut Beyermann", date: "vor 1 Jahr", stars: 1, text: "Negativ: Sensor abgefallen -> Polizeieinsatz." },
    { name: "Oliver von B.", date: "vor 2 Jahren", stars: 1, text: "Negativ: Batterie leer nach 1 Woche (laut Händler)." },
    { name: "Sascha Dosoudil", date: "vor 1 Woche", stars: 5, text: "Dank an Frau Batliner." },
    { name: "thierry bunel", date: "vor 3 Monaten", stars: 5, text: "Besichtigung Produktion, alles vor Ort gefertigt." },
    { name: "alfred muniesa", date: "vor 4 Monaten", stars: 5, text: "10 Sterne für Kundendienst." },
    { name: "Quentin Dupas", date: "vor 2 Jahren", stars: 5, text: "Tolle Beratung durch Emmanuel, E-Bikes." },
    { name: "Guillaume Genest", date: "vor 2 Jahren", stars: 5, text: "Lobt Qualität und Design WiPro III." },
    { name: "Volker L.", date: "vor 6 Jahren", stars: 5, text: "Bestes System, modular." },
    { name: "John Sander Andersen", date: "vor 4 Monaten", stars: 5, text: "Fantastische Erfahrung." },
    { name: "Michael Sievering", date: "vor 1 Jahr", stars: 5, text: "Bester Support aller Zeiten." },
    { name: "Sigi Rebholz", date: "vor 2 Jahren", stars: 5, text: "Vorbildlicher Service auch nach Kauf." },
    { name: "Jenny Atorf", date: "vor 1 Jahr", stars: 5, text: "Hätte nicht besser sein können." },
    { name: "Fred Fiedler", date: "vor 1 Jahr", stars: 5, text: "Behindertengerechte Toilette vorhanden." },
    { name: "Roberto Hoerrmann", date: "vor 3 Jahren", stars: 5, text: "Team motiviert und kundenorientiert." },
    { name: "Heike Kiefel", date: "vor 3 Jahren", stars: 5, text: "Kunde noch König." },
    { name: "Ferdi Doussier", date: "vor 3 Jahren", stars: 5, text: "Spontan super Service." },
    { name: "uwe munz", date: "vor 1 Jahr", stars: 5, text: "Hammer Support." },
    { name: "Andreas", date: "vor 1 Jahr", stars: 5, text: "Egal mit wem man spricht, alle haben Ahnung." },
    { name: "mo lo", date: "vor 1 Jahr", stars: 5, text: "Toller Support per Mail/Telefon." },
    { name: "roberto pahlke", date: "vor 4 Monaten", stars: 5, text: "Super freundlich." },
    { name: "Vero G.", date: "vor 3 Jahren", stars: 5, text: "Toller Kundenservice." },
    { name: "Christof Greskamp", date: "vor 8 Jahren", stars: 5, text: "Top Service auch außerhalb Garantie." },
    { name: "Andreas Homberger", date: "vor 3 Jahren", stars: 5, text: "Immer wieder gerne." },
    { name: "ANDREAS PANNENBORG", date: "vor 2 Jahren", stars: 5, text: "Hilfsbereit und verständnisvoll." },
    { name: "Familie Goerner", date: "vor 2 Jahren", stars: 5, text: "Einfach nur Klasse." },
    { name: "J. Mo.", date: "vor 2 Jahren", stars: 5, text: "Super schneller kompetenter Service." },
    { name: "ACR Phontastik GmbH", date: "vor 2 Jahren", stars: 5, text: "Super Support." },
    { name: "Roger Stehr", date: "vor 5 Jahren", stars: 5, text: "Produkte & Service erstklassig." },
    { name: "Patrick H", date: "vor 1 Jahr", stars: 5, text: "Schlüsselplatine auf Kulanz gewechselt." },
];

/* ═════════════════════════ STATS ═════════════════════════ */

const totalReviews = REVIEWS.length;
const avgRating = (REVIEWS.reduce((sum, r) => sum + r.stars, 0) / totalReviews).toFixed(1);
const fiveStarPct = Math.round((REVIEWS.filter(r => r.stars === 5).length / totalReviews) * 100);

/* ═════════════════════════ STARS COMPONENT ═════════════════════════ */

function Stars({ count, size = 14 }: { count: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={size}
                    className={`${i <= count
                        ? "text-brand-lime fill-brand-lime"
                        : "text-white/20"
                        } transition-colors`}
                />
            ))}
        </div>
    );
}

/* ═════════════════════════ REVIEW CARD ═════════════════════════ */

function ReviewCard({ review }: { review: Review }) {
    const initials = review.name
        .split(" ")
        .map(w => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="bg-white/[0.04] rounded-xl border border-white/10 p-5 flex flex-col gap-3 h-full hover:bg-white/[0.07] transition-colors duration-300 group">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-sky/30 to-brand-navy flex items-center justify-center text-sm font-bold text-white shrink-0 border border-brand-sky/20">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{review.name}</div>
                    <div className="text-[0.68rem] text-white/40 mt-0.5">{review.date}</div>
                </div>
            </div>

            {/* Stars */}
            <Stars count={review.stars} />

            {/* Text */}
            <p className="text-[0.82rem] text-white/70 leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
            </p>

            {/* Google badge */}
            <div className="flex items-center gap-1.5 mt-auto pt-1">
                <div className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white/50">G</span>
                </div>
                <span className="text-[0.62rem] text-white/30 tracking-wide">Google Review</span>
            </div>
        </div>
    );
}

/* ═════════════════════════ MAIN COMPONENT ═════════════════════════ */

const CARDS_PER_PAGE = 3;

export function CustomerFeedbackCard() {
    const [page, setPage] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(1);
    const totalPages = Math.ceil(REVIEWS.length / CARDS_PER_PAGE);

    const goTo = useCallback((nextPage: number, dir: number) => {
        setDirection(dir);
        setPage(nextPage);
    }, []);

    const goNext = useCallback(() => {
        goTo((page + 1) % totalPages, 1);
    }, [page, totalPages, goTo]);

    const goPrev = useCallback(() => {
        goTo((page - 1 + totalPages) % totalPages, -1);
    }, [page, totalPages, goTo]);

    // Auto-scroll
    useEffect(() => {
        if (isPaused) return;
        const id = setInterval(goNext, 5000);
        return () => clearInterval(id);
    }, [isPaused, goNext]);

    const visibleReviews = REVIEWS.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
    };

    return (
        <div
            className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-md"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* ── HEADER ── */}
            <div className="bg-gradient-to-br from-brand-navy-dark via-brand-navy to-brand-navy-light relative overflow-hidden px-5">
                {/* Decorative background */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-[35%] bg-gradient-to-br from-transparent to-brand-navy-light/35"
                    style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }}
                    aria-hidden="true"
                />
                <div
                    className="absolute right-[8%] top-1/2 -translate-y-1/2 opacity-[0.07] text-[8rem] leading-none select-none text-white font-black tracking-tighter"
                    aria-hidden="true"
                >
                    ⭐
                </div>

                <div className="max-w-[1360px] mx-auto py-[22px] pb-5 flex items-center justify-between flex-wrap gap-4 relative">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                        <MessageSquareQuote className="w-6 h-6 text-brand-sky" />
                        <div>
                            <div className="text-[1.35rem] font-extrabold text-white tracking-[0.5px] leading-none">
                                Feedback unserer Kunden
                            </div>
                            <div className="text-[0.58rem] text-brand-sky-light tracking-[3.5px] uppercase mt-1 font-medium">
                                Google Bewertungen · Eckernförde
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-5 flex-wrap">
                        {[
                            { val: totalReviews.toString(), lbl: "Bewertungen", icon: null },
                            { val: avgRating, lbl: "Durchschnitt", icon: null },
                            { val: `${fiveStarPct}%`, lbl: "5-Sterne", icon: null },
                        ].map(({ val, lbl }) => (
                            <div key={lbl} className="text-center">
                                <div className="text-2xl font-extrabold text-white leading-none">{val}</div>
                                <div className="text-[0.55rem] text-brand-sky-light tracking-[2px] uppercase">{lbl}</div>
                            </div>
                        ))}
                    </div>

                    {/* Overall stars */}
                    <div className="bg-white/[0.09] border border-brand-lime/30 rounded-lg px-5 py-2.5 text-center backdrop-blur-sm">
                        <div className="flex items-center gap-1.5 justify-center">
                            <Stars count={5} size={18} />
                        </div>
                        <div className="text-[0.6rem] text-brand-lime tracking-[2px] uppercase mt-1 font-semibold">
                            Top bewertet
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BLUE DIVIDER ── */}
            <div className="bg-brand-sky h-1 shadow-[0_2px_12px_rgba(59,169,211,0.38)]" />

            {/* ── CAROUSEL CONTENT ── */}
            <div className="max-w-[1360px] mx-auto px-5 py-8 relative">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-brand-sky" />
                        <span className="text-[0.72rem] tracking-[3px] text-white uppercase font-bold">
                            Kundenstimmen
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-3 min-w-[60px]" />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Page indicator */}
                        <span className="text-[0.7rem] text-white/40 font-mono">
                            {page + 1}/{totalPages}
                        </span>

                        {/* Arrows */}
                        <button
                            onClick={goPrev}
                            className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            aria-label="Vorherige Bewertungen"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={goNext}
                            className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            aria-label="Nächste Bewertungen"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={page}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {visibleReviews.map((review, i) => (
                                <ReviewCard key={`${page}-${i}`} review={review} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mt-6">
                    {Array.from({ length: Math.min(totalPages, 20) }).map((_, i) => {
                        // Show a subset of dots if there are too many pages
                        const dotIndex = totalPages <= 20 ? i : Math.round((i / 19) * (totalPages - 1));
                        return (
                            <button
                                key={i}
                                onClick={() => goTo(dotIndex, dotIndex > page ? 1 : -1)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${dotIndex === page
                                    ? "w-6 bg-brand-sky"
                                    : "w-1.5 bg-white/15 hover:bg-white/30"
                                    }`}
                                aria-label={`Seite ${dotIndex + 1}`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="bg-black/20 text-brand-sky-light text-center px-5 py-3.5 text-[0.7rem] tracking-[2px] uppercase">
                THITRONIK® · Kundenfeedback aus Google Bewertungen
            </div>
        </div>
    );
}
