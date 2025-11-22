# COMP3810SEF - Group 2 (Simple Library System)
Hong Kong Metropolitan University COMP3810SEF Group Project, not meant to be used in production.
```
Group Members:
  Lau Chun Kit 13897100
  Lee Chun Yin 14007429
  Chong Tsz Ho 13990354
  Fung Ming Chu 14201890
```
> Currently Serving on https://comp3810sef.avanlcy.hk

## User flow
1. Login via with predefined credential `Username: user1` `Password: user1password` and hit submit **(READ)**.
2. After entering the dashboard, click ***Update Username*** button and change username and hit `update` **(Update)**.
3. Click ***Return Home*** button and click ***Borrow Book*** button and click `Borrow` **(CREATE)** on a random book to borrow the book.
4. When returned to the dashboard, click `Return` **(DELETE)** to return the book from user's possession.
5. Hit ***Logout*** to clear cookie-session.

If the user or administrator wants to access the data from an API, they are able to use our RESTful API endpoints below programmatically.

## Functions
This library system is designed to be simple and straight forward, we have also included many error handling and checking on our EJS endpoints as well as our RESTful API to prevent any interruption during runtime. In addition, we have also made sure the RESTful API endpoints are all stateless.

For the ease of deployment, we have also used **docker** to streamline our deployment process and isolate their environment, which will then be deployed to **Google Cloud's Serverless platform, Cloud Run** to handle the automatic scaling and traffic routing.

## EJS endpoints
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
- `DELETE /api/user/:username` - Delete a user
- `DELETE /api/user/:username/books/:bookid` - Remove a borrowed book from user

**POST (CREATE) CURL**
```bash
curl -X POST http://localhost:8000/api/user \
  -d "userName=user3" \
  -d "password=user3password"

curl -X POST http://localhost:8000/api/user/user3/books/69202a9b893f148c069dc2b8
```

**GET (READ) CURL**
```bash
curl -X GET http://localhost:8000/api/user | jq.
curl -X GET http://localhost:8000/api/books | jq .
curl -X GET http://localhost:8000/api/books?canBorrow=true | jq .
curl -X GET http://localhost:8000/api/books/69202a9b893f148c069dc2b8 | jq .
```

**PUT (UPDATE) CURL**
```bash
curl -X PUT http://localhost:8000/api/user/user3 \
  -d "newName=USER3"
```

**DELETE (DELETE) CURL**
```bash
curl -X DELETE http://localhost:8000/api/user/USER3/books/69202a9b893f148c069dc2b8 | jq .
curl -X DELETE http://localhost:8000/api/user/USER3 | jq .
```