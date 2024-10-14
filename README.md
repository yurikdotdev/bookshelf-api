# Bookshelf API Documentation

install dependencies:

```sh
bun install
```

run:

```sh
bun dev
```

<http://localhost:3000>

## Endpoints

### API Specification

| Endpoint     | HTTP     | Description       |
| ------------ | -------- | ----------------- |
| `/books`     | `GET`    | Get all books     |
| `/books/:id` | `GET`    | Get book by id    |
| `/books`     | `POST`   | Add new book      |
| `/books`     | `DELETE` | Delete all books  |
| `/books/:id` | `DELETE` | Delete book by id |
| `/books/:id` | `PATCH`  | Update book by id |


