# Possible Errors

This is an _**incomplete**_ guide to the possible errors that may happen in your app. We have left some of them blank to prompt you to think about the errors that could occur as a client uses each endpoint that you have created.

Think about what could go wrong for each route, and the HTTP status code should be sent to the client in each case.
For each thing that could go wrong, make a test with your expected status code and then make sure that possibility is handled.

Bear in mind, handling bad inputs from clients doesn't necessarily have to lead to a 4\*\* status code. Handling can include using default behaviours or even ignoring parts of the request.

The following is _not_ a comprehensive list! Its purpose is just to get the ball rolling down the sad path 😢

---

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 418 I'm a teapot
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## The Express Documentation

[The Express Docs](https://expressjs.com/en/guide/error-handling.html) have a great section all about handling errors in Express.

## Unavailable Routes

### GET `/not-a-route`

- Status: 400

---

## Available Routes

### GET `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`)
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)

### PATCH `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`)
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
- Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)

### POST `/api/articles/:article_id/comments`

- ???

### GET `/api/articles/:article_id/comments`

- ???

### GET `/api/articles`

- Bad queries:
  - `sort_by` a column that doesn't exist
  - `order` !== "asc" / "desc"
  - `topic` that is not in the database
  - `topic` that exists but does not have any articles associated with it

### PATCH `/api/comments/:comment_id`

- ???

### DELETE `/api/comments/:comment_id`

- ???
