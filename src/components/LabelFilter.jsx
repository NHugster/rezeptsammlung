const GROUP_ORDER = ['Mahlzeit', 'Ernährung', 'Charakter', 'Herkunft']

// Flache, horizontal scrollende Chip-Zeile — Single-Select
// labels: Array<{id, name, group}>, activeFilter: string, onSelect: (name) => void
export default function LabelFilter({ labels, activeFilter, onSelect }) {
  const sorted = GROUP_ORDER.flatMap(group =>
    labels.filter(l => l.group === group)
  )

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none px-5 pb-[18px] pt-[2px]">
      {/* "Alle" räumt den Filter */}
      <ChipButton
        label="Alle"
        active={activeFilter === 'Alle'}
        onClick={() => onSelect('Alle')}
      />
      {sorted.map(label => (
        <ChipButton
          key={label.id}
          label={label.name}
          active={activeFilter === label.name}
          onClick={() => onSelect(label.name)}
        />
      ))}
    </div>
  )
}

function ChipButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex-none px-[14px] py-2 rounded-full text-[13px] font-sans',
        'border whitespace-nowrap cursor-pointer transition-[background,color,border-color] duration-[120ms]',
        active
          ? 'bg-accent border-accent text-accent-fg font-semibold'
          : 'bg-surface border-[var(--line)] text-fg font-medium',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
