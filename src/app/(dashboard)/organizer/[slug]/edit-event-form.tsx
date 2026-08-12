'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { FormField } from '../new/form-field'
import { editEventSchema, type EditEventInput } from './edit-event-schema'

type EditEventFormProps = {
  defaultValues: EditEventInput
  onSave: (data: EditEventInput) => Promise<void>
  onCancel: () => void
  serverError: string | null
}

export function EditEventForm({
  defaultValues,
  onSave,
  onCancel,
  serverError,
}: EditEventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditEventInput>({
    resolver: zodResolver(editEventSchema),
    defaultValues,
  })

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      noValidate
      className="flex flex-col gap-4 rounded-md border border-border bg-surface p-5"
    >
      <FormField label="Local" error={errors.venueName} registration={register('venueName')} />
      <FormField label="Cidade" error={errors.city} registration={register('city')} />
      <FormField
        label="Data e hora"
        type="datetime-local"
        error={errors.startsAt}
        registration={register('startsAt')}
      />

      {serverError && (
        <p role="alert" className="text-sm text-red-400">
          {serverError}
        </p>
      )}

      <div className="flex gap-3">
        <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 size-4" />
              Salvando...
            </>
          ) : (
            'Salvar'
          )}
        </Button>
        <Button className="cursor-pointer" type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
