import { createTodoModel, getTodosModel, updateTodoModel } from "../models/todoModel.js";

// Fetch all todos from the database
export const getTodosController = async (req, res) => {
  try {
    const todos = await getTodosModel();
    res.status(200).send(todos);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
// Create a new todo in the database
export const createTodoController = async (req, res) => {
  const { title, importance, due_date, finished, description } = req.body;
  try {
    const newTodo = await createTodoModel({ title, importance, due_date, finished, description });
    res.status(201).send(newTodo);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update an existing todo in the database
export const updateTodoController = async (req, res) => {
  const { id } = req.params;
  const { title, importance, due_date, finished, description } = req.body;
  try {
    const updatedTodo = await updateTodoModel(id, { title, importance, due_date, finished, description });
    res.status(200).send(updatedTodo);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
