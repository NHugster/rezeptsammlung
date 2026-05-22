import { useState } from 'react'
import { Link } from 'react-router-dom'
import RecipePhoto from './RecipePhoto.jsx'
import { IconBookmark, IconClock } from './icons.jsx'

function loadBookmarks() {
  try {
    return new Set(JSON.parse(localStorage.getItem('bookmarks') || '[]'))
  } catch {
    return new Set()
  }
}

export default function RecipeCard({ recipe, primaryLabel }) {
  const [bookmarked, setBookmarked] = useState(
    () => loadBookmarks().has(recipe.id)
  )

  function handleBookmark(e) {
    e.preventDefault()
    e.stopPropagation()
    setBookmarked(prev => {
      const next = !prev
      try {
        const stored = loadBookmarks()
        next ? stored.add(recipe.id) : stored.delete(recipe.id)
        localStorage.setItem('bookmarks', JSON.stringify([...stored]))
      } catch { /* localStorage nicht verfügbar */ }
      return next
    })
  }

  return (
    <Link
      to={`/rezept/${recipe.id}`}
      className="block text-fg no-underline"
    >
      {/* Foto + Lesezeichen-Button */}
      <div className="relative">
        <RecipePhoto recipe={recipe} height={170} radius={14} />
        <button
          onClick={handleBookmark}
          aria-label={bookmarked ? 'Lesezeichen entfernen' : 'Als Lesezeichen speichern'}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
                     bg-white/85 backdrop-blur-sm border-0 cursor-pointer
                     text-fg [&.bookmarked]:text-accent"
          style={{ color: bookmarked ? 'var(--accent)' : 'var(--fg)' }}
        >
          <IconBookmark size={15} filled={bookmarked} />
        </button>
      </div>

      {/* Titel + Meta */}
      <div className="pt-[10px] px-[2px]">
        <p className="font-serif font-medium text-17 tracking-[-0.005em] text-fg mb-[5px] leading-[1.15]">
          {recipe.title}
        </p>
        <div className="flex items-center gap-[5px] text-[12px] text-muted">
          <IconClock size={12} />
          <span>{recipe.cook_time_minutes} Min.</span>
          {primaryLabel && (
            <>
              <span className="opacity-40 mx-[4px]">·</span>
              <span>{primaryLabel}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
