import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db.js'
import RecipePhoto from '../components/RecipePhoto.jsx'
import { IconBack, IconBookmark, IconClock, IconPortions } from '../components/icons.jsx'

function formatAmount(ing) {
  if (!ing.amount || ing.amount === 0) return 'n. B.'
  return ing.unit ? `${ing.amount} ${ing.unit}` : String(ing.amount)
}

function loadBookmarked(id) {
  try {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]').includes(id)
  } catch {
    return false
  }
}

export default function RecipeDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const recipeId = Number(id)

  const [checkedIngredients, setCheckedIngredients] = useState(new Set())
  const [activeStep, setActiveStep]                 = useState(0)
  const [bookmarked, setBookmarked]                 = useState(() => loadBookmarked(recipeId))
  const [isStuck, setIsStuck]                       = useState(false)

  const scrollContainerRef = useRef(null)
  const sentinelRef        = useRef(null)

  const recipe      = useLiveQuery(() => db.recipes.get(recipeId), [recipeId])
  const ingredients = useLiveQuery(
    () => db.ingredients.where('recipe_id').equals(recipeId).sortBy('order_num'),
    [recipeId]
  )
  const steps = useLiveQuery(
    () => db.steps.where('recipe_id').equals(recipeId).sortBy('order_num'),
    [recipeId]
  )
  const labels = useLiveQuery(async () => {
    const rows = await db.recipe_labels.where('recipe_id').equals(recipeId).toArray()
    if (!rows.length) return []
    return db.labels.where('id').anyOf(rows.map(r => r.label_id)).toArray()
  }, [recipeId])

  // Shadow-Effekt: erscheint wenn Zutaten-Band oben eingeklemmt ist
  useEffect(() => {
    const sentinel  = sentinelRef.current
    const container = scrollContainerRef.current
    if (!sentinel || !container) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { root: container, threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [recipe?.id])

  function toggleIngredient(index) {
    setCheckedIngredients(prev => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }

  function toggleBookmark() {
    setBookmarked(prev => {
      const next = !prev
      try {
        const stored = new Set(JSON.parse(localStorage.getItem('bookmarks') || '[]'))
        next ? stored.add(recipeId) : stored.delete(recipeId)
        localStorage.setItem('bookmarks', JSON.stringify([...stored]))
      } catch { /* localStorage nicht verfügbar */ }
      return next
    })
  }

  if (!recipe) {
    return (
      <div className="screen-height flex items-center justify-center text-muted font-sans">
        Lädt …
      </div>
    )
  }

  return (
    <div className="screen-height relative bg-bg overflow-hidden font-sans text-fg">

      {/* ── Floating Zurück-Button — bleibt immer oben links sichtbar ── */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Zurück zur Übersicht"
        className="absolute top-[14px] left-4 z-20 w-[38px] h-[38px] rounded-full
                   flex items-center justify-center border-0 cursor-pointer
                   bg-white/[0.92] backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.16)]
                   text-[#2a1f1a]"
      >
        <IconBack size={17} />
      </button>

      {/* ── Floating Lesezeichen-Button — bleibt immer oben rechts sichtbar ── */}
      <button
        onClick={toggleBookmark}
        aria-label={bookmarked ? 'Lesezeichen entfernen' : 'Als Lesezeichen speichern'}
        className="absolute top-[14px] right-4 z-20 w-[38px] h-[38px] rounded-full
                   flex items-center justify-center border-0 cursor-pointer
                   bg-white/[0.92] backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
        style={{ color: 'var(--accent)' }}
      >
        <IconBookmark size={15} filled={bookmarked} />
      </button>

      {/* ── Einziger Scroll-Container ── */}
      <div ref={scrollContainerRef} className="h-full overflow-y-auto">

        {/* Hero-Foto (220 px, vollfläche, kein Radius) */}
        <RecipePhoto recipe={recipe} height={220} radius={0} large />

        {/* Titelblock */}
        <div className="px-5 pt-[14px] pb-[12px]">
          <h1 className="font-serif font-normal text-28 tracking-[-0.01em] text-fg m-0 mb-2">
            {recipe.title}
          </h1>

          {labels && labels.length > 0 && (
            <div className="flex flex-wrap items-center gap-[6px] mb-[10px]">
              {labels.slice(0, 3).map(l => (
                <span
                  key={l.id}
                  className="font-mono text-[11px] tracking-[0.04em] lowercase
                             px-2 py-[3px] rounded-full bg-accent-soft text-accent-deep"
                >
                  {l.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-[18px] text-13 text-muted">
            <span className="flex items-center gap-[6px]">
              <IconClock size={14} />
              {recipe.cook_time_minutes} Min.
            </span>
            <span className="flex items-center gap-[6px]">
              <IconPortions size={14} />
              {recipe.servings} Portionen
            </span>
          </div>
        </div>

        {/* Sentinel: IntersectionObserver erkennt hier ob Zutaten-Band "klebt" */}
        <div ref={sentinelRef} className="h-px" aria-hidden="true" />

        {/* ── Sticky-Band: Zutaten bleiben beim Scrollen oben sichtbar ── */}
        <div
          className="sticky top-0 z-[5] bg-bg py-[6px]"
          style={{
            boxShadow: isStuck ? '0 6px 14px rgba(42,31,26,0.10)' : 'none',
            transition: 'box-shadow 180ms ease',
          }}
        >
          <div className="mx-5 px-[14px] pt-3 pb-[10px] bg-surface border border-[var(--line)] rounded-[14px]">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-10 tracking-[0.16em] uppercase text-muted">
                Zutaten
              </span>
              <span className="text-11 text-muted">
                {ingredients?.length ?? 0} Zutaten
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-[14px] gap-y-[6px]">
              {ingredients?.map((ing, i) => {
                const checked = checkedIngredients.has(i)
                return (
                  <button
                    key={ing.id}
                    onClick={() => toggleIngredient(i)}
                    className={[
                      'flex items-baseline justify-between gap-2 border-0 bg-transparent',
                      'p-0 pb-[5px] border-b border-dashed border-[var(--line-soft)]',
                      'cursor-pointer text-left font-sans transition-opacity',
                      checked ? 'opacity-40 line-through' : '',
                    ].join(' ')}
                  >
                    <span className="text-[13.5px] text-fg">{ing.name}</span>
                    <span className="font-mono text-[12px] text-muted whitespace-nowrap flex-shrink-0">
                      {formatAmount(ing)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Zubereitungs-Block (fließt natürlich unter dem Sticky-Band) ── */}
        <div className="px-5 pt-[14px] pb-8">
          <div className="flex items-baseline justify-between pb-2">
            <span className="font-mono text-10 tracking-[0.16em] uppercase text-muted">
              Zubereitung
            </span>
            <span className="text-11 text-muted">
              {(steps?.length ?? 0) > 0 ? `${activeStep + 1} / ${steps.length}` : ''}
            </span>
          </div>

          {steps?.map((step, i) => {
            const active = i === activeStep
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={[
                  'flex gap-[14px] w-full text-left bg-transparent border-0',
                  'cursor-pointer font-sans text-fg py-3 px-1',
                  i < (steps.length - 1) ? 'border-b border-[var(--line-soft)]' : '',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex-none w-[26px] h-[26px] rounded-full font-mono text-[12px]',
                    'font-semibold flex items-center justify-center mt-[1px]',
                    'transition-[background,color,border] duration-[120ms]',
                    active
                      ? 'bg-accent text-accent-fg border-0'
                      : 'bg-transparent text-muted border border-[var(--line)]',
                  ].join(' ')}
                >
                  {i + 1}
                </span>
                <span
                  className={[
                    'flex-1 leading-[1.45] transition-[font-size,color] duration-[120ms] text-pretty',
                    active
                      ? 'text-[15px] font-medium text-fg'
                      : 'text-[14px] font-normal text-fg-soft',
                  ].join(' ')}
                >
                  {step.description}
                </span>
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}
