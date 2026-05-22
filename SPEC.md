# Rezeptsammlung — Projektspezifikation

## Projektziel
Eine persönliche Web-App zur Verwaltung von Kochrezepten aus verschiedenen Quellen.
Rezepte sollen schnell auffindbar sein und beim Kochen auf dem Handy optimal anzeigen.

---

## Tech-Stack
| Schicht | Technologie |
|---|---|
| Framework | React (via Vite) |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Lokale DB | Dexie.js (IndexedDB) |
| KI-Import | Anthropic API (direkt im Browser, Option A) |
| PWA | vite-plugin-pwa |
| Hosting | GitHub Pages oder Netlify (statisch, kostenlos) |

---

## Screens

### 1. Übersicht (`/`)
- Kachelansicht: Bild + Titel + Kochzeit
- Suchfeld (Volltextsuche über Titel)
- Label-Filter als klickbare Chips (mehrere gleichzeitig aktiv)
- Kacheln sind klickbar → öffnen Kochansicht

### 2. Kochansicht (`/rezept/:id`)
- Handy-optimiert: alles auf einer Seite, kein Tab-Wechsel
- Oben fix: Titel, Metadaten (Zeit, Portionen), Labels
- Zutaten-Liste immer sichtbar (kein Scrollen nötig — kompakt)
- Schritte scrollbar darunter
- Zurück-Button zur Übersicht

### 3. Erfassen (`/neu`) — Spätere Phase, noch nicht im MVP
- URL eingeben → KI-Agent liest Seite und befüllt Struktur
- Felder prüfen und anpassen
- Speichern in IndexedDB

---

## Labels (fest, v1.0)

| Gruppe | Labels |
|---|---|
| Mahlzeit | Frühstück, Mittagessen, Abendessen, Dessert, Snack, Getränk |
| Ernährung | vegetarisch, vegan, glutenfrei, laktosefrei |
| Charakter | warm, kalt, schnell (<30 Min), aufwendig, Meal Prep |
| Herkunft | Schweizer Küche, Italienisch, Asiatisch, International |

---

## Datenmodell (Dexie.js / IndexedDB)

### `recipes`
| Feld | Typ |
|---|---|
| id | number (auto) |
| title | string |
| description | string |
| source_url | string |
| image_url | string |
| cook_time_minutes | number |
| servings | number |
| created_at | Date |

### `ingredients`
| Feld | Typ |
|---|---|
| id | number (auto) |
| recipe_id | number (FK) |
| amount | number |
| unit | string \| null |
| name | string |
| order_num | number |

### `steps`
| Feld | Typ |
|---|---|
| id | number (auto) |
| recipe_id | number (FK) |
| order_num | number |
| description | string |

### `labels`
| Feld | Typ |
|---|---|
| id | number (auto) |
| name | string |
| group | string |

### `recipe_labels`
| Feld | Typ |
|---|---|
| recipe_id | number (FK) |
| label_id | number (FK) |

---

## Projektstruktur

```
rezeptsammlung/
├── CLAUDE.md
├── SPEC.md
├── ARCHITECTURE.md
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── public/
│   └── manifest.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── db/
    │   ├── db.js          ← Dexie-Instanz & Schema
    │   └── seed.js        ← Initiale Rezeptdaten aus recipes.json
    ├── pages/
    │   ├── Overview.jsx
    │   ├── RecipeDetail.jsx
    │   └── AddRecipe.jsx  ← spätere Phase
    ├── components/
    │   ├── RecipeCard.jsx
    │   ├── LabelFilter.jsx
    │   └── SearchBar.jsx
    └── services/
        └── aiImport.js    ← spätere Phase
```

---

## MVP-Scope (Phase 1) — was jetzt gebaut wird

**Ziel:** Design und Usability von Übersicht und Kochansicht perfektionieren.

**Enthalten:**
- Rezeptdaten aus `recipes.json` beim ersten App-Start in IndexedDB laden (seed)
- Übersicht: Kachelansicht, Suche, Label-Filter
- Kochansicht: handy-optimiert, Zutaten + scrollbare Schritte
- PWA: auf Handy/Tablet installierbar

**Bewusst nicht enthalten:**
- URL-Import mit KI (`/neu`-Screen)
- Rezepte im UI erfassen oder bearbeiten
- Einkaufsliste, Favoriten, Bewertungen
- Geräteübergreifende Synchronisation

---

## Spätere Phasen (Backlog)

| Phase | Inhalt |
|---|---|
| Phase 2 | Rezept erfassen: URL-Import via Anthropic API (Option A) |
| Phase 3 | Rezept bearbeiten / löschen im UI |
| Phase 4 | API-Key Proxy-Server (Option B) zum Schutz des Keys |
| Phase 5 | Einkaufsliste, Portionsrechner |
| Phase 6 | Geräteübergreifende Synchronisation (z.B. Supabase) |
