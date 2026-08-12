'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { manualCodeSchema, type ManualCodeInput } from './validate-schema'

type ManualCodeFormProps = {
  onValidate: (code: string) => void
  isValidating: boolean
}

export function ManualCodeForm({ onValidate, isValidating }: ManualCodeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualCodeInput>({
    resolver: zodResolver(manualCodeSchema),
  })

  function onSubmit(data: ManualCodeInput) {
    onValidate(data.code)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Código do ingresso"
        aria-invalid={errors.code ? 'true' : 'false'}
        {...register('code')}
        className="rounded-md border border-border bg-surface px-3 py-2.5 text-text transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent text-center"
      />
      {errors.code && (
        <p role="alert" className="text-sm text-red-400">
          {errors.code.message}
        </p>
      )}

      <Button type="submit" disabled={isValidating} variant="ghost" className="px-4 py-2 text-sm">
        {isValidating ? (
          <>
            <Spinner className="mr-2 size-4" />
            Validando...
          </>
        ) : (
          'Validar código'
        )}
      </Button>
    </form>
  )
}
