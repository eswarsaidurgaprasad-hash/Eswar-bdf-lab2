const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const fs = require("fs");

const PORT = Number(process.env.PORT) || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "database", "books.db");
const app = express();

app.use(express.json());

let db;

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function validateBook(body) {
  const { title, author, price, pages } = body || {};
  if (typeof title !== "string" || !title.trim()) return "title must be a non-empty string";
  if (typeof author !== "string" || !author.trim()) return "author must be a non-empty string";
  if (!Number.isInteger(price) || price < 0) return "price must be a non-negative integer";
  if (!isPositiveInteger(pages)) return "pages must be a positive integer";
  return null;
}

// The database connection must succeed before the HTTP server starts.
async function initializeDBAndServer() {
  try {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = await open({ filename: DB_PATH, driver: sqlite3.Database });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL CHECK (price >= 0),
        pages INTEGER NOT NULL CHECK (pages > 0)
      );
    `);

    // Auto-seed initial sample books if table is empty
    const countResult = await db.get("SELECT COUNT(*) AS count FROM book");
    if (countResult && countResult.count === 0) {
      const seedSqlPath = path.join(__dirname, "database", "seed.sql");
      if (fs.existsSync(seedSqlPath)) {
        const seedSql = fs.readFileSync(seedSqlPath, "utf-8");
        await db.exec(seedSql);
        console.log("Database seeded successfully with initial books.");
      }
    }

    // Root welcome route for health check and API overview
    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Lab 2: SQLite database and CRUD API is running!",
        author: "Y. Eswar Sai Durga Prasad",
        endpoints: {
          getAllBooks: "GET /books/",
          getBookById: "GET /books/:bookId/",
          addBook: "POST /books/",
          updateBook: "PUT /books/:bookId/",
          deleteBook: "DELETE /books/:bookId/"
        }
      });
    });

    app.get("/books/", async (req, res) => {
      try {
        const books = await db.all("SELECT * FROM book ORDER BY id");
        res.status(200).json(books);
      } catch (error) {
        res.status(500).json({ error: "Unable to retrieve books" });
      }
    });

    app.get("/books/:bookId/", async (req, res) => {
      const id = Number(req.params.bookId);
      if (!isPositiveInteger(id)) return res.status(400).json({ error: "bookId must be a positive integer" });
      try {
        const book = await db.get("SELECT * FROM book WHERE id = ?", [id]);
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.status(200).json(book);
      } catch (error) {
        res.status(500).json({ error: "Unable to retrieve book" });
      }
    });

    app.post("/books/", async (req, res) => {
      const validationError = validateBook(req.body);
      if (validationError) return res.status(400).json({ error: validationError });
      const { title, author, price, pages } = req.body;
      try {
        const result = await db.run(
          "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
          [title.trim(), author.trim(), price, pages]
        );
        const created = await db.get("SELECT * FROM book WHERE id = ?", [result.lastID]);
        res.status(201).json(created);
      } catch (error) {
        res.status(500).json({ error: "Unable to create book" });
      }
    });

    app.put("/books/:bookId/", async (req, res) => {
      const id = Number(req.params.bookId);
      if (!isPositiveInteger(id)) return res.status(400).json({ error: "bookId must be a positive integer" });
      const validationError = validateBook(req.body);
      if (validationError) return res.status(400).json({ error: validationError });
      const { title, author, price, pages } = req.body;
      try {
        const existing = await db.get("SELECT id FROM book WHERE id = ?", [id]);
        if (!existing) return res.status(404).json({ error: "Book not found" });
        await db.run(
          "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?",
          [title.trim(), author.trim(), price, pages, id]
        );
        const updated = await db.get("SELECT * FROM book WHERE id = ?", [id]);
        res.status(200).json(updated);
      } catch (error) {
        res.status(500).json({ error: "Unable to update book" });
      }
    });

    app.delete("/books/:bookId/", async (req, res) => {
      const id = Number(req.params.bookId);
      if (!isPositiveInteger(id)) return res.status(400).json({ error: "bookId must be a positive integer" });
      try {
        const result = await db.run("DELETE FROM book WHERE id = ?", [id]);
        if (result.changes === 0) return res.status(404).json({ error: "Book not found" });
        res.status(200).json({ message: "Book deleted successfully", bookId: id });
      } catch (error) {
        res.status(500).json({ error: "Unable to delete book" });
      }
    });

    app.use((req, res) => res.status(404).json({ error: "Route not found" }));

    // Handle malformed JSON body errors
    app.use((err, req, res, next) => {
      if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON payload" });
      }
      res.status(500).json({ error: "Internal Server Error" });
    });

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`SQLite database: ${DB_PATH}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Please stop the conflicting process or set a different PORT.`);
      } else {
        console.error("Server error:", err.message);
      }
      process.exit(1);
    });

    // Graceful shutdown closes both the HTTP server and database connection.
    const shutdown = () => server.close(async () => {
      if (db) await db.close();
      process.exit(0);
    });
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to initialize SQLite database:", error.message);
    process.exit(1);
  }
}

initializeDBAndServer();
