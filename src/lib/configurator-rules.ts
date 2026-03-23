export const HARD_RULES = {
  // safe.lock nur für Ducato/Boxer/Jumper
  safelockVehicles: ['fiat-ducato-250', 'fiat-ducato-290', 'peugeot-boxer', 'citroen-jumper'],

  // Max. Funk-Sensoren pro WiPro III: 20 Stück
  maxWirelessSensors: 20,

  // Max. Funk-Handsender pro System: 9 Stück
  maxRemotes: 9,

  // Umrüstplatine blockiert wenn safe.lock gewählt
  upgradeBlockedBy: { '101052': ['100770'] },
};

export const RECOMMENDATIONS = [
  {
    trigger: { hasBaseUnit: true, missing: '100089' },
    message: '⚠️ Empfehlung: Backup-Sirene (100089) hinzufügen – schützt bei Stromunterbrechung',
    severity: 'warning' as const,
  },
  {
    trigger: { hasSku: '100760', missing: '101052' },
    message: '💡 Tipp: Mit der safe.lock Umrüstplatine (101052) können Sie OBD-Schutz nachrüsten',
    severity: 'info' as const,
    onlyForVehicles: ['fiat-ducato-250', 'fiat-ducato-290', 'peugeot-boxer', 'citroen-jumper'],
  },
  {
    trigger: { hasBaseUnit: true, missing: '105750' },
    message: '💡 Tipp: G.A.S.-connect (105750) bietet Gaswarnung direkt über die Alarmanlage',
    severity: 'info' as const,
  },
];

export const VEHICLE_WARNINGS: Record<string, string[]> = {
  'mercedes-sprinter-907': [
    'WiPro III safe.lock ist für dieses Fahrzeug NICHT verfügbar.',
    'Bitte Seriennummer ≥ 22000 und Software ≥ 3.x sicherstellen.',
  ],
  'fiat-ducato-290': [
    'DIP-Switch 3 muss auf ON stehen für CAN-Bus-Anbindung.',
  ],
};
