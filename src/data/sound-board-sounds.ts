export interface ThitronikSound {
  id: string
  name: string
  product: string
  category: "gaswarner" | "alarmanlage" | "funkfernbedienung" | "sonstige"
  /** Pfad relativ zu /public */
  audioSrc: string
  /** Beschreibung wann dieser Sound ertönt */
  description: string
  /** Icon/Emoji für die Card */
  icon: string
}

export const sounds: ThitronikSound[] = [
  {
    id: "snd-001",
    name: "Gas-Alarm",
    product: "G.A.S.-Pro",
    category: "gaswarner",
    audioSrc: "/sounds/gas-alarm.mp3",
    description: "Ertönt bei Erkennung von Narkosegas oder Propan/Butan im Wohnmobil.",
    icon: "🔔"
  },
  {
    id: "snd-002",
    name: "Einbruch-Alarm",
    product: "WiPro III",
    category: "alarmanlage",
    audioSrc: "/sounds/einbruch-alarm.mp3",
    description: "Sirene bei unbefugtem Öffnen von Türen oder Klappen.",
    icon: "🚨"
  },
  {
    id: "snd-003",
    name: "Quittungston Schärfen",
    product: "WiPro III",
    category: "alarmanlage",
    audioSrc: "/sounds/quittungston-schaerfen.mp3",
    description: "Ein kurzer Signalton beim erfolgreichen Schärfen der Alarmanlage.",
    icon: "🔒"
  },
  {
    id: "snd-004",
    name: "Quittungston Entschärfen",
    product: "WiPro III",
    category: "alarmanlage",
    audioSrc: "/sounds/quittungston-entschaerfen.mp3",
    description: "Zwei kurze Signaltöne beim Entschärfen der Alarmanlage.",
    icon: "🔓"
  },
  {
    id: "snd-005",
    name: "Panikalarm",
    product: "Funkfernbedienung",
    category: "funkfernbedienung",
    audioSrc: "/sounds/panikalarm.mp3",
    description: "Sofortige Auslösung der Sirene über die Fernbedienung im Notfall.",
    icon: "⚠️"
  },
  {
    id: "snd-006",
    name: "Sensor anlernen",
    product: "WiPro III",
    category: "alarmanlage",
    audioSrc: "/sounds/sensor-anlernen.mp3",
    description: "Bestätigungston, wenn ein neuer Funk-Magnetkontakt erfolgreich mit der Zentrale verbunden wurde.",
    icon: "✅"
  },
  {
    id: "snd-007",
    name: "Fehler beim Anlernen",
    product: "WiPro III",
    category: "alarmanlage",
    audioSrc: "/sounds/fehler-anlernen.mp3",
    description: "Tiefer Signalton, wenn das Anlernen eines Sensors fehlgeschlagen ist.",
    icon: "❌"
  },
  {
    id: "snd-008",
    name: "Vent-Check Warnung",
    product: "WiPro III",
    category: "alarmanlage",
    audioSrc: "/sounds/vent-check.mp3",
    description: "Hinweiston beim Einschalten der Zündung, falls noch ein Fenster (mit Magnetkontakt) geöffnet ist.",
    icon: "🪟"
  },
  {
    id: "snd-009",
    name: "Kabelschleife durchtrennt",
    product: "Funk-Kabelschleife",
    category: "sonstige",
    audioSrc: "/sounds/kabelschleife.mp3",
    description: "Alarm durch die Zentrale, wenn das Sicherungskabel am Fahrradträger durchschnitten wird.",
    icon: "🚲"
  },
  {
    id: "snd-010",
    name: "Selbsttest erfolgreich",
    product: "G.A.S.-Pro",
    category: "gaswarner",
    audioSrc: "/sounds/selbsttest-gas.mp3",
    description: "Pfeifton als Bestätigung nach dem Einschalten und der Selbstkalibrierungsphase.",
    icon: "🩺"
  },
  {
    id: "snd-011",
    name: "Batterie schwach",
    product: "Funk-Magnetkontakt",
    category: "sonstige",
    audioSrc: "/sounds/batterie-schwach.mp3",
    description: "Wiederholtes Piepen alle paar Minuten, wenn die Knopfzelle im Sensor fast leer ist.",
    icon: "🔋"
  },
  {
    id: "snd-012",
    name: "Sabotagealarm",
    product: "C.A.S.-Pro",
    category: "alarmanlage",
    audioSrc: "/sounds/sabotage.mp3",
    description: "Auslösung der Alarmanlage beim Versuch, das Gehäuse der Zentrale gewaltsam zu öffnen.",
    icon: "🔨"
  }
]
