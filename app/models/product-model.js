const mongoose = require('mongoose')
const {Schema, model} = mongoose

const productSchema = new Schema({
    productName : String,
    productSpecifications : String,
    productImage : [{url:String,key:String}],
    productPrice :{
        type : Number,
    },
    mobileNumber : String,
    stock :  {
        type : String,
        enum : ['available','notAvailable'],
        default : 'available'
    },
    lat: Number,
    long: Number,
    // address :{
    //     type: Schema.Types.ObjectId,
    //     ref : "Address"
    // },
    productOwner :Schema.Types.ObjectId,
    category : String,
    review :[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    radius : Number
}, {timestamps: true})

const Product = model('Product', productSchema)

module.exports = Product