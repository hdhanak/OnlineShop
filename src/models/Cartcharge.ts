import mongoose, { model, Schema } from "mongoose";


const charge = new Schema({
    cartId:{
        type:mongoose.Types.ObjectId,
        required: true
    },
    chargeId:{
        type:String,
        required:true
    },
    
  
},{versionKey:false})

const paymnetChargeModel = model('paymnetCharge',charge)
export default paymnetChargeModel