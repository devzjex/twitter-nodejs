import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_DIR, UPLOAD_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_TEMP_DIR, {
            recursive: true // Tạo folder nested
        })
    }
}

export const handleUploadImage = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_TEMP_DIR,
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

export const getNameFromFullName = (fullName: string) => {
    const name_arr = fullName.split('.')
    name_arr.pop()
    return name_arr.join('')
}
