import { z } from 'zod'

export const checkoutSchema = z.object({
  eventId: z.string().min(1),
  seatIds: z.array(z.string().min(1)).min(1),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  holderName: z.string().min(1),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
