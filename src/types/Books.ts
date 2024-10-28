import { z } from 'zod';

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(255),
  description: z.string().optional(),
  publisher: z.string().max(255).optional(),
  published_date: z.string().datetime({ offset: true }).optional(),
  language: z.string().max(100).optional(),
  cover_image: z.string().optional(),
  author_id: z.string().uuid(),
});

export const bookCreateSchema = bookSchema.omit({
  id: true,
});

export type Book = z.infer<typeof bookSchema>;
