import { Request, Response } from "express";
import * as todoService from "../services/todoService";

import { authMiddleware } from "../middleware/authMiddleware";


export const createTodo = [
  authMiddleware,
  async (req: any, res: Response): Promise<void> => {
    const { task, deadline, assigned_users, patient_id, resources } = req.body;

    try {
      const created_by = req.user?.id;

      if (!created_by) {
        res.status(403).json({ error: "User authentication required" });
        return;
      }

      if (!task || !deadline) {
        res.status(400).json({ error: "Task and deadline are required." });
        return;
      }

      const todo = await todoService.createTodo({
        task,
        deadline,
        assigned_users,
        created_by,
        patient_id,
        resources,
      });

      res.status(201).json({ message: "To-Do created successfully", todo });
    } catch (error) {
      console.error("Error creating To-Do:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  },
];

// Get all To-Dos
export const getAllTodos = async (_: Request, res: Response): Promise<void> => {
  try {
    const todos = await todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos." });
  }
};

// Get filtered To-Dos
export const getFilteredTodos = async (req: Request, res: Response): Promise<void> => {
  console.log("getFilteredTodos called"); // Add this
  const { task_name, deadline_from, deadline_to, assigned_user } = req.query;

  try {
    const filters: Record<string, any> = {};

    if (task_name) filters.task_name = `%${task_name as string}%`;
    if (deadline_from) filters.deadline_from = new Date(deadline_from as string);
    if (deadline_to) filters.deadline_to = new Date(deadline_to as string);
    if (assigned_user) filters.assigned_user = Number(assigned_user);

    console.log("Filters:", filters); // Add this for debugging filters

    const todos = await todoService.getTodos(filters);
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching filtered todos:", error);
    res.status(500).json({ error: "Failed to fetch filtered todos." });
  }
};
// Get a To-Do by ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const todoId = parseInt(id, 10); // Ensure `id` is parsed as an integer
    if (isNaN(todoId)) {
      res.status(400).json({ error: "Invalid To-Do ID provided." });
      return;
    }

    const todo = await todoService.getTodoById(todoId);
    if (!todo) {
      res.status(404).json({ error: "To-Do not found" });
      return;
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error("Error fetching To-Do by ID:", error);
    res.status(500).json({ error: "Failed to fetch To-Do." });
  }
};
// Update a To-Do
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { task, deadline, assigned_users, resources } = req.body;

  try {
    if (!task || !deadline) {
      res.status(400).json({ error: "Task and deadline are required." });
      return;
    }

    const updatedTodo = await todoService.updateTodo(Number(id), { task, deadline, assigned_users, resources });
    if (!updatedTodo) {
      res.status(404).json({ error: "To-Do not found" });
      return;
    }
    res.status(200).json({ message: "To-Do updated successfully", updatedTodo });
  } catch (error) {
    console.error("Error updating To-Do:", error);
    res.status(500).json({ error: "Failed to update To-Do." });
  }
};

// Delete a To-Do
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedTodo = await todoService.deleteTodo(Number(id));
    if (!deletedTodo) {
      res.status(404).json({ error: "To-Do not found" });
      return;
    }
    res.status(200).json({ message: "To-Do deleted successfully" });
  } catch (error) {
    console.error("Error deleting To-Do:", error);
    res.status(500).json({ error: "Failed to delete To-Do." });
  }
};
