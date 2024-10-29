import { Book } from '@prisma/client';
import { Hono } from 'hono';
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from '../services/booksService';
import { bookCreateSchema } from '../types/Books';
import { handleErrorResponse } from '../utils/utils';

const booksRouter = new Hono();

booksRouter.get('/', async (c) => {
  try {
    const books = await getAllBooks();

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
    const book = await getBookById(id);

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

    const book: Book = await createBook(parsed);

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

    const book: Book = await updateBook(id, parsed);

    if (!book) {
      return handleErrorResponse(c, 'Error updating book: Book not found', 404);
    }

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
    const book = await deleteBook(id);
    
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
