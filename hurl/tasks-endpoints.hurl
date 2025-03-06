# tasks-endpoints.hurl

# Create test users for task operations
POST http://localhost:3000/users
{
  "firstName": "Task",
  "lastName": "Assignee"
}
HTTP 201
[Captures]
assigneeId: jsonpath "$.id"

POST http://localhost:3000/users
{
  "firstName": "Task",
  "lastName": "Reporter"
}
HTTP 201
[Captures]
reporterId: jsonpath "$.id"

# Test getting all tasks
GET http://localhost:3000/tasks
HTTP 200
[Asserts]
header "Content-Type" contains "application/json"

# Test creating a task
POST http://localhost:3000/tasks
{
  "title": "Complete API testing",
  "status": "todo",
  "priority": "high",
  "assigneeId": "{{assigneeId}}",
  "reporterId": "{{reporterId}}"
}
HTTP 201
[Captures]
taskId: jsonpath "$.id"
[Asserts]
jsonpath "$.title" == "Complete API testing"
jsonpath "$.status" == "todo"
jsonpath "$.priority" == "high"
jsonpath "$.assigneeId" == "{{assigneeId}}"
jsonpath "$.reporterId" == "{{reporterId}}"

# Test getting a task by ID
GET http://localhost:3000/tasks/{{taskId}}
HTTP 200
[Asserts]
jsonpath "$.id" == "{{taskId}}"
jsonpath "$.title" == "Complete API testing"

# Test updating a task
PUT http://localhost:3000/tasks/{{taskId}}
{
  "title": "Complete API testing",
  "status": "in progress",
  "priority": "medium",
  "assigneeId": "{{assigneeId}}",
  "reporterId": "{{reporterId}}"
}
HTTP 200
[Asserts]
jsonpath "$.status" == "in progress"
jsonpath "$.priority" == "medium"

# Test deleting a task
DELETE http://localhost:3000/tasks/{{taskId}}
HTTP 204

# Verify task was deleted
GET http://localhost:3000/tasks/{{taskId}}
HTTP 404

# Clean up test users
DELETE http://localhost:3000/users/{{assigneeId}}
HTTP 204

DELETE http://localhost:3000/users/{{reporterId}}
HTTP 204
