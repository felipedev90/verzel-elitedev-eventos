import { z } from 'zod'

export const checkoutFormSchema = z.object({
  holderName: z.string().min(1, 'Nome obrigatório'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Número do cartão deve ter 16 dígitos'),
})

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>
