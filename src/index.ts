import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import staticRouter from './routes/static.routes'

config()
databaseService.connect()
const app = express()
const PORT = process.env.PORT || 3000

// Tạo folder uploads
initFolder()

app.use(express.json())

app.use('/users', userRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter) // custom static route for serving images

// app.use('/static', express.static(UPLOAD_IMAGE_DIR))   // static route for serving images in library minimist
app.use(defaultErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
