import { Router } from 'express'
import { loginController, registerController } from '~/controllers/user.controllers'
import { accessTokenValidator, loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { warpRequestHandler } from '~/utils/handles'

const userRouter = Router()

userRouter.post('/login', loginValidator, warpRequestHandler(loginController))
userRouter.post('/register', registerValidator, warpRequestHandler(registerController))
userRouter.post(
  '/logout',
  accessTokenValidator,
  warpRequestHandler((req, res) => {
    res.status(200).json({ message: 'Logout successfully' })
  })
)

export default userRouter
