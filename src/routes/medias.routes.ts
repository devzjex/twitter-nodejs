import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { warpRequestHandler } from '~/utils/handles'

const mediasRouter = Router()

mediasRouter.post('/upload-image', warpRequestHandler(uploadImageController))

export default mediasRouter
