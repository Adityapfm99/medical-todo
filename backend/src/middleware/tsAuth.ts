import express, { Request, Response } from "express";
import { authMiddleware } from "./authMiddleware";

const app = express();

app.get("/test", authMiddleware, (req: Request, res: Response) => {
  console.log("req.user:", req.user); // Log the `req.user` property
  res.json({ message: "Authenticated", user: req.user });
});

app.listen(3000, () => {
  console.log("Test server running on http://localhost:3000");
});
