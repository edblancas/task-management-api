# comments-endpoints.hurl

# Create test users and task for comment operations
POST http://localhost:3000/users
{
  "firstName": "Comment",
  "lastName": "User"
}
HTTP 201
[Captures]
userId: jsonpath "$.id"

POST http://localhost:3000/users
{
  "firstName": "Task",
  "lastName": "Owner"
}
HTTP 201
[Captures]
taskOwnerId: jsonpath "$.id"

# Create a task to add comments to
POST http://localhost:3000/tasks
{
  "title": "Task with comments",
  "status": "todo",
  "priority": "medium",
  "assigneeId": "{{userId}}",
  "reporterId": "{{taskOwnerId}}"
}
HTTP 201
[Captures]
taskId: jsonpath "$.id"

# Test getting all comments
GET http://localhost:3000/comments
HTTP 200
[Asserts]
header "Content-Type" contains "application/json"

# Test creating a comment
POST http://localhost:3000/comments
{
  "taskId": "{{taskId}}",
  "userId": "{{userId}}",
  "text": "This is a test comment"
}
HTTP 201
[Captures]
commentId: jsonpath "$.id"
[Asserts]
jsonpath "$.taskId" == "{{taskId}}"
jsonpath "$.userId" == "{{userId}}"
jsonpath "$.text" == "This is a test comment"
jsonpath "$.date" isString

# Test getting a comment by ID
GET http://localhost:3000/comments/{{commentId}}
HTTP 200
[Asserts]
jsonpath "$.id" == "{{commentId}}"
jsonpath "$.text" == "This is a test comment"

# Test getting comments by task ID
GET http://localhost:3000/tasks/{{taskId}}/comments
HTTP 200
[Asserts]
jsonpath "$[0].taskId" == "{{taskId}}"
jsonpath "$" count >= 1

# Test updating a comment
PUT http://localhost:3000/comments/{{commentId}}
{
  "taskId": "{{taskId}}",
  "userId": "{{userId}}",
  "text": "This is an updated comment"
}
HTTP 200
[Asserts]
jsonpath "$.text" == "This is an updated comment"

# Test deleting a comment
DELETE http://localhost:3000/comments/{{commentId}}
HTTP 204

# Verify comment was deleted
GET http://localhost:3000/comments/{{commentId}}
HTTP 404

# Clean up test task
DELETE http://localhost:3000/tasks/{{taskId}}
HTTP 204

# Clean up test users
DELETE http://localhost:3000/users/{{userId}}
HTTP 204

DELETE http://localhost:3000/users/{{taskOwnerId}}
HTTP 204
