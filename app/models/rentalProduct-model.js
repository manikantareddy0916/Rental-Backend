const mongoose = require('mongoose')
const {Schema, model} = mongoose 

const rentalProductModel = new Schema({
    // address:{
    //     type : Schema.Types.ObjectId,
    //     ref : 'Address'
    // },
    
    status :  {
        type : String,
        enum : ['accepted','rejected','pending'],
        default : 'pending'
    },
    //productOwner: String,
    productOwner: {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    product : {
        type : Schema.Types.ObjectId,
        ref : 'Product'
    } ,
    rentalUser : {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    aadhar : [{url:String,key:String}],
    mobileNumber : String,
    days : Number,
    startDate : Date,
    endDate : Date,
    productOwnerEmail :  {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
}, {timestamps: true})

const RentalProduct = model('RentalProduct',rentalProductModel)

module.exports = RentalProduct 