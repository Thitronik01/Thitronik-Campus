export type Manufacturer =
    | "Mercedes-Benz"
    | "VW"
    | "Ford"
    | "Fiat"
    | "Peugeot"
    | "Citroën"
    | "Renault"
    | "Opel"
    | "Iveco"
    | "MAN"
    | "Nissan"
    | "Andere";

export type BaseUnit = "WiPro III" | "WiPro III safe.lock" | "WiPro easy" | "C.A.S. III" | "G.A.S.-pro" | "G.A.S.-pro III" | "Pro-finder" | "Keine Empfehlung";

export type UseCase =
    | "Alarm"
    | "Alarm + Zentralverriegelung"
    | "Alarm + Gaswarnung"
    | "Ortung"
    | "Komplettsystem"
    | "Nur Gaswarnung";

export type VehicleFeature = "ILS" | "Keyless-Entry" | "Startknopf" | "Doppelkabine" | "Eura-Mobil" | "Deadlock" | "Ohne CAN-Bus";

export interface VehicleSelection {
    manufacturer: Manufacturer;
    model: string;
    year: number;
    features: VehicleFeature[];
    useCase: UseCase;
}

export interface Accessory {
    name: string;
    artNr: string;
    reason: string;
}

export interface Warning {
    level: "Info" | "Warnung" | "Kritisch";
    message: string;
}

export interface DipSwitch {
    sw1: "ON" | "OFF";
    sw2: "ON" | "OFF";
    sw3: "ON" | "OFF";
    sw4: "ON" | "OFF";
}

export interface ConfiguratorResult {
    vehicleName: string; // e.g., "Mercedes Vito (W447), 2020"
    baseUnit: {
        name: BaseUnit;
        artNr: string;
    };
    dipSwitches: DipSwitch | null; // null if no base unit or irrelevant
    minSerialNumber: string | null;
    minSoftware: string | null;
    mandatoryAccessories: Accessory[];
    recommendedAccessories: Accessory[];
    warnings: Warning[];
    installationNote: string | null;
}
