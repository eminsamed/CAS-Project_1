import sqlite3 from "sqlite3";

// SQLite database connection
const db = new sqlite3.Database("todo_app.db");

// Create todos table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      importance INTEGER,
      due_date DATE,
      finished BOOLEAN,
      description TEXT,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Fetch all todos from the database
export const getTodos = (callback) => {
  db.all("SELECT * FROM todos", (err, rows) => {
    callback(err, rows);
  });
};

// Add a new todo to the database
export const addTodo = (todo, callback) => {
  const { title, importance, due_date, finished, description } = todo;
  const query = `
    INSERT INTO todos (title, importance, due_date, finished, description)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [title, importance, due_date, finished, description], function (err) {
    callback(err, { id: this.lastID, ...todo });
  });
};

// Update an existing todo in the database
export const updateTodo = (id, todo, callback) => {
  const { title, importance, due_date, finished, description } = todo;
  const query = `
    UPDATE todos
    SET title = ?, importance = ?, due_date = ?, finished = ?, description = ?
    WHERE id = ?
  `;
  db.run(query, [title, importance, due_date, finished, description, id], (err) => {
    callback(err, { id, ...todo });
  });
};
