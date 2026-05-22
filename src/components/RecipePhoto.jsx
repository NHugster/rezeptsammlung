// Fallback-Paletten (warm, editorial) für Rezepte ohne Foto
const TINTS = [
  ['#bcc28a', '#e8d59b', '#a8a05c'],
  ['#efe3c4', '#d7b27a', '#c69558'],
  ['#d49858', '#b87338', '#8a4a1f'],
  ['#e2a96b', '#c45a2c', '#8b3416'],
  ['#e8a892', '#d77860', '#7e9168'],
]

function recipeBackground([a, b, c]) {
  return [
    `radial-gradient(at 22% 28%, ${a} 0%, transparent 55%)`,
    `radial-gradient(at 78% 18%, ${b} 0%, transparent 50%)`,
    `radial-gradient(at 55% 85%, ${c} 0%, transparent 60%)`,
    `linear-gradient(180deg, ${a} 0%, ${b} 100%)`,
  ].join(', ')
}

// Subtile Textur-Streifen auf Platzhaltern (kein flaches Gradient)
const STRIPE_BG = 'repeating-linear-gradient(127deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px), repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 6px)'

export default function RecipePhoto({ recipe, height, radius = 14, large = false }) {
  const tint = TINTS[(recipe.id - 1) % TINTS.length]
  const hasPhoto = !!recipe.image_url

  return (
    // inline-style nötig: dynamischer Gradient aus Rezept-Tint-Daten
    <div
      className="relative w-full overflow-hidden flex-shrink-0"
      style={{
        height,
        borderRadius: radius,
        background: hasPhoto ? '#3a2c25' : recipeBackground(tint),
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
      }}
    >
      {/* Texturtextur-Overlay auf Platzhaltern */}
      {!hasPhoto && (
        <div className="absolute inset-0" style={{ backgroundImage: STRIPE_BG }} />
      )}

      {/* Echtes Foto */}
      {hasPhoto && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Vignettenüberlagerung — inline-style nötig: conditional gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: hasPhoto
            ? 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.18) 100%)'
            : 'radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.18) 100%)',
        }}
      />

      {/* Platzhalter-Beschriftung */}
      {!hasPhoto && (
        <div
          className="absolute font-mono uppercase text-white/80 bg-black/[0.18] backdrop-blur-sm rounded"
          style={{
            left: large ? 16 : 10,
            bottom: large ? 16 : 8,
            fontSize: large ? 11 : 9,
            letterSpacing: '0.06em',
            padding: large ? '4px 8px' : '2px 6px',
          }}
        >
          [ Foto · {recipe.id} ]
        </div>
      )}
    </div>
  )
}
