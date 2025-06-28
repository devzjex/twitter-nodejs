import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/message'
import mediasService from '~/services/medias.services'
import fs from 'fs'
import mime from 'mime'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
    const result = await mediasService.uploadImage(req)
    res.json({
        message: USER_MESSAGES.UPLOAD_SUCCESS,
        result
    })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
    const result = await mediasService.uploadVideo(req)
    res.json({
        message: USER_MESSAGES.UPLOAD_SUCCESS,
        result
    })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params
    res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
        if (err) {
            res.status((err as any).status).send('Not Found')
        }
    })
}

export const serveVideoStreamController = (req: Request, res: Response, next: NextFunction) => {
    const range = req.headers.range

    if (!range) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send('Range header is required')
    }

    const { name } = req.params
    const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
    /**
     * 1MB = 10^6 bytes (Tính theo hệ 10, đây là thứ nhìn thấy trên UI)
     * Còn nếu tính theo hệ nhị phân thì 1MB = 2^20 bytes (1024 * 1024 bytes)
     * */

    // Lấy kích thước file video (bytes)
    const videoSize = fs.statSync(videoPath).size
    // Dung lượng video trong mỗi phân đạon stream
    const chunkSize = 10 ** 6 // 1MB
    // Lấy giá trị bytes bắt đầu và kết thúc từ range header
    const start = Number(range.replace(/\D/g, '')) // Chỉ lấy số từ chuỗi range
    const end = Math.min(start + chunkSize, videoSize - 1) // Đảm bảo không vượt quá kích thước file

    // Dung lượng thưcc tế của đoạn video\
    // Thường  đây là chunkSize, ngoại trừ video cuối cùng
    const contentLength = end - start + 1
    const contentType = mime.getType(videoPath) || 'video/*'
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': contentType
    }
    res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
}
