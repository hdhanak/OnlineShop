import express, { NextFunction, Request, Response } from "express";
const path = require('path')
const ffmpeg = require('fluent-ffmpeg');
// import mongoose from "mongoose";
import { isImportEqualsDeclaration } from "typescript";
const multer = require("multer");
import {
  ErrorMessage,
  MessageResponse,
  tokenAccess,
} from "../middleware/commenResError";
import addressModel from "../models/address";
import cartModel from "../models/cart";
import paymnetChargeModel from "../models/Cartcharge";
import ItemsSchemaModel from "../models/item";
import orderModel from "../models/ordrePlace";

import signUp, { registerSchema } from "../models/register";
import tokenModel from "../models/token";
const { phone } = require("phone");

import { fileFilter, storage } from "../utils/CommUpload"
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Appstring = require("../Appstring");
require("dotenv").config();
var mongoose = require("mongoose");
var stripe = require('stripe')('sk_test_51M1mIrHozDBhccUTAjM3bBXxN6VaVzwT0op1LWWELmmIspcCEgOV1dIEbZAV5O0T9Jkv9XjfZXlHVLaUUSHzLCQt00O8anuqZ5');
// const verifyRefresh = require('../middleware/helper')
// var stripe = require('stripe')('sk_test_51M1mIrHozDBhccUTAjM3bBXxN6VaVzwT0op1LWWELmmIspcCEgOV1dIEbZAV5O0T9Jkv9XjfZXlHVLaUUSHzLCQt00O8anuqZ5');
import {decrypt,encrypt} from '../utils/aes'
import { fileFilterAudio, fileFilterPdf, fileFilterVideo, fileStorageAudio, fileStoragePdf, fileStorageVideo } from "../utils/CommUpload";
import EncrData from '../middleware/enc'
const register = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await signUp.create({
      firstName: req.body.firstName,
      email: req.body?.email,
      password: hashPassword,
      phoneNo: req.body.phoneNo
        ? phone(req.body?.phoneNo)?.phoneNumber
        : undefined, //phoneNo.phoneNumber

    });
    const address = await addressModel.create({
      userId: user._id,
      area: req.body.area,
      location: {
        type: "Point",
        coordinates: req.body.coordinates
      },
      primary: true,
    });

    // let encData = await EncrData.EncryptData(req, res, user)
    // return res.status(200).send(encData) 
    await user.save();
    await address.save();
    MessageResponse(req, res, Appstring.REGISTER_SUCCESSFULLY, 201);

  } catch (error) {
    
    ErrorMessage(req, res, error, 422);
  }
};
const register1 = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await signUp.create({
      firstName: req.body.firstName,
      email: req.body?.email,
      password: hashPassword,
      phoneNo: req.body.phoneNo
        ? phone(req.body?.phoneNo)?.phoneNumber
        : undefined, //phoneNo.phoneNumber

    });
    const address = await addressModel.create({
      userId: user._id,
      area: req.body.area,
      location: {
        type: "Point",
        coordinates: req.body.coordinates
      },
      primary: true,
    });

    let encData = await EncrData.EncryptData(req, res, user)
    return res.status(200).send(encData) 
    // await user.save();
    // await address.save();
    // MessageResponse(req, res, Appstring.REGISTER_SUCCESSFULLY, 201);

  } catch (error) {
    
    ErrorMessage(req, res, error, 422);
  }
};

