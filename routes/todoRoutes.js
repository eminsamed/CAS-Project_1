import express from "express";
import { getTodos, createTodo, updateTodo } from "../controllers/todoController.js";

const router = express.Router();

// Define routes for todos
router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);

export default router;
