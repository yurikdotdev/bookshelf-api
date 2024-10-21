import { Hono } from 'hono';
import { logger } from 'hono/logger';

const dataBooks = [
  {
    id: '1',
    title: 'Book 1',
    author: 'Author 1',
    description: 'Description 1',
    publisher: 'Publisher 1',
    published_date: '2021-01-01',
  },
  {
    id: '2',
    title: 'Book 2',
    author: 'Author 2',
    description: 'Description 2',
    publisher: 'Publisher 2',
    published_date: '2021-01-01',
  },
];

const app = new Hono();

app.use(logger());

app.get('/', (c) => {
  c.header('X-Message', '201');

  return c.json(
    {
      message: 'Bookshelf API',
    },
    200
  );
});

app.get('/books', (c) => {
  const page = Number(c.req.query('page')) || 1;
  const itemsPerPage = Number(c.req.query('items')) || 10;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = dataBooks.slice(startIndex, endIndex);

  return c.json(
    {
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
      message: 'All books deleted successfully',
    },
    204
  );
});

app.delete('/books/:id', (c) => {
  const id = c.req.param('id');

  const bookIndex = dataBooks.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return c.json({ message: 'Book not found' }, 404);
  }

  dataBooks.splice(bookIndex, 1);

  return c.json(
    {
      message: 'Book deleted successfully',
    },
    204
  );
});

export default app;