const login = async (req: Request, res: Response) => {
  try {


    const user = await signUp.findOne({
      email: req.body?.email,
      phoneNo: req.body?.phoneNo,
    });
   

    let uniqueUserKey = encrypt(
      JSON.stringify({
        _id: user?._id,
        email: req.body?.email,
        phoneNo: req.body?.phoneNo,

      }), process.env.OUTER_KEY_USER)
      
     
      

  let payload = encrypt(uniqueUserKey, process.env.OUTER_KEY_PAYLOAD)
      console.log(payload,'payload');
 

    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {

        let params = {
          _id: user._id,
          email: req.body?.email,
          phoneNo: req.body?.phoneNo,
        };

        const token = await jwt.sign({sub:payload}, process.env.SECRET_KEY, {
          expiresIn: "20m",
        });
        console.log(token,'token logic');
        
        const refreshToken = jwt.sign({sub:payload}, process.env.REFRESHSH_TOKEN_KEY, {
          expiresIn: "40m",
        });
        console.log(token,'token');
        
        //................change
        res.cookie('refresh_token', refreshToken, { maxAge: 10 * 60 * 1000, httpOnly: true, secure: false });
        res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
        return MessageResponse(req, res, Appstring.LOGGEDIN, 200)
        // return res
        //   .cookie("access_token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //   })
        //   .status(200)
        //   .json({ message: "Logged in successfully 😊 👌", tokenAccess: token, refreshToken: refreshToken });

        // tokenAccess(req, res, createToken, 200);

      } else {
        ErrorMessage(req, res, Appstring.NOT_VALID_DETAILS, 409);
      }
    } else {
      ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 409);
    }
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 422);
  }
};
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await jwt.verify(req.cookies.refresh_token, process.env.REFRESHSH_TOKEN_KEY, {}, async (error: any, data: any) => {
      if (error) {
        console.log(error);
        if (error.message == 'jwt must be provided') return ErrorMessage(req, res, 'try login again', 401)

        ErrorMessage(req, res, error, 401)
      }
      else {
        console.log(data, 'data')
        if (data) {
          req.userId = data?._id
          console.log(req.userId, '..');
          const token = jwt.sign({ _id: data._id, email: email }, process.env.SECRET_KEY, {
            expiresIn: "2m",
          });
          res.cookie('access_token', token, { maxAge: 2 * 60 * 1000, httpOnly: true, secure: false });//2min
          // res.cookie('refresh_token',token,{maxAge: 2*60*1000, httpOnly: true, secure: false});
          return res.status(200).json({ success: true, token });
        } else {

          return res
            .status(409)
            .json({ success: false, error: "Invalid token,try login again" });
        }

      }
    })

    //   if (!isValid) {
    //     return res
    //       .status(401)
    //       .json({ success: false, error: "Invalid token,try login again" });
    //   }
    //   const accessToken = jwt.sign({ email: email }, process.env.SECRET_KEY, {
    //     expiresIn: "2m",
    //   });
    //   return res.status(200).json({ success: true, accessToken });
  }

  catch (error) {
    return ErrorMessage(req, res, error, 401);
  }
}

const imgUpload = async (req: Request, res: Response, next: NextFunction) => {
  var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: { fileSize: maxSize },
  }).array("img");

  upload(req, res, async (err: any) => {
    if (err) {
      console.log(err, "errorr");
      ErrorMessage(req, res, err, 400);
    } else {
      console.log(req.files);
      var e: any = {};
      let a: any = req.files;
      a?.map((d: any, index: any) => {
        console.log(d, "d");
        e[index] = d.filename;
      });
      MessageResponse(req, res, e, 200);
    }
  });
};
const uploadFile= async(req: Request, res: Response)=> {
  const file = multer({
      storage: fileStoragePdf,
      fileFilter: fileFilterPdf,
  }).single("file");

  file(req, res, async (err: any) => {
      if (err) {
          return ErrorMessage(req, res,'FILE_NOT_UPLOADED', 409);
      }
      if (!req.file) return ErrorMessage(req, res,"FILE_NOT_FOUND" , 404);
      const image_name = req.file.filename;
      return MessageResponse(req, res, {
          file: image_name
      }, 200);
  });
}
const searchEmailAndPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {


    console.log(Object.keys(req.query).length, "qq");

    var pushArr: any = [];
    if (Object.keys(req.query).length == 1) {
      if (req.query.email) {
        pushArr.push({ email: req.query.email });
      }
      if (req.query.phoneNo) {
        pushArr.push({ phoneNo: req.query.phoneNo });
      }
      if (!(req.query.email || req.query.phoneNo)) {
        return ErrorMessage(
          req,
          res,
          "Check by only email or phoneNo at a time",
          400
        );
      }
      const user = await signUp.aggregate([
        {
          $match: {
            $or: pushArr,
          },
        },
      ]);
      console.log(pushArr);
      return MessageResponse(req, res, user, 200);
    } else {
      return MessageResponse(
        req,
        res,
        "Check by only email or phoneNo at a time",
        400
      );
    }
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 422);
  }
};

const getRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const user = await signUp.find();
    MessageResponse(req, res, user, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
};

const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  const userAddress = await addressModel.findOne({ userId: req.userId })

  try {
    if (userAddress) {
      const address = await addressModel.create({
        userId: req.userId,
        area: req.body.area,
        location: {
          type: "Point",
          coordinates: req.body.coordinates
        },
        primary: false,
      });

      await address.save();
      MessageResponse(req, res, address, 201)
    } else {
      const address = await addressModel.create({
        userId: req.userId,
        area: req.body.area,
        location: {
          type: "Point",
          coordinates: req.body.coordinates
        },
        primary: true,
      });

      await address.save();
      MessageResponse(req, res, address, 201)

    }
  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
};

