# Get all authors
GET {{host}}/authors
HTTP 200

# Add a new author
POST {{host}}/authors
Content-Type: application/json
{
    "name": "dummy"
}
HTTP 201
[Captures]
authors_id: jsonpath "$.author.id"

    # Add an author without a name
    POST {{host}}/authors
    Content-Type: application/json
    {
        "name": "  "
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (authors): Name is required"

    # Add an author with an invalid name
    POST {{host}}/authors
    Content-Type: application/json
    {
        "name": 423423534523
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (authors): Invalid name input"

    # Add an author with name longer than 100 characters
    POST {{host}}/authors
    Content-Type: application/json
    {
        "name":  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" 
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (authors): Invalid name input"

# Get the new author by id
GET {{host}}/authors/{{authors_id}}
HTTP 200
[Asserts]
jsonpath "$.author.name" == "dummy"

    # Get an author by invalid input 
    GET {{host}}/authors/zzzzz2342342
    HTTP 500
    [Asserts]
    jsonpath "$.message" == "Error fetching author: Invalid id"

    # Get an author by non-existent id
    GET {{host}}/authors/00000000-0000-0000-0000-000000000000
    HTTP 404
    [Asserts]
    jsonpath "$.message" == "Error fetching author: Author not found"

# Update an author by id
PATCH {{host}}/authors/{{authors_id}}
Content-Type: application/json
{
  "name": "dummy updated"
} 
HTTP 200
[Asserts]
jsonpath "$.author.name" == "dummy updated"

    # Update an author with an invalid id
    PATCH {{host}}/authors/zzzz23343434
    Content-Type: application/json
    {
      "name": "invalid id"
    } 
    HTTP 500
    [Asserts]
    jsonpath "$.message" == "Error updating author: Invalid input"

    # Update a non-existent author
    PATCH {{host}}/authors/00000000-0000-0000-0000-000000000000
    Content-Type: application/json
    {
      "name": "Some Author"
    }
    HTTP 404
    [Asserts]
    jsonpath "$.message" == "Error updating author: Author not found"

    # Update an author with invalid name
    PATCH {{host}}/authors/{{authors_id}}
    Content-Type: application/json
    {
      "name": 423423534523
    }
    HTTP 400
    [Asserts]
    jsonpath "$.message" == "Validation error (authors): Invalid name input"

# Delete author by id
DELETE {{host}}/authors/{{authors_id}}
HTTP 200

    # Delete the same author again
    DELETE {{host}}/authors/{{authors_id}}
    HTTP 404
    [Asserts]
    jsonpath "$.message" == "Error deleting author: Author not found"

    # Delete an invalid input author
    DELETE {{host}}/authors/invalid_id
    HTTP 500
    [Asserts]
    jsonpath "$.message" == "Error deleting author: Invalid input"