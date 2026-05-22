// Recipe app screens — HomeScreen (Übersicht) and CookScreen (Kochansicht)
// All icons are inline SVG (simple shapes). Type pairing: Newsreader (display
// serif) + Manrope (UI sans) + JetBrains Mono (placeholder captions).

const LABELS = [
  'Alle',
  'Frühstück',
  'Mittagessen',
  'Abendessen',
  'vegetarisch',
  'warm',
  'kalt',
  'schnell (<30 Min)',
  'Schweizer Küche',
  'Italienisch',
];

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────
const IconSearch = ({ size = 18, c = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
const IconClock = ({ size = 14, c = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const IconPortions = ({ size = 14, c = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 13a9 9 0 0 1 18 0" />
    <path d="M2 13h20" />
    <path d="M7 17h10" />
  </svg>
);
const IconBack = ({ size = 18, c = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
const IconBookmark = ({ size = 18, c = 'currentColor', filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h12v17l-6-4-6 4z" />
  </svg>
);
const IconPlus = ({ size = 22, c = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Recipe "photo" placeholder — warm gradient + monospace caption.
// We deliberately don't fake a food illustration here. The user can drop in
// real photography later; until then the placeholder communicates the slot.
// ─────────────────────────────────────────────────────────────
function RecipePhoto({ recipe, height, radius = 14, caption = true, large = false }) {
  const hasPhoto = !!recipe.photo;
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      borderRadius: radius,
      overflow: 'hidden',
      background: hasPhoto ? '#3a2c25' : recipeBackground(recipe.tint),
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
    }}>
      {hasPhoto ? (
        <img
          src={recipe.photo}
          alt={recipe.title}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, ...PHOTO_STRIPES }} />
      )}
      {/* vignette — soft on photos, stronger on placeholders */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hasPhoto
          ? 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.18) 100%)'
          : 'radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.18) 100%)',
      }} />
      {caption && !hasPhoto && (
        <div style={{
          position: 'absolute',
          left: large ? 16 : 10,
          bottom: large ? 16 : 8,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: large ? 11 : 9,
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.78)',
          textTransform: 'uppercase',
          background: 'rgba(0,0,0,0.18)',
          backdropFilter: 'blur(4px)',
          padding: large ? '4px 8px' : '2px 6px',
          borderRadius: 4,
        }}>
          [ Foto · {recipe.id} ]
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Home screen — Übersicht
// ─────────────────────────────────────────────────────────────
function HomeScreen({ accent, onOpen }) {
  const [active, setActive] = React.useState('Alle');
  const [query, setQuery] = React.useState('');

  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--bg)',
      color: 'var(--fg)',
      fontFamily: 'Manrope, system-ui, sans-serif',
      paddingBottom: 96,
    }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 6px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 2,
            }}>
              Donnerstag · 22. Mai
            </div>
            <h1 style={{
              fontFamily: 'Newsreader, Georgia, serif',
              fontWeight: 400,
              fontSize: 38,
              lineHeight: 1,
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              Rezepte
            </h1>
          </div>
          <button style={{
            width: 40, height: 40, borderRadius: 999,
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            color: 'var(--fg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <IconPlus size={20} />
          </button>
        </div>

        {/* Search */}
        <label style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: '11px 14px',
          marginBottom: 14,
        }}>
          <IconSearch size={17} c="var(--muted)" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rezept oder Zutat suchen"
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              flex: 1, fontSize: 15, fontFamily: 'inherit', color: 'var(--fg)',
            }}
          />
        </label>
      </div>

      {/* Filter chips — horizontal scroll */}
      <div style={{
        display: 'flex', gap: 8,
        padding: '2px 20px 18px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {LABELS.map(l => {
          const on = active === l;
          return (
            <button
              key={l}
              onClick={() => setActive(l)}
              style={{
                flex: '0 0 auto',
                padding: '8px 14px',
                borderRadius: 999,
                border: on ? '1px solid var(--accent)' : '1px solid var(--line)',
                background: on ? 'var(--accent)' : 'var(--surface)',
                color: on ? 'var(--accent-fg)' : 'var(--fg)',
                fontSize: 13,
                fontWeight: on ? 600 : 500,
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'background 120ms, color 120ms, border-color 120ms',
              }}
            >
              {l}
            </button>
          );
        })}
      </div>

      {/* Recipe grid — 2 cols on phone, 3-4 on wider via CSS grid auto-fill */}
      <div style={{
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 16,
      }}>
        {RECIPES.map((r, i) => (
          <RecipeCard key={r.id} recipe={r} featured={i === 0} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onOpen }) {
  const [bm, setBm] = React.useState(recipe.id === 'kasknoedel');
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen && onOpen(recipe.id)}
      style={{
        cursor: 'pointer', display: 'block', width: '100%',
        fontFamily: 'inherit', color: 'inherit',
      }}
    >
      <div style={{ position: 'relative' }}>
        <RecipePhoto recipe={recipe} height={170} radius={14} />
        <button
          onClick={(e) => { e.stopPropagation(); setBm(b => !b); }}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 32, height: 32, borderRadius: 999,
            border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: bm ? 'var(--accent)' : 'var(--fg)',
          }}
        >
          <IconBookmark size={15} filled={bm} />
        </button>
      </div>
      <div style={{ padding: '10px 2px 0' }}>
        <div style={{
          fontFamily: 'Newsreader, Georgia, serif',
          fontWeight: 500,
          fontSize: 17,
          lineHeight: 1.15,
          letterSpacing: '-0.005em',
          color: 'var(--fg)',
          marginBottom: 5,
        }}>
          {recipe.title}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 12, color: 'var(--muted)',
        }}>
          <IconClock size={12} />
          <span>{recipe.minutes} Min.</span>
          <span style={{ opacity: 0.4, margin: '0 4px' }}>·</span>
          <span>{recipe.labels[0]}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Cook screen — Kochansicht (recipe detail)
