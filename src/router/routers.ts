import express, { Request, Response } from 'express'
const router = express.Router()
const V =require('../middleware/validations')
const path = require('path')
const multer = require('multer')
import { FileFilterCallback } from "multer";
import { addAddress, addItemInCart, craeteItem, createCart, deleteAddress, deleteCart, deleteCartItem, deleteItem, encData, getCart, getItem, getRegister, imgUpload, LanguageChange, login, logout, payment, refreshToken, reFund, register, register1, searchEmailAndPhone, updateAddress, uploadAudio, uploadFile, uploadVideo } from '../controller/logic'
import auth from '../middleware/auth'
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void


// export var storage = multer.diskStorage({

//     destination: function (req: Request, res: Response, callback: DestinationCallback) {
//         console.log('1');

//         callback(null, path.join(__dirname, '../uploads'))
//     },
//     filename: function (req: Request, file: Express.Multer.File, callback: FileNameCallback) {
//         console.log('file', file.originalname);

//         callback(null, file.originalname)
//     }
// })

// export const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//         callback(null, true)
//     } else {
//         callback(null, false)
//     }
// }

import decryptedData from '../middleware/dec'
import enc from '../middleware/enc'

router.post('/register1',V.register,register1)

router.post('/register',decryptedData.DecryptedData,V.register,register)
router.post('/login',V.login,login)
router.post('/refreshToken',V.refreshToken,refreshToken)
router.get('/getRegister',auth,getRegister)

//upload
/*router.post('/imgUpload',imgUpload)
router.post('/uploadFile',uploadFile)
router.post('/uploadAudio',uploadAudio)
router.post('/uploadVideo',uploadVideo)

router.get('/searchEmailAndPhone',searchEmailAndPhone)
router.post('/addAddress',V.addAddress,auth,addAddress)
router.put('/updateAddress/:addressId',auth,updateAddress)
router.delete('/deleteAddress/:addressId',auth,deleteAddress)


// Item 
router.post('/craeteItem',V.craeteItem,auth,craeteItem)
router.get('/getItem',auth,getItem)
router.delete('/deleteItem/:itemId',auth,deleteItem)

//crat
router.post('/createCart',V.createCart,auth,createCart)
router.get('/getCart',auth,getCart)
router.delete('/deleteCart/:cartId',auth,deleteCart)
router.put('/deleteCartItem/:cartId',V.deleteCartItem,auth,deleteCartItem)
router.put('/addItemInCart/:cartId',V.addItemInCart,auth,addItemInCart)

//paymnet
router.post('/payment/:cartId',V.payment,auth,payment)
router.get('/reFund/:cartId',auth,reFund)
router.get('/logout',auth,logout)
*/

// export default [
//     // user Auth
//     {
//         path: "/register",
//         method: "post",
//         controller: authController.register,
//         validation: V.registerValidation,
//         isPublic: true,
//     }, 
    // router.get('/LanguageChange',LanguageChange)
console.log("hello");

export default [
    {
        path:'/LanguageChange',
        method:"post",
        controller : LanguageChange,
        validation:V.Language,
        isPublic:true,
    }
]
