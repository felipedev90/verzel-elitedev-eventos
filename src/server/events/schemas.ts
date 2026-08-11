import { z } from 'zod'

export const createEventSchema = z.object({
  externalId: z.string().min(1),
  venueName: z.string().min(1),
  city: z.string().min(1),
  startsAt: z.string().datetime(),
  priceCents: z.number().int().positive(),
  published: z.boolean().default(false),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
