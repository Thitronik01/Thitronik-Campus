import { VehicleSelection, ConfiguratorResult, Warning, Accessory, DipSwitch, BaseUnit } from "./types";
import { PRODUCTS, DIP_SWITCHES } from "./data";

export function evaluateConfiguration(selection: VehicleSelection): ConfiguratorResult {
    let baseUnit: { name: BaseUnit; artNr: string } = PRODUCTS.wipro_iii as { name: BaseUnit; artNr: string };
    let dipSwitches: DipSwitch | null = null;
    let minSerialNumber: string | null = null;
    let minSoftware: string | null = null;
    const mandatoryAccessories: Accessory[] = [];
    const recommendedAccessories: Accessory[] = [];
    const warnings: Warning[] = [];
    let installationNote: string | null = null;
    
    // Determine Base Unit
    if (selection.useCase === "Nur Gaswarnung") {
        baseUnit = PRODUCTS.gas_pro as { name: BaseUnit; artNr: string };
        dipSwitches = null;
        minSerialNumber = null;
    } else if (selection.useCase.includes("Zentralverriegelung") || selection.useCase === "Komplettsystem") {
        baseUnit = PRODUCTS.wipro_safe_lock as { name: BaseUnit; artNr: string };
    } else if (selection.useCase === "Ortung") {
        baseUnit = PRODUCTS.pro_finder as { name: BaseUnit; artNr: string };
        dipSwitches = null;
        minSerialNumber = "0699-012";
    } else {
        baseUnit = PRODUCTS.wipro_iii as { name: BaseUnit; artNr: string };
    }

    // Determine Base Unit properties based on Vehicle
    const isWipro = baseUnit.artNr === PRODUCTS.wipro_iii.artNr;
    const isSafelock = baseUnit.artNr === PRODUCTS.wipro_safe_lock.artNr;
    const vId = selection.model;
    const feats = selection.features;

    if (isWipro || isSafelock) {
        dipSwitches = DIP_SWITCHES.all_off; // Default Fallback
        
        // ------------- MERCEDES -------------
        if (selection.manufacturer === "Mercedes-Benz") {
            if (vId === "sprinter_w906") {
                dipSwitches = DIP_SWITCHES.mb_sprinter;
                minSerialNumber = isSafelock ? "1050-003" : "0823-001";
                recommendedAccessories.push({ ...PRODUCTS.backup_siren, reason: "Hupe funktioniert nur bei eingeschalteter Zündung" });
            } else if (vId === "sprinter_w907") {
                dipSwitches = DIP_SWITCHES.mb_sprinter;
                if (isSafelock) minSerialNumber = "5458-001";
                recommendedAccessories.push({ ...PRODUCTS.backup_siren, reason: "Hupe funktioniert nur bei eingeschalteter Zündung" });
                if (isSafelock && feats.includes("Eura-Mobil")) {
                    warnings.push({ level: "Warnung", message: "Bei Eura-Mobil-Aufbauten gibt es Einschränkungen im Campingmodus → Thitronik-Support kontaktieren." });
                }
            } else if (vId === "vito_w447") {
                dipSwitches = DIP_SWITCHES.mb_vito;
                minSerialNumber = isSafelock ? "1050-003" : "0823-013";
                if (!isSafelock) minSoftware = "5.6";
                if (feats.includes("ILS")) {
                    recommendedAccessories.push({ ...PRODUCTS.extra_siren, reason: "Bei Fahrzeugen mit ILS werden nur hintere Blinker aktiviert" });
                    warnings.push({ level: "Info", message: "Bei ILS werden nur hintere Blinker angesteuert." });
                }
            }
        }
        
        // ------------- FIAT / PEUGEOT / CITROEN / IVECO -------------
        else if (["Fiat", "Peugeot", "Citroën", "Iveco"].includes(selection.manufacturer)) {
            dipSwitches = DIP_SWITCHES.fiat_can;
            const isOld = selection.year >= 2006 && selection.year <= 2018;
            
            if (isWipro) {
                minSerialNumber = "0823-001";
            } else if (isSafelock) {
                minSerialNumber = isOld ? "1050-003" : "1050-004";
                if (isOld) {
                    recommendedAccessories.push({ ...PRODUCTS.safelock_board, reason: "Dringend empfohlen wegen Replay-Attacken-Risiko auf Originalfernbedienung" });
                    warnings.push({ level: "Warnung", message: "Fahrzeuge bis Baujahr 2018 sind anfällig für Replay-Attacken auf die Original-Funkfernbedienung." });
                }
            }
            if (selection.manufacturer === "Iveco" && selection.year >= 2018) {
                mandatoryAccessories.push({ ...PRODUCTS.extra_siren, reason: "Erforderlich für Iveco Daily ab Baujahr 2018" });
            }
            if (vId === "talento") {
                dipSwitches = DIP_SWITCHES.renault_trafic;
                minSerialNumber = isSafelock ? "1050-004" : "0823-014";
                if (feats.includes("Keyless-Entry")) {
                    mandatoryAccessories.push({ ...PRODUCTS.remote, reason: "Originalschlüssel steuert WiPro/safe.lock nicht an (Keyless)" });
                    warnings.push({ level: "Warnung", message: "Scharf-/Unscharfschaltung nur über Funk-Handsender möglich, nicht über Originalschlüssel." });
                }
            }
        }
        
        // ------------- FORD -------------
        else if (selection.manufacturer === "Ford") {
            if (vId === "transit_gen6") {
                dipSwitches = DIP_SWITCHES.ford_gen6;
                minSerialNumber = isWipro ? "0823-001" : "1050-003";
                if (!feats.includes("Deadlock")) {
                    warnings.push({ level: "Warnung", message: "Transit 6. Generation funktioniert nur MIT vorhandener Deadlock-Funktion am Fahrzeug." });
                }
            } else if (vId === "transit_gen7_14") {
                dipSwitches = DIP_SWITCHES.ford_gen7_14;
                minSerialNumber = isWipro ? "0823-011" : "1050-003";
                if (isWipro) minSoftware = "4.7";
            } else if (vId === "transit_gen7_16") {
                dipSwitches = DIP_SWITCHES.ford_gen7_16;
                minSerialNumber = isWipro ? "0823-013" : "1050-003";
                if (isWipro) minSoftware = "5.6";
                if (feats.includes("Deadlock")) {
                    warnings.push({ level: "Warnung", message: "Transit 7. Generation (ab 2016) funktioniert nur OHNE Deadlock-Funktion (Gegenteil zur 6. Gen!)." });
                }
            } else if (vId === "transit_gen7_19" || vId === "tourneo_custom_19") {
                dipSwitches = DIP_SWITCHES.ford_gen7_16; // same as 2016 structurally for CAN
                if (isWipro) {
                    minSerialNumber = "0823-018"; // default
                }
                if (isSafelock) {
                    minSerialNumber = "5298-001";
                    minSoftware = "7.4.0.s";
                    warnings.push({ level: "Kritisch", message: "Die \"Schaltsperre\" im Ford-Bordcomputer muss zwingend deaktiviert werden (Einstellungen → Fahrzeug → Schaltsperre → AUS)." });
                }
            } else if (vId === "transit_gen7_24" || vId === "tourneo_custom_24") {
                dipSwitches = DIP_SWITCHES.ford_gen7_16; // Assume same CAN setting roughly
                if (isSafelock) {
                    warnings.push({ level: "Kritisch", message: "Die \"Schaltsperre\" kann bei Modellen ab 2023/2024 nicht mehr deaktiviert werden. Die safe.lock funktioniert hier nur im Campingmodus mit speziellem Zubehör → Thitronik-Support kontaktieren." });
                    installationNote = "Installation nur eingeschränkt möglich aufgrund der nicht deaktivierbaren Schaltsperre.";
                }
            }
        }
        
        // ------------- VW -------------
        else if (selection.manufacturer === "VW" || selection.manufacturer === "MAN") {
            if (vId === "t5_pre") {
                dipSwitches = DIP_SWITCHES.vw_t5_pre;
                minSerialNumber = isWipro ? "0823-001" : "1050-003";
                recommendedAccessories.push({ ...PRODUCTS.backup_siren, reason: "Hupe funktioniert nur bei eingeschalteter Zündung" });
            } else if (vId === "t5_face") {
                dipSwitches = DIP_SWITCHES.vw_t5_face;
                minSerialNumber = isWipro ? "0823-001" : "1050-003";
                recommendedAccessories.push({ ...PRODUCTS.backup_siren, reason: "Hupe funktioniert nur bei eingeschalteter Zündung" });
            } else if (vId === "t6") {
                dipSwitches = DIP_SWITCHES.vw_t6;
                minSerialNumber = isWipro ? "0823-012" : "1050-003";
                if (isWipro) minSoftware = "5.1";
                recommendedAccessories.push({ ...PRODUCTS.backup_siren, reason: "Hupe funktioniert nur bei eingeschalteter Zündung" });
                if (feats.includes("Doppelkabine")) warnings.push({ level: "Kritisch", message: "VW T6/T6.1 Doppelkabine ist NICHT kompatibel mit dieser CAN-Einstellung." });
            } else if (vId.startsWith("t6_1")) {
                dipSwitches = DIP_SWITCHES.vw_t6;
                minSerialNumber = isWipro ? "0823-019" : "1050-004";
                if (isWipro) minSoftware = "6.8";
                recommendedAccessories.push({ ...PRODUCTS.backup_siren, reason: "Hupe funktioniert nur bei eingeschalteter Zündung" });
                if (feats.includes("Doppelkabine")) warnings.push({ level: "Kritisch", message: "VW T6/T6.1 Doppelkabine ist NICHT kompatibel mit dieser CAN-Einstellung." });
                if (isSafelock && vId === "t6_1_post_21") {
                    warnings.push({ level: "Warnung", message: "ZV-Ansteuerung über CAN-Bus ist möglicherweise nicht möglich. 3-Minuten-Funktionstest durchführen!" });
                    installationNote = "Fahrzeug verriegeln → 3 Minuten warten → über safe.lock entriegeln. Wenn erfolglos, Thitronik-Support kontaktieren.";
                }
            } else if (vId === "crafter_2" || vId === "tge") {
                dipSwitches = DIP_SWITCHES.vw_crafter;
                minSerialNumber = isWipro ? "0823-019" : "1050-004";
                if (isWipro) minSoftware = "6.8";
                mandatoryAccessories.push({ ...PRODUCTS.extra_horn, reason: "Fahrzeughupe ist nicht über CAN-Bus ansteuerbar" });
                if (feats.includes("Startknopf")) {
                    if (isSafelock) mandatoryAccessories.push({ ...PRODUCTS.remote, reason: "ZV nicht über CAN ansteuerbar bei Keyless Start" });
                    warnings.push({ level: "Warnung", message: "Bei Fahrzeugen mit Startknopf ist die ZV nicht über CAN-Bus ansteuerbar → Nur Funk-Handsender verwenden." });
                }
            }
        }
        
        // ------------- RENAULT / OPEL / NISSAN -------------
        else if (["Renault", "Opel", "Nissan"].includes(selection.manufacturer)) {
            if (vId === "master_old" || vId === "movano_old" || vId === "interstar") {
                dipSwitches = DIP_SWITCHES.renault_old;
                minSerialNumber = isWipro ? "0823-001" : "1050-003";
                mandatoryAccessories.push({ ...PRODUCTS.magnet_black, reason: "Schiebetür und Hecktür werden vom CAN nicht überwacht" });
            } else if (vId === "master_new" || vId === "movano_new") {
                dipSwitches = DIP_SWITCHES.renault_new;
                minSerialNumber = isWipro ? "0823-001" : "1050-003";
                mandatoryAccessories.push({ ...PRODUCTS.magnet_black, reason: "Schiebetür und Hecktür werden vom CAN nicht überwacht" });
            } else if (vId === "master_19") {
                dipSwitches = DIP_SWITCHES.renault_old; // specific to some 2019 config, fallback check
                if (isSafelock) {
                    minSerialNumber = "1050-004";
                    mandatoryAccessories.push({ ...PRODUCTS.remote, reason: "Originalschlüssel steuert safe.lock nicht an" });
                    warnings.push({ level: "Warnung", message: "Scharf-/Unscharfschaltung nur über Funk-Handsender möglich. Originalschlüssel verriegelt nur das Fahrzeug." });
                } else if (isWipro) {
                    minSerialNumber = "0823-014";
                }
                if (feats.includes("Keyless-Entry")) {
                    mandatoryAccessories.push({ ...PRODUCTS.remote, reason: "Keyless blockiert Ansteuerung über Schlüssel" });
                }
            } else if (vId === "trafic_3") {
                dipSwitches = DIP_SWITCHES.renault_trafic;
                minSerialNumber = isWipro ? "0823-014" : "1050-004";
                if (feats.includes("Keyless-Entry")) {
                    mandatoryAccessories.push({ ...PRODUCTS.remote, reason: "Originalschlüssel steuert WiPro/safe.lock nicht an (Keyless)" });
                    warnings.push({ level: "Warnung", message: "Scharf-/Unscharfschaltung nur über Funk-Handsender möglich, nicht über Originalschlüssel." });
                }
            }
        }
        
        // ------------- UNIVERSAL -------------
        else if (selection.manufacturer === "Andere") {
             dipSwitches = DIP_SWITCHES.all_off;
             installationNote = "Hupe und Blinker müssen analog angeschlossen werden.";
        }
    }

    // Use Case Additions
    if (selection.useCase === "Alarm + Gaswarnung" || selection.useCase === "Komplettsystem") {
        mandatoryAccessories.push({ ...PRODUCTS.gas_connect, reason: "Integrierter Funk-Gaswarner für System" });
    }
    if (selection.useCase === "Komplettsystem") {
        mandatoryAccessories.push({ ...PRODUCTS.pro_finder, reason: "Ortungsmodul für Komplettsystem" });
        mandatoryAccessories.push({ ...PRODUCTS.network_module, reason: "Vernetzung zwischen Alarm und Ortung" });
    }

    // Default Serial Number adjustments
    if (baseUnit.artNr === PRODUCTS.wipro_iii.artNr && !minSerialNumber) minSerialNumber = "0823-018";
    if (baseUnit.artNr === PRODUCTS.wipro_safe_lock.artNr && !minSerialNumber) minSerialNumber = "1050-003";

    return {
        vehicleName: `${selection.manufacturer} ${VEHICLES_MAP[vId]?.name || selection.model}, Baujahr ${selection.year}`,
        baseUnit: {
            name: baseUnit.name,
            artNr: baseUnit.artNr,
        },
        dipSwitches,
        minSerialNumber,
        minSoftware,
        mandatoryAccessories,
        recommendedAccessories,
        warnings,
        installationNote
    };
}

// Utility mapper for vehicle descriptions
import { VEHICLES } from "./data";
const VEHICLES_MAP = VEHICLES.reduce<Record<string, {name: string}>>((acc, m) => {
    m.models.forEach(mod => {
        acc[mod.id] = mod;
    });
    return acc;
}, {});
