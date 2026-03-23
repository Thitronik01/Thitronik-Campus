-- supabase/seed.sql
-- Seed script for Thitronik Configurator Products and dependencies

-- 1. Insert Products
INSERT INTO public.products (sku, name, slug, category, description, is_base_unit) VALUES
('100760', 'WiPro III', 'wipro-iii', 'alarm_base', 'Funk-Alarmanlage für Reisemobile, 868 MHz, inkl. integriertem Neigungssensor und Innenraumüberwachung', true),
('100770', 'WiPro III safe.lock', 'wipro-iii-safe-lock', 'alarm_base', 'Funk-Alarmanlage mit OBD-Schutz und safe.lock Wegfahrsperre für Fiat Ducato, Peugeot Boxer, Citroën Jumper', true),
('105750', 'G.A.S.-connect', 'gas-connect', 'gas_warning', 'Funk-Gaswarner zur Integration in WiPro III, warnt vor Propan/Butan, Narkosegas und CO (optional)', false),
('105700', 'G.A.S.-pro', 'gas-pro', 'gas_warning', 'Standalone-Gaswarner mit akustischem/optischem Alarm, erweiterbar mit Zusatzsensoren', false),
('101289', 'Zusatzsensor G.A.S.-pro III', 'zusatzsensor-gas-pro-iii', 'gas_warning', 'Zusätzlicher Gassensor für G.A.S.-pro III Systeme', false),
('100433', 'CO-Sensor', 'co-sensor', 'gas_warning', 'Kohlenmonoxid-Sensor als Erweiterung für G.A.S.-pro / G.A.S.-pro III', false),
('100456', 'Zusatzsensor G.A.S.-pro', 'zusatzsensor-gas-pro', 'gas_warning', 'Zusätzlicher Gassensor für G.A.S.-pro Systeme', false),
('105710', 'Pro-finder', 'pro-finder', 'tracking', 'GSM/GPS-Ortungsmodul mit SMS-Alarmierung, Live-Tracking über App, Integration in WiPro III', false),
('100757', 'Funk-Magnetkontakt 868 MHz schwarz', 'funk-magnetkontakt-schwarz', 'sensor', 'Funk-Magnetkontakt zur Überwachung von Türen, Klappen und Fenstern – schwarz', false),
('100758', 'Funk-Magnetkontakt 868 MHz weiß', 'funk-magnetkontakt-weiss', 'sensor', 'Funk-Magnetkontakt zur Überwachung von Türen, Klappen und Fenstern – weiß', false),
('100761', 'Funk-Kabelschleife 868 MHz', 'funk-kabelschleife', 'sensor', 'Funk-Kabelschleife zur flexiblen Absicherung von Stauklappen und Heckgaragen', false),
('101074', 'Funk-Kabelschleife XL 868 MHz schwarz', 'funk-kabelschleife-xl-schwarz', 'sensor', 'Verlängerte Funk-Kabelschleife für große Klappen – schwarz', false),
('101064', 'Funk-Handsender 868 MHz', 'funk-handsender', 'sensor', 'Zusätzlicher Funk-Handsender für WiPro III / WiPro III safe.lock', false),
('100190', 'Zusatzsirene', 'zusatzsirene', 'siren', 'Kabelgebundene Zusatzsirene, 8–30V, zur Verstärkung der akustischen Alarmierung', false),
('100089', 'Backup-Sirene', 'backup-sirene', 'siren', 'Batteriebetriebene Backup-Sirene, 110 dB, funktioniert auch bei getrennter Stromversorgung', false),
('105339', 'Zusatzhupe', 'zusatzhupe', 'siren', 'Elektrische Zusatzhupe als ergänzender Signalgeber', false),
('100034', 'Externe LED', 'externe-led', 'siren', 'Externe LED-Betriebsanzeige zur sichtbaren Abschreckung', false),
('105299', 'NFC Modul', 'nfc-modul', 'module', 'NFC-Scharf-/Unscharfschaltung per KeyCard, KeyTag oder KeyStrap – kein Handsender nötig', false),
('101290', 'Vernetzungsmodul', 'vernetzungsmodul', 'module', 'Bluetooth-Vernetzungsmodul zur Verbindung von WiPro III mit der Thitronik-App', false),
('101052', 'safe.lock Umrüstplatine', 'safelock-umruestplatine', 'module', 'Umrüstplatine zum Nachrüsten der safe.lock-Funktion auf bestehende WiPro III (100760)', false),
('101283', 'Abschalteinrichtung einpolig', 'abschalteinrichtung-einpolig', 'cutoff', 'Einpolige Abschalteinrichtung für Verbraucher bei Alarm', false),
('105821', 'Abschalteinrichtung mehrpolig', 'abschalteinrichtung-mehrpolig', 'cutoff', 'Mehrpolige Abschalteinrichtung für Verbraucher bei Alarm', false)
ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_base_unit = EXCLUDED.is_base_unit;

-- 2. Insert Dependencies (we can't easily conflict on multiple columns without unique constraints, so let's delete existing ones first for idempotency)
TRUNCATE TABLE public.product_dependencies;

