# users-endpoints.hurl

# Test getting all users
GET http://localhost:3000/users
HTTP 200
[Asserts]
jsonpath "$" count > 0
header "Content-Type" contains "application/json"

# Test getting a single user by ID
# First, create a test user
POST http://localhost:3000/users
{
  "firstName": "John",
  "lastName": "Doe"
}
HTTP 201
[Captures]
userId: jsonpath "$.id"

# Now get the user by ID
GET http://localhost:3000/users/{{userId}}
HTTP 200
[Asserts]
jsonpath "$.id" == "{{userId}}"
jsonpath "$.firstName" == "John"
jsonpath "$.lastName" == "Doe"

# Test updating a user
PUT http://localhost:3000/users/{{userId}}
{
  "firstName": "Jane",
  "lastName": "Smith"
}
HTTP 200
[Asserts]
jsonpath "$.firstName" == "Jane"
jsonpath "$.lastName" == "Smith"
jsonpath "$.id" == "{{userId}}"

# Test deleting a user
DELETE http://localhost:3000/users/{{userId}}
HTTP 204

# Verify user was deleted
GET http://localhost:3000/users/{{userId}}
HTTP 404
