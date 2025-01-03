

import pool from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Login a user
export const loginUser = async (email: string, password: string): Promise<{ user: any, token: string }> => {
    const query = "SELECT * FROM users WHERE email = $1;";
    const result = await pool.query(query, [email]);
  
    if (result.rows.length === 0) {
      throw new Error("User not found.");
    }
  
    const user = result.rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
    if (!isPasswordCorrect) {
      throw new Error("Incorrect password.");
    }
  
    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    
    return { user, token };
  };