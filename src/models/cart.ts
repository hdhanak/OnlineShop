import  { model, Schema } from "mongoose";
var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const cart = new Schema({
   
    customerId : mongoose.Types.ObjectId,
    vendorId: mongoose.Types.ObjectId,
    item:{
       type: [Object]
    },
    totalPrice:{
        type: SchemaTypes.Double
    },   
    
},
{versionKey:false,timestamps:true}
// {_id:false} // 1st wahy to not genrete id
)

const cartModel = model('cart', cart ,"cart")
export default cartModel