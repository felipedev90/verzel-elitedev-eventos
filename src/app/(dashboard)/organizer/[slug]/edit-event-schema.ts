import { z } from 'zod'

export const editEventSchema = z.object({
  venueName: z.string().min(1, 'Local obrigatório'),
  city: z.string().min(1, 'Cidade obrigatória'),
  startsAt: z.string().min(1, 'Data obrigatória'),
})

export type EditEventInput = z.infer<typeof editEventSchema>