const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const address = await addressModel.findOne({ _id: req.params.addressId });
    if (address) {
      if (address.primary == false) {
        const updateQuray = {
          area: req.body?.area,
          // coordinates: req.body?.coordinates,
          // $set: { "coordinates.$" : req.body?.coordinates } 
          // coordinates : req.body?.coordinates,
          $set: { 'location.coordinates': req.body?.coordinates }

        };
        console.log(updateQuray, 'updateQuray');

        const result = await addressModel.updateOne(
          { _id: req.params.addressId },
          updateQuray,
          { new: true }
        );
        MessageResponse(req, res, "updated", 200);
      } else {
        ErrorMessage(req, res, "can not update adress", 400);
      }
    } else {
      ErrorMessage(req, res, "adrress is not present", 400);
    }
  } catch (error) {
    console.log(error);
    ErrorMessage(req, res, error, 422);
  }
};
const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const address = await addressModel.findOne({ _id: req.params.addressId });
    if (address) {
      if (address.primary == false) {

        const result = await addressModel.deleteOne(
          { _id: req.params.addressId },
          { new: true }
        );
        MessageResponse(req, res, "deleted", 200);
      } else {
        ErrorMessage(req, res, "can not delete first adress", 400);
      }
    } else {
      ErrorMessage(req, res, "adrress is not present", 409);
    }
  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    // res.redirect('/');
    MessageResponse(req, res, Appstring.LOGOUT, 200)

  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 204)

  }
}


const craeteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await ItemsSchemaModel.create({
      vendorId: req.userId,
      name: req.body.name,
      img: req.body.img,
      price: req.body.price,
      width: req.body?.width,
      weight: req.body?.weight,
      length: req.body?.length,
      discount: req.body?.discount,
      discountPrice: Math.round(req.body.price - (req.body.price * (req.body?.discount / 100)))

    })
    MessageResponse(req, res, item, 201)
  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
}
const getItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ItemsSchemaModel.aggregate([
      {
        $match: {
          vendorId: mongoose.Types.ObjectId(req.userId)
        }
      }
    ])
    MessageResponse(req, res, data, 200)
  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
}
const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await ItemsSchemaModel.findOne({ _id: req.params.itemId })
    if (item?.vendorId == req.userId) {
      const result = await ItemsSchemaModel.deleteOne({ _id: req.params.itemId })
      MessageResponse(req, res, 'deleted', 200)
    } else {
      ErrorMessage(req, res, 'Only item creator deleted', 409)
    }

  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
}
const createCart = async (req: Request, res: Response, next: NextFunction) => {
  const itemData = await ItemsSchemaModel.findOne({ _id: req.body.itemId })
  const isCartExsit = await cartModel.findOne({ customerId: req.userId, vendorId: itemData?.vendorId })
  console.log(itemData?.vendorId, isCartExsit?.vendorId);



  if (isCartExsit) {
    const cartUpdate = await cartModel.updateOne({ customerId: req.userId, vendorId: itemData?.vendorId },
      {
        $push: {
          "item": itemData
        }
      }
      , { new: true })
    const priceUpdate = await cartModel.updateOne({ customerId: req.userId, vendorId: itemData?.vendorId },
      {
        totalPrice: { $set: { $sum: ["$itemData.amout", "$item.totalPrice"] } }
      }
      , { new: true })

    MessageResponse(req, res,Appstring.ITEM_INSERTED, 200)
  } else {
    const cart = await cartModel.create({
      customerId: req.userId,
      vendorId: itemData?.vendorId,
      item: itemData,
      totalPrice: itemData?.discountPrice
    })
    MessageResponse(req, res, cart, 201)
  }


}
//////////// .............. #facet use here.....
const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
    const limit_ = parseInt(req.query.limit as string) || 2;
    const skip_ = (page - 1) * limit_;
    var total_ = await cartModel.find({
      // customerId: req.userId,
  }).sort({createdAt: -1}).countDocuments();
  try {
    const data = await cartModel.aggregate([
      // {
      //   $match: {
      //     customerId: mongoose.Types.ObjectId(req.userId)
      //   }
      // },
      {
        $facet: {
            metadata: [
                {$count: "total"},
                {
                    $addFields: {
                        page: page,
                        limit: limit_,
                        total: total_,
                        hasMoreData: total_ > page * limit_ ? true : false,
                    },
                },
            ],
            data: [
                {$skip: skip_},
                {$limit: limit_},
                {
                    $project: {
                        _id: 1,
                        customerId: "$customerId",
                        vendorId: "$vendorId",
                       
                    },
                },
            ],
        },
    },
    ])
    MessageResponse(req, res, data, 200)
  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
}

