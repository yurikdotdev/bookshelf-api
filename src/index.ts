import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { dataBooks } from './data/dataBooks';

const app = new Hono();

app.use(logger());

app.get('/', (c) => {
  c.header('X-Message', '201');

  return c.json(
    {
      ok: true,
      message: 'Bookshelf API',
    },
    200
  );
});

app.get('/books', (c) => {
  const page = Number(c.req.query('page')) || 1;
  const itemsPerPage = 3;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = dataBooks.slice(startIndex, endIndex);

  return c.json(
    {
      ok: true,
      total: dataBooks.length,
      page,
      books: paginatedBooks,
    },
    200
  );
});

app.get('/books/:id', (c) => {
  const id = c.req.param('id');

  const book = dataBooks.find((book) => book.id === id);

  if (!book) {
    return c.json({ message: 'Book not found' }, 404);
  }

  return c.json(
    {
      book,
    },
    200
  );
});

app.post('/books', async (c) => {
  const { title, author, description, publisher, published_date } =
    await c.req.json();

  const newBook = {
    id: crypto.randomUUID(),
    title,
    author,
    description,
    publisher,
    published_date,
  };

  dataBooks.push(newBook);

  return c.json(
    {
      ok: true,
      message: 'Book added successfully',
      book: newBook,
    },
    201
  );
});

app.patch('/books/:id', async (c) => {
  const id = c.req.param('id');

  const { title, author, description, publisher, published_date } =
    await c.req.json();

  const bookIndex = dataBooks.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return c.json({ message: 'Book not found' }, 404);
  }

  dataBooks[bookIndex] = {
    ...dataBooks[bookIndex],
    title,
    author,
    description,
    publisher,
    published_date,
  };

  return c.json(
    {
      ok: true,
      message: 'Book updated successfully',
      book: dataBooks[bookIndex],
    },
    200
  );
});

app.delete('/books', (c) => {
  dataBooks.splice(0, dataBooks.length);

  return c.json(
    {
      ok: true,
      message: 'All books deleted successfully',
    },
    204
  );
})
  
app.delete('/books/:id', (c) => {
  const id = c.req.param('id');

  const bookIndex = dataBooks.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return c.json({ message: 'Book not found' }, 404);
  }

  dataBooks.splice(bookIndex, 1);

  return c.json(
    {
      ok: true,
      message: 'Book deleted successfully',
    },
    204
  );
});

export default app;
