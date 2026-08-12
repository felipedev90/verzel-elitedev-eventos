import { z } from 'zod'

export const manualCodeSchema = z.object({
  code: z.string().min(1, 'Digite o código do ingresso'),
})

export type ManualCodeInput = z.infer<typeof manualCodeSchema>
