import  { model, Schema } from "mongoose";
var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const order = new Schema({
   
    customerId : mongoose.Types.ObjectId,
    vendorId: mongoose.Types.ObjectId,
    cartId: mongoose.Types.ObjectId,
    totalAmount:{
        type: SchemaTypes.Double
    },   
    
},
{versionKey:false,timestamps:true}
// {_id:false} // 1st wahy to not genrete id
)

const orderModel = model('orderPlaced', order ,"orderPlaced")
export default orderModel