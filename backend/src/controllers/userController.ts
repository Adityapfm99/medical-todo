import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import { check, validationResult } from 'express-validator';

// Validation Middleware
export const validateUser = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").notEmpty().withMessage("Password is required"),
  check("role")
    .isIn(["Doctor", "Nurse", "Secretary"])
    .withMessage("Role must be Doctor, Nurse, or Secretary"),
];

// // Middleware to handle validation errors
// export const handleValidationErrors = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Response | void => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res
//       .status(400)
//       .json({ message: errors.array().map((err) => err.msg).join(", ") });
//   }
//   next();
// };

// Create User Controller
export const createUser = async (req: Request, res: Response): Promise<void> => {
  console.log("Request body:", req.body); // Log request body
  try {
    const { name, email, password, role, doctor_number } = req.body;
    const user = await userService.createUser({ name, email, password, role, doctor_number });
    res.status(201).json(user);
  } catch (error: any) {
    console.error("Error in createUser:", error.message);
    if (error.message.includes("Duplicate email")) {
      res.status(400).json({ message: "Duplicate email" });
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  }
};

// Get All Users Controller
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Call the service layer to fetch all users
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    const err = error as Error; // Type assertion
    console.error("Error in getAllUsers:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
