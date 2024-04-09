// Import necessary modules
import express, { Request, Response } from 'express';
import  {Register}  from '../controllers/authentication';
import {Person} from '../models/user';

const router = express.Router();

// Function to handle errors
const handleError = (res: Response, error: any) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Error occurred', content:error });
};

// GET endpoint for retrieving all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    // Retrieve all users from the database
    const users = await Person.findAll();
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
});

// POST endpoint for creating a new user
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    // Create the user
    const user = await Person.create({ name, email, password , phone});
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/register", Register)

router.get("/id/verify/:token")

export default router;