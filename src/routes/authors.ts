import { Hono } from 'hono';
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
} from '../services/authorsService';
import { authorCreateSchema } from '../types/Authors';
import { handleErrorResponse } from '../utils/utils';

const authorsRouter = new Hono();

authorsRouter.get('/', async (c) => {
  try {
    const authors = await getAllAuthors();
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
    const author = await getAuthorById(id);

    if (!author) {
      return handleErrorResponse(
        c,
        'Error fetching author: Author not found',
        404
      );
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

    const { name }: { name: string } = parsed.data;

    if (name.trim() === '') {
      return handleErrorResponse(
        c,
        'Validation error (authors): Name is required',
        400
      );
    }

    const author = await createAuthor(name);

    return c.json(
      {
        message: 'Author created successfully',
        author: {
          id: author.id,
          name: author.name,
          books: author.books,
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

    const author = await updateAuthor(id, name);

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
      return handleErrorResponse(
        c,
        'Error updating author: Author not found',
        404
      );
    }

    return handleErrorResponse(c, 'Error updating author: Invalid input', 500);
  }
});

authorsRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const author = await deleteAuthor(id);

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
      return handleErrorResponse(
        c,
        'Error deleting author: Author not found',
        404
      );
    }

    return handleErrorResponse(c, 'Error deleting author: Invalid input', 500);
  }
});

export default authorsRouter;
