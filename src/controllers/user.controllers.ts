import { Request, Response } from 'express'
import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'devmai@gmail.com' && password === '123123') {
    res.status(200).json({ message: 'Logged in successfully' })
  }
  res.status(400).json({ message: 'Login failed' })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersService.register({ email, password })
    res.json({ message: 'Register success', result })
  } catch (error) {
    res.status(400).json({ message: 'Register failed' })
  }
}
