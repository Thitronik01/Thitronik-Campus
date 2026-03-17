export interface WasBinIchProduct {
  id: string;
  name: string;
  artikelNummer: string;
  accentColor: string;
  emoji: string;
  hinweise: string[]; // exakt 5, Ich-Perspektive
  funFact: string;
  acceptedAnswers: string[]; // Aliases für Freitexteingabe
}

export const PRODUCTS: WasBinIchProduct[] = [
  {
    id: "funk-handsender-868",
    name: "Funk-Handsender 868",
    artikelNummer: "101064",
    accentColor: "#A3E635",
    emoji: "📡",
    hinweise: [
      "Ich sende auf einer Frequenz von 868,35 MHz.",
      "Ich habe genau 2 Tasten – eine zum Scharfschalten, eine zum Unscharfschalten.",
      "Ich passe ausschließlich zu einem einzigen Thitronik-System – eine Nutzung mit anderen Funksystemen ist nicht möglich.",
      "Ich bin nach der Funkrichtlinie 2014/53/EU CE-zertifiziert und trage die Art.-Nr. 101064.",
      "Ich bin der handliche Schlüssel zur WiPro III Alarmanlage – per Funk, ganz ohne Kabel."
    ],
    funFact: "Der Funk-Handsender 868 kann an bis zu 100 verschiedene WiPro III Zentralen angelernt werden – ideal für Händler mit Flottenfahrzeugen!",
    acceptedAnswers: ["funk-handsender", "handsender", "funk handsender 868", "funksender", "handsender 868"]
  },
  {
    id: "wipro-iii",
    name: "WiPro III",
    artikelNummer: "diverse",
    accentColor: "#38BDF8",
    emoji: "🔒",
    hinweise: [
      "Ich empfange auf 868,35 MHz und kann bis zu 100 Funksender anlernen.",
      "Ich arbeite mit 9–30V DC und nehme im Betrieb nur ca. 11 mA auf.",
      "Mein Codesystem hat über 4 Milliarden mögliche Kombinationen – Codeklonen ist praktisch ausgeschlossen.",
      "Ich habe einen integrierten Störsenderalarm (Anti-Jamming) – wer versucht, mein Funksignal zu stören, löst damit selbst Alarm aus.",
      "Ich bin Thitroniks meistverbautte Fahrzeugalarmanlage und biete Sirenenausgang, Blinkersteuerung und Zündungsüberwachung."
    ],
    funFact: "Die WiPro III erkennt aktive Störsender (Jammer) und schlägt sofort Alarm – Fahrzeugdiebe mit Funkstörern haben keine Chance!",
    acceptedAnswers: ["wipro iii", "wipro 3", "wipro", "wi pro iii", "wi-pro iii"]
  },
  {
    id: "pro-finder",
    name: "Pro-finder",
    artikelNummer: "diverse",
    accentColor: "#FB923C",
    emoji: "📍",
    hinweise: [
      "Ich verrate jederzeit, wo sich ein Fahrzeug gerade befindet.",
      "Ich arbeite mit dem BT-connect-Modul zusammen, um meine Daten zu übertragen.",
      "Ich liefere Position, Geschwindigkeit und Batteriezustand in Echtzeit.",
      "Ich bin der GPS-Tracker im Thitronik Ökosystem.",
      "Ohne mich wäre ein gestohlenes Fahrzeug nur sehr schwer wiederzufinden."
    ],
    funFact: "Der Pro-finder kann via BT-connect nicht nur orten – er liefert auch Geschwindigkeitsdaten und den aktuellen Batteriezustand des Fahrzeugs.",
    acceptedAnswers: ["pro-finder", "pro finder", "profinder", "gps tracker", "ortungsgerät"]
  },
  {
    id: "gas-pro-iii",
    name: "G.A.S.-pro III",
    artikelNummer: "diverse",
    accentColor: "#A78BFA",
    emoji: "⚗️",
    hinweise: [
      "Ich erkenne unsichtbare Gefahren: Propan, Butan und sogar Betäubungsgase.",
      "Ich arbeite mit 12V oder 24V Bordspannung und verbrauche im Standby nur 0,009 mA.",
      "Wenn ich anschlage, schließe ich automatisch ein Magnetventil, um die Gasquelle zu sperren.",
      "Ich bin speziell für den Einsatz in Wohnmobilen, Reisebussen und Campingfahrzeugen entwickelt.",
      "Ich bin der Gaswarner im Thitronik-Portfolio und schütze vor explosiven und betäubenden Gasen."
    ],
    funFact: "Der G.A.S.-pro III erkennt auch Betäubungsgase – ein Schutz gegen eine perfide Einbruchmethode, bei der Fahrzeuginsassen durch das Einleiten von Gas bewusstlos gemacht werden.",
    acceptedAnswers: ["gas-pro iii", "gas pro iii", "gas pro 3", "gaspro", "g.a.s. pro iii", "gaswarner"]
  },
  {
    id: "wipro-iii-safelock",
    name: "WiPro III safe.lock",
    artikelNummer: "diverse",
    accentColor: "#34D399",
    emoji: "🛡️",
    hinweise: [
      "Ich bin die Weiterentwicklung der WiPro III – mit einer zusätzlichen Sicherheitsstufe.",
      "Ich kann drahtlose Funksensoren wie den T.S.A. Funk-Rauchmelder direkt anlernen.",
      "Ich bin das Herzstück für das gesamte Thitronik Funk-Ökosystem: Rauchmelder, Gaswarner und Handsender sprechen alle mit mir.",
      "Mein Namenszusatz verrät, dass ich eine besonders sichere Schlossfunktion integriert habe.",
      "Ich bin kompatibel mit dem BT-connect-Modul für Bluetooth-Vernetzung."
    ],
    funFact: "Die WiPro III safe.lock ist das Bindeglied des gesamten Thitronik Funk-Systems – Rauchmelder, Gaswarner, Handsender und BT-connect laufen alle über sie zusammen.",
    acceptedAnswers: ["wipro iii safe.lock", "wipro safe lock", "wipro safelock", "safe.lock", "wipro 3 safe lock"]
  },
  {
    id: "tsa-funk-rauchmelder",
    name: "T.S.A. Funk-Rauchmelder",
    artikelNummer: "105753 / 105754",
    accentColor: "#F87171",
    emoji: "🔥",
    hinweise: [
      "Ich bin in zwei Farben erhältlich: Weiß (Art.-Nr. 105753) und Grau (Art.-Nr. 105754).",
      "Ich kommuniziere kabellos mit der WiPro III und der WiPro III safe.lock.",
      "Wenn ich Rauch erkenne, melde ich das sofort an die Alarmzentrale – die löst dann den Alarm aus.",
      "Ich muss aktiv an die Alarmzentrale angelernt werden, bevor ich funktioniere.",
      "Ich schütze Fahrzeuginsassen vor einer der größten Gefahren auf Reisen: Feuer und Rauch im Schlaf."
    ],
    funFact: "Der T.S.A. Funk-Rauchmelder sendet seinen Alarm kabellos – er kann damit auch in Wohnmobilen nachgerüstet werden, ohne aufwändige Verkabelung.",
    acceptedAnswers: ["tsa funk rauchmelder", "funk rauchmelder", "rauchmelder", "t.s.a. rauchmelder", "tsa rauchmelder"]
  },
  {
    id: "keycard",
    name: "KeyCard",
    artikelNummer: "diverse",
    accentColor: "#FBBF24",
    emoji: "💳",
    hinweise: [
      "Ich sehe aus wie eine normale Scheckkarte – bin aber viel mehr als das.",
      "Ich diene als berührungsloser Schlüsselersatz für Thitronik Alarmsysteme.",
      "Ich nutze RFID-Technologie, um die Alarmanlage zu scharf- oder unscharzuschalten.",
      "Ich passe in jede Brieftasche und falle kaum auf – ideal für diskrete Fahrzeugsicherung.",
      "Ich bin die elegante Alternative zum klassischen Funk-Handsender."
    ],
    funFact: "Die KeyCard sieht aus wie eine gewöhnliche Kreditkarte – potenzielle Diebe erkennen gar nicht, dass der Fahrzeugbesitzer gerade die Alarmanlage scharf stellt.",
    acceptedAnswers: ["keycard", "key card", "rfid karte", "schlüsselkarte"]
  },
  {
    id: "bt-connect",
    name: "BT-connect",
    artikelNummer: "diverse",
    accentColor: "#60A5FA",
    emoji: "📶",
    hinweise: [
      "Ich verbinde Thitronik-Geräte kabellos über Bluetooth mit der Außenwelt.",
      "Ich bin das Bindeglied zwischen WiPro III safe.lock und dem Pro-finder.",
      "Ohne mich kann der Pro-finder seine GPS-Daten nicht übermitteln.",
      "Mein Name setzt sich aus der Funktechnik und dem englischen Wort für 'verbinden' zusammen.",
      "Ich bin ein reines Vernetzungsmodul – ich habe keinen eigenen Sensor, aber ich bringe alle anderen zum Sprechen."
    ],
    funFact: "Der BT-connect macht aus einzelnen Thitronik-Produkten ein vernetztes System – erst durch ihn werden Pro-finder-Daten wie Position und Geschwindigkeit in Echtzeit übertragbar.",
    acceptedAnswers: ["bt-connect", "bt connect", "btconnect", "bluetooth modul", "bluetooth connect"]
  }
];
