import express from "express";
import userRoutes from "./routes/user";
import todoRoutes from "./routes/todo";
import authRoutes from "./routes/login";
import patientRoutes from "./routes/patient";
const app = express();
app.use(express.json()); // JSON middleware

// Mount Routes
app.use("/api/users", userRoutes);

app.use("/api/todos", todoRoutes);
app.use("/api/patients", patientRoutes);
app.use("/login", authRoutes);

export default app;
