import { z } from 'zod';

const flexibleDate = z.union([
  z.date(),
  z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date string format',
  }), 
]);

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(255),
  description: z.string().optional().nullable().default(''),
  publisher: z.string().max(255).optional().nullable().default(''),
  published_date: flexibleDate.optional().nullable().default(new Date()),
  language: z.string().max(100).optional().nullable().default(''),
  cover_image: z.string().optional().nullable().default(''),
  author_id: z.string().uuid(),
});

export const bookCreateSchema = bookSchema.omit({
  id: true,
});

export type Book = z.infer<typeof bookSchema>;
