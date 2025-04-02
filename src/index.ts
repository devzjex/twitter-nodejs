import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

app.use('/users', userRouter)
databaseService.connect()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
