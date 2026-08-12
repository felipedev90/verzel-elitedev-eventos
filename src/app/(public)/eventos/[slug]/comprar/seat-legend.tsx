export function SeatLegend() {
  return (
    <div className="flex items-center justify-center gap-6 text-xs text-text-muted">
      <span className="flex items-center gap-2">
        <span className="size-3 rounded border border-border" /> Disponível
      </span>
      <span className="flex items-center gap-2">
        <span className="size-3 rounded border border-accent bg-accent" /> Selecionado
      </span>
      <span className="flex items-center gap-2">
        <span className="size-3 rounded border border-border/50 opacity-40" /> Ocupado
      </span>
    </div>
  )
}
