// src/routes/authRoutes.ts
import express from "express";
import { loginUser } from "../controllers/loginController";

const router = express.Router();

// POST request to login and get a JWT token

router.post("/", loginUser);
export default router;
