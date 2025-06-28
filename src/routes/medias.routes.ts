import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { warpRequestHandler } from '~/utils/handles'

const mediasRouter = Router()

mediasRouter.post('/upload-image', accessTokenValidator, warpRequestHandler(uploadImageController))
mediasRouter.post('/upload-video', accessTokenValidator, warpRequestHandler(uploadVideoController))

export default mediasRouter
