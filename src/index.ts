import express from 'express'
import userRouter from './user.routes'

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', userRouter)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
