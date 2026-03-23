export interface FillTheGapQuestion {
  id: string;
  category: "produkte" | "einbau" | "alarmsysteme" | "allgemein";
  /** Satz mit Platzhalter {{gap}} für die Lücke */
  sentence: string;
  /** Korrekte Antwort */
  answer: string;
  /** Akzeptierte Alternativ-Antworten (case-insensitive) */
  acceptedAlternatives?: string[];
  /** Optionen für Multiple-Choice (inkl. korrekter Antwort) */
  options: string[];
  /** Erklärung nach Beantwortung */
  explanation?: string;
}

export const fillTheGapQuestions: FillTheGapQuestion[] = [
  {
    id: "ftg-001",
    category: "produkte",
    sentence: "Der {{gap}} schützt Wohnmobile zuverlässig vor Gasangriffen während der Nacht.",
    answer: "G.A.S.-Pro",
    acceptedAlternatives: ["GAS Pro", "Gas Pro", "GAS-Pro"],
    options: ["G.A.S.-Pro", "WiPro III", "C.A.S.-Pro", "ProLiner"],
    explanation: "Der G.A.S.-Pro ist Thitroniks Gaswarner für Wohnmobile."
  },
  {
    id: "ftg-002",
    category: "alarmsysteme",
    sentence: "Die {{gap}} ist eine modulare Alarmanlage ohne störende Bewegungsmelder.",
    answer: "WiPro III",
    acceptedAlternatives: ["WiPro 3", "Wi Pro III", "Wipro"],
    options: ["WiPro III", "G.A.S.-Pro", "C.A.S.-Pro", "Pro-finder"],
    explanation: "Das Herzstück des Thitronik-Systems, welches auf Magnetkontakte statt auf Bewegungsmelder setzt."
  },
  {
    id: "ftg-003",
    category: "produkte",
    sentence: "Der {{gap}} dient als Ortungssystem und sendet Alarmmeldungen per SMS an das Smartphone.",
    answer: "Pro-finder",
    acceptedAlternatives: ["Pro finder", "Profinder"],
    options: ["Pro-finder", "WiPro III", "G.A.S.-pro", "Funk-Gaswarner"],
    explanation: "Der Pro-finder ergänzt die WiPro III um GPS-Ortung und Benachrichtigungen."
  },
  {
    id: "ftg-004",
    category: "einbau",
    sentence: "Beim Einbau der WiPro III wird die Zentrale idealerweise im {{gap}} montiert.",
    answer: "Innenraum",
    acceptedAlternatives: ["Wohnraum", "Fahrzeuginnenraum"],
    options: ["Innenraum", "Motorraum", "Außenbereich", "Gaskasten"],
    explanation: "Die Zentrale sollte trocken und geschützt im Innenraum montiert werden."
  },
  {
    id: "ftg-005",
    category: "einbau",
    sentence: "Die Funk-Magnetkontakte der WiPro III benötigen keine {{gap}} für die Montage.",
    answer: "Kabel",
    acceptedAlternatives: ["Verkabelung", "Kabelverbindung", "Kabelstränge"],
    options: ["Kabel", "Batterien", "Schrauben", "Zulassung"],
    explanation: "Einer der Hauptvorteile sind die kabellosen Magnetkontakte, die über Funk kommunizieren."
  },
  {
    id: "ftg-006",
    category: "allgemein",
    sentence: "Thitronik-Produkte sind speziell für die Nachrüstung in {{gap}} und Kastenwagen entwickelt.",
    answer: "Wohnmobile",
    acceptedAlternatives: ["Wohnmobilen", "Reisemobile", "Reisemobilen", "Camper"],
    options: ["Wohnmobile", "PKW", "LKW", "Motorräder"],
    explanation: "Der Fokus von Thitronik liegt maßgeblich auf dem Freizeitfahrzeugsektor."
  },
  {
    id: "ftg-007",
    category: "alarmsysteme",
    sentence: "Ein Vorteil der WiPro III ist der Aufenthalt im Fahrzeug trotz {{gap}} Anlage.",
    answer: "scharfer",
    acceptedAlternatives: ["aktivierter", "eingeschalteter"],
    options: ["scharfer", "deaktivierter", "geschlossener", "stromloser"],
    explanation: "Da das System die Außenhaut sichert, kann man sich im Aufbau frei bewegen."
  },
  {
    id: "ftg-008",
    category: "alarmsysteme",
    sentence: "Das System warnt rechtzeitig, falls noch ein {{gap}} beim Losfahren geöffnet ist.",
    answer: "Fenster",
    acceptedAlternatives: ["Dachfenster", "Dachluke"],
    options: ["Fenster", "Tankdeckel", "Wassertank", "Gasventil"],
    explanation: "Die Vent-Check Funktion prüft den Status der Kontakte beim Einschalten der Zündung."
  },
  {
    id: "ftg-009",
    category: "produkte",
    sentence: "Der {{gap}} detektiert sowohl Propan/Butan als auch sogenannte KO-Gase.",
    answer: "G.A.S.-Pro",
    acceptedAlternatives: ["GAS Pro", "GAS-Pro"],
    options: ["G.A.S.-Pro", "G.A.S.-plug", "C.A.S.-Pro", "Pro-finder"],
    explanation: "Der Festsensor ist für unterschiedliche Gase ausgelegt und kalibriert sich automatisch."
  },
  {
    id: "ftg-010",
    category: "einbau",
    sentence: "Ein G.A.S.-Pro sollte optimalerweise auf {{gap}} montiert werden, um Gase früh zu erkennen.",
    answer: "mittlerer Höhe",
    acceptedAlternatives: ["Mitte", "mittig"],
    options: ["mittlerer Höhe", "Bodenhöhe", "Deckenhöhe", "Dachhöhe"],
    explanation: "Je nach Gasart (schwerer als Luft oder leichter), gibt es verschiedene Montage-Empfehlungen für die Zusatzsensoren."
  },
  {
    id: "ftg-011",
    category: "einbau",
    sentence: "Für den C.A.S.-Pro wird der direkte Anschluss an den {{gap}} des Fahrzeugs benötigt.",
    answer: "CAN-Bus",
    acceptedAlternatives: ["CAN Bus", "CANBus"],
    options: ["CAN-Bus", "LIN-Bus", "OBD-Stecker", "Autoradio"],
    explanation: "Der C.A.S.-Pro verwendet die fahrzeugeigenen Daten zur Auswertung der Sicherheit."
  },
  {
    id: "ftg-012",
    category: "produkte",
    sentence: "Die {{gap}} ist ein kleines Gadget zum Anstecken in den Zigarettenanzünder.",
    answer: "G.A.S.-plug",
    acceptedAlternatives: ["GAS plug", "GAS-plug"],
    options: ["G.A.S.-plug", "G.A.S.-Pro", "WiPro III", "GPS-Tracker"],
    explanation: "Der G.A.S.-plug ist die mobile Lösung für Mietfahrzeuge oder zum einfachen Mitnehmen."
  },
  {
    id: "ftg-013",
    category: "alarmsysteme",
    sentence: "Das Öffnen einer durch einen Magnetkontakt gesicherten Tür löst sofort die {{gap}} aus.",
    answer: "Sirene",
    acceptedAlternatives: ["Alarm", "Alarmanlage"],
    options: ["Sirene", "Zündung", "Lüftung", "Heizung"],
    explanation: "Die Sirene dient der Abschreckung und der Aufmerksamkeitserregung."
  },
  {
    id: "ftg-014",
    category: "allgemein",
    sentence: "Die Reichweite der Funkkontakte beträgt im Freifeld ca. {{gap}} Meter.",
    answer: "75",
    acceptedAlternatives: ["75m", "siebzig"],
    options: ["75", "10", "300", "500"],
    explanation: "Die Signalstärke reicht problemlos für Wohnwagen und große Wohnmobile."
  },
  {
    id: "ftg-015",
    category: "produkte",
    sentence: "Der {{gap}} ist ein Sicherungssystem für E-Bikes auf dem Fahrradträger.",
    answer: "Funk-Kabelschleife",
    acceptedAlternatives: ["Kabelschleife", "Zubehör"],
    options: ["Funk-Kabelschleife", "Spannband", "Fahrrad-Plug", "Gepäcknetz"],
    explanation: "Durch Zerschneiden oder Lösen des Kabels wird der Alarm ausgelöst."
  },
  {
    id: "ftg-016",
    category: "einbau",
    sentence: "Um Fehlalarme zu vermeiden, dürfen Magnetkontakte nicht an heißen {{gap}} befestigt werden.",
    answer: "Wärmequellen",
    acceptedAlternatives: ["Heizungen", "Öfen"],
    options: ["Wärmequellen", "Kühlschränken", "Fenstern", "Holzverkleidungen"],
    explanation: "Temperaturschwankungen und metallische Nachbarbauteile können Magnetfelder beeinflussen."
  },
  {
    id: "ftg-017",
    category: "einbau",
    sentence: "Zusätzliche Funk-Komponenten können einfach durch einen Tastendruck an der Zentrale {{gap}} werden.",
    answer: "angelernt",
    acceptedAlternatives: ["verbunden", "gekoppelt", "eingelernt"],
    options: ["angelernt", "gelöscht", "aufgeschraubt", "verkabelt"],
    explanation: "Das Anlernen (Pairing) erfolgt schnell und ohne PC oder Laptop."
  },
  {
    id: "ftg-018",
    category: "alarmsysteme",
    sentence: "Eine Panikfunktion kann durch die externe {{gap}} ausgelöst werden.",
    answer: "Funkfernbedienung",
    acceptedAlternatives: ["Fernbedienung", "Schlüssel", "Paniksender"],
    options: ["Funkfernbedienung", "App", "Zentrale", "Sirene"],
    explanation: "Mit der Funkfernbedienung kann jederzeit der Alarm ausgelöst werden, wenn man sich bedroht fühlt."
  },
  {
    id: "ftg-019",
    category: "allgemein",
    sentence: "Thitronik entwickelt und produziert die Alarmsysteme exklusiv in {{gap}}.",
    answer: "Deutschland",
    acceptedAlternatives: ["Germany"],
    options: ["Deutschland", "China", "Polen", "USA"],
    explanation: "Die Systeme tragen das Qualitätssiegel Made in Germany."
  },
  {
    id: "ftg-020",
    category: "produkte",
    sentence: "Das System {{gap}} schützt insbesondere Fahrzeuge aus dem PSA / Stellantis Konzern.",
    answer: "WiPro III safe.lock",
    acceptedAlternatives: ["safe.lock", "WiPro safe lock", "WiPro 3 safe.lock"],
    options: ["WiPro III safe.lock", "WiPro Classic", "Pro-finder", "C.A.S.-Pro"],
    explanation: "Schließt die Sicherheitslücken in den Funkschlüsseln der Basisfahrzeuge."
  },
  {
    id: "ftg-021",
    category: "allgemein",
    sentence: "Ein {{gap}} (Replay-Angriff) wird von der safe.lock Funktion verhindert.",
    answer: "Replay-Angriff",
    acceptedAlternatives: ["Replay Angriff", "Replay", "Kopierangriff"],
    options: ["Replay-Angriff", "Hacker-Angriff", "DDoS-Angriff", "Spam-Angriff"],
    explanation: "Die Fernbedienungssignale werden bei safe.lock mit rollierenden Codes gesichert."
  },
  {
    id: "ftg-022",
    category: "einbau",
    sentence: "Die LED der Alarmanlage sollte so verbaut werden, dass sie von außen gut {{gap}} ist.",
    answer: "sichtbar",
    acceptedAlternatives: ["erkennbar", "zu sehen"],
    options: ["sichtbar", "versteckt", "abgedeckt", "beleuchtet"],
    explanation: "Eine gut sichtbare LED dient als Abschreckung für potentielle Einbrecher."
  },
  {
    id: "ftg-023",
    category: "einbau",
    sentence: "Ein {{gap}} muss immer einen ausreichenden Abstand zu Magneten im Fahrzeug haben.",
    answer: "Magnetkontakt",
    acceptedAlternatives: ["Kontakt", "Sensor"],
    options: ["Magnetkontakt", "Gas-Sensor", "GPS-Tracker", "Netzteil"],
    explanation: "Starke Fremdmagnetfelder können die Funktion stören."
  },
  {
    id: "ftg-024",
    category: "alarmsysteme",
    sentence: "Wenn man das Fahrzeug verlässt, quittiert die Alarmanlage das Schärfen durch einen kurzen {{gap}}.",
    answer: "Quittungston",
    acceptedAlternatives: ["Ton", "Piep", "Signalton"],
    options: ["Quittungston", "Lichtblitz", "Anruf", "SMS"],
    explanation: "Der Ton bestätigt, dass das System erfolgreich scharfgeschaltet ist."
  },
  {
    id: "ftg-025",
    category: "produkte",
    sentence: "Der {{gap}} überwacht den Fahrzeuginnenraum nur, wenn man es wirklich wünscht, da er sonst oft stört.",
    answer: "Bewegungsmelder",
    acceptedAlternatives: ["Radar", "Ultraschall", "Infrarot"],
    options: ["Bewegungsmelder", "Kühlschrank", "Rauchmelder", "Heizlüfter"],
    explanation: "Die WiPro III kommt daher ohne Bewegungsmelder aus, um Fehlalarme durch Tiere oder Personen zu vermeiden."
  },
  {
    id: "ftg-026",
    category: "einbau",
    sentence: "Beim C.A.S.-Pro muss die korrekte {{gap}} in den Fahrzeugeinstellungen programmiert werden.",
    answer: "Codierung",
    acceptedAlternatives: ["Programmierung", "Einstellung"],
    options: ["Codierung", "Lackierung", "Temperatur", "Reifengröße"],
    explanation: "Die Integration in den CAN-Bus erfordert oft eine Anpassung des Fahrzeugsteuergerätes."
  },
  {
    id: "ftg-027",
    category: "alarmsysteme",
    sentence: "Die Alarmanlage hat eine integrierte {{gap}}, die das System bei Stromausfall weiterversorgt.",
    answer: "Notstromversorgung",
    acceptedAlternatives: ["Batterie", "Akku"],
    options: ["Notstromversorgung", "Solarzelle", "Lichtmaschine", "Brennstoffzelle"],
    explanation: "Ein kleiner Backup-Akku in der Zentrale stellt sicher, dass die Sirene bei Durchtrennen des Fahrzeugstroms weiter heult."
  },
  {
    id: "ftg-028",
    category: "produkte",
    sentence: "Zur Sicherung von Stauklappen werden häufig extrem flache {{gap}} verwendet.",
    answer: "Funk-Magnetkontakte",
    acceptedAlternatives: ["Magnetkontakte", "Kontakte"],
    options: ["Funk-Magnetkontakte", "Schlösser", "Riegel", "Kameras"],
    explanation: "Besonders die extrem kleinen Profile der Thitronik Sensoren eignen sich für enge Spaltmaße."
  },
  {
    id: "ftg-029",
    category: "einbau",
    sentence: "Der Pro-finder benötigt für den vollen Funktionsumfang eine aktive {{gap}}.",
    answer: "SIM-Karte",
    acceptedAlternatives: ["SIM", "Karte", "Mobilfunkkarte"],
    options: ["SIM-Karte", "SD-Karte", "WLAN-Antenne", "Bluetooth-Verbindung"],
    explanation: "Für das Senden von SMS und Daten an den Server."
  },
  {
    id: "ftg-030",
    category: "allgemein",
    sentence: "Das {{gap}} Zertifikat bescheinigt Thitronik Alarmanlagen eine besonders hohe Sicherheit.",
    answer: "E1",
    acceptedAlternatives: ["KBA", "TÜV"],
    options: ["E1", "A+", "ISO 9001", "CE"],
    explanation: "Thitronik Anlagen besitzen eine e1-Zulassung des Kraftfahrt-Bundesamtes."
  }
];
