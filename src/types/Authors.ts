import { z } from 'zod';

export const authorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  books: z.array(z.any()).optional(),
});

export const authorCreateSchema = z.object({
  name: z.string().max(100),
  books: z.array(z.any()).optional(),
})

export type Author = z.infer<typeof authorSchema>;
