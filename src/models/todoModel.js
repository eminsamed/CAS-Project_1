import sqlite3 from "sqlite3";
import { open } from "sqlite";

// SQLite database connection
const dbPromise = open({
  filename: "../../todo_app.db",
  driver: sqlite3.Database,
});

const initializeDb = async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      importance INTEGER NOT NULL,
      due_date TEXT,
      finished INTEGER,
      description TEXT
    )
  `);
};

initializeDb().catch((error) => {
  console.error("Failed to initialize the database:", error);
});

export const getTodosModel = async () => {
  const db = await dbPromise;
  const data = await db.all("SELECT * FROM todos");
  return data;
};

export const createTodoModel = async (todo) => {
  const { title, importance, due_date, finished, description } = todo;
  const db = await dbPromise;
  const result = await db.run(
    "INSERT INTO todos (title, importance, due_date, finished, description) VALUES (?, ?, ?, ?, ?)",
    [title, importance, due_date, finished, description]
  );
  return { id: result.lastID, ...todo };
};

export const updateTodoModel = async (id, todo) => {
  const { title, importance, due_date, finished, description } = todo;
  const db = await dbPromise;
  await db.run("UPDATE todos SET title = ?, importance = ?, due_date = ?, finished = ?, description = ? WHERE id = ?", [
    title,
    importance,
    due_date,
    finished,
    description,
    id,
  ]);
  return { id, ...todo };
};
