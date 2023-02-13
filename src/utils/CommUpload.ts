import { FileFilterCallback } from "multer";

const multer = require("multer");
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
const path = require('path')


export const fileStoragePdf = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
        // callback(null, './src/uploads/sampleFile')
        callback(null, path.join(__dirname, '../uploads/files'))
    },

    filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
        console.log('file', file.originalname);
        callback(null, file.originalname)
    }
})
export const fileFilterPdf = (request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    console.log("FILE_TYPE: ", file.mimetype)
    if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/svg+xml' ||
        file.mimetype === 'audio/mpeg' ||
        file.mimetype === 'audio/mp3' ||
        file.mimetype === 'audio/mp4' ||
        file.mimetype === 'audio/wav' ||
        file.mimetype === 'video/mpg' ||
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/m4v' ||
        file.mimetype === 'video/mkv' ||
        file.mimetype === 'video/webm' ||
        file.mimetype === 'video/avi' ||
        file.mimetype === "application/octet-stream" ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "application/zip" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/bmp" ||
        file.mimetype === "image/gif"
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}
export const fileStorageAudio = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
        callback(null, './src/uploads/audio')
    },

    filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
        callback(null, file.originalname)
    }
})

export const fileFilterAudio = (request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (
        file.mimetype === 'audio/mpeg' ||
        file.mimetype === 'audio/mp3' ||
        file.mimetype === 'audio/mp4' ||
        file.mimetype === 'audio/wav'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}
export const fileStorageVideo = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
        callback(null,path.join(__dirname, '../uploads/video'))
    },

    filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
        callback(null, file.originalname)
    }
})
export const fileFilterVideo = (request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (
        file.mimetype === 'video/mpg' ||
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/m4v' ||
        file.mimetype === 'video/mkv' ||
        file.mimetype === 'video/webm' ||
        file.mimetype === 'video/avi'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}
export var storage = multer.diskStorage({

    destination: function (req: Request, res: Response, callback: DestinationCallback) {
        console.log('1');

        callback(null, path.join(__dirname, '../uploads/image'))
    },
    filename: function (req: Request, file: Express.Multer.File, callback: FileNameCallback) {
        console.log('file', file.originalname);

        callback(null, file.originalname)
    }
})

export const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}