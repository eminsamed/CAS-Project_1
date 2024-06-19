import sqlite3 from "sqlite3";
import { open } from "sqlite";

// SQLite database connection
const dbPromise = open({
  filename: "./todo_app.db",
  driver: sqlite3.Database,
});

// Get all todos
export const getTodos = async (req, res) => {
  try {
    const db = await dbPromise;
    const todos = await db.all("SELECT * FROM todos");
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new todo
export const createTodo = async (req, res) => {
  const { title, importance, due_date, finished, description } = req.body;
  try {
    const db = await dbPromise;
    const result = await db.run(
      "INSERT INTO todos (title, importance, due_date, finished, description) VALUES (?, ?, ?, ?, ?)",
      [title, importance, due_date, finished, description]
    );
    res.status(201).json({
      id: result.lastID,
      title,
      importance,
      due_date,
      finished,
      description,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing todo
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, importance, due_date, finished, description } = req.body;
  try {
    const db = await dbPromise;
    await db.run(
      "UPDATE todos SET title = ?, importance = ?, due_date = ?, finished = ?, description = ? WHERE id = ?",
      [title, importance, due_date, finished, description, id]
    );
    res.json({
      id,
      title,
      importance,
      due_date,
      finished,
      description,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
