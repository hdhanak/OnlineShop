import  { model, Schema } from "mongoose";
var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const Itemsschema = new Schema({
   
    vendorId : mongoose.Types.ObjectId,     
    img:{
       type: [String]
    },   
    name : String,
    price:  {
        type: Number
    },
    width:{
        type: SchemaTypes.Double
    },
    weight:{
        type: SchemaTypes.Double
    },
    length:{
        type: SchemaTypes.Double
    },
    discount:SchemaTypes.Double,
    discountPrice:{
        type: SchemaTypes.Double
    },

},
{versionKey:false,timestamps:true}
// {_id:false} // 1st wahy to not genrete id
)

const ItemsSchemaModel = model('Items', Itemsschema)
export default ItemsSchemaModel