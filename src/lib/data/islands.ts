// Issue #8: ISLANDS-Daten aus Dashboard page.tsx ausgelagert
// Quelle: src/app/[locale]/page.tsx

export interface Island {
  id: string;
  name: string;
  icon: string;
  xp: number;
  status: "completed" | "active" | "locked";
  desc: string;
}

export const ISLANDS: Island[] = [
  { id: "poel",       name: "Poel",      icon: "🏝️", xp: 50,  status: "completed", desc: "Onboarding & Plattform-Tour" },
  { id: "vejroe",     name: "Vejrø",     icon: "⚓",  xp: 100, status: "completed", desc: "Produktschulung WiPro III" },
  { id: "hiddensee",  name: "Hiddensee", icon: "🌊", xp: 150, status: "active",    desc: "Einbau-Praxis" },
  { id: "samsoe",     name: "Samsø",     icon: "⛵",  xp: 150, status: "locked",   desc: "Basisfahrzeuge" },
  { id: "langeland",  name: "Langeland", icon: "🗺️", xp: 100, status: "locked",   desc: "Beratung & Service" },
  { id: "usedom",     name: "Usedom",    icon: "🔭", xp: 120, status: "locked",   desc: "Konfigurator-Training" },
  { id: "fehmarn",    name: "Fehmarn",   icon: "🔧", xp: 120, status: "locked",   desc: "Support & Fehleranalyse" },
];
