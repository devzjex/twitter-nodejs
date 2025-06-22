import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import { USER_MESSAGES } from '~/constants/message'
import mediasService from '~/services/medias.services'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
    const result = await mediasService.handleUploadImage(req)
    res.json({
        message: USER_MESSAGES.UPLOAD_SUCCESS,
        result
    })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params
    res.sendFile(path.resolve(UPLOAD_DIR, name), (err) => {
        if (err) {
            res.status((err as any).status).send('Not Found')
        }
    })
}
