
// Import necessary modules
import express, { Request, Response } from "express";
import User from "../models/user";

const router = express.Router();


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 */

// GET endpoint for retrieving all users
router.get("/users", async (req: Request, res: Response) => {
  try {
    // Retrieve all users from the database
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Error retrieving users" });
  }
});
router.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    // Create the user
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

export default router;



