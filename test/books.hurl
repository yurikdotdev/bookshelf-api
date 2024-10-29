# Add dummy author
POST {{host}}/authors
{
  "name": "dummy"
}
HTTP 201
[Captures]
author_id: jsonpath "$.author.id"

# Get all books
GET {{host}}/books
HTTP 200

    # Get a non-existent book
    GET {{host}}/books/00000000-0000-0000-0000-000000000000
    HTTP 404
    [Asserts]
    jsonpath "$.message" == "Error fetching book: Book not found"

    # Get a book with invalid id
    GET {{host}}/books/fasdf222333
    HTTP 500
    [Asserts]
    jsonpath "$.message" == "Error fetching book: Invalid id"

# Add a new book
POST {{host}}/books
Content-Type: application/json
{
  "title": "dummy book",
  "description": "dummy description",
  "publisher": "dummy publisher",
  "published_date": "2023-10-25T14:30:00Z",
  "language": "English",
  "cover_image": "https://example.com/great-gatsby-cover.jpg",
  "author_id": "{{author_id}}"
}
HTTP 201
[Captures]
book_id: jsonpath "$.book.id"

# Add a new book with only title and author id
POST {{host}}/books
Content-Type: application/json
{
  "title": "partial dummy book",
  "author_id": "{{author_id}}"
}
HTTP 201
[Captures]
partial_book_id: jsonpath "$.book.id"

    # Add a new book with an invalid title
    POST {{host}}/books
    Content-Type: application/json
    {
      "title": 3123123,
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": 31231231231231232,
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "{{author_id}}"
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (books): Invalid book input"

    # Add a new book with an empty title
    POST {{host}}/books
    Content-Type: application/json
    {
      "title": "     ",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "{{author_id}}"
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (books): Title is required"

    # Add a new book with missing author id
    POST {{host}}/books
    Content-Type: application/json
    {
      "title": "The Great Gatsby",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "       "
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (books): Invalid book input"

    # Add a new book with non-existent author id 
    POST {{host}}/books
    Content-Type: application/json
    {
      "title": "The Great Gatsby",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "00000000-0000-0000-0000-000000000000"
    }
    HTTP 500
    [Asserts]
    jsonpath "$.message" == "Error creating book: Invalid author id"

    # Add a new book with invalid author id
    POST {{host}}/books
    Content-Type: application/json
    {
      "title": "The Great Gatsby",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "asdfasdf"
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (books): Invalid book input"

# Update a book by id
PATCH {{host}}/books/{{book_id}}
Content-Type: application/json
{
  "title": "updated book",
  "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
  "publisher": "Scribner",
  "published_date": "2023-10-25T14:30:00+00:00",
  "language": "English",
  "cover_image": "https://example.com/great-gatsby-cover.jpg",
  "author_id": "{{author_id}}"
}
HTTP 200

# Update a book with only partial information
PATCH {{host}}/books/{{partial_book_id}}
Content-Type: application/json
{
  "title": "updated partial dummy",
  "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
  "language": "English",
  "author_id": "{{author_id}}"
}
HTTP 200

    # Update a book with missing title
    PATCH {{host}}/books/{{book_id}}
    Content-Type: application/json
    {
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "{{author_id}}"
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (books): Invalid book input"

    # Update a book with empty title
    PATCH {{host}}/books/{{book_id}}
    Content-Type: application/json
    {
      "title": "          ",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "{{author_id}}"
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (books): Title is required"

    # Update a book with an invalid input
    PATCH {{host}}/books/{{book_id}}
    Content-Type: application/json
    {
      "title": "test",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": 4234234234234234234,
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "{{author_id}}"
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (books): Invalid book input"

    # Update a book with missing author id
    PATCH {{host}}/books/{{book_id}}
    Content-Type: application/json
    {
      "title": "test",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg"
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (books): Invalid book input"

    # Update a book with an invalid author id
    PATCH {{host}}/books/{{book_id}}
    Content-Type: application/json
    {
      "title": "test",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "asdfasdf"
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (books): Invalid book input"

    # Update a book by non-existent book id
    PATCH {{host}}/books/00000000-0000-0000-0000-000000000000
    Content-Type: application/json
    {
      "title": "test",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "{{author_id}}"
    }
    HTTP 404
    [Asserts]
    jsonpath "$.message" == "Error updating book: Book not found"

    # Update a book by non-existent author id
    PATCH {{host}}/books/{{book_id}}
    Content-Type: application/json
    {
      "title": "test",
      "description": "A novel set in the Roaring Twenties that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      "publisher": "Scribner",
      "published_date": "2023-10-25T14:30:00+00:00",
      "language": "English",
      "cover_image": "https://example.com/great-gatsby-cover.jpg",
      "author_id": "00000000-0000-0000-0000-000000000000"
    }
    HTTP 500
    [Asserts]
    jsonpath "$.message" == "Error updating book: Invalid input"

# Delete a book by id
DELETE {{host}}/books/{{book_id}}
HTTP 200

DELETE {{host}}/books/{{partial_book_id}}
HTTP 200

    # Delete the same book again
    DELETE {{host}}/books/{{book_id}}
    HTTP 404
    [Asserts]
    jsonpath "$.message" == "Error deleting book: Book not found"

    DELETE {{host}}/books/{{partial_book_id}}
    HTTP 404
    [Asserts]
    jsonpath "$.message" == "Error deleting book: Book not found"

    # Delete a book by non-existent id
    DELETE {{host}}/books/00000000-0000-0000-0000-000000000000
    HTTP 404
    [Asserts]
    jsonpath "$.message" == "Error deleting book: Book not found"

    # Delete book by invalid id
    DELETE {{host}}/books/fasdfds22342342
    HTTP 500
    [Asserts]
    jsonpath "$.message" == "Error deleting book: Invalid id"

# Delete dummy author
DELETE {{host}}/authors/{{author_id}}
HTTP 200