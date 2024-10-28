import prisma from '@/db';
import { bookCreateSchema } from '@/types/Books';
import { handleErrorResponse } from '@/utils/utils';
import { Book } from '@prisma/client';
import { Hono } from 'hono';

const booksRouter = new Hono();

booksRouter.get('/', async (c) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: true,
      },
    });

    return c.json(
      {
        books,
      },
      200
    );
  } catch (error) {
    return handleErrorResponse(c, 'Error fetching books', 500);
  }
});

booksRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const book = await prisma.book.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });

    if (!book) {
      return handleErrorResponse(c, 'Error fetching book: Book not found', 404);
    }

    return c.json(
      {
        book,
      },
      200
    );
  } catch (error) {
    return handleErrorResponse(c, 'Error fetching book: Invalid id', 500);
  }
});

booksRouter.post('/', async (c) => {
  try {
    const result = await c.req.json();
    const parsed = bookCreateSchema.safeParse(result);

    if (!parsed.success) {
      return handleErrorResponse(
        c,
        'Validation error (books): Invalid book input',
        400
      );
    }

    const {
      title,
      description,
      publisher,
      published_date,
      language,
      cover_image,
      author_id,
    } = parsed.data;

    if (!title || !author_id) {
      return handleErrorResponse(
        c,
        'Validation error (books): Title and author id are required',
        400
      );
    }

    if (title.trim() === '' || author_id.trim() === '') {
      return handleErrorResponse(
        c,
        'Validation error (books): Title or author id cannot be empty',
        400
      );
    }

    const author = await prisma.author.findUnique({
      where: {
        id: author_id,
      },
    });

    if (!author) {
      return handleErrorResponse(
        c,
        'Error creating book: Author not found',
        404
      );
    }

    const book: Book = await prisma.$transaction(async (tx) => {
      return await tx.book.create({
        data: {
          title,
          description,
          publisher,
          published_date,
          language,
          cover_image,
          author_id,
        },
      });
    });

    return c.json(
      {
        message: 'Book added successfully',
        book,
      },
      201
    );
  } catch (error) {
    return handleErrorResponse(c, 'Error creating book: Invalid id', 500);
  }
});

booksRouter.patch('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const result = await c.req.json();
    const parsed = bookCreateSchema.safeParse(result);

    if (!parsed.success) {
      return handleErrorResponse(
        c,
        'Validation error (books): Invalid book input',
        400
      );
    }

    const {
      title,
      description,
      publisher,
      published_date,
      language,
      cover_image,
      author_id,
    } = parsed.data;

    if (!title || !author_id) {
      return handleErrorResponse(
        c,
        'Validation error (books): Title and author id are required',
        400
      );
    }

    if (title.trim() === '' || author_id.trim() === '') {
      return handleErrorResponse(
        c,
        'Validation error (books): Title or author id cannot be empty',
        400
      );
    }

    const author = await prisma.author.findUnique({
      where: {
        id: author_id,
      },
    });

    if (!author) {
      return handleErrorResponse(
        c,
        'Error updating book: Author not found',
        404
      );
    }

    const book: Book = await prisma.book.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        publisher,
        published_date,
        language,
        cover_image,
        author_id,
      },
    });

    return c.json(
      {
        message: 'Book updated successfully',
        book,
      },
      200
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleErrorResponse(c, 'Error updating book: Book not found', 404);
    }

    return handleErrorResponse(c, 'Error updating book: Invalid input', 500);
  }
});

booksRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const book = await prisma.book.delete({
      where: {
        id: id,
      },
    });

    return c.json(
      {
        message: 'Book deleted successfully',
        book,
      },
      200
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return handleErrorResponse(c, 'Error deleting book: Book not found', 404);
    }

    return handleErrorResponse(c, 'Error deleting book: Invalid id', 500);
  }
});

export default booksRouter;
