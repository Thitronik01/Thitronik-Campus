// ─────────────────────────────────────────────────────────────────────────────
// Default CMS Blocks – Thitronik Campus 2.0 (v2 Refactored)
// Production-ready content for all 7 training islands.
// ─────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid'
import type { CMSBlock, DistributedOmit } from './types'

// Helper: assign auto-incrementing order to blocks
function withOrder(blocks: DistributedOmit<CMSBlock, 'order'>[]): CMSBlock[] {
  return blocks.map((b, i) => ({ ...b, order: i }) as CMSBlock)
}

const POEL_BLOCKS: DistributedOmit<CMSBlock, 'order'>[] = [
  {
    id: uuidv4(), type: 'heading',
    level: 1, text: 'Willkommen im Thitronik Campus'
  },
  {
    id: uuidv4(), type: 'text',
    content: 'Deine digitale Schulungsplattform für Händler & Servicepartner. Heute lernst du alles rund um Installation, Verkauf und Support der Thitronik-Produktwelt.'
  },
  {
    id: uuidv4(), type: 'text',
    content: `## Was erwartet dich heute?\n\nDer Thitronik Campus begleitet dich durch **7 Inseln** – jede mit eigenem Schwerpunkt:\n\n| Insel | Thema |\n|-------|-------|\n| 🏝️ Poel | Onboarding & Plattform-Tour |\n| ⚓ Vejrø | WiPro III Produktschulung |\n| 🌊 Hiddensee | Einbau-Praxis |\n| ⛵ Samsø | Basisfahrzeuge & Kompatibilität |\n| 🗺️ Langeland | Beratung & Verkauf |\n| 🔭 Usedom | Konfigurator & Pro-finder |\n| 🔧 Fehmarn | Support & Troubleshooting |`
  },
  {
    id: uuidv4(), type: 'checklist',
    title: 'Lernziele: Poel',
    items: [
      { id: uuidv4(), label: 'Ich kenne alle 7 Inseln und ihre Themen', checked: false },
      { id: uuidv4(), label: 'Ich habe meinen QR-Code eingescannt und bin eingecheckt', checked: false },
      { id: uuidv4(), label: 'Ich kenne die Navigation im Campus (XP, Badges, Profil)', checked: false },
    ]
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// INSEL 2 – VEJRØ: WiPro III Produktschulung
// ═══════════════════════════════════════════════════════════════════════════

const VEJROE_BLOCKS: DistributedOmit<CMSBlock, 'order'>[] = [
  {
    id: uuidv4(), type: 'heading',
    level: 1, text: 'WiPro III – Die Fahrzeugsicherheitsanlage'
  },
  {
    id: uuidv4(), type: 'cards',
    title: 'Key Features',
    cards: [
      { id: uuidv4(), title: 'Spannung', content: '9–30V DC (12V & 24V Vehicles)' },
      { id: uuidv4(), title: 'Frequenz', content: '868,35 MHz Technik' },
      { id: uuidv4(), title: 'Kapazität', content: 'Bis zu 100 Funk-Sender' }
    ]
  },
  {
    id: uuidv4(), type: 'steps',
    title: 'Zubehör anlernen – easy add 1.0',
    steps: [
      { id: uuidv4(), title: 'Vorbereiten', description: 'Alle Öffnungen schließen, Anlage unscharf.' },
      { id: uuidv4(), title: 'Strom trennen', description: '10 Sek. unterbrechen, dann wieder herstellen.' },
      { id: uuidv4(), title: 'Aktivieren', description: 'Innerhalb 30 Sek. Lautsprecher-Taste 5x drücken.' }
    ]
  },
  {
    id: uuidv4(), type: 'video',
    url: 'https://www.youtube.com/watch?v=example',
    caption: 'WiPro III – Einbau & Inbetriebnahme'
  },
  {
    id: uuidv4(), type: 'quiz',
    question: 'Wie viele Funk-Sender können maximal an eine WiPro III angelernt werden?',
    options: [
      { id: uuidv4(), text: '10', isCorrect: false },
      { id: uuidv4(), text: '50', isCorrect: false },
      { id: uuidv4(), text: '100', isCorrect: true },
      { id: uuidv4(), text: 'Unbegrenzt', isCorrect: false }
    ],
    explanation: 'Die WiPro III Zentrale kann bis zu 100 individuelle Funk-Sensoren oder Handsender verwalten.',
    xpReward: 50
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// INSEL 3 – HIDDENSEE: Einbau-Praxis
// ═══════════════════════════════════════════════════════════════════════════

const HIDDENSEE_BLOCKS: DistributedOmit<CMSBlock, 'order'>[] = [
  {
    id: uuidv4(), type: 'heading',
    level: 1, text: 'Einbau & Montage in der Praxis'
  },
  {
    id: uuidv4(), type: 'text',
    content: '> [!WARNING]\n> Arbeiten an der Fahrzeugelektrik dürfen NUR von ausgebildeten Fachwerkstätten durchgeführt werden.'
  },
  {
    id: uuidv4(), type: 'comparison',
    title: 'Kabelfarben & Belegung',
    headers: ['Leitung', 'Farbe', 'Funktion'],
    rows: [
      { id: uuidv4(), values: ['Masse', 'Schwarz', 'Ground (Pin 1)'] },
      { id: uuidv4(), values: ['Sirene', 'Weiß', '+12V (Pin 15)'] },
      { id: uuidv4(), values: ['Blinker', 'Grau/Weiß', 'Ansteuerung'] }
    ]
  },
  {
    id: uuidv4(), type: 'game',
    gameId: 'order',
    title: 'Montage-Reihenfolge',
    description: 'Bringe die Schritte in die richtige Reihenfolge.',
    isRequired: true,
    xpReward: 75
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// INSEL 4 – SAMSØ: Basisfahrzeuge & Kompatibilität
// ═══════════════════════════════════════════════════════════════════════════

const SAMSOE_BLOCKS: DistributedOmit<CMSBlock, 'order'>[] = [
  {
    id: uuidv4(), type: 'heading',
    level: 1, text: 'Fahrzeugkunde für Thitronik-Systeme'
  },
  {
    id: uuidv4(), type: 'faq',
    items: [
      { id: uuidv4(), question: 'Wann safe.lock empfehlen?', answer: 'Bei Fahrzeugen mit CAN-Bus, um die Originalschlüssel-Funktion zu nutzen.' },
      { id: uuidv4(), question: 'Passt die Anlage in 24V LKWs?', answer: 'Ja, die WiPro III ist von 9V bis 30V kompatibel.' }
    ]
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// INSEL 5 – LANGELAND: Beratung & Verkauf
// ═══════════════════════════════════════════════════════════════════════════

const LANGELAND_BLOCKS: DistributedOmit<CMSBlock, 'order'>[] = [
  {
    id: uuidv4(), type: 'heading',
    level: 1, text: 'Der perfekte Thitronik-Verkauf'
  },
  {
    id: uuidv4(), type: 'game',
    gameId: 'sales-simulator',
    title: 'Verkaufs-Simulator',
    description: 'Führe ein Beratungsgespräch.',
    isRequired: true,
    xpReward: 100
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// INSEL 6 – USEDOM: Pro-finder & Konfigurator
// ═══════════════════════════════════════════════════════════════════════════

const USEDOM_BLOCKS: DistributedOmit<CMSBlock, 'order'>[] = [
  {
    id: uuidv4(), type: 'heading',
    level: 1, text: 'Pro-finder & Digitale Tools'
  },
  {
    id: uuidv4(), type: 'presentation',
    fileId: 'pro-finder-guide',
    title: 'Pro-finder Telemetrie-Guide',
    slideCount: 12
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// INSEL 7 – FEHMARN: Support & Troubleshooting
// ═══════════════════════════════════════════════════════════════════════════

const FEHMARN_BLOCKS: DistributedOmit<CMSBlock, 'order'>[] = [
  {
    id: uuidv4(), type: 'heading',
    level: 1, text: 'Support & Troubleshooting'
  },
  {
    id: uuidv4(), type: 'comparison',
    title: 'LED Blinkcodes',
    headers: ['Code', 'Ursache'],
    rows: [
      { id: uuidv4(), values: ['1x', 'Kabinentüren'] },
      { id: uuidv4(), values: ['5x', 'G.A.S. Alarm'] },
      { id: uuidv4(), values: ['8x', 'Stromausfall'] }
    ]
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT MAP
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_ISLAND_BLOCKS: Record<string, CMSBlock[]> = {
  poel:      withOrder(POEL_BLOCKS),
  vejroe:    withOrder(VEJROE_BLOCKS),
  hiddensee: withOrder(HIDDENSEE_BLOCKS),
  samsoe:    withOrder(SAMSOE_BLOCKS),
  langeland: withOrder(LANGELAND_BLOCKS),
  usedom:    withOrder(USEDOM_BLOCKS),
  fehmarn:   withOrder(FEHMARN_BLOCKS),
}
