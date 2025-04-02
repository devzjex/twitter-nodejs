import { Router } from 'express'
import { loginController } from '~/controllers/user.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

const userRouter = Router()

userRouter.post('/login', loginValidator, loginController)

export default userRouter
