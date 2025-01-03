import { readFileSync } from "fs";
import path from "path";
import { readdirSync } from "fs";
import pool from "./config/database";

const runMigrations = async () => {
  try {
    console.log("Starting migrations...");

    // Get all migration files from the `migrations` folder
    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = readdirSync(migrationsDir).filter(file => file.endsWith(".sql"));

    // Execute each migration file in sorted order
    for (const file of migrationFiles.sort()) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const query = readFileSync(filePath, "utf8");
      await pool.query(query);
      console.log(`Migration ${file} executed successfully.`);
    }

    console.log("All migrations completed successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    pool.end();
  }
};

runMigrations();
