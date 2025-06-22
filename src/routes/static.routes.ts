import { Router } from 'express'
import { serveImageController } from '~/controllers/medias.controllers'

const staticRouter = Router()

staticRouter.get('/:name', serveImageController)

export default staticRouter
