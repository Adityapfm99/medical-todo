import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

router.get("/", userController.getAllUsers); // Handles GET /users
router.post("/", userController.validateUser, userController.createUser);


export default router;
