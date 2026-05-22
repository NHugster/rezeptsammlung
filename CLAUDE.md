# CLAUDE.md — Regeln für die Rezeptsammlung

## Projekt
Persönliche Rezept-App als Browser-PWA. Kein Backend.
Stack: React + Vite + Tailwind CSS + Dexie.js (IndexedDB).
Ziel MVP: Übersicht und Kochansicht — Design und Usability stehen im Vordergrund.

---

## TIER 1 — Harte Regeln, immer einhalten

- Lies SPEC.md und ARCHITECTURE.md bevor du anfängst
- Immer eine Sache auf einmal — kein ganzes Feature in einem Schritt
- Vor jeder Änderung kurz erklären was gemacht wird und warum
- Keine Dateien löschen ohne explizite Bestätigung
- `src/db/db.js` nur nach Rückfrage ändern (Schemaänderungen sind heikel)
- Keine npm-Pakete hinzufügen ohne Begründung

---

## Entwicklungsumgebung

- Node.js 18+
- Paketmanager: npm
- Dev-Server starten: `npm run dev`
- App läuft auf: http://localhost:5173
- Build: `npm run build`

---

## Code-Konventionen

### React
- Funktionale Komponenten mit Hooks (kein class-basiert)
- Eine Komponente pro Datei
- Props mit klaren Namen, keine Abkürzungen
- Kommentare auf Deutsch, Code (Variablen, Funktionen) auf Englisch

### Tailwind CSS
- Mobile-first: zuerst für kleinen Screen stylen, dann `md:` / `lg:` für grössere
- Keine inline-Styles, alles via Tailwind-Klassen
- Keine eigenen CSS-Dateien ausser `index.css` für globale Resets

### Dexie.js
- DB-Schema nur in `src/db/db.js` definieren
- Datenbankzugriffe nur in `useLiveQuery`-Hooks oder dedizierten Service-Funktionen
- Nie direkt in Render-Funktionen auf die DB zugreifen

### Allgemein
- Keine `console.log`-Statements im finalen Code
- Fehler immer abfangen und dem Benutzer sinnvoll anzeigen
- Keine Magic Numbers — Konstanten auslagern

---

## Wichtige Architekturentscheide (nicht ohne Diskussion ändern)

- Kein Backend im MVP — alle Daten lokal in IndexedDB
- Bilder als URL (kein Base64-Upload im MVP)
- Labels sind eine eigene Tabelle mit Gruppe + Name
- Anthropic API wird direkt im Browser aufgerufen (Option A, nur Privatgebrauch)
  → ⚠ TODO später: durch Proxy-Server ersetzen (Option B)

---

## Aufgaben-Workflow

1. Lies die relevanten Dateien (SPEC.md, ARCHITECTURE.md, betroffene Komponenten)
2. Erkläre in 1–2 Sätzen was du tun wirst
3. Implementiere genau das — nicht mehr
4. Sage was als nächstes getestet oder geprüft werden sollte

---

## Umsetzungsreihenfolge (MVP)

1. Projekt-Setup: package.json, vite.config.js, tailwind.config.js
2. Datenbank: db.js (Dexie-Schema) + seed.js (recipes.json einlesen)
3. App-Grundgerüst: main.jsx, App.jsx mit Router
4. Übersicht: RecipeCard, SearchBar, LabelFilter, Overview-Page
5. Kochansicht: RecipeDetail-Page
6. PWA-Konfiguration: manifest.json, vite-plugin-pwa
7. Feinschliff: responsive Design, Ladeanimationen, Fehlerzustände

---

## Wenn etwas unklar ist

Lieber einmal mehr nachfragen als falsch implementieren.
Bei Fehlern immer den vollständigen Stack-Trace zeigen.
Bei Designentscheiden (Layout, Farben, Interaktion) immer eine Empfehlung machen
und begründen — der Nutzer entscheidet.
