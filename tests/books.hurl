# Get all books
GET http://localhost:3000/books
HTTP 200

# Get all books on page 3
GET http://localhost:3000/books?page=3
HTTP 200

# Post a new book
POST http://localhost:3000/books
Content-Type: application/json
{
    "title": "added",
    "author": "Paulo Coelho",
    "description": "A fable about following your dreams",
    "publisher": "HarperCollins",
    "published_date": "1988-04-01"
}
HTTP 201

# Patch book 1
PATCH http://localhost:3000/books/1
Content-Type: application/json
{
  "title": "edited",
  "author": "Paulo Coelho",
  "description": "A fable about following your dreams",
  "publisher": "HarperCollins",
  "published_date": "1988-04-01"
}
HTTP 200

# Delete book 2
DELETE http://localhost:3000/books/2
HTTP 204

# Delete all books
DELETE http://localhost:3000/books
HTTP 204