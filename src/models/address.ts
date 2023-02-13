import mongoose, { model, Schema } from "mongoose";
var mongooseTypePhone = require('mongoose-type-phone');



const schema = new Schema({
    userId:mongoose.Types.ObjectId,
    area:{
        type:String,
        // required: true
    },    
    city:{
        type:String,
    },
    state:{
        type:String
    },
    country: {
        type: Schema.Types.Mixed,        
    },
    primary:Boolean,
    location: {
        type:{
            type: String,
            enum:["Point"],
          
        },
        coordinates: {
            type:[Number],// Array of arrays of arrays of numbers
        },
//         $near: {
//             $geometry: {
//                type: "Point" ,
//                coordinates:[-73.856077, 40.848447]
//             },
//             $maxDistance:5,
//             $minDistance:6,
  },



    
},{versionKey:false,timestamps:true})
schema.index({location:"2dsphere"})

const addressModel = model('address',schema,'address')
// export {schema}
export default addressModel