const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartModel.findOne({ _id: req.params.cartId })
    console.log(typeof (cart?.customerId), typeof (req.userId), 'req.userId');
    if (cart?.customerId == req.userId) {

      const result = await cartModel.deleteOne({ _id: req.params.cartId })
      MessageResponse(req, res, 'deleted', 200)
    } else {
      ErrorMessage(req, res, Appstring.ONLY_CART_CRAETOR_DELETED, 409)
    }
  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
}

const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartModel.findOne({ _id: req.params.cartId })

    if (cart?.customerId == req.userId) {

      const result = await cartModel.updateOne({ _id: req.params.cartId },
        { $pull: { item: { _id: mongoose.Types.ObjectId(req.body.itemId) } } }
        , { new: true })
      MessageResponse(req, res,Appstring.DELETED, 200)
      // if (result.acknowledged == true) {
      //   return MessageResponse(req, res, 'deleted', 200)
      // }
      // return ErrorMessage(req, res, 'item not present or already present', 422)

    } else {
      ErrorMessage(req, res, Appstring.ONLY_CART_CRAETOR_DELETED, 409)
    }
  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
}

const addItemInCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartModel.findOne({ _id: req.params.cartId })
    const itemData = await ItemsSchemaModel.findOne({ _id: req.body.itemId })

    if (cart?.customerId == req.userId && cart?.vendorId == req.body.vendorId) {

      const result = await cartModel.updateOne({ _id: req.params.cartId },
        {
          $push: {
            "item": itemData
          }
        }
        , { new: true })
      const priceUpdate = await cartModel.updateOne({ customerId: req.userId, vendorId: itemData?.vendorId },
        [{
          $set: { totalPrice: { $sum: "$item.discountPrice" } }
        }]
        , { new: true })


      MessageResponse(req, res,Appstring.ITEM_INSERTED, 200)
      // if (result.acknowledged == true) {
      //   return MessageResponse(req, res, 'deleted', 200)
      // }
      // return ErrorMessage(req, res, 'item not present or already present', 422)

    } else {
      //change
      ErrorMessage(req, res, 'Only cart creator deleted or this item is not from this owner', 409)
    }
  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
}
const payment = async (req: Request, res: Response, next: NextFunction) => {

  const user = await signUp.findOne({ _id: req.userId })
  const cart = await cartModel.findOne({ _id: req.params.cartId })
  console.log(typeof(cart),'cart');
  
  const token = await stripe.tokens.create({
    card: {
      number: '4242424242424242',
      exp_month: 11,
      exp_year: 2023,
      cvc: '314',
    },
  });

  if (user && cart) {

    stripe.customers.create({
      email: user.email,
      source: token.id,
      name: user.firstName,
      address: {
        line1: 'TC 9/4 Old MES colony',
        postal_code: '452331',
        city: 'Indore',
        state: 'Madhya Pradesh',
        country: 'India',
      }
    })
      .then((customer: any) => {
        console.log(customer.id, 'customer');

        return stripe.charges.create({
          amount: Number(cart.totalPrice),     // Charging Rs 25
          description: req.body.description,
          currency: 'usd',
          // payment_intent: paymentIntent.id,
          customer: customer.id
        });
      })
      .then(async (charge: any) => {
        console.log(charge.id, 'charge');
        const order = await orderModel.create({
          customerId: req.userId,
          vendorId: cart?.vendorId,
          cartId:cart._id,
          totalAmount: cart?.totalPrice
        })
        const storeCharge = await paymnetChargeModel.create({
          cartId:cart?._id,
          chargeId:charge.id
        })
        await order.save()
        await storeCharge.save()
        res.status(200).send("Success")
        MessageResponse(req,res,Appstring.PAYMENT_SUCCESSFULL,200)  // If no error occurs
      })
      .catch((err: any) => {
        console.log(err);
        ErrorMessage(req,res,err,422)
               // If some error occurs
      })
  } else {
    ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 409)
  }
}
const reFund = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await paymnetChargeModel.findOne({ cartId: req.params.cartId })
    const refund = await stripe.refunds.create({
      charge: cart?.chargeId,
      reason: "requested_by_customer",
    });
    const deleteCart = await orderModel.deleteOne({ cartId: req.params.cartId })
    const chargeDelete = await paymnetChargeModel.deleteOne({cartId: req.params.cartId})
    MessageResponse(req, res, refund, 200)

  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
}

