import { Hono } from 'hono';
import { logger } from 'hono/logger';

import booksRouter from './routes/books'; 
import authorsRouter from './routes/authors';
import tagsRouter from './routes/tags';

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
app.route('/tags', tagsRouter)

export default app;
