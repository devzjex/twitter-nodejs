import { Router } from 'express'
import { loginController, registerController } from '~/controllers/user.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

const userRouter = Router()

userRouter.post('/login', loginValidator, loginController)
userRouter.post('/register', registerController)

export default userRouter
