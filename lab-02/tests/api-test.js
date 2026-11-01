// Basic end-to-end route checks. Start the API in another terminal before running this file.
const assert = require("assert");

const BASE = process.env.BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const body = await response.json();
  return { status: response.status, body };
}

(async () => {
  let result = await request("/books/");
  assert.strictEqual(result.status, 200);
  assert.ok(Array.isArray(result.body));

  result = await request("/books/1/");
  assert.strictEqual(result.status, 200);
  assert.strictEqual(result.body.id, 1);

  result = await request("/books/", {
    method: "POST",
    body: JSON.stringify({ title: "API Test Book", author: "Test Author", price: 199, pages: 120 })
  });
  assert.strictEqual(result.status, 201);
  const newId = result.body.id;

  result = await request(`/books/${newId}/`, {
    method: "PUT",
    body: JSON.stringify({ title: "Updated API Test Book", author: "Test Author", price: 225, pages: 130 })
  });
  assert.strictEqual(result.status, 200);
  assert.strictEqual(result.body.title, "Updated API Test Book");

  result = await request(`/books/${newId}/`, { method: "DELETE" });
  assert.strictEqual(result.status, 200);

  result = await request(`/books/${newId}/`);
  assert.strictEqual(result.status, 404);

  console.log("PASS: GET all, GET one, POST, PUT, DELETE, and not-found checks.");
})().catch((error) => {
  console.error("API test failed:", error);
  process.exit(1);
});
