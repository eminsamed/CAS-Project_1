import { Router } from "express";
import { getTodosController, createTodoController, updateTodoController } from "../controllers/todoController.js";

const router = Router();

router.get("/", getTodosController);
router.post("/", createTodoController);
router.put("/:id", updateTodoController);

export default router;
