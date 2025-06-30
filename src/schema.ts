import { z } from 'zod';

export const opinionSchema = z.object({
  caseroId: z.string().min(3, 'El identificador debe tener al menos 3 caracteres'),
  texto: z.string().min(10, 'La opinión debe tener al menos 10 caracteres').max(500, 'La opinión no puede exceder los 500 caracteres'),
  rating: z.number().min(1).max(5),
});

export type OpinionFormData = z.infer<typeof opinionSchema>;
