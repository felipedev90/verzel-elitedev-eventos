'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { formatPriceFromCents } from '@/lib/format'
import { checkoutFormSchema, type CheckoutFormInput } from './checkout-schema'

type PaymentFormProps = {
  totalCents: number
  onSubmit: (data: CheckoutFormInput) => Promise<void>
  declined: boolean
  serverError: string | null
}

export function PaymentForm({ totalCents, onSubmit, declined, serverError }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="holderName" className="text-sm text-text-muted">
          Nome do titular
        </label>
        <input
          id="holderName"
          autoComplete="name"
          aria-invalid={errors.holderName ? 'true' : 'false'}
          {...register('holderName')}
          className="rounded-md border border-border bg-bg px-3 py-2.5 text-text transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {errors.holderName && (
          <p role="alert" className="text-sm text-red-400">
            {errors.holderName.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cardNumber" className="text-sm text-text-muted">
          Número do cartão
        </label>
        <input
          id="cardNumber"
          inputMode="numeric"
          maxLength={16}
          placeholder="0000000000000000"
          autoComplete="cc-number"
          aria-invalid={errors.cardNumber ? 'true' : 'false'}
          {...register('cardNumber')}
          className="rounded-md border border-border bg-bg px-3 py-2.5 text-text transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {errors.cardNumber && (
          <p role="alert" className="text-sm text-red-400">
            {errors.cardNumber.message}
          </p>
        )}
        <p className="text-xs text-text-muted">
          Pagamento simulado — nenhuma cobrança real é feita.
        </p>
      </div>

      {declined && (
        <p role="alert" className="text-sm text-red-400">
          Pagamento recusado. Verifique os dados e tente novamente.
        </p>
      )}

      {serverError && (
        <p role="alert" className="text-sm text-red-400">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full cursor-pointer">
        {isSubmitting ? (
          <>
            <Spinner className="mr-2 size-4" />
            Processando...
          </>
        ) : (
          `Confirmar compra · ${formatPriceFromCents(totalCents)}`
        )}
      </Button>
    </form>
  )
}
