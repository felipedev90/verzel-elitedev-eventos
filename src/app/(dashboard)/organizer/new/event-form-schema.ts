import { z } from 'zod'

export const eventFormSchema = z.object({
  venueName: z.string().min(1, 'Local obrigatório'),
  city: z.string().min(1, 'Cidade obrigatória'),
  startsAt: z.string().min(1, 'Data obrigatória'),
  priceCents: z.coerce.number().int().positive('Preço deve ser maior que zero'),
  published: z.boolean(),
})

export type EventFormInput = z.input<typeof eventFormSchema>
export type EventFormOutput = z.output<typeof eventFormSchema>
