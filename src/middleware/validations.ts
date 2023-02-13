import { NextFunction, Request, Response } from "express";
import { ErrorMessage } from "./commenResError";
const validator = require('./helper');

// Login
const register = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
        
        "firstName": "required|string",       
        "email": "required_without:phoneNo|string|email|exist:register,email",
        "password": "required|string|min:3|strict",
        "phoneNo": "required_without:email|exist:register,phoneNo",//digits:10 not work        // "phoneNo": "required_without:email|exist:register,phoneNo",//digits:10 not work
        
    

    };

    await validator(req.body, validationRule, {

        "required_without.email": 'email or phoneNo must required',
        "required_without.phoneNo": 'email or phoneNo must required',
        digits_between: "phone number must be 10 digits"
    },

        (err: any, status: any) => {
            if (!status) {
                const tempObj = err.errors
                let transformed: any = {};
                Object.keys(tempObj).forEach(function (key, index) {
                    transformed[key] = tempObj[key]?.join('');
                })
                console.log(transformed, 'transformed');

                ErrorMessage(req, res, transformed, 422)

            } else {
                next();
            }
        }).catch((err: any) => console.log(err))
}
const login = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
      
        "email": "required_without:phoneNo|string|email",
        "password": "required|string|min:3|strict",
        "phoneNo": "required_without:email"
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "email": "required|email",
        
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}

//Address

const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "area": "required|string",
       
        // "address.longitude" : "required|numeric|min:-180|max:180",
        // "address.latitude" :"required|numeric|min:-180|max:180",
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}

//item

const craeteItem = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "name": "required|string",
        "price":"required"
        
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}


//cart
const createCart = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "itemId": "required|string",
        
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "itemId": "required|string",
        
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const addItemInCart = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "itemId": "required|string",
        "vendorId": "required|string",
        
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
//payment
const payment = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "description": "required|string"
       
        
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const Language= async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body,'body');
    
    const validationRule = {       

        "item": "required|string",  
              
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');
            
            ErrorMessage(req, res, transformed, 422)
            
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
export { Language,register, login,addAddress,craeteItem,createCart,refreshToken,deleteCartItem,addItemInCart,payment }