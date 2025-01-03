
import { Request, Response } from "express";
import * as loginServices from "../services/loginServices";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const { user, token } = await loginServices.loginUser(email, password);
  
      // Return user data and the token
      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unexpected error occurred." });
      }
    }
  
  };