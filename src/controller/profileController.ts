import { Request, Response } from 'express'

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const users = {
      keeny: 'rupee',
    }
    if (!users) {
      return res.status(404).json({ message: 'users not found' })
    }
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({
      message: 'server error',
    })
  }
}