const uploadAudio= async (req: Request, res: Response, next: NextFunction) => {
  const audio = multer({
      storage: fileStorageAudio,
      fileFilter: fileFilterAudio,
  }).single("audio");

  audio(req, res, async (err: any) => {
      if (err) {
          return ErrorMessage(req, res, "AUDIO_NOT_UPLOADED", 409);
      }
      if (!req.file) return ErrorMessage(req, res, "AUDIO_NOT_FOUND", 404);
      const image_name = req.file.filename;
      return MessageResponse(req, res, {
          audio: image_name
      }, 200);
  });
}
const uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
  const video = multer({
      storage: fileStorageVideo,
      fileFilter: fileFilterVideo,
  }).single("video");
  
  
  video(req, res, async (err: any) => {
      if (err) {
        console.log(err,'err');
        
          return ErrorMessage(req, res,Appstring.VIDEO_NOT_UPLOADED, 409);
      }
      if (!req.file) return ErrorMessage(req, res,Appstring.VIDEO_NOT_FOUND, 404);
      console.log(path.join(__dirname, '../uploads/video/thumbnail') + req.file.filename,'fielname');
      console.log(path.join(__dirname),'dirname');
      
      ffmpeg(path.join(__dirname, '../uploads/video/') + req.file.filename)
          .on('filenames', function (filenames: any) {
            
          }).on('error', function (err: any, stdout: any, stderr: any) {
          
          return  ErrorMessage(req,res,"somthing went wrong",422) 
      }).on('end', function () {
          const responseData = {
              "video": req.file?.filename,
              "thumbnail": 'thumb/' + req.file?.filename.substring(0, req.file.filename.indexOf(".")) + ".jpg"
          }
          return MessageResponse(req, res, responseData,200);
      }).screenshots({
          filename: req.file.filename.substring(0, req.file.filename.indexOf(".")) + ".jpg",
          count: 1,
          folder: path.join(__dirname, '../uploads/video/thumbnail'),
          size: '320x240'
      });

  });
}
// async function uploadVideo(req: any, res: Response) {
//   const video = multer({
//       storage: fileStorageVideo,
//       fileFilter: fileFilterVideo,
//   }).single("video");

//   video(req, res, async (err: any) => {
//       if (err) {
//           return commonUtils.sendError(req, res, {message: AppStrings.VIDEO_NOT_UPLOADED}, 409);
//       }
//       if (!req.file) return commonUtils.sendError(req, res, {message: AppStrings.VIDEO_NOT_FOUND}, 404);

//       ffmpeg('./src/uploads/video/' + req.file.filename)
//           .on('filenames', function (filenames: any) {
//               console.log('Will generate ' + filenames.join(', '))
//           }).on('error', function (err: any, stdout: any, stderr: any) {
//           console.error(err);
//           console.error(stderr);
//           return res.status(422).json({
//               'message': "oops ,Something Went Wrong !!",
//           });
//       }).on('end', function () {
//           const responseData = {
//               "video": req.file.filename,
//               "thumbnail": 'thumb/' + req.file.filename.substring(0, req.file.filename.indexOf(".")) + ".jpg"
//           }
//           return commonUtils.sendSuccess(req, res, responseData);
//       }).screenshots({
//           filename: req.file.filename.substring(0, req.file.filename.indexOf(".")) + ".jpg",
//           count: 1,
//           folder: './src/uploads/video/thumb/',
//           size: '320x240'
//       });

//   });
// }
const encData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('req',req.body);
      
    } catch (error) {
      ErrorMessage(req,res,error,422)
    }
}
const LanguageChange= async (req: any, res: Response, next: NextFunction) => {
  try {
  
    console.log(req.headers ,'jj');
      
    res.send({message:req.t('created')})
  } catch (error) {
    res.send(error)
  }
}

export {
  LanguageChange,
  encData,
  addAddress,
  addItemInCart,
  craeteItem,
  createCart,
  deleteAddress,
  deleteCart,
  deleteCartItem,
  deleteItem,
  getCart,
  getItem,
  getRegister,
  imgUpload,
  login,
  logout,
  payment,
  refreshToken,
  reFund,
  register,
  register1,
  searchEmailAndPhone,
  updateAddress,
  uploadFile,
  uploadAudio,
  uploadVideo
};
// _id
// 6347f3b1e4798f16fb5b594f
// userId
// 6347d7135717c48c6c38acad
// postId
// 6347f381e4798f16fb5b594c
