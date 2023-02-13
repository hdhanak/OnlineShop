

import {NextFunction, Request, Response} from "express"
import multer, {FileFilterCallback, MulterError} from 'multer'
import { ErrorMessage, MessageResponse } from "./commenResError";

const crypto = require("crypto");

const API_KEY_DEC = "58F702E6036F411ACB725E9B8D45D5B3"
const API_DECRYPT_IV_KEY = "290606C6A880BEA1"

async function DecryptedDataResponse(req: Request, res: Response, next: NextFunction) {
    try {
        const decipher = await crypto.createDecipheriv("aes-256-cbc", API_KEY_DEC, API_DECRYPT_IV_KEY);
        // crypto.createCipheriv("aes-256-cbc", API_KEY_ENC, API_ENCRYPT_IV_KEY);
        console.log(decipher,'decipher');
    
        
        if (req.body && req.body.value && req.body.value !== "") {
            let encryptedData = req.body.value;
            console.log('88',encryptedData);
            
            let decryptedData = decipher.update(encryptedData, "base64", "utf-8") + decipher.final("utf-8");
            console.log('99');
            
            console.log(decryptedData,'decryptedData');

            req.body = JSON.parse(decryptedData);
            console.log(req.body,'b');
            
            next();
        } else {
            return ErrorMessage(req, res, {message: "DECRYPT DATA IS REQUIRED"}, 400);
        }
    } catch (e) {
        return ErrorMessage(req, res, {
            "message": e
        },422)
    }
}

async function DecryptData(req: Request, res: Response, next: NextFunction) {
    if (req.method === "GET") return next()

    if (req.headers.env && req.headers.env === "test") {
        next();
    } else {
        return DecryptedDataResponse(req, res, next);
    }
}

async function DecryptedDataRequest(req: Request, res: Response, next: NextFunction) {
    const API_KEY_DEC = req.query.API_KEY_DEC as string
    const API_DECRYPT_IV_KEY = req.query.API_DECRYPT_IV_KEY as string

    if (!API_KEY_DEC || !API_DECRYPT_IV_KEY) {
        return res.status(400).send({
            message: "API_KEY_DEC and API_DECRYPT_IV_KEY are required"
        })
    }

    try {
        const decipher = await crypto.createDecipheriv("aes-256-cbc", API_KEY_DEC.trim(), API_DECRYPT_IV_KEY.trim());
        if (req.body && req.body.value && req.body.value !== "") {
            let encryptedData = req.body.value;

            let decryptedData = decipher.update(encryptedData, "base64", "utf-8");
            decryptedData += decipher.final("utf-8");
            const data = JSON.parse(decryptedData);
            return MessageResponse(req, res, data,200);
        } else {
            return ErrorMessage(req, res, {message: "INVALID_REQUEST"}, 400);
        }
    } catch (e) {
        return ErrorMessage(req, res, {
            "message": e
        },422)
    }

}

export default {
    DecryptedData: DecryptData,
    DecryptedDataRequest: DecryptedDataRequest
}