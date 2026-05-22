import { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db.js'
import RecipeCard from '../components/RecipeCard.jsx'
import LabelFilter from '../components/LabelFilter.jsx'
import { IconSearch, IconPlus } from '../components/icons.jsx'

// Aktuelles Datum als "Donnerstag · 22. Mai"
function formatEyebrow() {
  const now = new Date()
  const weekday = now.toLocaleDateString('de-DE', { weekday: 'long' })
  const day     = now.getDate()
  const month   = now.toLocaleDateString('de-DE', { month: 'long' })
  return `${weekday} · ${day}. ${month}`
}

export default function Overview() {
  const [query, setQuery]               = useState('')
  const [activeFilter, setActiveFilter] = useState('Alle')

  const allRecipes      = useLiveQuery(() => db.recipes.toArray(),       [])
  const allLabels       = useLiveQuery(() => db.labels.toArray(),        [])
  const allRecipeLabels = useLiveQuery(() => db.recipe_labels.toArray(), [])
  const allIngredients  = useLiveQuery(() => db.ingredients.toArray(),   [])

  // Erste Label-Bezeichnung pro Rezept (für die Kachel-Meta-Zeile)
  const primaryLabelByRecipe = useMemo(() => {
    if (!allRecipeLabels || !allLabels) return new Map()
    const labelMap = new Map(allLabels.map(l => [l.id, l.name]))
    const result   = new Map()
    for (const { recipe_id, label_id } of allRecipeLabels) {
      if (!result.has(recipe_id)) result.set(recipe_id, labelMap.get(label_id))
    }
    return result
  }, [allRecipeLabels, allLabels])

  const filteredRecipes = useMemo(() => {
    if (!allRecipes || !allRecipeLabels || !allLabels) return []

    let matchIds = null // null = alle

    // Label-Filter (Single-Select)
    if (activeFilter !== 'Alle') {
      const label = allLabels.find(l => l.name === activeFilter)
      if (label) {
        matchIds = new Set(
          allRecipeLabels
            .filter(rl => rl.label_id === label.id)
            .map(rl => rl.recipe_id)
        )
      }
    }

    // Suchfilter (Titel + Zutatname)
    if (query.trim() && allIngredients) {
      const q = query.toLowerCase().trim()
      const titleHits = new Set(allRecipes.filter(r => r.title.toLowerCase().includes(q)).map(r => r.id))
      const ingHits   = new Set(allIngredients.filter(i => i.name.toLowerCase().includes(q)).map(i => i.recipe_id))
      const searchIds = new Set([...titleHits, ...ingHits])
      matchIds = matchIds ? new Set([...matchIds].filter(id => searchIds.has(id))) : searchIds
    }

    return matchIds === null
      ? allRecipes
      : allRecipes.filter(r => matchIds.has(r.id))
  }, [allRecipes, allLabels, allRecipeLabels, allIngredients, query, activeFilter])

  const isLoading = !allRecipes

  return (
    <div className="min-h-screen bg-bg font-sans text-fg pb-24">

      {/* ── Header ── */}
      <div className="px-5 pt-2 pb-[6px]">
        {/* Eyebrow-Datum + Plus-Button */}
        <div className="flex items-baseline justify-between mb-[14px]">
          <div>
            <p className="font-mono text-10 tracking-[0.18em] uppercase text-muted mb-[2px]">
              {formatEyebrow()}
            </p>
            <h1 className="font-serif font-normal text-38 tracking-[-0.01em] text-fg leading-none m-0">
              Rezepte
            </h1>
          </div>
          {/* + Schaltfläche — Rezept-Erfassung ist für spätere Phase geplant */}
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center
                       bg-surface border border-[var(--line)] text-fg cursor-pointer"
            aria-label="Neues Rezept hinzufügen"
            onClick={() => {/* TODO Phase 2: /neu Route */}}
          >
            <IconPlus size={20} />
          </button>
        </div>

        {/* Suchfeld */}
        <label className="flex items-center gap-[10px] bg-surface border border-[var(--line)]
                          rounded-xl px-[14px] py-[11px] mb-[14px] cursor-text">
          <span className="text-muted flex-none"><IconSearch size={17} /></span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rezept oder Zutat suchen"
            className="flex-1 bg-transparent border-0 outline-none text-[15px]
                       font-sans text-fg placeholder:text-muted"
          />
        </label>
      </div>

      {/* ── Filter-Chip-Zeile ── */}
      {allLabels && (
        <LabelFilter
          labels={allLabels}
          activeFilter={activeFilter}
          onSelect={setActiveFilter}
        />
      )}

      {/* ── Rezept-Kachelraster ── */}
      <div className="px-5">
        {isLoading && (
          <p className="text-center text-muted mt-12 text-[15px]">Lädt …</p>
        )}
        {!isLoading && filteredRecipes.length === 0 && (
          <p className="text-center text-muted mt-12 text-[15px]">Keine Rezepte gefunden.</p>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              primaryLabel={primaryLabelByRecipe.get(recipe.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
