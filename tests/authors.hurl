# Get all authors
GET http://localhost:3000/authors
HTTP 200

# Add an author
POST http://localhost:3000/authors
Content-Type: application/json
{
    "name": "Haruki Murakami"
}
HTTP 201
[Captures]
authors_id: jsonpath "$.author.id"

# Get author by id
GET http://localhost:3000/authors/{{authors_id}}
HTTP 200
[Asserts]
jsonpath "$.author.name" == "Haruki Murakami"

# Get author by invalid input 
GET http://localhost:3000/authors/invalid_id
HTTP 500
[Asserts]
jsonpath "$.message" == "Internal Server Error: Invalid input"

# Get author by non-existent id
GET http://localhost:3000/authors/00000000-0000-0000-0000-000000000000
HTTP 404
[Asserts]
jsonpath "$.message" == "Author not found"

# Patch author by id
PATCH http://localhost:3000/authors/{{authors_id}}
Content-Type: application/json
{
  "name": "Fredrik Backman"
} 
HTTP 200
[Asserts]
jsonpath "$.author.name" == "Fredrik Backman"

# Patch author by invalid input id
PATCH http://localhost:3000/authors/invalid_id
Content-Type: application/json
{
  "name": "Fredrik Backman"
} 
HTTP 500
[Asserts]
jsonpath "$.message" == "Internal Server Error: Invalid input"

# Patch a non-existent author
PATCH http://localhost:3000/authors/00000000-0000-0000-0000-000000000000
Content-Type: application/json
{
  "name": "Some Author"
}
HTTP 404
[Asserts]
jsonpath "$.message" == "Author not found"

# Delete author by id
DELETE http://localhost:3000/authors/{{authors_id}}
HTTP 200

# Delete the same author again
DELETE http://localhost:3000/authors/{{authors_id}}
HTTP 404
[Asserts]
jsonpath "$.message" == "Author not found"

# Delete an invalid input author
DELETE http://localhost:3000/authors/invalid_id
HTTP 500
[Asserts]
jsonpath "$.message" == "Internal Server Error: Invalid input"

# Add an author without a name
POST http://localhost:3000/authors
Content-Type: application/json
{
    "name": ""
}
HTTP 400
[Asserts]
jsonpath "$.message" == "Validation Error: Name is required"