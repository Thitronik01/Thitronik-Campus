# Mitwirken bei THITRONIK Campus 2.0

Vielen Dank für dein Interesse, zum Projekt beizutragen! 🎉

## Schnellstart

1. **Fork** erstellen und lokal klonen
2. Neuen Branch anlegen:
   ```bash
   git checkout -b feature/mein-feature
   ```
3. Änderungen vornehmen und testen
4. Commit erstellen (siehe Konventionen unten)
5. **Pull Request** öffnen

## Commit-Konventionen

Wir verwenden [Conventional Commits](https://www.conventionalcommits.org/):

| Typ | Beschreibung |
|-----|-------------|
| `feat:` | Neues Feature |
| `fix:` | Bugfix |
| `docs:` | Nur Dokumentation |
| `style:` | Formatierung (kein Code-Change) |
| `refactor:` | Code-Refactoring |
| `test:` | Tests hinzufügen/ändern |
| `chore:` | Build-Prozess, Tooling |

**Beispiel:** `feat: add certificate download button`

## Branch-Workflow

- `main` – Stabiler Branch, immer deploybar
- `feature/*` – Neue Features
- `fix/*` – Bugfixes
- `docs/*` – Dokumentationsänderungen

## Pull Requests

- Beschreibe **was** und **warum** geändert wurde
- Verlinke relevante Issues mit `Closes #123`
- Stelle sicher, dass `npm run lint` und `npm run build` erfolgreich sind

## Code-Style

- TypeScript verwenden
- Tailwind CSS für Styling
- Deutsche UI-Texte als Übersetzungskeys in `messages/`
- Komponenten in `src/components/` organisieren

## Fragen?

Öffne ein [Issue](https://github.com/Thitronik01/Thitronik-Campus/issues) oder kontaktiere das Team.
