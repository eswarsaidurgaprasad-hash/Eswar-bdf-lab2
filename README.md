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

## 🌐 Live Deployment on Render

* **Live Base URL:** [https://eswar-bdf-lab2.onrender.com](https://eswar-bdf-lab2.onrender.com)

## ⚡ CRUD Endpoints

| Method | Endpoint | Live URL | Success Status | Description |
|:---:|---|---|:---:|---|
| `GET` | `/` | [https://eswar-bdf-lab2.onrender.com/](https://eswar-bdf-lab2.onrender.com/) | `200 OK` | API health check & route listing |
| `GET` | `/books/` | [https://eswar-bdf-lab2.onrender.com/books/](https://eswar-bdf-lab2.onrender.com/books/) | `200 OK` | Retrieve all 10 books from SQLite |
| `GET` | `/books/:bookId/` | [https://eswar-bdf-lab2.onrender.com/books/1/](https://eswar-bdf-lab2.onrender.com/books/1/) | `200 OK` | Retrieve single book by ID |
| `POST` | `/books/` | `https://eswar-bdf-lab2.onrender.com/books/` | `201 Created` | Add a new book (with JSON body) |
| `PUT` | `/books/:bookId/` | `https://eswar-bdf-lab2.onrender.com/books/1/` | `200 OK` | Update an existing book's details |
| `DELETE` | `/books/:bookId/` | `https://eswar-bdf-lab2.onrender.com/books/1/` | `200 OK` | Delete a book by ID |
| `GET` | `/books/999/` | [https://eswar-bdf-lab2.onrender.com/books/999/](https://eswar-bdf-lab2.onrender.com/books/999/) | `404 Not Found` | Error case: Book not found |

---

## 📁 Project Structure

* [`lab-02/`](lab-02/) — Complete source code (`app.js`, database files, tests, and execution screenshots).

