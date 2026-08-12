import { Button } from '@/components/ui/Button'

type EventActionsProps = {
  isEditing: boolean
  isPublished: boolean
  isToggling: boolean
  onEdit: () => void
  onTogglePublished: () => void
}

export function EventActions({
  isEditing,
  isPublished,
  isToggling,
  onEdit,
  onTogglePublished,
}: EventActionsProps) {
  return (
    <div className="flex gap-3">
      {!isEditing && (
        <Button variant="primary" onClick={onEdit} className="cursor-pointer">
          Editar
        </Button>
      )}
      <Button
        onClick={onTogglePublished}
        disabled={isToggling}
        variant="ghost"
        className="cursor-pointer"
      >
        {isToggling ? 'Atualizando...' : isPublished ? 'Despublicar' : 'Publicar'}
      </Button>
    </div>
  )
}
