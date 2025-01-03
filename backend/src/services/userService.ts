import pool from "../config/database";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Create a user
export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  doctor_number?: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);  // Hash the password
  const query = `
    INSERT INTO users (name, email, password, role, doctor_number)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [data.name, data.email, hashedPassword, data.role, data.doctor_number || null];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get all users
export const getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users;");
  return result.rows;
};


// Get a user by ID
export const getUserById = async (id: number) => {
  const query = "SELECT * FROM users WHERE id = $1;";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Update a user
export const updateUser = async (
  id: number,
  data: { name: string; email: string; password?: string; role: string; doctor_number?: string }
) => {
  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

  const query = `
    UPDATE users
    SET name = $1, email = $2, password = COALESCE($3, password), role = $4, doctor_number = $5
    WHERE id = $6
    RETURNING *;
  `;
  const values = [
    data.name,
    data.email,
    hashedPassword || null,
    data.role,
    data.doctor_number || null,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete a user
export const deleteUser = async (id: number) => {
  const query = "DELETE FROM users WHERE id = $1 RETURNING *;";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
export const getUserByEmail = async (email: string) => {
  const query = "SELECT * FROM users WHERE email = $1;";
  const result = await pool.query(query, [email]);
  return result.rows[0];  // Returns user if found
};

