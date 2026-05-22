# Architektur & Datenmodell — Rezeptsammlung

## Stack-Entscheidungen

| Schicht | Technologie | Begründung |
|---|---|---|
| UI Framework | React (via Vite) | Komponentenbasiert, grosse Community, gute PWA-Unterstützung |
| Styling | Tailwind CSS | Utility-first, mobil-optimiert, kein Build-Overhead |
| Routing | React Router | Standard für Multi-Screen SPAs |
| Lokale DB | Dexie.js (IndexedDB) | Einfachste API für Browser-Datenbank, offline-fähig |
| KI-Import | Anthropic API (direkt) | Kein Server nötig für MVP |
| Hosting | GitHub Pages oder Netlify | Kostenlos, statisches Deployment |
| PWA | Vite PWA Plugin | "Zum Homescreen hinzufügen" auf Handy/Tablet |

---

## ⚠ Bekannte technische Schuld (TODO)

**KI-API-Key im Browser (Option A)**
Im MVP wird der Anthropic API-Key direkt im Browser verwendet.
Das ist nur für den Privatgebrauch akzeptabel — der Key ist im Netzwerk-Traffic sichtbar.

**Geplante Lösung (Option B, später):**
Einen minimalen Proxy-Server einführen (z.B. Cloudflare Worker, kostenlos).
Der Browser schickt nur die URL → der Server ruft die Anthropic API auf → gibt strukturierte Daten zurück.
Der API-Key bleibt damit serverseitig geschützt.

**Aufwand:** ca. 1–2 Stunden, wenn der Rest der App steht.

---

## Datenmodell (IndexedDB via Dexie.js)

### Tabelle: `recipes`

| Feld | Typ | Beschreibung |
|---|---|---|
| id | number (auto) | Primärschlüssel |
| title | string | Rezepttitel |
| description | string | Kurzbeschreibung (1–2 Sätze) |
| source_url | string | Ursprungs-URL (für Quellenangabe) |
| image_url | string | URL oder Base64-kodiertes Bild |
| cook_time_minutes | number | Gesamte Kochzeit |
| servings | number | Anzahl Portionen |
| created_at | Date | Erstellungsdatum |

### Tabelle: `ingredients`

| Feld | Typ | Beschreibung |
|---|---|---|
| id | number (auto) | Primärschlüssel |
| recipe_id | number | Fremdschlüssel → recipes |
| amount | number | Menge (z.B. 200) |
| unit | string \| null | Einheit (g, ml, EL, Stück, …) |
| name | string | Zutatname |
| order_num | number | Reihenfolge in der Liste |

### Tabelle: `steps`

| Feld | Typ | Beschreibung |
|---|---|---|
| id | number (auto) | Primärschlüssel |
| recipe_id | number | Fremdschlüssel → recipes |
| order_num | number | Schritt-Nummer |
| description | string | Zubereitungsschritt |

### Tabelle: `labels`

| Feld | Typ | Beschreibung |
|---|---|---|
| id | number (auto) | Primärschlüssel |
| name | string | Label-Name (z.B. "vegetarisch") |
| group | string | Gruppe (z.B. "Ernährung", "Mahlzeit") |

### Verbindungstabelle: `recipe_labels`

| Feld | Typ | Beschreibung |
|---|---|---|
| recipe_id | number | Fremdschlüssel → recipes |
| label_id | number | Fremdschlüssel → labels |

---

## Label-Liste (fest, v1.0)

| Gruppe | Labels |
|---|---|
| Mahlzeit | Frühstück, Mittagessen, Abendessen, Dessert, Snack, Getränk |
| Ernährung | vegetarisch, vegan, glutenfrei, laktosefrei |
| Charakter | warm, kalt, schnell (<30 Min), aufwendig, Meal Prep |
| Herkunft | Schweizer Küche, Italienisch, Asiatisch, International |

---

## Projektstruktur (Vite + React)

```
rezeptsammlung/
├── CLAUDE.md
├── SPEC.md
├── ARCHITECTURE.md          ← diese Datei
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── public/
│   └── manifest.json        ← PWA-Manifest
└── src/
    ├── main.jsx
    ├── App.jsx              ← Router-Setup
    ├── db/
    │   ├── db.js            ← Dexie-Instanz & Schema
    │   └── seed.js          ← Initiale Rezeptdaten (recipes.json)
    ├── pages/
    │   ├── Overview.jsx     ← Kachelansicht + Suche + Filter
    │   ├── RecipeDetail.jsx ← Kochansicht
    │   └── AddRecipe.jsx    ← Erfassen (später)
    ├── components/
    │   ├── RecipeCard.jsx   ← Einzelne Kachel
    │   ├── LabelFilter.jsx  ← Filter-Chips
    │   └── SearchBar.jsx    ← Suchfeld
    └── services/
        └── aiImport.js      ← Anthropic API-Aufruf (später)
                             ← ⚠ TODO: durch Proxy-Server ersetzen
```

---

## Screens & Navigation

```
/ (Übersicht)
  └── /rezept/:id (Kochansicht)
  └── /neu (Erfassen — spätere Phase)
```

---

## MVP-Scope (Phase 1)

**Enthalten:**
- Rezeptdaten aus `recipes.json` beim ersten App-Start in IndexedDB laden
- Kachelansicht mit Bild, Titel, Kochzeit
- Suche (Titel) + Label-Filter
- Kochansicht: Zutaten fix sichtbar, Schritte scrollbar
- PWA: installierbar auf Handy/Tablet

**Nicht enthalten (später):**
- URL-Import mit KI
- Rezept manuell erfassen/bearbeiten im UI
- API-Key Proxy (Option B)
