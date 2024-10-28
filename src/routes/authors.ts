import prisma from '@/db';
import { Author, authorCreateSchema } from '@/types/Authors';
import { Book } from '@/types/Books';
import { handleErrorResponse } from '@/utils/utils';
import { Hono } from 'hono';

const authorsRouter = new Hono();

authorsRouter.get('/', async (c) => {
  try {
    const authors: Author[] = await prisma.author.findMany({
      include: {
        books: true,
      },
    });

    return c.json(
      {
        authors,
      },
      200
    );
  } catch (error) {
    return handleErrorResponse(c, 'Error fetching authors', 500);
  }
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
      return handleErrorResponse(c, 'Error fetching author: Author not found', 404);
    }

    return c.json(
      {
        author,
      },
      200
    );
  } catch (error) {
    return handleErrorResponse(c, 'Error fetching author: Invalid id', 500);
  }
});

authorsRouter.post('/', async (c) => {
  try {
    const result = await c.req.json();
    const parsed = authorCreateSchema.safeParse(result);

    if (!parsed.success) {
      return handleErrorResponse(
        c,
        'Validation error (authors): Invalid name input',
        400
      );
    }

    const { name, books }: { name: string; books?: { id: string }[] } =
      parsed.data;

    if (name.trim() === '') {
      return handleErrorResponse(
        c,
        'Validation error (authors): Name is required',
        400
      );
    }

    let validBooks: Book[] = [];
    if (books && books.length > 0) {
      validBooks = (await prisma.book.findMany({
        where: {
          id: {
            in: books.map((book) => book.id),
          },
        },
      }))
      
      if (validBooks.length !== books.length) {
        return handleErrorResponse(
          c,
          'Validation error (authors): Some books are not found',
          404
        );
      }
    }

    const author = await prisma.$transaction(async (tx) => {
      return await tx.author.create({
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
    console.error('error creating author:', error);
    return c.json({ message: 'an unexpected error occurred' }, 500);
  }
});

authorsRouter.patch('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const result = await c.req.json();
    const parsed = authorCreateSchema.safeParse(result);

    if (!parsed.success) {
      return handleErrorResponse(
        c,
        'Validation error (authors): Invalid name input',
        400
      );
    }

    const { name } = parsed.data;

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
      return handleErrorResponse(c, 'Error updating author: Author not found', 404);
    }

    return handleErrorResponse(c, 'Error updating author: Invalid input', 500);
  }
});

authorsRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const author = await prisma.$transaction(async (tx) => {
      await tx.book.deleteMany({
        where: {
          author_id: id,
        },
      });

      return await tx.author.delete({
        where: {
          id: id,
        },
      });
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
      return handleErrorResponse(c, 'Error deleting author: Author not found', 404);
    }

    return handleErrorResponse(c, 'Error deleting author: Invalid input', 500);
  }
});

export default authorsRouter;
