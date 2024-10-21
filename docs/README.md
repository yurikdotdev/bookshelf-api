# Bookshelf API Documentation

## Installation

Install dependencies:

```sh
bun install
```

Run:

```sh
bun dev
```

<http://localhost:3000>

## Endpoints

### API Specification

#### Books

| Endpoint     | HTTP     | Description         |
| ------------ | -------- | ------------------- |
| `/books`     | `GET`    | Get all books       |
| `/books/:id` | `GET`    | Get a book by ID    |
| `/books`     | `POST`   | Add a new book      |
| `/books/:id` | `PATCH`  | Update a book by ID |
| `/books/:id` | `DELETE` | Delete a book by ID |
| `/books`     | `DELETE` | Delete all books    |

#### Authors

| Endpoint       | HTTP     | Description            |
| -------------- | -------- | ---------------------- |
| `/authors`     | `GET`    | Get all authors        |
| `/authors/:id` | `GET`    | Get an author by ID    |
| `/authors`     | `POST`   | Add a new author       |
| `/authors/:id` | `PATCH`  | Update an author by ID |
| `/authors/:id` | `DELETE` | Delete an author by ID |

#### Tags

| Endpoint    | HTTP     | Description        |
| ----------- | -------- | ------------------ |
| `/tags`     | `GET`    | Get all tags       |
| `/tags/:id` | `GET`    | Get a tag by ID    |
| `/tags`     | `POST`   | Add a new tag      |
| `/tags/:id` | `PATCH`  | Update a tag by ID |
| `/tags/:id` | `DELETE` | Delete a tag by ID |

#### BookTags

| Endpoint                  | HTTP     | Description                     |
| ------------------------- | -------- | ------------------------------- |
| `/books/:id/tags`         | `GET`    | Get tags associated with a book |
| `/books/:id/tags`         | `POST`   | Add a tag to a book             |
| `/books/:id/tags/:tag_id` | `DELETE` | Remove a tag from a book        |

#### Status

| Endpoint            | HTTP     | Description                         |
| ------------------- | -------- | ----------------------------------- |
| `/books/:id/status` | `GET`    | Get the reading status of a book    |
| `/books/:id/status` | `POST`   | Add or update the status of a book  |
| `/books/:id/status` | `PATCH`  | Update the reading status of a book |
| `/books/:id/status` | `DELETE` | Remove the status for a book        |

#### Reviews

| Endpoint                  | HTTP     | Description                 |
| ------------------------- | -------- | --------------------------- |
| `/books/:id/reviews`      | `GET`    | Get reviews for a book      |
| `/books/:id/reviews/:rid` | `GET`    | Get a review by its ID      |
| `/books/:id/reviews`      | `POST`   | Add a new review for a book |
| `/books/:id/reviews/:rid` | `PATCH`  | Update a review by ID       |
| `/books/:id/reviews/:rid` | `DELETE` | Delete a review by ID       |

|

## ERD

```mermaid
erDiagram
    Book {
        uuid id PK "Primary Key: Unique identifier for the book"
        string title "Title of the book"
        string description "Brief description or synopsis of the book"
        string publisher "Name of the publisher"
        date published_date "Publication date of the book"
        string language "Language in which the book is written"
        string coverImage "URL or path to the cover image of the book"
        uuid author_id FK "Foreign Key referencing Author"
    }

    Author {
        uuid id PK "Primary Key: Unique identifier for the author"
        string name "Full name of the author"
    }

    Tag {
        uuid id PK "Primary Key: Unique identifier for the tag"
        string[] keywords "Array of keywords associated with the tag"
    }

    BookTag {
        uuid id PK "Primary Key: Unique identifier for the BookTag association"
        uuid book_id FK "Foreign Key referencing Book"
        uuid tag_id FK "Foreign Key referencing Tag"
    }

    Status {
        uuid id PK "Primary Key: Unique identifier for the status record"
        uuid book_id FK "Foreign Key referencing Book"
        string status "Current reading status (i.g., read/currently reading)"
        date date_added "Date when the status was recorded"
        boolean reviewed "Indicates if the book has been reviewed (true/false)"
    }

    Review {
        uuid id PK "Primary Key: Unique identifier for the review"
        uuid book_id FK "Foreign Key referencing Book"
        string review "Text content of the review"
        date date_reviewed "Date when the review was written"
    }

    %% Relationships
    Book ||--o| Author : written_by
    Book ||--o| BookTag : tagged_with
    Book ||--o| Status : has_status
    Book ||--o| Review : has_review
    Tag ||--o| BookTag : includes
```