// Single scroll region. Hero + title scroll away, the ingredients block
// pins to the top of the viewport (position: sticky), steps continue
// scrolling below. Back/bookmark buttons float persistently.
// ─────────────────────────────────────────────────────────────
function CookScreen({ recipeId = 'kasknoedel', onBack }) {
  const recipe = RECIPES.find(r => r.id === recipeId) || RECIPES[0];
  const [checked, setChecked] = React.useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const scrollRef = React.useRef(null);
  const [stuck, setStuck] = React.useState(false);

  // Detect when the ingredients block has pinned to the top — used for the
  // soft drop-shadow that signals "this is now a header".
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      // hero is 220 tall; title block roughly 100; sticky starts somewhere
      // around 300. Use 260 as the threshold (some padding tolerance).
      setStuck(el.scrollTop > 260);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [recipeId]);

  return (
    <div style={{
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg)',
      color: 'var(--fg)',
      fontFamily: 'Manrope, system-ui, sans-serif',
    }}>
      {/* Floating buttons — stay visible over hero AND over the sticky block */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: 14, left: 16, zIndex: 20,
          width: 38, height: 38, borderRadius: 999,
          border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#2a1f1a',
          boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
        }}
      >
        <IconBack size={17} />
      </button>
      <button
        style={{
          position: 'absolute', top: 14, right: 16, zIndex: 20,
          width: 38, height: 38, borderRadius: 999,
          border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
        }}
      >
        <IconBookmark size={15} filled />
      </button>

      {/* Single scroll container */}
      <div ref={scrollRef} style={{
        height: '100%',
        overflowY: 'auto',
        scrollBehavior: 'smooth',
      }}>
        {/* Hero image — full-bleed, scrolls away */}
        <div style={{ height: 220, flex: '0 0 auto' }}>
          <RecipePhoto recipe={recipe} height="100%" radius={0} large />
        </div>

        {/* Title + meta block — scrolls away */}
        <div style={{ padding: '14px 20px 12px' }}>
          <h1 style={{
            fontFamily: 'Newsreader, Georgia, serif',
            fontWeight: 400,
            fontSize: 28,
            lineHeight: 1.05,
            margin: '0 0 8px',
            letterSpacing: '-0.01em',
          }}>
            {recipe.title}
          </h1>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            flexWrap: 'wrap', marginBottom: 10,
          }}>
            {recipe.labels.slice(0, 3).map(l => (
              <span key={l} style={{
                fontSize: 11,
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                letterSpacing: '0.04em',
                textTransform: 'lowercase',
                padding: '3px 8px',
                borderRadius: 999,
                background: 'var(--accent-soft)',
                color: 'var(--accent-deep)',
              }}>
                {l}
              </span>
            ))}
          </div>
          <div style={{
            display: 'flex', gap: 18,
            fontSize: 13, color: 'var(--muted)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconClock size={14} /> {recipe.minutes} Min.
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconPortions size={14} /> {recipe.portions} Portionen
            </span>
          </div>
        </div>

        {/* Sticky ingredients band — pins to top of scroll viewport */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: 'var(--bg)',
          paddingTop: 6,
          paddingBottom: 8,
          // Soft drop shadow only once the band is actually pinned.
          boxShadow: stuck ? '0 6px 14px rgba(42, 31, 26, 0.10)' : 'none',
          transition: 'box-shadow 180ms ease',
        }}>
          <div style={{
            margin: '0 20px',
            padding: '12px 14px 10px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
          }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}>
                Zutaten
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                {recipe.ingredients.length} Zutaten
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: 14, rowGap: 6,
            }}>
              {recipe.ingredients.map(([name, amount], i) => {
                const on = checked[i];
                return (
                  <button
                    key={i}
                    onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                    style={{
                      border: 'none', background: 'transparent', padding: 0,
                      fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                      gap: 8,
                      borderBottom: '1px dashed var(--line-soft)',
                      paddingBottom: 5,
                      opacity: on ? 0.4 : 1,
                      textDecoration: on ? 'line-through' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 13.5, color: 'var(--fg)' }}>{name}</span>
                    <span style={{
                      fontSize: 12,
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      color: 'var(--muted)',
                      whiteSpace: 'nowrap',
                    }}>
                      {amount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Steps — flow below the sticky band */}
        <div style={{ padding: '14px 20px 32px' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            padding: '0 2px 8px',
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}>
              Zubereitung
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              {activeStep + 1} / {recipe.steps.length}
            </div>
          </div>
          {recipe.steps.map((s, i) => {
            const on = i === activeStep;
            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  display: 'flex', gap: 14, padding: '12px 4px',
                  borderBottom: i === recipe.steps.length - 1 ? 'none' : '1px solid var(--line-soft)',
                  width: '100%', textAlign: 'left',
                  border: 'none', background: 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
                }}
              >
                <div style={{
                  flex: '0 0 auto',
                  width: 26, height: 26, borderRadius: 999,
                  background: on ? 'var(--accent)' : 'transparent',
                  color: on ? 'var(--accent-fg)' : 'var(--muted)',
                  border: on ? 'none' : '1px solid var(--line)',
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 120ms, color 120ms',
                }}>
                  {i + 1}
                </div>
                <div style={{
                  flex: 1,
                  fontSize: on ? 15 : 14,
                  lineHeight: 1.45,
                  color: on ? 'var(--fg)' : 'var(--fg-soft)',
                  fontWeight: on ? 500 : 400,
                  textWrap: 'pretty',
                  transition: 'font-size 120ms, color 120ms',
                }}>
                  {s}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, CookScreen, RecipePhoto });
