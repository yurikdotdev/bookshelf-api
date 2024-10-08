import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { dummyBooks } from './data/dummy';

const app = new Hono();

app.use(logger());

app.get('/', (c) => {
  c.header('X-Message', '201');

  return c.json({
    ok: true,
    message: 'Personal Bookshelves API',
  });
});

app.get('/books', (c) => {
  const page = Number(c.req.query('page')) || 1;
  const itemsPerPage = 2;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = dummyBooks.slice(startIndex, endIndex);

  return c.json({
    ok: true,
    total: dummyBooks.length,
    page,
    books: paginatedBooks,
  });
});

app.get('/books/:id', (c) => {
  const id = c.req.param('id');

  const book = dummyBooks.find((book) => book.id === Number(id));

  if (!book) {
    return c.json({ message: 'Book not found' }, 404);
  }

  return c.json(book);
});

export default app;