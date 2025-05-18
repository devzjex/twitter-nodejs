import { NextFunction, Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.request'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'devmai@gmail.com' && password === '123123') {
    res.status(200).json({ message: 'Logged in successfully' })
  }
  res.status(400).json({ message: 'Login failed' })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  res.json({ message: 'Register success', result })
}
