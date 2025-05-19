import { Router } from 'express'
import { loginController, registerController } from '~/controllers/user.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { warpRequestHandler } from '~/utils/handles'

const userRouter = Router()

userRouter.post('/login', loginValidator, warpRequestHandler(loginController))
userRouter.post('/register', registerValidator, warpRequestHandler(registerController))

export default userRouter
