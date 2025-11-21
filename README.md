# COMP3810SEF - Group 2 (Simple Library System)
> Need to satisfy CRUD (Create, Read, Update, Delete)

- `GET /` - Home page (redirects to login or dashboard)
- `GET /login` - Login page
- `POST /login` - Login user
- `GET /logout` - Logout user
- `GET /dashboard` - User dashboard (login required)
- `GET /updateUsername` - Update username page (login required)
- `POST /updateUsername` - Update username (login required)
- `GET /borrowBook` - Borrow book page (login required)
- `POST /borrow-book` - Borrow a book (login required)
- `POST /return-book` - Return a book (login required)

---

## RESTful API

- `POST /api/user` - Create a new user
  - Form: `{ username, password }`
- `POST /api/books` - Create a new book
  - Form: `{ title, author, publishedYear }`
- `POST /api/user/:username/books/:bookID` - Add a borrowed book to user
- `GET /api/user` - Get all users
- `GET /api/user/:username` - Get user by username
- `GET /api/user/:username/books` - Get all books borrowed by a user
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `PUT /api/user/:username` - Update user information
  - Form: `{ newUsername }`
- `DELETE /api/user/:username/books/:bookid` - Remove a borrowed book from user