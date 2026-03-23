import { Warning, Accessory, DipSwitch } from "./types";

export const PRODUCTS = {
    wipro_iii: { name: "WiPro III", artNr: "100760" },
    wipro_safe_lock: { name: "WiPro III safe.lock", artNr: "100770" },
    wipro_easy: { name: "WiPro easy", artNr: "UNKNOWN" }, // Optional
    cas_iii: { name: "C.A.S. III", artNr: "UNKNOWN" }, // Optional
    gas_connect: { name: "G.A.S.-connect", artNr: "105750" },
    gas_pro: { name: "G.A.S.-pro", artNr: "105700" },
    gas_pro_iii: { name: "G.A.S.-pro III", artNr: "UNKNOWN" },
    pro_finder: { name: "Pro-finder", artNr: "105710" },
    magnet_black: { name: "Funk-Magnetkontakt schwarz", artNr: "100757" },
    magnet_white: { name: "Funk-Magnetkontakt weiß", artNr: "100758" },
    remote: { name: "Funk-Handsender 868 MHz", artNr: "100756" },
    cable_loop: { name: "Funk-Kabelschleife", artNr: "100761" },
    backup_siren: { name: "Backup-Sirene", artNr: "100089" },
    extra_siren: { name: "Zusatzsirene", artNr: "100190" },
    extra_horn: { name: "Zusatzhupe", artNr: "105339" },
    nfc_module: { name: "NFC-Modul", artNr: "105299" },
    network_module: { name: "Vernetzungsmodul", artNr: "101290" },
    safelock_board: { name: "safe.lock Umrüstplatine", artNr: "101052" },
} as const;

export const DIP_SWITCHES = {
    all_off: { sw1: "OFF", sw2: "OFF", sw3: "OFF", sw4: "OFF" } as DipSwitch,
    fiat_can: { sw1: "OFF", sw2: "ON", sw3: "OFF", sw4: "OFF" } as DipSwitch,
    ford_gen6: { sw1: "ON", sw2: "ON", sw3: "OFF", sw4: "OFF" } as DipSwitch,
    ford_gen7_14: { sw1: "ON", sw2: "ON", sw3: "ON", sw4: "ON" } as DipSwitch,
    ford_gen7_16: { sw1: "OFF", sw2: "ON", sw3: "OFF", sw4: "ON" } as DipSwitch,
    iveco: { sw1: "OFF", sw2: "ON", sw3: "OFF", sw4: "OFF" } as DipSwitch,
    mb_sprinter: { sw1: "ON", sw2: "OFF", sw3: "OFF", sw4: "OFF" } as DipSwitch,
    mb_vito: { sw1: "ON", sw2: "OFF", sw3: "ON", sw4: "ON" } as DipSwitch,
    renault_old: { sw1: "ON", sw2: "ON", sw3: "ON", sw4: "OFF" } as DipSwitch,
    renault_new: { sw1: "OFF", sw2: "ON", sw3: "ON", sw4: "OFF" } as DipSwitch,
    renault_trafic: { sw1: "OFF", sw2: "OFF", sw3: "ON", sw4: "OFF" } as DipSwitch,
    vw_t5_pre: { sw1: "ON", sw2: "OFF", sw3: "ON", sw4: "OFF" } as DipSwitch,
    vw_t5_face: { sw1: "ON", sw2: "OFF", sw3: "OFF", sw4: "ON" } as DipSwitch,
    vw_t6: { sw1: "OFF", sw2: "OFF", sw3: "ON", sw4: "ON" } as DipSwitch,
    vw_crafter: { sw1: "OFF", sw2: "ON", sw3: "ON", sw4: "ON" } as DipSwitch,
};

