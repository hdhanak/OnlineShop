import { Request, Response } from "express";
import enn from "../middleware/enc";

const ErrorMessage = (req:Request,res:Response,error:any,statusCode:number)=>{
            res.status(statusCode).json({error})
}
const MessageResponse = async (req:Request,res:Response,data:any,statusCode:number)=>{
    if (req.headers.env === "test") {
        return res.status(statusCode).json({data})
    }

    let encData = await enn.EncryptData(req, res, data)
    return res.status(statusCode).send(encData) 
}
const tokenAccess = (req:Request,res:Response,ACCESS_TOKEN:any,statusCode:number)=>{
    res.status(statusCode).json({ACCESS_TOKEN})
    
}

export {ErrorMessage,MessageResponse,tokenAccess }