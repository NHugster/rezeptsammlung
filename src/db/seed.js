import { db } from './db.js'
import recipesData from '../recipes.json'

// Versionsnummer erhöhen wenn sich recipes.json ändert → erzwingt automatisches Re-Seeding
const SEED_VERSION = 'v5'

// Vollständige Label-Liste gemäss SPEC.md
const ALL_LABELS = [
  { name: 'Frühstück',       group: 'Mahlzeit' },
  { name: 'Mittagessen',     group: 'Mahlzeit' },
  { name: 'Abendessen',      group: 'Mahlzeit' },
  { name: 'Dessert',         group: 'Mahlzeit' },
  { name: 'Snack',           group: 'Mahlzeit' },
  { name: 'Getränk',         group: 'Mahlzeit' },
  { name: 'vegetarisch',     group: 'Ernährung' },
  { name: 'vegan',           group: 'Ernährung' },
  { name: 'glutenfrei',      group: 'Ernährung' },
  { name: 'laktosefrei',     group: 'Ernährung' },
  { name: 'warm',            group: 'Charakter' },
  { name: 'kalt',            group: 'Charakter' },
  { name: 'schnell (<30 Min)', group: 'Charakter' },
  { name: 'aufwendig',       group: 'Charakter' },
  { name: 'Meal Prep',       group: 'Charakter' },
  { name: 'Schweizer Küche', group: 'Herkunft' },
  { name: 'Italienisch',     group: 'Herkunft' },
  { name: 'Asiatisch',       group: 'Herkunft' },
  { name: 'International',   group: 'Herkunft' },
]

export async function seedDatabase() {
  if (localStorage.getItem('seed_version') === SEED_VERSION) return

  await db.transaction('rw', db.recipes, db.ingredients, db.steps, db.labels, db.recipe_labels, async () => {
    // Alle Tabellen leeren bevor neu befüllt wird
    await Promise.all([
      db.recipes.clear(),
      db.ingredients.clear(),
      db.steps.clear(),
      db.labels.clear(),
      db.recipe_labels.clear(),
    ])
    // Alle Labels einfügen und Name→ID-Map aufbauen
    const labelIds = await db.labels.bulkAdd(ALL_LABELS, { allKeys: true })
    const labelMap = Object.fromEntries(ALL_LABELS.map((l, i) => [l.name, labelIds[i]]))

    for (const recipe of recipesData) {
      // Denormalisierte Felder herauslösen
      const { id: _jsonId, labels, ingredients, steps, ...recipeFields } = recipe

      const recipeId = await db.recipes.add({
        ...recipeFields,
        created_at: new Date(),
      })

      await db.ingredients.bulkAdd(
        ingredients.map((ing, i) => ({ ...ing, recipe_id: recipeId, order_num: i + 1 }))
      )

      await db.steps.bulkAdd(
        steps.map((description, i) => ({ recipe_id: recipeId, order_num: i + 1, description }))
      )

      const recipeLabelRows = labels
        .filter(name => labelMap[name] !== undefined)
        .map(name => ({ recipe_id: recipeId, label_id: labelMap[name] }))
      await db.recipe_labels.bulkAdd(recipeLabelRows)
    }
  })

  localStorage.setItem('seed_version', SEED_VERSION)
}
