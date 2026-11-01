# Backend Development Frameworks - Lab 02: SQLite Database & CRUD Routes

**Student Name:** Y. Eswar Sai Durga Prasad  
**Registration Number:** 252U1R3104  
**Section:** CSE-DS-2B  
**Course:** Backend Development Fundamentals  

---

## 📖 Objective
Connect an Express.js server to an SQLite database and implement full CRUD operations over HTTP endpoints for a `book` collection.

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** SQLite3 / SQLite
* **Dev Tools:** Nodemon

---

## ⚡ CRUD Endpoints

| Method | Endpoint | Description | Success Status |
|:---:|---|---|:---:|
| `GET` | `/books/` | Retrieve all books from database | `200 OK` |
| `GET` | `/books/:bookId/` | Retrieve a single book by ID | `200 OK` |
| `POST` | `/books/` | Add a new book to the database | `201 Created` |
| `PUT` | `/books/:bookId/` | Update an existing book's details | `200 OK` |
| `DELETE` | `/books/:bookId/` | Delete a book by ID | `200 OK` |
| `GET` | `/books/999/` | Error case: Not Found | `404 Not Found` |

---

## 📁 Project Structure

* [`lab-02/`](lab-02/) — Complete source code (`app.js`, database files, tests, and execution screenshots).
