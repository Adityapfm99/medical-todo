import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./config/swagger.json";
import cors from "cors";
import app from "./app"; // Import routes and middleware from app.ts

const PORT = process.env.PORT || 3000;

const server: Application = express();

// Middleware
server.use(cors());
server.use(express.json());

// Swagger setup
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Mount App
server.use(app);

// Start the Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
