# POST /auth/register
{
  "username": "ayan",
  "email": "ayan@example.com",
  "password": "secret123"
}
- response(201 OK)
{
  "message": "User registered successfully"
}


# POST /auth/login
{
  "email": "ayan@example.com",
  "password": "secret123"
}
- response(200 OK)
{
    token: "jwt_token",
    "user": {
    "_id": "userId123",
    "username": "ayan",
    "email": "ayan@example.com",
    "role": "user"
  }
}

# POST /posts(auth required)
{
    "title": "My First Blog",
  "content": "This is the content...",
  "summary": "Short intro...",
  "coverImageUrl": "https://example.com/image.jpg"
}
- response
{
  "_id": "postId123",
  "title": "My First Blog",
  "content": "This is the content...",
  "summary": "Short intro...",
  "authorId": "userId123",
  "createdAt": "2025-09-01T12:00:00Z"
}

# GET /posts
- Returns a list of posts (paginated).
- response
[
  {
    "_id": "postId123",
    "title": "My First Blog",
    "summary": "Short intro...",
    "author": "ayan",
    "createdAt": "2025-09-01T12:00:00Z"
  }
]


# GET /posts/:id
- Returns one post + comments.

# POST /posts/:id/comments
{
  "content": "Nice article!"
}

- response
{
  "_id": "commentId123",
  "postId": "postId123",
  "authorId": "userId123",
  "content": "Nice article!",
  "createdAt": "2025-09-01T12:30:00Z"
}

# GET /posts/:id/comments
- Returns list of comments for a post.
