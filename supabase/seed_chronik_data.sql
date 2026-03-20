-- SEED DATA FOR CAMPUS CHRONIK 2023 - 2026

-- 2023: Campus Opening
INSERT INTO campus_chronik (id, year, title, description, sort_order)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  2023, 
  'Campus Eröffnung Eckernförde', 
  'Ein Meilenstein für die THITRONIK Akademie: Die Eröffnung des neuen Campus in Eckernförde. Modernste Schulungsräume, ein eigenes Testgelände und Platz für über 100 Partner gleichzeitig.',
  1
);

INSERT INTO campus_chronik_images (chronik_id, storage_path, caption, sort_order)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '2023/campus_opening.webp',
  'Die neue Campus-Zentrale bei Nacht.',
  1
);

-- 2024: Innovation Award
INSERT INTO campus_chronik (id, year, title, description, sort_order)
VALUES (
  '22222222-2222-2222-2222-222222222222', 
  2024, 
  'Innovation Award: WiPro III', 
  'Auszeichnung für exzellente Sicherheitstechnik. Die WiPro III wurde zum "Produkt des Jahres" im Bereich Caravan-Security gekürt.',
  2
);

INSERT INTO campus_chronik_images (chronik_id, storage_path, caption, sort_order)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '2024/award.webp',
  'Der goldene Innovationspreis 2024.',
  1
);

-- 2025: Digital Excellence
INSERT INTO campus_chronik (id, year, title, description, sort_order)
VALUES (
  '33333333-3333-3333-3333-333333333333', 
  2025, 
  'Digital Excellence: Campus 2.0', 
  'Launch der neuen interaktiven Lernplattform. Mit Gamification, Live-Checkins und einer globalen Community setzen wir neue Maßstäbe in der Händler-Ausbildung.',
  3
);

INSERT INTO campus_chronik_images (chronik_id, storage_path, caption, sort_order)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '2025/digital_learning.webp',
  'Interaktive Schulungskonzepte der nächsten Generation.',
  1
);

-- 2026: Global Expansion
INSERT INTO campus_chronik (id, year, title, description, sort_order)
VALUES (
  '44444444-4444-4444-4444-444444444444', 
  2026, 
  'Globale Expansion & KI-Support', 
  'THITRONIK geht international. Mit dem Rollout in 5 neue europäische Märkte und dem KI-gestützten Support-System "THI" unterstützen wir unsere Partner weltweit.',
  4
);

INSERT INTO campus_chronik_images (chronik_id, storage_path, caption, sort_order)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '2026/global_sync.webp',
  'Vernetzte Partnerschaften über Ländergrenzen hinweg.',
  1
);

-- Some initial comments
INSERT INTO campus_chronik_comments (chronik_id, user_name, content, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Hans Albers', 'Was für ein tolles Gebäude! Ich war bei der Eröffnung dabei.', now() - interval '2 years'),
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Danke Hans! Wir freuen uns auf viele weitere Schulungen hier.', now() - interval '2 years'),
  ('22222222-2222-2222-2222-222222222222', 'Sabine M.', 'Absolut verdienter Preis. Die WiPro III ist unschlagbar.', now() - interval '1 year'),
  ('33333333-3333-3333-3333-333333333333', 'Marco Polo', 'Die neue Oberfläche ist der Wahnsinn! Endlich macht Lernen richtig Spaß.', now() - interval '3 months'),
  ('44444444-4444-4444-4444-444444444444', 'Elite Partner', 'Freue mich auf die internationalen Trainings!', now());
