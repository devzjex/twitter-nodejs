import { Request, Response } from 'express'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'devmai@gmail.com' && password === '123123') {
    res.status(200).json({ message: 'Logged in successfully' })
    return
  }
  res.status(400).json({ message: 'Login failed' })
  return
}
