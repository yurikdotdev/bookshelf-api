import { Hono } from 'hono';
import prisma from '../db';

import { Author, authorCreateSchema } from '../types/Authors';
import { Book } from '../types/Books';

const authorsRouter = new Hono();

authorsRouter.get('/', async (c) => {
  const authors: Author[] = await prisma.author.findMany();

  return c.json(
    {
      authors,
    },
    200
  );
});

authorsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const author = await prisma.author.findUnique({
      where: {
        id: id,
      },
      include: {
        books: true,
      },
    });

    if (!author) {
      return c.json({ message: 'Author not found' }, 404);
    }

    return c.json(
      {
        author,
      },
      200
    );
  } catch (error) {
    console.error('Error fetching author:', error);
    return c.json({ message: 'Internal Server Error: Invalid input' }, 500);
  }
});

authorsRouter.post('/', async (c) => {
  try {
    const result = await c.req.json();
    const parsed = authorCreateSchema.safeParse(result);

    if (!parsed.success) {
      return c.json('Validation Error: Invalid input', 400);
    }

    const { name, books }: { name: string; books?: { id: string }[] } =
      parsed.data;

    if (name.trim() === '') {
      return c.json({ message: 'Validation Error: Name is required' }, 400);
    }

    let validBooks: Book[] = [];

    if (books && books.length > 0) {
      validBooks = (await prisma.book.findMany({
        where: {
          id: {
            in: books.map((book) => book.id),
          },
        },
      })) as Book[];

      if (validBooks.length !== books.length) {
        return c.json({ message: 'Some books not found' }, 404);
      }
    }

    const author: Author = await prisma.author.create({
      data: {
        name,
        ...(validBooks.length > 0 && {
          books: {
            connect: validBooks.map((book) => ({
              id: book.id,
            })),
          },
        }),
      },
      include: {
        books: true,
      },
    });

    return c.json(
      {
        message: 'Author created successfully',
        author: {
          id: author.id,
          name: author.name,
          books: validBooks || [],
        },
      },
      201
    );
  } catch (error) {
    console.error('Error creating author:', error);
    return c.json({ message: 'An unexpected error occurred' }, 500);
  }
});

authorsRouter.patch('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const { name } = await c.req.json();

    const author = await prisma.author.update({
      where: {
        id: id,
      },
      data: {
        name,
      },
    });

    return c.json(
      {
        message: `Author updated successfully`,
        author: {
          id: author.id,
          name: author.name,
        },
      },
      200
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return c.json({ message: 'Author not found' }, 404);
    }

    console.error('Error fetching author:', error);
    return c.json({ message: 'Internal Server Error: Invalid input' }, 500);
  }
});

authorsRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const author = await prisma.author.delete({
      where: {
        id: id,
      },
    });

    return c.json(
      {
        message: 'Author deleted successfully',
        author: {
          id: author.id,
          name: author.name,
        },
      },
      200
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return c.json({ message: 'Author not found' }, 404);
    }

    console.error('Error fetching author:', error);
    return c.json({ message: 'Internal Server Error: Invalid input' }, 500);
  }
});

export default authorsRouter;
