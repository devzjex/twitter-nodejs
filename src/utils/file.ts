import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
    ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true // Tạo folder nested
            })
        }
    })
}

export const handleUploadImage = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_IMAGE_TEMP_DIR,
        maxFiles: 4,
        keepExtensions: true,
        maxFileSize: 300 * 1024, // 300 KB
        maxTotalFileSize: 300 * 1024 * 4, // 1.2 MB
        filter: function ({ name, originalFilename, mimetype }) {
            const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
            if (!valid) {
                form.emit('error' as any, new Error('File type is not valid') as any)
            }
            return valid
        }
    })

    return new Promise<File[]>((resolve, reject) => {
        form.parse(req, (error, fields, files) => {
            if (error) {
                return reject(error)
            }

            if (!files || !files.image) {
                return reject(new Error('No image file uploaded'))
            }

            resolve(files.image as File[])
        })
    })
}

export const handleUploadVideo = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_VIDEO_DIR,
        maxFiles: 4,
        maxFileSize: 50 * 1024 * 1024, // 50 MB
        filter: function ({ name, originalFilename, mimetype }) {
            const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
            if (!valid) {
                form.emit('error' as any, new Error('File type is not valid') as any)
            }
            return valid
        }
    })

    return new Promise<File[]>((resolve, reject) => {
        form.parse(req, (error, fields, files) => {
            if (error) {
                return reject(error)
            }

            if (!files || !files.video) {
                return reject(new Error('No video file uploaded'))
            }

            const videoFile = files.video as File[]

            videoFile.forEach((video) => {
                const ex = getFileExtension(video.originalFilename as string)
                fs.renameSync(video.filepath, video.filepath + '.' + ex)
                video.newFilename = video.newFilename + '.' + ex
            })

            resolve(files.video as File[])
        })
    })
}

export const getNameFromFullName = (fullName: string) => {
    const name_arr = fullName.split('.')
    name_arr.pop()
    return name_arr.join('')
}

export const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.')
    return parts.length > 1 ? parts.pop() : ''
}
