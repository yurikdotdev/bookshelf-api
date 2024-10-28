import { Hono } from 'hono';
import { logger } from 'hono/logger';

import authorsRouter from './routes/authors';
import booksRouter from './routes/books';

const app = new Hono();

app.use(logger());

app.get('/', (c) => {
  return c.json(
    {
      message: 'Bookshelf API',
    },
    200
  );
});

app.route('/books', booksRouter);
app.route('/authors', authorsRouter);

export default app;
