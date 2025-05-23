import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/user.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { warpRequestHandler } from '~/utils/handles'

const userRouter = Router()

userRouter.post('/login', loginValidator, warpRequestHandler(loginController))
userRouter.post('/register', registerValidator, warpRequestHandler(registerController))
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, warpRequestHandler(logoutController))

export default userRouter