INSERT INTO public.product_dependencies (product_sku, dependency_type, target_sku, rule, message) VALUES
('105750', 'requires', '100760', 'OR:100770', 'G.A.S.-connect benötigt ein WiPro III oder WiPro III safe.lock als Basisgerät'),
('105710', 'requires', '100760', 'OR:100770', 'Pro-finder benötigt ein WiPro III oder WiPro III safe.lock als Basisgerät'),
('100757', 'requires', '100760', 'OR:100770', 'Funk-Magnetkontakt benötigt ein WiPro III Basisgerät'),
('100758', 'requires', '100760', 'OR:100770', 'Funk-Magnetkontakt benötigt ein WiPro III Basisgerät'),
('100761', 'requires', '100760', 'OR:100770', 'Funk-Kabelschleife benötigt ein WiPro III Basisgerät'),
('101074', 'requires', '100760', 'OR:100770', 'Funk-Kabelschleife XL benötigt ein WiPro III Basisgerät'),
('101064', 'requires', '100760', 'OR:100770', 'Funk-Handsender benötigt ein WiPro III Basisgerät'),
('100089', 'recommends', '100760', 'OR:100770', 'Backup-Sirene wird dringend empfohlen für zuverlässigen Alarm bei Stromunterbrechung'),
('105299', 'requires', '100760', 'OR:100770', 'NFC Modul benötigt ein WiPro III Basisgerät'),
('101290', 'requires', '100760', 'OR:100770', 'Vernetzungsmodul benötigt ein WiPro III Basisgerät'),
('101052', 'requires', '100760', NULL, 'Umrüstplatine ist nur für WiPro III (100760) – NICHT für bereits vorhandenes safe.lock (100770)'),
('101052', 'incompatible', '100770', NULL, 'WiPro III safe.lock hat safe.lock bereits integriert – Umrüstplatine nicht nötig'),
('100433', 'requires', '105700', 'OR:105750', 'CO-Sensor benötigt ein G.A.S.-pro oder G.A.S.-connect System'),
('100456', 'requires', '105700', NULL, 'Zusatzsensor benötigt ein G.A.S.-pro System'),
('101289', 'requires', '105700', NULL, 'Zusatzsensor G.A.S.-pro III benötigt ein G.A.S.-pro III System');

-- 3. Insert Vehicle configs
TRUNCATE TABLE public.vehicle_product_config;

-- Fiat Ducato (ab 2006, Typ 250/290)
INSERT INTO public.vehicle_product_config (vehicle_slug, product_sku, dip_switch_setting, notes) VALUES
('fiat-ducato-250', '100760', '{"dip1":"ON","dip2":"OFF","dip3":"OFF","dip4":"OFF"}', 'Standard-Einstellung Ducato X250/X290'),
('fiat-ducato-250', '100770', '{"dip1":"ON","dip2":"OFF","dip3":"OFF","dip4":"OFF"}', 'safe.lock Ducato – OBD-Schutz aktiv');

-- Fiat Ducato (ab 2014, Typ 290)
INSERT INTO public.vehicle_product_config (vehicle_slug, product_sku, dip_switch_setting, notes) VALUES
('fiat-ducato-290', '100760', '{"dip1":"ON","dip2":"OFF","dip3":"ON","dip4":"OFF"}', 'Ducato X290 – DIP3 ON für CAN-Bus Anbindung'),
('fiat-ducato-290', '100770', '{"dip1":"ON","dip2":"OFF","dip3":"ON","dip4":"OFF"}', 'safe.lock Ducato X290');

-- Mercedes Sprinter (W907/W910, ab 2018)
INSERT INTO public.vehicle_product_config (vehicle_slug, product_sku, dip_switch_setting, warnings, min_serial_number) VALUES
('mercedes-sprinter-907', '100760', '{"dip1":"OFF","dip2":"ON","dip3":"OFF","dip4":"OFF"}', 'Achtung: Bei Sprinter W907 ab Bj. 2018 zwingend Softwarestand ≥ 3.x prüfen', '22000'),
('mercedes-sprinter-907', '100770', NULL, 'safe.lock NICHT verfügbar für Mercedes Sprinter – nur WiPro III', NULL);

-- VW Crafter (ab 2017)
INSERT INTO public.vehicle_product_config (vehicle_slug, product_sku, dip_switch_setting) VALUES
('vw-crafter-2017', '100760', '{"dip1":"OFF","dip2":"ON","dip3":"OFF","dip4":"ON"}');

-- Ford Transit (ab 2014)
INSERT INTO public.vehicle_product_config (vehicle_slug, product_sku, dip_switch_setting) VALUES
('ford-transit-2014', '100760', '{"dip1":"OFF","dip2":"OFF","dip3":"ON","dip4":"OFF"}');

-- MAN TGE (ab 2017)
INSERT INTO public.vehicle_product_config (vehicle_slug, product_sku, dip_switch_setting) VALUES
('man-tge-2017', '100760', '{"dip1":"OFF","dip2":"ON","dip3":"OFF","dip4":"ON"}');

-- Peugeot Boxer / Citroën Jumper
INSERT INTO public.vehicle_product_config (vehicle_slug, product_sku, dip_switch_setting) VALUES
('peugeot-boxer', '100760', '{"dip1":"ON","dip2":"OFF","dip3":"OFF","dip4":"OFF"}'),
('peugeot-boxer', '100770', '{"dip1":"ON","dip2":"OFF","dip3":"OFF","dip4":"OFF"}'),
('citroen-jumper', '100760', '{"dip1":"ON","dip2":"OFF","dip3":"OFF","dip4":"OFF"}'),
('citroen-jumper', '100770', '{"dip1":"ON","dip2":"OFF","dip3":"OFF","dip4":"OFF"}');