export const VEHICLES = [
    {
        manufacturer: "Mercedes-Benz",
        models: [
            { id: "sprinter_w906", name: "Sprinter NCV3 (W906)", minYear: 2006, maxYear: 2018, features: [] },
            { id: "sprinter_w907", name: "Sprinter (W907/W910)", minYear: 2018, maxYear: 2099, features: ["Eura-Mobil", "Startknopf"] },
            { id: "vito_w447", name: "Vito / V-Klasse (W447)", minYear: 2014, maxYear: 2099, features: ["ILS"] },
        ]
    },
    {
        manufacturer: "Fiat",
        models: [
            { id: "ducato_x250", name: "Ducato (X250/290)", minYear: 2006, maxYear: 2018, features: [] },
            { id: "ducato_new", name: "Ducato (ab 2019)", minYear: 2019, maxYear: 2099, features: ["Startknopf"] },
            { id: "talento", name: "Talento", minYear: 2016, maxYear: 2021, features: ["Keyless-Entry"] }
        ]
    },
    {
        manufacturer: "Ford",
        models: [
            { id: "transit_gen6", name: "Transit 6. Gen", minYear: 2006, maxYear: 2013, features: ["Deadlock"] },
            { id: "transit_gen7_14", name: "Transit 7. Gen", minYear: 2014, maxYear: 2015, features: [] },
            { id: "transit_gen7_16", name: "Transit 7. Gen", minYear: 2016, maxYear: 2018, features: [] },
            { id: "transit_gen7_19", name: "Transit 7. Gen", minYear: 2019, maxYear: 2023, features: [] },
            { id: "transit_gen7_24", name: "Transit (ab 2024)", minYear: 2024, maxYear: 2099, features: [] },
            { id: "tourneo_custom_19", name: "Tourneo Custom", minYear: 2019, maxYear: 2023, features: [] },
            { id: "tourneo_custom_24", name: "Tourneo Custom", minYear: 2024, maxYear: 2099, features: [] },
        ]
    },
    {
        manufacturer: "VW",
        models: [
            { id: "t5_pre", name: "T5 (vor Facelift)", minYear: 2006, maxYear: 2009, features: [] },
            { id: "t5_face", name: "T5 Facelift", minYear: 2010, maxYear: 2015, features: [] },
            { id: "t6", name: "T6", minYear: 2015, maxYear: 2019, features: ["Doppelkabine"] },
            { id: "t6_1_pre_21", name: "T6.1 (bis 2021)", minYear: 2019, maxYear: 2020, features: ["Doppelkabine"] },
            { id: "t6_1_post_21", name: "T6.1 (ab 2021)", minYear: 2021, maxYear: 2099, features: ["Doppelkabine"] },
            { id: "crafter_2", name: "Crafter II", minYear: 2017, maxYear: 2099, features: ["Startknopf"] },
        ]
    },
    {
        manufacturer: "Peugeot",
        models: [
            { id: "boxer", name: "Boxer", minYear: 2006, maxYear: 2018, features: [] },
            { id: "boxer_new", name: "Boxer (ab 2019)", minYear: 2019, maxYear: 2099, features: [] },
        ]
    },
    {
        manufacturer: "Citroën",
        models: [
            { id: "jumper", name: "Jumper", minYear: 2006, maxYear: 2018, features: [] },
            { id: "jumper_new", name: "Jumper (ab 2019)", minYear: 2019, maxYear: 2099, features: [] },
        ]
    },
    {
        manufacturer: "Iveco",
        models: [
            { id: "daily", name: "Daily", minYear: 2006, maxYear: 2017, features: [] },
            { id: "daily_18", name: "Daily (ab 2018)", minYear: 2018, maxYear: 2099, features: [] },
        ]
    },
    {
        manufacturer: "Renault",
        models: [
            { id: "master_old", name: "Master", minYear: 2006, maxYear: 2011, features: [] },
            { id: "master_new", name: "Master", minYear: 2011, maxYear: 2018, features: [] },
            { id: "master_19", name: "Master (ab 2019)", minYear: 2019, maxYear: 2099, features: ["Keyless-Entry"] },
            { id: "trafic_3", name: "Trafic III", minYear: 2014, maxYear: 2099, features: ["Keyless-Entry"] },
        ]
    },
    {
        manufacturer: "Opel",
        models: [
            { id: "movano_old", name: "Movano", minYear: 2006, maxYear: 2011, features: [] },
            { id: "movano_new", name: "Movano", minYear: 2011, maxYear: 2021, features: [] },
        ]
    },
    {
        manufacturer: "MAN",
        models: [
            { id: "tge", name: "TGE", minYear: 2017, maxYear: 2099, features: ["Startknopf"] },
        ]
    },
    {
        manufacturer: "Nissan",
        models: [
            { id: "interstar", name: "Interstar", minYear: 2006, maxYear: 2011, features: [] },
        ]
    },
    {
        manufacturer: "Andere",
        models: [
            { id: "universal", name: "Universal (Alle ohne CAN-Bus)", minYear: 1900, maxYear: 2099, features: ["Ohne CAN-Bus"] },
        ]
    }
];
