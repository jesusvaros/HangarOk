import { z } from 'zod';

export const opinionSchema = z.object({
  caseroId: z.string().min(3, 'Identifier must be at least 3 characters long'),
  texto: z
    .string()
    .min(10, 'Review must be at least 10 characters long')
    .max(500, 'Review cannot exceed 500 characters'),
  would_recommend: z.number().min(1).max(5),
});

export type OpinionFormData = z.infer<typeof opinionSchema>;
