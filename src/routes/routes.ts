// Import necessary modules
import express, { Request, Response } from 'express';
import User from '../models/user';

const router = express.Router();

// Function to handle errors
const handleError = (res: Response, error: any) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Error occurred' });
};

// GET endpoint for retrieving all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    // Retrieve all users from the database
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
});

// POST endpoint for creating a new user
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    // Create the user
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
