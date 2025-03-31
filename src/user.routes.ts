import { Router } from 'express'

const userRouter = Router()

userRouter.use((req, res, next) => {
  console.log('Middleware:', req.method, req.url)
  console.log('Time: ', Date.now())
  next()
})

userRouter.get('/twitter', (req, res) => {
  res.json({ name: 'John Doe', age: 30 })
})

export default userRouter
