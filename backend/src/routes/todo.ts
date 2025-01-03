import express, { Router } from "express";
import * as todoController from "../controllers/todoController";

const router: Router = express.Router();

router.get("/", todoController.getAllTodos); // Get all todos
router.post("/", todoController.createTodo); // Create a new todo
router.get("/filters", todoController.getFilteredTodos); // Get filtered todos
router.get("/:id", todoController.getTodoById); // Get todo by ID
router.put("/:id", todoController.updateTodo); // Update a todo
router.delete("/:id", todoController.deleteTodo); // Delete a todo
export default router;
